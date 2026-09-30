import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    SafeAreaView,
    StatusBar,
    Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getAuth } from '@react-native-firebase/auth';
import { colors } from '../../constants/colors';
import { s, vs, ms, rf } from '../../utils/responsive';

let LinearGradient;
try {
    LinearGradient = require('react-native-linear-gradient').default;
} catch (e) {
    LinearGradient = null;
}

const DashboardScreen = ({ navigation }) => {
   

    // 1. User Name: Firebase se actual logged in user ka naam uthayega
    const [userName, setUserName] = useState('');
    const [userPhoto, setUserPhoto] = useState(null);

    // 2. Metrics / Stat Cards (Defaults 0 / empty - API data bind hoga)
    const [stats, setStats] = useState({
        activeJobs: 0,
        activeJobsTrend: '',
        postcardsSent: 0,
        postcardsTrend: '',
        callsReceived: 0,
        callsTrend: '',
        newLeads: 0,
        newLeadsTrend: '',
    });

    // 3. Projects List (Empty array - API se aayega)
    const [activeProjects, setActiveProjects] = useState([]);

    // 4. Campaigns List (Empty array - API se aayega)
    const [recentCampaigns, setRecentCampaigns] = useState([]);

    useEffect(() => {
        try {
            const authInstance = getAuth();
            const current = authInstance.currentUser;
            if (current) {
                const name =
                    current.displayName ||
                    (current.email ? current.email.split('@')[0] : 'Welcome');
                setUserName(name);
                setUserPhoto(current.photoURL || null);
            }
        } catch (e) {
            console.log('User auth read error:', e);
        }

        // 👈 Yahan aap apni API call laga sakte hain, misaal ke taur par:
        // fetchDashboardData().then(res => {
        //     setStats(res.stats);
        //     setActiveProjects(res.projects);
        //     setRecentCampaigns(res.campaigns);
        // });
    }, []);

    // Button Render Helper
    const renderNewCampaignButton = () => {
        const buttonContent = (
            <View style={styles.actionBtnContent}>
                <Ionicons name="add-circle-outline" size={rf(18)} color="#FFFFFF" style={styles.btnIcon} />
                <Text style={styles.actionBtnText}>New Campaign</Text>
            </View>
        );

        if (LinearGradient) {
            return (
                <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => {
                        // Navigate to new campaign
                    }}
                >
                    <LinearGradient
                        colors={[colors.gradientStart, colors.gradientEnd]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.campaignBtnGradient}
                    >
                        {buttonContent}
                    </LinearGradient>
                </TouchableOpacity>
            );
        }

        return (
            <TouchableOpacity
                style={[styles.campaignBtnGradient, { backgroundColor: colors.primary }]}
                activeOpacity={0.85}
                onPress={() => {
                    // Navigate to new campaign
                }}
            >
                {buttonContent}
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar
                barStyle="dark-content"
                backgroundColor="#EAF2EE"
                translucent={false}
            />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* 1. TOP HEADER (Drafting Compass Icon + App Title + User Avatar) */}
                <View style={styles.topHeader}>
                    <View style={styles.brandRow}>
                        <Image
                            source={require('../../assets/icons/logo.png')}
                            style={styles.logoIcon}
                            resizeMode="contain"
                        />
                        <Text style={styles.brandTitle}>The Good Neighbor</Text>
                    </View>

                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={styles.avatarContainer}
                        onPress={() => navigation?.navigate?.('Profile')}
                    >
                        {userPhoto ? (
                            <Image source={{ uri: userPhoto }} style={styles.avatarImage} />
                        ) : (
                            <Ionicons name="person" size={rf(20)} color={colors.primary} />
                        )}
                    </TouchableOpacity>
                </View>

                {/* 2. GREETING SECTION (Actual User Name) */}
                <View style={styles.greetingSection}>
                    <Text style={styles.greetingTitle}>
                        {userName ? `${userName}!` : 'Welcome!'}
                    </Text>
                    <Text style={styles.greetingSubtitle}>
                        Here's what's happening with your job sites today:
                    </Text>
                </View>

                {/* 3. METRIC STAT CARDS (Layout Ready for API) */}
                <View style={styles.statsContainer}>
                    {/* Card 1: ACTIVE JOBS */}
                    <View style={styles.statCard}>
                        <View style={styles.statTopRow}>
                            <Text style={styles.statTitle}>ACTIVE JOBS</Text>
                            <Ionicons name="construct-outline" size={rf(18)} color={colors.primary} />
                        </View>
                        <Text style={styles.statValue}>{stats.activeJobs}</Text>
                        <View style={styles.statBottomRow}>
                            {stats.activeJobsTrend ? (
                                <Text style={[styles.statTrendText, styles.trendPositive]}>
                                    {stats.activeJobsTrend}
                                </Text>
                            ) : (
                                <Text style={styles.statTrendPlaceholder}>No change this week</Text>
                            )}
                        </View>
                    </View>

                    {/* Card 2: POSTCARDS SENT */}
                    <View style={styles.statCard}>
                        <View style={styles.statTopRow}>
                            <Text style={styles.statTitle}>POSTCARDS SENT</Text>
                            <Ionicons name="mail-outline" size={rf(18)} color={colors.primary} />
                        </View>
                        <Text style={styles.statValue}>{stats.postcardsSent}</Text>
                        <View style={styles.statBottomRow}>
                            {stats.postcardsTrend ? (
                                <Text style={styles.statTrendText}>{stats.postcardsTrend}</Text>
                            ) : (
                                <Text style={styles.statTrendPlaceholder}>No active campaign</Text>
                            )}
                        </View>
                    </View>

                    {/* Card 3: CALLS RECEIVED */}
                    <View style={styles.statCard}>
                        <View style={styles.statTopRow}>
                            <Text style={styles.statTitle}>CALLS RECEIVED</Text>
                            <Ionicons name="call-outline" size={rf(18)} color={colors.primary} />
                        </View>
                        <Text style={styles.statValue}>{stats.callsReceived}</Text>
                        <View style={styles.statBottomRow}>
                            {stats.callsTrend ? (
                                <Text style={[styles.statTrendText, styles.trendPositive]}>
                                    {stats.callsTrend}
                                </Text>
                            ) : (
                                <Text style={styles.statTrendPlaceholder}>0% response rate</Text>
                            )}
                        </View>
                    </View>

                    {/* Card 4: NEW LEADS */}
                    <View style={styles.statCard}>
                        <View style={styles.statTopRow}>
                            <Text style={styles.statTitle}>NEW LEADS</Text>
                            <Ionicons name="shield-checkmark-outline" size={rf(18)} color={colors.primary} />
                        </View>
                        <Text style={styles.statValue}>{stats.newLeads}</Text>
                        <View style={styles.statBottomRow}>
                            {stats.newLeadsTrend ? (
                                <Text style={[styles.statTrendText, styles.trendAlert]}>
                                    {stats.newLeadsTrend}
                                </Text>
                            ) : (
                                <Text style={styles.statTrendPlaceholder}>No action required</Text>
                            )}
                        </View>
                    </View>
                </View>

                {/* 4. ACTIVE PROJECTS SECTION */}
                <View style={styles.sectionHeaderRow}>
                    <Text style={styles.sectionTitle}>Active Projects</Text>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => navigation?.navigate?.('Projects')}
                    >
                        <Text style={styles.viewAllText}>View All</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.projectsList}>
                    {activeProjects && activeProjects.length > 0 ? (
                        activeProjects.map((project) => (
                            <View key={project.id} style={styles.projectCard}>
                                {project.imageUrl ? (
                                    <Image
                                        source={{ uri: project.imageUrl }}
                                        style={styles.projectImage}
                                        resizeMode="cover"
                                    />
                                ) : (
                                    <View style={styles.projectImageFallback}>
                                        <Ionicons name="home-outline" size={rf(32)} color={colors.textMuted} />
                                    </View>
                                )}
                                <View style={styles.projectCardBody}>
                                    <View style={styles.projectMetaRow}>
                                        <View style={styles.statusBadge}>
                                            <Text style={styles.statusBadgeText}>{project.status}</Text>
                                        </View>
                                        <Text style={styles.projectUpdateText}>{project.updatedAt}</Text>
                                    </View>
                                    <Text style={styles.projectTitle}>{project.title}</Text>
                                    <Text style={styles.projectCategory}>{project.category}</Text>
                                    <View style={styles.reachRow}>
                                        <Text style={styles.reachLabel}>{project.reachLabel}</Text>
                                        <Text style={styles.reachValue}>{project.reachValue}</Text>
                                    </View>
                                    <TouchableOpacity activeOpacity={0.85} style={styles.detailsButton}>
                                        <Text style={styles.detailsButtonText}>Details</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))
                    ) : (
                        <View style={styles.emptyStateCard}>
                            <Ionicons name="folder-open-outline" size={rf(30)} color={colors.primary} />
                            <Text style={styles.emptyTitle}>No Active Projects</Text>
                            <Text style={styles.emptySubtitle}>
                                Projects from your API will be displayed here once connected.
                            </Text>
                        </View>
                    )}
                </View>

                {/* 5. RECENT CAMPAIGNS SECTION */}
                <View style={styles.sectionHeaderRow}>
                    <Text style={styles.sectionTitle}>Recent Campaigns</Text>
                </View>

                <View style={styles.campaignsContainer}>
                    {recentCampaigns && recentCampaigns.length > 0 ? (
                        recentCampaigns.map((camp) => (
                            <View key={camp.id} style={styles.campaignItemWrapper}>
                                <View style={styles.campaignRow}>
                                    <View style={[styles.campaignIconBox, { backgroundColor: camp.iconBg || '#D4EFEB' }]}>
                                        <Ionicons
                                            name={camp.icon || 'send-outline'}
                                            size={rf(18)}
                                            color={camp.iconColor || colors.primary}
                                        />
                                    </View>
                                    <View style={styles.campaignTextContainer}>
                                        <Text style={styles.campaignTitle}>{camp.title}</Text>
                                        <Text style={styles.campaignSubtitle}>{camp.subtitle}</Text>
                                    </View>
                                </View>
                            </View>
                        ))
                    ) : (
                        <View style={styles.emptyCampaignContainer}>
                            <Ionicons name="megaphone-outline" size={rf(26)} color={colors.primary} />
                            <Text style={styles.emptyTitle}>No Campaigns Active</Text>
                            <Text style={styles.emptySubtitle}>
                                Campaigns will be displayed here once loaded from the API.
                            </Text>
                        </View>
                    )}

                    <View style={styles.newCampaignBtnWrapper}>
                        {renderNewCampaignButton()}
                    </View>
                </View>

                <View style={{ height: vs(70) }} />
            </ScrollView>

            {/* FLOATING ACTION BUTTON (+) */}
            <TouchableOpacity
                activeOpacity={0.85}
                style={styles.fabButton}
                onPress={() => {
                    // Floating button action
                }}
            >
                <Ionicons name="add" size={rf(26)} color="#FFFFFF" />
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#EAF2EE',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: s(16),
        paddingTop: Platform.OS === 'android' ? vs(14) : vs(8),
        paddingBottom: vs(24),
    },

    // 1. TOP HEADER
    topHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: vs(16),
        marginTop: vs(6),
    },
    brandRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoIcon: {
        width: s(24),
        height: s(28),
        marginRight: s(10),
    },
    brandTitle: {
        fontSize: rf(17),
        fontWeight: '800',
        color: colors.primary,
        letterSpacing: 0.2,
    },
    avatarContainer: {
        width: s(36),
        height: s(36),
        borderRadius: s(18),
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        borderWidth: 1.5,
        borderColor: '#D4E5DE',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
    },

    // 2. GREETING
    greetingSection: {
        marginBottom: vs(20),
    },
    greetingTitle: {
        fontSize: rf(28),
        fontWeight: '800',
        color: '#101828',
        letterSpacing: -0.5,
    },
    greetingSubtitle: {
        fontSize: rf(13.5),
        color: '#475467',
        marginTop: vs(4),
        lineHeight: vs(20),
    },

    // 3. STAT CARDS
    statsContainer: {
        marginBottom: vs(22),
    },
    statCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: ms(16),
        paddingHorizontal: s(18),
        paddingVertical: vs(14),
        marginBottom: vs(12),
        borderWidth: 1,
        borderColor: '#E6ECE8',
        shadowColor: '#101828',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 2,
    },
    statTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    statTitle: {
        fontSize: rf(11),
        fontWeight: '700',
        color: '#667085',
        letterSpacing: 0.8,
    },
    statValue: {
        fontSize: rf(30),
        fontWeight: '800',
        color: '#101828',
        marginTop: vs(4),
        marginBottom: vs(2),
    },
    statBottomRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statTrendText: {
        fontSize: rf(12),
        fontWeight: '600',
    },
    statTrendPlaceholder: {
        fontSize: rf(11.5),
        color: '#98A2B3',
        fontWeight: '500',
    },
    trendPositive: {
        color: '#12B76A',
    },
    trendAlert: {
        color: '#D92D20',
    },

    // 4. ACTIVE PROJECTS
    sectionHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: vs(12),
        marginTop: vs(4),
    },
    sectionTitle: {
        fontSize: rf(18),
        fontWeight: '800',
        color: '#101828',
    },
    viewAllText: {
        fontSize: rf(13),
        fontWeight: '700',
        color: colors.primary,
    },
    projectsList: {
        marginBottom: vs(20),
    },
    emptyStateCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: ms(16),
        paddingVertical: vs(28),
        paddingHorizontal: s(20),
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#E6ECE8',
        borderStyle: 'dashed',
    },
    emptyCampaignContainer: {
        paddingVertical: vs(20),
        paddingHorizontal: s(16),
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyTitle: {
        fontSize: rf(14),
        fontWeight: '700',
        color: '#101828',
        marginTop: vs(8),
    },
    emptySubtitle: {
        fontSize: rf(12),
        color: '#667085',
        textAlign: 'center',
        marginTop: vs(4),
        lineHeight: vs(17),
    },
    projectCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: ms(16),
        overflow: 'hidden',
        marginBottom: vs(14),
        borderWidth: 1,
        borderColor: '#E6ECE8',
        elevation: 2,
    },
    projectImage: {
        width: '100%',
        height: vs(125),
    },
    projectImageFallback: {
        width: '100%',
        height: vs(125),
        backgroundColor: '#E6EAE8',
        alignItems: 'center',
        justifyContent: 'center',
    },
    projectCardBody: {
        padding: s(16),
    },
    projectMetaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: vs(8),
    },
    statusBadge: {
        backgroundColor: '#E0E7F4',
        paddingHorizontal: s(8),
        paddingVertical: vs(3),
        borderRadius: ms(4),
        marginRight: s(8),
    },
    statusBadgeText: {
        fontSize: rf(9.5),
        fontWeight: '800',
        color: '#3B5998',
    },
    projectUpdateText: {
        fontSize: rf(11.5),
        color: '#667085',
    },
    projectTitle: {
        fontSize: rf(16),
        fontWeight: '800',
        color: '#101828',
        marginBottom: vs(2),
    },
    projectCategory: {
        fontSize: rf(13),
        color: '#667085',
        marginBottom: vs(12),
    },
    reachRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginBottom: vs(12),
    },
    reachLabel: {
        fontSize: rf(11),
        color: '#667085',
        marginRight: s(6),
    },
    reachValue: {
        fontSize: rf(13),
        fontWeight: '800',
        color: colors.primary,
    },
    detailsButton: {
        backgroundColor: colors.primary,
        borderRadius: ms(20),
        height: vs(38),
        alignItems: 'center',
        justifyContent: 'center',
    },
    detailsButtonText: {
        color: '#FFFFFF',
        fontSize: rf(13),
        fontWeight: '700',
    },

    // 5. RECENT CAMPAIGNS
    campaignsContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: ms(16),
        padding: s(16),
        borderWidth: 1,
        borderColor: '#E6ECE8',
        elevation: 2,
    },
    campaignItemWrapper: {
        marginBottom: vs(12),
    },
    campaignRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    campaignIconBox: {
        width: s(36),
        height: s(36),
        borderRadius: ms(8),
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: s(12),
    },
    campaignTextContainer: {
        flex: 1,
    },
    campaignTitle: {
        fontSize: rf(13.5),
        fontWeight: '700',
        color: '#101828',
    },
    campaignSubtitle: {
        fontSize: rf(12),
        color: '#667085',
        marginTop: vs(2),
    },
    newCampaignBtnWrapper: {
        marginTop: vs(6),
    },
    campaignBtnGradient: {
        borderRadius: ms(12),
        height: vs(42),
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionBtnContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnIcon: {
        marginRight: s(6),
    },
    actionBtnText: {
        color: '#FFFFFF',
        fontSize: rf(13.5),
        fontWeight: '700',
    },

    // FLOATING ACTION BUTTON (+)
    fabButton: {
        position: 'absolute',
        bottom: vs(18),
        right: s(16),
        width: s(48),
        height: s(48),
        borderRadius: s(24),
        backgroundColor: '#00584B',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 6,
    },
});

export default DashboardScreen;
