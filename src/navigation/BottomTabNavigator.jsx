import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../constants/colors';
import { vs, s, rf, ms } from '../utils/responsive';

// Screens
import DashboardScreen from '../screens/MainTabs/DashboardScreen';
import ProjectsScreen from '../screens/MainTabs/ProjectsScreen';
import LeadsScreen from '../screens/MainTabs/LeadsScreen';
import ProfileScreen from '../screens/MainTabs/ProfileScreen';

const Tab = createBottomTabNavigator();

const TAB_CONFIG = {
    Dashboard: {
        label: 'DASHBOARD',
        icon: 'grid-outline',
    },
    Projects: {
        label: 'PROJECTS',
        icon: 'construct-outline',
    },
    Leads: {
        label: 'LEADS',
        icon: 'people-outline',
    },
    Profile: {
        label: 'PROFILE',
        icon: 'person-outline',
    },
};

const CustomTabBar = ({ state, descriptors, navigation }) => {
    return (
        <View style={styles.tabBarContainer}>
            {state.routes.map((route, index) => {
                const isFocused = state.index === index;
                const config = TAB_CONFIG[route.name] || { label: route.name, icon: 'square-outline' };

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                return (
                    <TouchableOpacity
                        key={route.key}
                        accessibilityRole="button"
                        accessibilityState={isFocused ? { selected: true } : {}}
                        activeOpacity={0.8}
                        onPress={onPress}
                        style={styles.tabItem}
                    >
                        <View style={[styles.pillContainer, isFocused && styles.pillActive]}>
                            <Ionicons
                                name={config.icon}
                                size={rf(19)}
                                color={isFocused ? colors.primary : '#667085'}
                            />
                            <Text
                                numberOfLines={1}
                                style={[
                                    styles.tabLabel,
                                    isFocused ? styles.tabLabelActive : styles.tabLabelInactive,
                                ]}
                            >
                                {config.label}
                            </Text>
                        </View>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const BottomTabNavigator = () => {
    return (
        <Tab.Navigator
            tabBar={(props) => <CustomTabBar {...props} />}
            screenOptions={{
                headerShown: false,
            }}
        >
            <Tab.Screen name="Dashboard" component={DashboardScreen} />
            <Tab.Screen name="Projects" component={ProjectsScreen} />
            <Tab.Screen name="Leads" component={LeadsScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    tabBarContainer: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderTopColor: '#EAECF0',
        borderTopWidth: 1,
        height: Platform.OS === 'ios' ? vs(80) : vs(65),
        paddingHorizontal: s(8),
        paddingTop: vs(6),
        paddingBottom: Platform.OS === 'ios' ? vs(20) : vs(6),
        elevation: 10,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pillContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: s(10),
        paddingVertical: vs(5),
        borderRadius: ms(12),
        minWidth: s(68),
    },
    pillActive: {
        backgroundColor: '#DCEDE6', // Screenshot wala soft mint pill background
    },
    tabLabel: {
        fontSize: rf(9.5),
        fontWeight: '800',
        marginTop: vs(3),
        letterSpacing: 0.4,
    },
    tabLabelActive: {
        color: colors.primary,
    },
    tabLabelInactive: {
        color: '#667085',
    },
});

export default BottomTabNavigator;
