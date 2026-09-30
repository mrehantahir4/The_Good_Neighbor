import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { colors } from '../../constants/colors';
import { theme } from '../../constants/theme';

const LeadsScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Campaign & Leads</Text>
            <Text style={styles.subtitle}>Calls & AI Insights</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        alignItems: 'center',
        justifyContent: 'center',
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
    },
});

export default LeadsScreen;
