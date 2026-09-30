import React, { useState, useEffect, useRef } from 'react';
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
    createUserWithEmailAndPassword,
    sendEmailVerification,
    signOut,
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

const RegisterScreen = ({ navigation }) => {
    const [fullName, setFullName] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);

    const scrollViewRef = useRef(null); // 👈 ScrollView ko control karne k liye
    const [keyboardHeight, setKeyboardHeight] = useState(0); // 👈 Asal keyboard ki height

    useEffect(() => {
        const showSub = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
            (e) => {
                setKeyboardVisible(true);
                // Keyboard ki exact height uthayega (e.g. 320px)
                setKeyboardHeight(e.endCoordinates?.height || vs(320));
            }
        );
        const hideSub = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
            () => {
                setKeyboardVisible(false);
                setKeyboardHeight(0);
            }
        );

        return () => {
            showSub.remove();
            hideSub.remove();
        };
    }, []);


    const [loading, setLoading] = useState(false); // 👈 Loading spinner ke liye

    const handleCreateAccount = async () => {
        if (!fullName.trim() || !email.trim() || !password) {
            Alert.alert(
                'Required Fields',
                'Please fill in your name, email, and password.',
            );
            return;
        }

        if (password.length < 8) {
            Alert.alert(
                'Weak Password',
                'Password must be at least 8 characters long.',
            );
            return;
        }

        try {
            setLoading(true);

            const authInstance = getAuth();

            const userCredential = await createUserWithEmailAndPassword(
                authInstance,
                email.trim(),
                password,
            );

            console.log('User created:', userCredential.user.uid);

            // Verification email bhejien
            await sendEmailVerification(userCredential.user);

            // User ko sign out karein taake email verify kiye baghair direct login na rahe
            await signOut(authInstance);

            Alert.alert(
                'Verify Your Email',
                `A verification link has been sent to ${email.trim()}.\n\nPlease check your email inbox and click the verification link before logging in.`,
                [
                    {
                        text: 'Go to Login',
                        onPress: () => navigation.navigate('Login'),
                    },
                ],
            );
        } catch (error) {
            console.log('Full signup error:', error);

            Alert.alert(
                'Registration Failed',
                `${error?.code ?? 'Unknown error'}\n${error?.message ?? String(error)}`,
            );
        } finally {
            setLoading(false);
        }
    };

    const renderGradientButton = () => {
        const buttonContent = loading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
            <View style={styles.buttonContentRow}>
                <Text style={styles.createButtonText}>Create Account</Text>
                <Ionicons name="arrow-forward" size={rf(18)} color="#FFFFFF" style={styles.arrowIcon} />
            </View>
        );

        if (LinearGradient) {
            return (
                <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={handleCreateAccount}
                    style={styles.buttonShadow}
                    disabled={loading}
                >
                    <LinearGradient
                        colors={[colors.gradientStart, colors.gradientEnd]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.createButton}
                    >
                        {buttonContent}
                    </LinearGradient>
                </TouchableOpacity>
            );
        }

        return (
            <TouchableOpacity
                style={[styles.createButton, { backgroundColor: colors.primary }, styles.buttonShadow]}
                activeOpacity={0.85}
                onPress={handleCreateAccount}
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
                    ref={scrollViewRef} // 👈 Ref lagaya
                    contentContainerStyle={[
                        styles.scrollContent,
                        isKeyboardVisible && {
                            justifyContent: 'flex-start',            // 👈 Lock khatam kiya
                            paddingBottom: keyboardHeight + vs(80), // 👈 Poori 380px+ space di
                        },
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

                        {/* 2. Title & Subtitle */}
                        <View style={styles.headerContainer}>
                            <Text style={styles.title}>Build Your Future</Text>
                            <Text style={styles.subtitle}>
                                Create your professional account today.
                            </Text>
                        </View>

                        {/* 3. Input: Full Name */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>FULL NAME</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="person-outline" size={rf(18)} color="#718279" />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Johnathan Doe"
                                    placeholderTextColor="#718279"
                                    value={fullName}
                                    onChangeText={setFullName}
                                />
                            </View>
                        </View>

                        {/* 4. Input: Company Name */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>COMPANY NAME</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="business-outline" size={rf(18)} color="#718279" />
                                <TextInput
                                    style={styles.input}
                                    placeholder="AK Builders LLC"
                                    placeholderTextColor="#718279"
                                    value={companyName}
                                    onChangeText={setCompanyName}
                                />
                            </View>
                        </View>

                        {/* 5. Input: Email Address */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>EMAIL ADDRESS</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="mail-outline" size={rf(18)} color="#718279" />
                                <TextInput
                                    style={styles.input}
                                    placeholder="john@company.com"
                                    placeholderTextColor="#718279"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    value={email}
                                    onChangeText={setEmail}
                                    onFocus={() => {
                                        setTimeout(() => {
                                            scrollViewRef.current?.scrollTo({ y: vs(140), animated: true });
                                        }, 150);
                                    }}
                                />
                            </View>
                        </View>

                        {/* 6. Input: Password With Eye Toggle */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>PASSWORD</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="lock-closed-outline" size={rf(18)} color="#718279" />
                                <TextInput
                                    style={styles.input}
                                    placeholder="••••••••••••"
                                    placeholderTextColor="#718279"
                                    secureTextEntry={!showPassword}
                                    value={password}
                                    onChangeText={setPassword}
                                    onFocus={() => {
                                        setTimeout(() => {
                                            scrollViewRef.current?.scrollToEnd({ animated: true });
                                        }, 150);
                                    }}
                                />
                                <TouchableOpacity
                                    onPress={() => setShowPassword(!showPassword)}
                                    style={styles.eyeButton}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons
                                        name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                                        size={rf(19)}
                                        color="#718279"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* 7. Create Account Button */}
                        {renderGradientButton()}

                        {/* 8. Already have an account? Log in */}
                        <View style={styles.loginRow}>
                            <Text style={styles.alreadyText}>Already have an account? </Text>
                            <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('Login')}>
                                <Text style={styles.loginLinkText}>Log in</Text>
                            </TouchableOpacity>
                        </View>

                        {/* 9. Terms of Service & Privacy Policy Disclaimer */}
                        <View style={styles.disclaimerContainer}>
                            <Text style={styles.disclaimerText}>
                                BY REGISTERING, YOU AGREE TO OUR{'\n'}
                                <Text style={styles.disclaimerUnderline}>TERMS OF SERVICE</Text> AND <Text style={styles.disclaimerUnderline}>PRIVACY POLICY</Text>
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
        paddingBottom: vs(24),
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
        marginBottom: vs(22),
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
    headerContainer: {
        marginBottom: vs(22),
    },
    title: {
        fontSize: rf(26),
        fontWeight: '800',
        color: colors.textPrimary,
        marginBottom: vs(6),
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: rf(14),
        fontWeight: '500',
        color: colors.textSecondary,
    },
    inputGroup: {
        marginBottom: vs(14),
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
    eyeButton: {
        padding: s(4),
    },
    buttonShadow: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
        marginTop: vs(8),
    },
    createButton: {
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
    createButtonText: {
        color: '#FFFFFF',
        fontSize: rf(15),
        fontWeight: '700',
        letterSpacing: 0.3,
    },
    arrowIcon: {
        marginLeft: s(8),
    },
    loginRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: vs(16),
        marginBottom: vs(16),
    },
    alreadyText: {
        fontSize: rf(13),
        color: '#667085',
        fontWeight: '500',
    },
    loginLinkText: {
        fontSize: rf(13),
        color: colors.primary,
        fontWeight: '700',
    },
    disclaimerContainer: {
        alignItems: 'center',
        marginTop: vs(4),
        paddingTop: vs(14),
        borderTopWidth: 1,
        borderTopColor: '#F2F4F7',
    },
    disclaimerText: {
        fontSize: rf(9.5),
        color: '#98A2B3',
        fontWeight: '600',
        textAlign: 'center',
        lineHeight: vs(14),
        letterSpacing: 0.5,
    },
    disclaimerUnderline: {
        textDecorationLine: 'underline',
    },
});

export default RegisterScreen;
