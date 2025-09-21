import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface Order {
    id: string;
    items: {
        name: string;
        price: number;
        quantity: number;
        image: string;
    }[];
    status: "delivered" | "shipped" | "processing" | "cancelled";
    orderDate: string;
    deliveryDate?: string;
    totalAmount: number;
    trackingId: string;
}

export default function OrdersScreen() {
    const [activeTab, setActiveTab] = useState<
        "all" | "delivered" | "processing"
    >("all");

    const orders: Order[] = [
        {
            id: "ORD001",
            items: [
                {
                    name: "Cotton Kurta Set",
                    price: 899,
                    quantity: 1,
                    image: "https://dummyimage.com/80x80/FF6B6B/FFFFFF?text=Kurta",
                },
            ],
            status: "delivered",
            orderDate: "2024-09-15",
            deliveryDate: "2024-09-18",
            totalAmount: 899,
            trackingId: "TRK123456789",
        },
        {
            id: "ORD002",
            items: [
                {
                    name: "Wireless Earbuds",
                    price: 1299,
                    quantity: 1,
                    image: "https://dummyimage.com/80x80/4ECDC4/FFFFFF?text=Earbuds",
                },
                {
                    name: "Phone Case",
                    price: 299,
                    quantity: 2,
                    image: "https://dummyimage.com/80x80/45B7D1/FFFFFF?text=Case",
                },
            ],
            status: "shipped",
            orderDate: "2024-09-18",
            totalAmount: 1897,
            trackingId: "TRK987654321",
        },
        {
            id: "ORD003",
            items: [
                {
                    name: "Face Serum",
                    price: 599,
                    quantity: 1,
                    image: "https://dummyimage.com/80x80/96CEB4/FFFFFF?text=Serum",
                },
            ],
            status: "processing",
            orderDate: "2024-09-20",
            totalAmount: 599,
            trackingId: "TRK456789123",
        },
    ];

    const getStatusColor = (status: Order["status"]) => {
        switch (status) {
            case "delivered":
                return "#4CAF50";
            case "shipped":
                return "#2196F3";
            case "processing":
                return "#FF9800";
            case "cancelled":
                return "#F44336";
            default:
                return "#999";
        }
    };

    const getStatusIcon = (status: Order["status"]) => {
        switch (status) {
            case "delivered":
                return "checkmark-circle";
            case "shipped":
                return "car";
            case "processing":
                return "time";
            case "cancelled":
                return "close-circle";
            default:
                return "help-circle";
        }
    };

    const filteredOrders = orders.filter((order) => {
        if (activeTab === "all") return true;
        if (activeTab === "delivered") return order.status === "delivered";
        if (activeTab === "processing")
            return order.status === "processing" || order.status === "shipped";
        return true;
    });

    const OrderCard = ({ order }: { order: Order }) => (
        <View style={styles.orderCard}>
            <BlurView intensity={20} style={styles.orderBlur}>
                <View style={styles.orderHeader}>
                    <View>
                        <Text style={styles.orderId}>Order #{order.id}</Text>
                        <Text style={styles.orderDate}>{order.orderDate}</Text>
                    </View>
                    <View style={styles.statusContainer}>
                        <Ionicons
                            name={getStatusIcon(order.status) as any}
                            size={16}
                            color={getStatusColor(order.status)}
                        />
                        <Text
                            style={[
                                styles.statusText,
                                { color: getStatusColor(order.status) },
                            ]}
                        >
                            {order.status.charAt(0).toUpperCase() +
                                order.status.slice(1)}
                        </Text>
                    </View>
                </View>

                <View style={styles.itemsContainer}>
                    {order.items.map((item, index) => (
                        <View key={index} style={styles.orderItem}>
                            <Image
                                source={{ uri: item.image }}
                                style={styles.itemImage}
                            />
                            <View style={styles.itemInfo}>
                                <Text style={styles.itemName}>{item.name}</Text>
                                <Text style={styles.itemDetails}>
                                    Qty: {item.quantity} • ₹{item.price}
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>

                <View style={styles.orderFooter}>
                    <Text style={styles.totalAmount}>
                        Total: ₹{order.totalAmount}
                    </Text>
                    <View style={styles.orderActions}>
                        {order.status === "delivered" && (
                            <TouchableOpacity style={styles.actionButton}>
                                <Text style={styles.actionText}>Reorder</Text>
                            </TouchableOpacity>
                        )}
                        {(order.status === "shipped" ||
                            order.status === "processing") && (
                            <TouchableOpacity style={styles.trackButton}>
                                <Text style={styles.trackText}>Track</Text>
                            </TouchableOpacity>
                        )}
                    </View>
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
                    <Text style={styles.headerTitle}>My Orders</Text>
                    <Text style={styles.headerSubtitle}>
                        Track your purchases
                    </Text>
                </View>
            </LinearGradient>

            <View style={styles.tabsContainer}>
                <BlurView intensity={80} style={styles.tabsBlur}>
                    {[
                        { key: "all", label: "All Orders" },
                        { key: "processing", label: "Active" },
                        { key: "delivered", label: "Delivered" },
                    ].map((tab) => (
                        <TouchableOpacity
                            key={tab.key}
                            style={[
                                styles.tab,
                                activeTab === tab.key && styles.activeTab,
                            ]}
                            onPress={() => setActiveTab(tab.key as any)}
                        >
                            <Text
                                style={[
                                    styles.tabText,
                                    activeTab === tab.key &&
                                        styles.activeTabText,
                                ]}
                            >
                                {tab.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </BlurView>
            </View>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                        <OrderCard key={order.id} order={order} />
                    ))
                ) : (
                    <View style={styles.emptyState}>
                        <Ionicons name="bag-outline" size={60} color="#ccc" />
                        <Text style={styles.emptyTitle}>No orders found</Text>
                        <Text style={styles.emptySubtitle}>
                            {activeTab === "all"
                                ? "You haven't placed any orders yet"
                                : `No ${activeTab} orders found`}
                        </Text>
                    </View>
                )}

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
        paddingBottom: 30,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
    },
    headerContent: {
        paddingHorizontal: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "white",
    },
    headerSubtitle: {
        fontSize: 14,
        color: "rgba(255,255,255,0.8)",
        marginTop: 5,
    },
    tabsContainer: {
        marginTop: -15,
        marginHorizontal: 20,
        borderRadius: 25,
        overflow: "hidden",
    },
    tabsBlur: {
        flexDirection: "row",
        backgroundColor: "rgba(255,255,255,0.9)",
    },
    tab: {
        flex: 1,
        paddingVertical: 15,
        alignItems: "center",
    },
    activeTab: {
        backgroundColor: "#FF6B6B",
    },
    tabText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#666",
    },
    activeTabText: {
        color: "white",
    },
    content: {
        flex: 1,
        paddingTop: 20,
    },
    orderCard: {
        marginHorizontal: 20,
        marginBottom: 15,
        borderRadius: 15,
        overflow: "hidden",
    },
    orderBlur: {
        backgroundColor: "rgba(255,255,255,0.9)",
        padding: 15,
    },
    orderHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15,
    },
    orderId: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    orderDate: {
        fontSize: 12,
        color: "#666",
        marginTop: 2,
    },
    statusContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.8)",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
    },
    statusText: {
        fontSize: 12,
        fontWeight: "600",
        marginLeft: 5,
    },
    itemsContainer: {
        marginBottom: 15,
    },
    orderItem: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    itemImage: {
        width: 50,
        height: 50,
        borderRadius: 8,
        marginRight: 12,
    },
    itemInfo: {
        flex: 1,
    },
    itemName: {
        fontSize: 14,
        fontWeight: "600",
        color: "#333",
    },
    itemDetails: {
        fontSize: 12,
        color: "#666",
        marginTop: 2,
    },
    orderFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: "#eee",
    },
    totalAmount: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    orderActions: {
        flexDirection: "row",
    },
    actionButton: {
        backgroundColor: "rgba(255,255,255,0.8)",
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: "#ddd",
        marginLeft: 10,
    },
    actionText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#333",
    },
    trackButton: {
        backgroundColor: "#FF6B6B",
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 15,
        marginLeft: 10,
    },
    trackText: {
        fontSize: 12,
        fontWeight: "600",
        color: "white",
    },
    emptyState: {
        alignItems: "center",
        paddingVertical: 80,
        paddingHorizontal: 40,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#999",
        marginTop: 20,
    },
    emptySubtitle: {
        fontSize: 14,
        color: "#ccc",
        textAlign: "center",
        marginTop: 10,
        lineHeight: 20,
    },
});
