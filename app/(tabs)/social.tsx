import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
    FlatList,
    Image,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface User {
    id: string;
    name: string;
    avatar: string;
    isBlended: boolean;
    pendingRequest: boolean;
    recentPurchases: string[];
    interests: string[];
}

interface BlendRequest {
    id: string;
    from: User;
    message: string;
    timestamp: string;
}

export default function SocialScreen() {
    const [users, setUsers] = useState<User[]>([
        {
            id: "1",
            name: "Priya Sharma",
            avatar: "https://dummyimage.com/80x80/FF6B6B/FFFFFF?text=PS",
            isBlended: true,
            pendingRequest: false,
            recentPurchases: ["Kurta", "Handbag", "Lipstick"],
            interests: ["Fashion", "Beauty", "Traditional"],
        },
        {
            id: "2",
            name: "Arjun Kumar",
            avatar: "https://dummyimage.com/80x80/4ECDC4/FFFFFF?text=AK",
            isBlended: false,
            pendingRequest: true,
            recentPurchases: ["Headphones", "T-shirt", "Sneakers"],
            interests: ["Electronics", "Fitness", "Casual"],
        },
        {
            id: "3",
            name: "Sneha Gupta",
            avatar: "https://dummyimage.com/80x80/45B7D1/FFFFFF?text=SG",
            isBlended: false,
            pendingRequest: false,
            recentPurchases: ["Face cream", "Saree", "Jewelry"],
            interests: ["Beauty", "Traditional", "Accessories"],
        },
    ]);

    const [blendRequests, setBlendRequests] = useState<BlendRequest[]>([
        {
            id: "1",
            from: users[1],
            message: "Hey! Would love to blend our shopping interests!",
            timestamp: "2 hours ago",
        },
    ]);

    const [showRequestModal, setShowRequestModal] = useState(false);

    const handleSendBlendRequest = (userId: string) => {
        setUsers(
            users.map((uer) =>
                user.id === userId ? { ...user, pendingRequest: true } : user
            )
        );
    };

    const handleAcceptBlendRequest = (requestId: string) => {
        const request = blendRequests.find((r) => r.id === requestId);
        if (request) {
            setUsers(
                users.map((user) =>
                    user.id === request.from.id
                        ? { ...user, isBlended: true, pendingRequest: false }
                        : user
                )
            );
            setBlendRequests(blendRequests.filter((r) => r.id !== requestId));
        }
    };

    const handleRejectBlendRequest = (requestId: string) => {
        const request = blendReqests.find((r) => r.id === requestId);
        if (request) {
            setUsers(
                users.map((user) =>
                    user.id === request.from.id
                        ? { ...user, pendingRequest: false }
                        : user
                )
            );
            setBlendRequests(blendRequests.filter((r) => r.id !== requestId));
        }
    };

    const UserCard = ({ user }: { user: User }) => (
        <View style={styles.userCard}>
            <BlurView intensity={20} style={styles.userCardBlur}>
                <Image source={{ uri: user.avatar }} style={styles.avatar} />
                <View style={styles.userInfo}>
                    <Text style={styles.userName}>{user.name}</Text>
                    <View style={styles.interestsContainer}>
                        {user.interests.slice(0, 2).map((interest, index) => (
                            <View key={index} style={styles.interestTag}>
                                <Text style={styles.interestText}>
                                    {interest}
                                </Text>
                            </View>
                        ))}
                    </View>
                    {user.isBlended && (
                        <View style={styles.recentPurchases}>
                            <Text style={styles.recentLabel}>Recent:</Text>
                            <Text style={styles.recentItems}>
                                {user.recentPurchases.slice(0, 2).join(", ")}
                            </Text>
                        </View>
                    )}
                </View>
                <View style={styles.actionButtons}>
                    {user.isBlended ? (
                        <View style={styles.blendedBadge}>
                            <Ionicons
                                name="checkmark-circle"
                                size={20}
                                color="#4ECDC4"
                            />
                            <Text style={styles.blendedText}>Blended</Text>
                        </View>
                    ) : user.pendingRequest ? (
                        <View style={styles.pendingBadge}>
                            <Ionicons
                                name="time-outline"
                                size={16}
                                color="#FFB347"
                            />
                            <Text style={styles.pendingText}>Pending</Text>
                        </View>
                    ) : (
                        <TouchableOpacity
                            style={styles.blendButton}
                            onPress={() => handleSendBlendRequest(user.id)}
                        >
                            <Ionicons
                                name="link-outline"
                                size={16}
                                color="white"
                            />
                            <Text style={styles.blendButtonText}>Blend</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </BlurView>
        </View>
    );

    const RequestCard = ({ request }: { request: BlendRequest }) => (
        <View style={styles.requestCard}>
            <BlurView intensity={30} style={styles.requestCardBlur}>
                <Image
                    source={{ uri: request.from.avatar }}
                    style={styles.requestAvatar}
                />
                <View style={styles.requestInfo}>
                    <Text style={styles.requestName}>{request.from.name}</Text>
                    <Text style={styles.requestMessage}>{request.message}</Text>
                    <Text style={styles.requestTime}>{request.timestamp}</Text>
                </View>
                <View style={styles.requestActions}>
                    <TouchableOpacity
                        style={styles.acceptButton}
                        onPress={() => handleAcceptBlendRequest(request.id)}
                    >
                        <Ionicons name="checkmark" size={16} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.rejectButton}
                        onPress={() => handleRejectBlendRequest(request.id)}
                    >
                        <Ionicons name="close" size={16} color="white" />
                    </TouchableOpacity>
                </View>
            </BlurView>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={["#667eea", "#764ba2"]}
                style={styles.header}
            >
                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>Social Shopping</Text>
                    <Text style={styles.headerSubtitle}>
                        Blend with friends & family
                    </Text>
                    <TouchableOpacity
                        style={styles.requestsButton}
                        onPress={() => setShowRequestModal(true)}
                    >
                        <Ionicons
                            name="notifications-outline"
                            size={20}
                            color="white"
                        />
                        {blendRequests.length > 0 && (
                            <View style={styles.notificationBadge}>
                                <Text style={styles.notificationText}>
                                    {blendRequests.length}
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
            </LinearGradient>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Your Blend Network</Text>
                    <FlatList
                        data={users.filter((user) => user.isBlended)}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => <UserCard user={item} />}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={
                            <View style={styles.emptyState}>
                                <Ionicons
                                    name="people-outline"
                                    size={50}
                                    color="#ccc"
                                />
                                <Text style={styles.emptyText}>
                                    No blends yet
                                </Text>
                                <Text style={styles.emptySubtext}>
                                    Start blending to see shared interests
                                </Text>
                            </View>
                        }
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Discover People</Text>
                    <FlatList
                        data={users.filter((user) => !user.isBlended)}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => <UserCard user={item} />}
                        showsVerticalScrollIndicator={false}
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        Trending Among Friends
                    </Text>
                    <View style={styles.trendingContainer}>
                        {[
                            "Ethnic Wear",
                            "Wireless Earbuds",
                            "Skincare",
                            "Home Decor",
                        ].map((trend, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.trendingCard}
                            >
                                <BlurView
                                    intensity={15}
                                    style={styles.trendingBlur}
                                >
                                    <Ionicons
                                        name="trending-up-outline"
                                        size={20}
                                        color="#FF6B6B"
                                    />
                                    <Text style={styles.trendingText}>
                                        {trend}
                                    </Text>
                                </BlurView>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Blend Requests Modal */}
            <Modal
                visible={showRequestModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowRequestModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <BlurView intensity={50} style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                Blend Requests
                            </Text>
                            <TouchableOpacity
                                onPress={() => setShowRequestModal(false)}
                            >
                                <Ionicons name="close" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.requestsList}>
                            {blendRequests.length > 0 ? (
                                blendRequests.map((request) => (
                                    <RequestCard
                                        key={request.id}
                                        request={request}
                                    />
                                ))
                            ) : (
                                <View style={styles.emptyRequests}>
                                    <Ionicons
                                        name="mail-outline"
                                        size={40}
                                        color="#ccc"
                                    />
                                    <Text style={styles.emptyRequestsText}>
                                        No pending requests
                                    </Text>
                                </View>
                            )}
                        </ScrollView>
                    </BlurView>
                </View>
            </Modal>
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
        paddingBottom: 30,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
    },
    headerContent: {
        paddingHorizontal: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "white",
        flex: 1,
    },
    headerSubtitle: {
        fontSize: 14,
        color: "rgba(255,255,255,0.8)",
        marginTop: 5,
    },
    requestsButton: {
        position: "relative",
        padding: 10,
    },
    notificationBadge: {
        position: "absolute",
        top: 5,
        right: 5,
        backgroundColor: "#FF6B6B",
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    notificationText: {
        color: "white",
        fontSize: 10,
        fontWeight: "bold",
    },
    content: {
        flex: 1,
        marginTop: -15,
    },
    section: {
        paddingHorizontal: 20,
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 15,
    },
    userCard: {
        marginBottom: 15,
        borderRadius: 15,
        overflow: "hidden",
    },
    userCardBlur: {
        flexDirection: "row",
        padding: 15,
        backgroundColor: "rgba(255,255,255,0.9)",
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 15,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 5,
    },
    interestsContainer: {
        flexDirection: "row",
        marginBottom: 5,
    },
    interestTag: {
        backgroundColor: "#e3f2fd",
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 12,
        marginRight: 5,
    },
    interestText: {
        fontSize: 10,
        color: "#1976d2",
        fontWeight: "600",
    },
    recentPurchases: {
        flexDirection: "row",
        alignItems: "center",
    },
    recentLabel: {
        fontSize: 12,
        color: "#666",
        fontWeight: "600",
        marginRight: 5,
    },
    recentItems: {
        fontSize: 12,
        color: "#999",
        flex: 1,
    },
    actionButtons: {
        justifyContent: "center",
    },
    blendedBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#e8f5e8",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
    },
    blendedText: {
        color: "#4ECDC4",
        fontSize: 12,
        fontWeight: "bold",
        marginLeft: 3,
    },
    pendingBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff3cd",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
    },
    pendingText: {
        color: "#FFB347",
        fontSize: 12,
        fontWeight: "bold",
        marginLeft: 3,
    },
    blendButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FF6B6B",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 15,
    },
    blendButtonText: {
        color: "white",
        fontSize: 12,
        fontWeight: "bold",
        marginLeft: 3,
    },
    emptyState: {
        alignItems: "center",
        paddingVertical: 40,
    },
    emptyText: {
        fontSize: 16,
        color: "#999",
        fontWeight: "600",
        marginTop: 10,
    },
    emptySubtext: {
        fontSize: 14,
        color: "#ccc",
        marginTop: 5,
    },
    trendingContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    trendingCard: {
        width: "48%",
        marginBottom: 10,
        borderRadius: 12,
        overflow: "hidden",
    },
    trendingBlur: {
        flexDirection: "row",
        alignItems: "center",
        padding: 15,
        backgroundColor: "rgba(255,255,255,0.8)",
    },
    trendingText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#333",
        marginLeft: 8,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "flex-end",
    },
    modalContent: {
        height: "70%",
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        overflow: "hidden",
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
    },
    requestsList: {
        flex: 1,
        padding: 20,
    },
    requestCard: {
        marginBottom: 15,
        borderRadius: 15,
        overflow: "hidden",
    },
    requestCardBlur: {
        flexDirection: "row",
        padding: 15,
        backgroundColor: "rgba(255,255,255,0.9)",
    },
    requestAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    requestInfo: {
        flex: 1,
    },
    requestName: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 5,
    },
    requestMessage: {
        fontSize: 14,
        color: "#666",
        marginBottom: 5,
    },
    requestTime: {
        fontSize: 12,
        color: "#999",
    },
    requestActions: {
        flexDirection: "column",
        justifyContent: "center",
    },
    acceptButton: {
        backgroundColor: "#4ECDC4",
        padding: 8,
        borderRadius: 20,
        marginBottom: 5,
        alignItems: "center",
    },
    rejectButton: {
        backgroundColor: "#FF6B6B",
        padding: 8,
        borderRadius: 20,
        alignItems: "center",
    },
    emptyRequests: {
        alignItems: "center",
        paddingVertical: 50,
    },
    emptyRequestsText: {
        fontSize: 16,
        color: "#999",
        marginTop: 10,
    },
});
