import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    ScrollView,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
    Alert,
    ActivityIndicator,
} from 'react-native';
import {
    getAuth,
    sendPasswordResetEmail,
} from '@react-native-firebase/auth';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../constants/colors';
import { s, vs, ms, rf } from '../utils/responsive';

let LinearGradient;
try {
    LinearGradient = require('react-native-linear-gradient').default;
} catch (e) {
    LinearGradient = null;
}

const ForgotPasswordScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const showSub = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
            () => setKeyboardVisible(true)
        );
        const hideSub = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
            () => setKeyboardVisible(false)
        );

        return () => {
            showSub.remove();
            hideSub.remove();
        };
    }, []);

    const handleResetPassword = async () => {
        if (!email.trim()) {
            Alert.alert('Required Field', 'Please enter your email address.');
            return;
        }

        try {
            setLoading(true);
            const authInstance = getAuth();
            // Firebase password reset email bhejega
            await sendPasswordResetEmail(authInstance, email.trim());

            Alert.alert(
                'Email Sent ✓',
                'A password reset link has been sent to your email. Please check your inbox and change your password, then come back and login.',
                [
                    {
                        text: 'Go to Login',
                        onPress: () => navigation.navigate('Login'),
                    },
                ]
            );
        } catch (error) {
            let errorMessage = 'Failed to send reset email. Please try again.';
            if (error.code === 'auth/user-not-found') {
                errorMessage = 'No account found with this email address.';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Please enter a valid email address.';
            } else if (error.code === 'auth/too-many-requests') {
                errorMessage = 'Too many attempts. Please try again later.';
            } else if (error.code === 'auth/network-request-failed') {
                errorMessage = 'Network error. Please check your internet connection.';
            }
            Alert.alert('Reset Failed', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const renderGradientButton = () => {
        const buttonContent = loading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
            <View style={styles.buttonContentRow}>
                <Text style={styles.verifyButtonText}>Verify & Send Reset Link</Text>
                <Ionicons name="arrow-forward" size={rf(18)} color="#FFFFFF" style={styles.arrowIcon} />
            </View>
        );

        if (LinearGradient) {
            return (
                <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={handleResetPassword}
                    style={styles.buttonShadow}
                    disabled={loading}
                >
                    <LinearGradient
                        colors={[colors.gradientStart, colors.gradientEnd]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.verifyButton}
                    >
                        {buttonContent}
                    </LinearGradient>
                </TouchableOpacity>
            );
        }

        return (
            <TouchableOpacity
                style={[styles.verifyButton, { backgroundColor: colors.primary }, styles.buttonShadow]}
                activeOpacity={0.85}
                onPress={handleResetPassword}
                disabled={loading}
            >
                {buttonContent}
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.keyboardView}
            >
                <ScrollView
                    contentContainerStyle={[
                        styles.scrollContent,
                        isKeyboardVisible && styles.scrollContentKeyboard,
                    ]}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    scrollEnabled={isKeyboardVisible}
                    bounces={false}
                >

                    {/* FLOATING WHITE CARD CONTAINER */}
                    <View style={styles.cardContainer}>

                        {/* 1. Header: Logo & Brand Name */}
                        <View style={styles.logoRow}>
                            <Image
                                source={require('../assets/icons/logo.png')}
                                style={styles.logoIcon}
                                resizeMode="contain"
                            />
                            <Text style={styles.brandTitle}>The Good Neighbor</Text>
                        </View>

                        {/* 2. Back Arrow Button */}
                        <TouchableOpacity
                            style={styles.backButton}
                            activeOpacity={0.7}
                            onPress={() => navigation.goBack()}
                        >
                            <Ionicons name="arrow-back" size={rf(22)} color={colors.textPrimary} />
                        </TouchableOpacity>

                        {/* 3. Lock Icon Circle */}
                        <View style={styles.lockIconContainer}>
                            <View style={styles.lockIconCircle}>
                                <Ionicons name="lock-closed-outline" size={rf(28)} color={colors.primary} />
                            </View>
                        </View>

                        {/* 4. Title & Subtitle */}
                        <View style={styles.headerContainer}>
                            <Text style={styles.title}>Forgot Password?</Text>
                            <Text style={styles.subtitle}>
                                No worries! Enter your registered email{'\n'}and we'll send you a reset link.
                            </Text>
                        </View>

                        {/* 5. Email Input */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>EMAIL ADDRESS</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="mail-outline" size={rf(18)} color="#718279" />
                                <TextInput
                                    style={styles.input}
                                    placeholder="name@company.com"
                                    placeholderTextColor="#718279"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    value={email}
                                    onChangeText={setEmail}
                                />
                            </View>
                        </View>

                        {/* 6. Verify Button */}
                        {renderGradientButton()}

                        {/* 7. Remember password? Sign In */}
                        <View style={styles.loginRow}>
                            <Text style={styles.rememberText}>Remember your password? </Text>
                            <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('Login')}>
                                <Text style={styles.loginLinkText}>Sign In</Text>
                            </TouchableOpacity>
                        </View>

                        {/* 8. Info Note */}
                        <View style={styles.infoContainer}>
                            <Ionicons name="information-circle-outline" size={rf(16)} color="#98A2B3" />
                            <Text style={styles.infoText}>
                                Check your spam folder if you don't receive the email within a few minutes.
                            </Text>
                        </View>

                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.screenBackground,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: s(14),
        paddingVertical: vs(20),
    },
    scrollContentKeyboard: {
        paddingBottom: vs(120),
    },
    cardContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: ms(30),
        paddingHorizontal: s(22),
        paddingTop: vs(24),
        paddingBottom: vs(28),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 4,
    },
    logoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: vs(16),
    },
    logoIcon: {
        width: s(24),
        height: s(28),
        marginRight: s(10),
    },
    brandTitle: {
        fontSize: rf(17),
        fontWeight: '700',
        color: colors.primary,
        letterSpacing: 0.2,
    },

    // Back Button
    backButton: {
        width: s(38),
        height: s(38),
        borderRadius: ms(12),
        backgroundColor: colors.inputBackground,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: vs(20),
    },

    // Lock Icon Circle
    lockIconContainer: {
        alignItems: 'center',
        marginBottom: vs(18),
    },
    lockIconCircle: {
        width: s(60),
        height: s(60),
        borderRadius: s(30),
        backgroundColor: colors.primaryTint,
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Header
    headerContainer: {
        alignItems: 'center',
        marginBottom: vs(24),
    },
    title: {
        fontSize: rf(26),
        fontWeight: '800',
        color: colors.textPrimary,
        marginBottom: vs(8),
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: rf(14),
        fontWeight: '500',
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: vs(20),
    },

    // Input
    inputGroup: {
        marginBottom: vs(20),
    },
    inputLabel: {
        fontSize: rf(11),
        fontWeight: '700',
        color: colors.textSecondary,
        letterSpacing: 0.8,
        marginBottom: vs(6),
    },
    inputContainer: {
        backgroundColor: colors.inputBackground,
        borderRadius: ms(12),
        height: vs(48),
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: s(14),
    },
    input: {
        flex: 1,
        fontSize: rf(14),
        color: colors.textPrimary,
        fontWeight: '600',
        marginLeft: s(10),
    },

    // Button
    buttonShadow: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    verifyButton: {
        height: vs(50),
        borderRadius: ms(12),
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonContentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    verifyButtonText: {
        color: '#FFFFFF',
        fontSize: rf(15),
        fontWeight: '700',
        letterSpacing: 0.3,
    },
    arrowIcon: {
        marginLeft: s(8),
    },

    // Remember password row
    loginRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: vs(18),
        marginBottom: vs(14),
    },
    rememberText: {
        fontSize: rf(13),
        color: '#667085',
        fontWeight: '500',
    },
    loginLinkText: {
        fontSize: rf(13),
        color: colors.primary,
        fontWeight: '700',
    },

    // Info note
    infoContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#F9FAFB',
        borderRadius: ms(10),
        paddingHorizontal: s(12),
        paddingVertical: vs(10),
        borderWidth: 1,
        borderColor: '#F2F4F7',
    },
    infoText: {
        flex: 1,
        fontSize: rf(11),
        color: '#98A2B3',
        fontWeight: '500',
        marginLeft: s(8),
        lineHeight: vs(16),
    },
});

export default ForgotPasswordScreen;
