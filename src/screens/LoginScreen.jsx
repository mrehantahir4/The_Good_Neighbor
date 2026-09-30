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
    signInWithEmailAndPassword,
    signOut,
    sendEmailVerification,
    GoogleAuthProvider,
    signInWithCredential,
} from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { colors } from '../constants/colors';
import { s, vs, ms, rf } from '../utils/responsive';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';



// Agar react-native-linear-gradient install ho toh use karega, warna smooth fallback
let LinearGradient;
try {
    LinearGradient = require('react-native-linear-gradient').default;
} catch (e) {
    LinearGradient = null;
}


// 1. Lock Icon (Clean Vector)
const LockIcon = ({ color = '#667085', size = 13 }) => (
    <View style={{ width: size, height: size * 1.25, justifyContent: 'flex-end', alignItems: 'center' }}>
        {/* Shackle */}
        <View
            style={{
                width: size * 0.65,
                height: size * 0.6,
                borderWidth: 1.5,
                borderColor: color,
                borderTopLeftRadius: size * 0.35,
                borderTopRightRadius: size * 0.35,
                borderBottomWidth: 0,
                marginBottom: -1,
            }}
        />
        {/* Body */}
        <View
            style={{
                width: size,
                height: size * 0.75,
                backgroundColor: color,
                borderRadius: 2,
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            {/* Keyhole dot */}
            <View style={{ width: 2, height: 2, borderRadius: 1, backgroundColor: '#FFFFFF' }} />
        </View>
    </View>
);

// 2. Headset / Support Icon (Clean Vector)
const HeadsetIcon = ({ color = '#667085', size = 13 }) => (
    <View style={{ width: size * 1.2, height: size * 1.1, alignItems: 'center' }}>
        {/* Arch */}
        <View
            style={{
                width: size * 1.1,
                height: size * 0.9,
                borderWidth: 1.5,
                borderColor: color,
                borderTopLeftRadius: size * 0.55,
                borderTopRightRadius: size * 0.55,
                borderBottomWidth: 0,
            }}
        />
        {/* Ear cushions */}
        <View style={{ position: 'absolute', bottom: 0, left: 0, width: 3, height: 6, backgroundColor: color, borderRadius: 1.5 }} />
        <View style={{ position: 'absolute', bottom: 0, right: 0, width: 3, height: 6, backgroundColor: color, borderRadius: 1.5 }} />
    </View>
);

// ------------------------------------------------------------------------ //

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [keepSignedIn, setKeepSignedIn] = useState(false);
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const [showPassword, setShowPassword] = useState(false);


    useEffect(() => {
        // 1. Google Sign-In setup
        try {
            GoogleSignin.configure({
                scopes: ['email', 'profile'],
            });
        } catch (e) {
            console.log('GoogleSignin configure error:', e);
        }

        // 2. Load Remembered Credentials (agar Remember Me check kiya gaya ho)
        const loadSavedCredentials = async () => {
            try {
                const isRemembered = await AsyncStorage.getItem('@remember_me');
                if (isRemembered === 'true') {
                    setKeepSignedIn(true);
                    const savedEmail = await AsyncStorage.getItem('@saved_email');
                    const savedPassword = await AsyncStorage.getItem('@saved_password');
                    if (savedEmail) setEmail(savedEmail);
                    if (savedPassword) setPassword(savedPassword);
                }
            } catch (err) {
                console.log('Error reading saved credentials:', err);
            }
        };

        loadSavedCredentials();

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

    const [loading, setLoading] = useState(false); // 👈 Loading spinner

    const handleSignIn = async () => {
        if (!email.trim() || !password) {
            Alert.alert('Required Fields', 'Please enter your email and password.');
            return;
        }

        try {
            setLoading(true);
            const authInstance = getAuth();

            // Firebase mein login karein
            const userCredential = await signInWithEmailAndPassword(authInstance, email.trim(), password);

            // Check karein kya user ka email verified hai
            if (!userCredential.user.emailVerified) {
                // User ko logout karwa dein taake unverified user app access na kare
                await signOut(authInstance);

                Alert.alert(
                    'Email Not Verified',
                    'Aapka email abhi verify nahi hua hai. Pehle apne inbox mein jaa kar verification link par click karein.',
                    [
                        {
                            text: 'Resend Email',
                            onPress: async () => {
                                try {
                                    setLoading(true);
                                    const tempCredential = await signInWithEmailAndPassword(authInstance, email.trim(), password);
                                    await sendEmailVerification(tempCredential.user);
                                    await signOut(authInstance);
                                    Alert.alert('Email Sent', 'Verification link dobara bhej di gayi hai. Apna inbox check karein.');
                                } catch (resendError) {
                                    Alert.alert('Error', 'Verification email bhejte waqt masla aya: ' + (resendError?.message || 'Dobara koshish karein.'));
                                } finally {
                                    setLoading(false);
                                }
                            },
                        },
                        {
                            text: 'OK',
                            style: 'cancel',
                        },
                    ]
                );
                return;
            }

            // Remember Me functionality
            if (keepSignedIn) {
                await AsyncStorage.setItem('@remember_me', 'true');
                await AsyncStorage.setItem('@saved_email', email.trim());
                await AsyncStorage.setItem('@saved_password', password);
            } else {
                await AsyncStorage.removeItem('@remember_me');
                await AsyncStorage.removeItem('@saved_email');
                await AsyncStorage.removeItem('@saved_password');
            }

            // Agar login aur email dono verified hain:
            navigation.replace('MainTabs');
        } catch (error) {
            let errorMessage = 'Invalid email or password. Please try again.';
            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
                errorMessage = 'Incorrect email or password.';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Please enter a valid email address.';
            } else if (error.code === 'auth/too-many-requests') {
                errorMessage = 'Too many failed login attempts. Please try again later.';
            } else if (error.code === 'auth/network-request-failed') {
                errorMessage = 'Network error. Please check your internet connection.';
            }
            Alert.alert('Login Failed', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            setLoading(true);
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
            const response = await GoogleSignin.signIn();
            const idToken = response.data?.idToken || response.idToken;

            if (!idToken) {
                throw new Error('Google Sign-In failed: No ID token received.');
            }

            const googleCredential = GoogleAuthProvider.credential(idToken);
            const authInstance = getAuth();
            await signInWithCredential(authInstance, googleCredential);

            if (keepSignedIn) {
                await AsyncStorage.setItem('@remember_me', 'true');
            }

            navigation.replace('MainTabs');
        } catch (error) {
            console.log('Google Sign-In Error:', error);
            if (error?.code === 'SIGN_IN_CANCELLED' || error?.message?.includes('cancelled')) {
                return;
            }
            Alert.alert(
                'Google Sign-In',
                error?.message || 'Google Sign-In could not be completed.'
            );
        } finally {
            setLoading(false);
        }
    };


    const renderGradientButton = () => {
        const buttonContent = loading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
            <Text style={styles.signInButtonText}>Sign In to Dashboard</Text>
        );

        if (LinearGradient) {
            return (
                <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={handleSignIn}
                    style={styles.buttonShadow}
                    disabled={loading}
                >
                    <LinearGradient
                        colors={[colors.gradientStart, colors.gradientEnd]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.signInButton}
                    >
                        {buttonContent}
                    </LinearGradient>
                </TouchableOpacity>
            );
        }

        return (
            <TouchableOpacity
                style={[styles.signInButton, { backgroundColor: colors.primary }, styles.buttonShadow]}
                activeOpacity={0.85}
                onPress={handleSignIn}
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
                    scrollEnabled={isKeyboardVisible} // 👈 Sirf keyboard open hone par hi scroll chalega!
                    bounces={false}
                >



                    {/* MAIN FLOATING WHITE CARD CONTAINER */}
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

                        {/* 2. Welcome Back Title & Subtitle */}
                        <View style={styles.headerContainer}>
                            <Text style={styles.welcomeTitle}>Welcome Back</Text>
                            <Text style={styles.welcomeSubtitle}>
                                Sign in to manage your active job{'\n'}sites{'\n'}and leads.
                            </Text>
                        </View>

                        {/* 3. Email Input */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>EMAIL ADDRESS</Text>
                            <View style={styles.inputContainer}>
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

                        {/* 4. Password Input & Forgot Link */}
                        <View style={styles.inputGroup}>
                            <View style={styles.passwordLabelRow}>
                                <Text style={styles.inputLabel}>PASSWORD</Text>
                                <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('ForgotPassword')}>
                                    <Text style={styles.forgotPasswordText}>FORGOT PASSWORD?</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.passwordInputContainer}>
                                <TextInput
                                    style={styles.passwordInput}
                                    placeholder="••••••••"
                                    placeholderTextColor="#718279"
                                    secureTextEntry={!showPassword} // 👈 Toggle state
                                    value={password}
                                    onChangeText={setPassword}
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


                        {/* 5. Keep me signed in Checkbox */}
                        <TouchableOpacity
                            style={styles.checkboxRow}
                            activeOpacity={0.8}
                            onPress={() => setKeepSignedIn(!keepSignedIn)}
                        >
                            <View style={[styles.checkbox, keepSignedIn && styles.checkboxActive]}>
                                {keepSignedIn && <Text style={styles.checkmark}>✓</Text>}
                            </View>
                            <Text style={styles.checkboxLabel}>
                                Keep me signed in for 30 days
                            </Text>
                        </TouchableOpacity>

                        {/* 6. Sign In to Dashboard Button */}
                        {renderGradientButton()}

                        {/* 7. Don't have an account? Sign Up */}
                        <View style={styles.signUpRow}>
                            <Text style={styles.noAccountText}>Don't have an account? </Text>
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={() => navigation.navigate('Register')} // 👈 Nayi screen par le jayega
                            >
                                <Text style={styles.signUpLinkText}>Sign Up</Text>
                            </TouchableOpacity>
                        </View>


                        {/* 8. Elegant OR Divider */}
                        <View style={styles.orDividerContainer}>
                            <View style={styles.orLine} />
                            <Text style={styles.orText}>OR</Text>
                            <View style={styles.orLine} />
                        </View>

                        {/* 9. Continue with Google Button */}
                        <TouchableOpacity
                            style={styles.googleButton}
                            activeOpacity={0.8}
                            onPress={handleGoogleSignIn}
                            disabled={loading}
                        >
                            <Image
                                source={require('../assets/icons/google.png')}
                                style={styles.googleIcon}
                                resizeMode="contain"
                            />
                            <Text style={styles.googleButtonText}>Continue with Google</Text>
                        </TouchableOpacity>


                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.screenBackground, // Outer soft mint background
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,               // Zaroori: Scroll ko poori screen par expand karta hai
        paddingHorizontal: s(14),
        paddingTop: vs(70),
        paddingBottom: vs(400),    // Zaroori: Keyboard ke upar scroll hone k liye extra space
    },


    // MAIN CARD CONTAINER (Screenshot wala rounded card)
    cardContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: ms(30),
        paddingHorizontal: s(22),
        paddingTop: vs(24),
        paddingBottom: vs(32),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 4,
    },

    // 1. Logo Row
    logoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: vs(28),
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

    // 2. Headings
    headerContainer: {
        marginBottom: vs(26),
    },
    welcomeTitle: {
        fontSize: rf(28),
        fontWeight: '800',
        color: colors.textPrimary,
        marginBottom: vs(10),
        letterSpacing: -0.5,
    },
    welcomeSubtitle: {
        fontSize: rf(14),
        fontWeight: '500',
        color: colors.textSecondary,
        lineHeight: vs(20),
    },

    // 3 & 4. Inputs
    inputGroup: {
        marginBottom: vs(18),
    },
    inputLabel: {
        fontSize: rf(11),
        fontWeight: '700',
        color: colors.textSecondary,
        letterSpacing: 0.8,
        marginBottom: vs(8),
    },
    passwordLabelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: vs(8),
    },
    passwordInputContainer: {
        backgroundColor: colors.inputBackground,
        borderRadius: ms(12),
        height: vs(48),
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: s(16),
    },
    passwordInput: {
        flex: 1,
        fontSize: rf(14),
        color: colors.textPrimary,
        fontWeight: '600',
    },
    eyeButton: {
        padding: s(4),
    },

    forgotPasswordText: {
        fontSize: rf(11),
        fontWeight: '700',
        color: colors.primary,
        letterSpacing: 0.5,
    },
    inputContainer: {
        backgroundColor: colors.inputBackground, // #DCE5E0
        borderRadius: ms(12),
        height: vs(48),
        justifyContent: 'center',
        paddingHorizontal: s(16),
    },
    input: {
        fontSize: rf(14),
        color: colors.textPrimary,
        fontWeight: '600',
    },

    // 5. Checkbox
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: vs(6),
        marginBottom: vs(22),
    },
    checkbox: {
        width: s(18),
        height: s(18),
        borderRadius: ms(4),
        borderWidth: 1.5,
        borderColor: '#98A2B3',
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: s(10),
    },
    checkboxActive: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    checkmark: {
        color: '#FFFFFF',
        fontSize: rf(11),
        fontWeight: 'bold',
    },
    checkboxLabel: {
        fontSize: rf(13),
        color: colors.textPrimary,
        fontWeight: '600',
    },

    // 6. Sign In (Linear Gradient) Button
    buttonShadow: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    signInButton: {
        height: vs(50),
        borderRadius: ms(12),
        alignItems: 'center',
        justifyContent: 'center',
    },
    signInButtonText: {
        color: '#FFFFFF',
        fontSize: rf(15),
        fontWeight: '700',
        letterSpacing: 0.3,
    },

    // 7. Don't have an account? Sign Up
    signUpRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: vs(18),
        marginBottom: vs(14),
    },
    noAccountText: {
        fontSize: rf(13),
        color: '#667085',
        fontWeight: '500',
    },
    signUpLinkText: {
        fontSize: rf(13),
        color: colors.primary,
        fontWeight: '700',
    },

    // 8. OR Divider
    orDividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: vs(16),
    },
    orLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#E4E7EC',
    },
    orText: {
        fontSize: rf(12),
        fontWeight: '600',
        color: '#98A2B3',
        paddingHorizontal: s(12),
        letterSpacing: 0.5,
    },

    // 9. Continue with Google Button
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: vs(50),
        borderRadius: ms(12),
        borderWidth: 1.2,
        borderColor: '#E4E7EC',
        backgroundColor: '#FFFFFF',
    },
    googleIcon: {
        width: s(20),
        height: s(20),
    },

    googleButtonText: {
        fontSize: rf(14),
        fontWeight: '600',
        color: '#344054',
        marginLeft: s(10),
    },



});

export default LoginScreen;
