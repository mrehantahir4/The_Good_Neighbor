import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { colors } from '../../constants/colors';
import { theme } from '../../constants/theme';

const ProjectsScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Project Pipeline</Text>
            <Text style={styles.subtitle}>Active & Completed Projects</Text>
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

export default ProjectsScreen;
