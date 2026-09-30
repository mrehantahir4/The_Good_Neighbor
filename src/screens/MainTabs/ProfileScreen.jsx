import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { colors } from '../../constants/colors';
import { theme } from '../../constants/theme';
import { vs } from '../../utils/responsive';

import { getAuth, signOut } from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = ({ navigation }) => {
    const handleSignOut = async () => {
        try {
            await AsyncStorage.removeItem('@remember_me');
            const authInstance = getAuth();
            await signOut(authInstance);
        } catch (e) {
            console.log('Signout error:', e);
        } finally {
            navigation.replace('Login');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Profile Settings</Text>
            <Text style={styles.subtitle}>Alex Sterling - General Contractor</Text>

            <TouchableOpacity
                style={styles.signOutButton}
                onPress={handleSignOut}
            >
                <Text style={styles.signOutText}>Sign Out</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: theme.spacing.l,
    },
    title: {
        fontSize: theme.fontSize.h1,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    subtitle: {
        fontSize: theme.fontSize.body,
        color: colors.textSecondary,
        marginTop: theme.spacing.s,
        marginBottom: vs(30),
    },
    signOutButton: {
        borderWidth: 1,
        borderColor: colors.error,
        paddingVertical: vs(10),
        paddingHorizontal: theme.spacing.l,
        borderRadius: theme.radius.button,
    },
    signOutText: {
        color: colors.error,
        fontSize: theme.fontSize.bodyMedium,
        fontWeight: '600',
    },
});

export default ProfileScreen;
