import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getAuth } from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import BottomTabNavigator from './BottomTabNavigator';
import { colors } from '../constants/colors';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
    const [initialRoute, setInitialRoute] = useState(null);

    useEffect(() => {
        const checkAutoLogin = async () => {
            try {
                const rememberMe = await AsyncStorage.getItem('@remember_me');
                const authInstance = getAuth();
                const currentUser = authInstance.currentUser;

                // Agar user ne 'Keep me signed in' check kiya tha aur email verified hai:
                if (rememberMe === 'true' && currentUser && currentUser.emailVerified) {
                    setInitialRoute('MainTabs');
                    return;
                }
            } catch (e) {
                console.log('Auto-login check error:', e);
            }

            setInitialRoute('Login');
        };

        checkAutoLogin();
    }, []);

    // Jab tak check complete na ho, soft splash loading show karein
    if (!initialRoute) {
        return (
            <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <Stack.Navigator
            initialRouteName={initialRoute}
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
        </Stack.Navigator>
    );
};

export default AppNavigator;