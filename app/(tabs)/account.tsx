import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface MenuItem {
    id: string;
    title: string;
    icon: string;
    color: string;
    route?: string;
    description?: string;
}

export default function AccountScreen() {
    const menuItems: MenuItem[] = [
        {
            id: "1",
            title: "Profile",
            icon: "person-outline",
            color: "#FF6B6B",
            description: "Manage your personal information",
        },
        {
            id: "2",
            title: "Auto-Cart Settings",
            icon: "sync-outline",
            color: "#4ECDC4",
            description: "Configure recurring purchases",
        },
        {
            id: "3",
            title: "Wishlist",
            icon: "heart-outline",
            color: "#FF9FF3",
            description: "Your saved items",
        },
        {
            id: "4",
            title: "Addresses",
            icon: "location-outline",
            color: "#45B7D1",
            description: "Manage delivery addresses",
        },
        {
            id: "5",
            title: "Payment Methods",
            icon: "card-outline",
            color: "#96CEB4",
            description: "Cards and payment options",
        },
        {
            id: "6",
            title: "Settings",
            icon: "settings-outline",
            color: "#FECA57",
            route: "/settings",
            description: "App preferences and privacy",
        },
        {
            id: "7",
            title: "Help & Support",
            icon: "help-circle-outline",
            color: "#6C5CE7",
            description: "Get help and contact us",
        },
        {
            id: "8",
            title: "About",
            icon: "information-circle-outline",
            color: "#A29BFE",
            description: "App version and legal info",
        },
    ];

    const MenuItem = ({ item }: { item: MenuItem }) => (
        <TouchableOpacity
            style={styles.menuItem}
            onPress={() => item.route && router.push(item.route)}
            activeOpacity={0.8}
        >
            <BlurView intensity={20} style={styles.menuBlur}>
                <View
                    style={[
                        styles.menuIcon,
                        { backgroundColor: `${item.color}20` },
                    ]}
                >
                    <Ionicons
                        name={item.icon as any}
                        size={24}
                        color={item.color}
                    />
                </View>
                <View style={styles.menuContent}>
                    <Text style={styles.menuTitle}>{item.title}</Text>
                    {item.description && (
                        <Text style={styles.menuDescription}>
                            {item.description}
                        </Text>
                    )}
                </View>
                <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </BlurView>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={["#667eea", "#764ba2"]}
                style={styles.header}
            >
                <View style={styles.headerContent}>
                    <View style={styles.profileSection}>
                        <Image
                            source={{
                                uri: "https://dummyimage.com/80x80/FF6B6B/FFFFFF?text=User",
                            }}
                            style={styles.profileImage}
                        />
                        <View style={styles.profileInfo}>
                            <Text style={styles.profileName}>John Doe</Text>
                            <Text style={styles.profileEmail}>
                                john.doe@example.com
                            </Text>
                            <View style={styles.membershipBadge}>
                                <Ionicons
                                    name="star"
                                    size={14}
                                    color="#FFD700"
                                />
                                <Text style={styles.membershipText}>
                                    Premium Member
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </LinearGradient>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* Stats Section */}
                <View style={styles.statsSection}>
                    <BlurView intensity={80} style={styles.statsContainer}>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>12</Text>
                            <Text style={styles.statLabel}>Orders</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>₹8,450</Text>
                            <Text style={styles.statLabel}>Saved</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>23</Text>
                            <Text style={styles.statLabel}>Wishlist</Text>
                        </View>
                    </BlurView>
                </View>

                {/* Menu Items */}
                <View style={styles.menuSection}>
                    {menuItems.map((item) => (
                        <MenuItem key={item.id} item={item} />
                    ))}
                </View>

                {/* Logout */}
                <TouchableOpacity style={styles.logoutButton}>
                    <BlurView intensity={20} style={styles.logoutBlur}>
                        <Ionicons
                            name="log-out-outline"
                            size={20}
                            color="#FF6B6B"
                        />
                        <Text style={styles.logoutText}>Logout</Text>
                    </BlurView>
                </TouchableOpacity>

                <View style={{ height: 100 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f9fa",
    },
    header: {
        paddingTop: 20,
        paddingBottom: 40,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
    },
    headerContent: {
        paddingHorizontal: 20,
    },
    profileSection: {
        flexDirection: "row",
        alignItems: "center",
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 3,
        borderColor: "rgba(255,255,255,0.3)",
    },
    profileInfo: {
        flex: 1,
        marginLeft: 15,
    },
    profileName: {
        fontSize: 22,
        fontWeight: "bold",
        color: "white",
    },
    profileEmail: {
        fontSize: 14,
        color: "rgba(255,255,255,0.8)",
        marginTop: 2,
    },
    membershipBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.2)",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: "flex-start",
        marginTop: 8,
    },
    membershipText: {
        fontSize: 12,
        color: "white",
        fontWeight: "600",
        marginLeft: 4,
    },
    content: {
        flex: 1,
        marginTop: -20,
    },
    statsSection: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    statsContainer: {
        flexDirection: "row",
        backgroundColor: "rgba(255,255,255,0.9)",
        borderRadius: 20,
        padding: 20,
        justifyContent: "space-around",
    },
    statItem: {
        alignItems: "center",
        flex: 1,
    },
    statNumber: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
    },
    statLabel: {
        fontSize: 12,
        color: "#666",
        marginTop: 4,
    },
    statDivider: {
        width: 1,
        height: 40,
        backgroundColor: "#eee",
        marginHorizontal: 10,
    },
    menuSection: {
        paddingHorizontal: 20,
    },
    menuItem: {
        marginBottom: 12,
        borderRadius: 15,
        overflow: "hidden",
    },
    menuBlur: {
        flexDirection: "row",
        alignItems: "center",
        padding: 15,
        backgroundColor: "rgba(255,255,255,0.9)",
    },
    menuIcon: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        justifyContent: "center",
        alignItems: "center",
    },
    menuContent: {
        flex: 1,
        marginLeft: 15,
    },
    menuTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
    },
    menuDescription: {
        fontSize: 12,
        color: "#666",
        marginTop: 2,
    },
    logoutButton: {
        marginHorizontal: 20,
        marginTop: 20,
        borderRadius: 15,
        overflow: "hidden",
    },
    logoutBlur: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 15,
        backgroundColor: "rgba(255,255,255,0.9)",
    },
    logoutText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#FF6B6B",
        marginLeft: 8,
    },
});
