// app/(tabs)/cart.tsx
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
    Alert,
    FlatList,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface CartItem {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    quantity: number;
    size?: string;
    color?: string;
    category: string;
}

interface AutoCartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    nextDelivery: string;
    image: string;
}

export default function CartScreen() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [autoCartItems, setAutoCartItems] = useState<AutoCartItem[]>([]);
    const [showAutoCart, setShowAutoCart] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCartData();
    }, []);

    const loadCartData = async () => {
        try {
            // Load regular cart items
            const cart = await AsyncStorage.getItem("cart");
            if (cart) {
                setCartItems(JSON.parse(cart));
            }

            // Load auto-cart items
            const autoCart = await AsyncStorage.getItem("autoCartItems");
            if (autoCart) {
                setAutoCartItems(JSON.parse(autoCart));
            } else {
                // Mock auto-cart items if none exist
                const mockAutoCart: AutoCartItem[] = [
                    {
                        id: "ac1",
                        name: "Basmati Rice 5kg",
                        price: 450,
                        quantity: 1,
                        nextDelivery: "2024-10-15",
                        image: "https://dummyimage.com/100x100/FF6B6B/FFFFFF?text=Rice",
                    },
                    {
                        id: "ac2",
                        name: "Cooking Oil 1L",
                        price: 150,
                        quantity: 2,
                        nextDelivery: "2024-10-15",
                        image: "https://dummyimage.com/100x100/4ECDC4/FFFFFF?text=Oil",
                    },
                    {
                        id: "ac3",
                        name: "Detergent Powder 1kg",
                        price: 180,
                        quantity: 1,
                        nextDelivery: "2024-10-15",
                        image: "https://dummyimage.com/100x100/45B7D1/FFFFFF?text=Detergent",
                    },
                ];
                setAutoCartItems(mockAutoCart);
                await AsyncStorage.setItem(
                    "autoCartItems",
                    JSON.stringify(mockAutoCart)
                );
            }

            setLoading(false);
        } catch (error) {
            console.error("Error loading cart data:", error);
            setLoading(false);
        }
    };

    const updateQuantity = async (itemId: string, newQuantity: number) => {
        if (newQuantity === 0) {
            removeFromCart(itemId);
            return;
        }

        const updatedCart = cartItems.map((item) =>
            item.id === itemId ? { ...item, quantity: newQuantity } : item
        );
        setCartItems(updatedCart);
        await AsyncStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    const removeFromCart = async (itemId: string) => {
        const updatedCart = cartItems.filter((item) => item.id !== itemId);
        setCartItems(updatedCart);
        await AsyncStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    const clearCart = async () => {
        Alert.alert(
            "Clear Cart",
            "Are you sure you want to remove all items from your cart?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Clear",
                    style: "destructive",
                    onPress: async () => {
                        setCartItems([]);
                        await AsyncStorage.removeItem("cart");
                    },
                },
            ]
        );
    };

    const calculateTotal = () => {
        return cartItems.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        );
    };

    const calculateSavings = () => {
        return cartItems.reduce((savings, item) => {
            if (item.originalPrice) {
                return (
                    savings + (item.originalPrice - item.price) * item.quantity
                );
            }
            return savings;
        }, 0);
    };

    const placeOrder = async () => {
        if (cartItems.length === 0) {
            Alert.alert(
                "Cart Empty",
                "Please add itms to your cart before placing an order."
            );
            return;
        }

        t.alert(
            "Place Order",
            `Total: ₹${calculateTotal()}\n\nProceed to checkout?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Place Order",
                    onPress: async () => {
                        // Clear cart after successful order
                        await AsyncStorage.removeItem("cart");
                        setCartItems([]);

                        Alert.alert(
                            "Order Placed!",
                            "Your order has been placed successfully. You can track it in the Orders section.",
                            [
                                {
                                    text: "View Orders",
                                    onPress: () =>
                                        router.push("/(tabs)/orders"),
                                },
                                { text: "Continue Shopping", style: "cancel" },
                            ]
                        );
                    },
                },
            ]
        );
    };

    const addAutoCartToRegularCart = async () => {
        const newCartItems: CartItem[] = autoCartItems.map((item) => ({
            id: `reg_${item.id}`,
            name: item.name,
            price: item.price,
            image: item.image,
            quantity: item.quantity,
            category: "Groceries",
        }));

        const updatedCart = [...cartItems, ...newCartItems];
        setCartItems(updatedCart);
        await AsyncStorage.setItem("cart", JSON.stringify(updatedCart));

        Alert.alert("Success", "Auto-cart items added to your regular cart!");
    };

    const CartItemComponent = ({ item }: { item: CartItem }) => (
        <View style={styles.cartItem}>
            <BlurView intensity={20} style={styles.cartItemBlur}>
                <Image source={{ uri: item.image }} style={styles.itemImage} />
                <View style={styles.itemDetails}>
                    <Text style={styles.itemName} numberOfLines={2}>
                        {item.name}
                    </Text>
                    <View style={styles.itemSpecs}>
                        {item.size && (
                            <Text style={styles.specText}>
                                Size: {item.size}
                            </Text>
                        )}
                        {item.color && (
                            <Text style={styles.specText}>
                                Color: {item.color}
                            </Text>
                        )}
                    </View>
                    <View style={styles.priceContainer}>
                        <Text style={styles.itemPrice}>₹{item.price}</Text>
                        {item.originalPrice && (
                            <Text style={styles.originalPrice}>
                                ₹{item.originalPrice}
                            </Text>
                        )}
                    </View>
                </View>
                <View style={styles.quantityContainer}>
                    <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() =>
                            updateQuantity(item.id, item.quantity - 1)
                        }
                    >
                        <Ionicons name="remove" size={16} color="#666" />
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{item.quantity}</Text>
                    <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() =>
                            updateQuantity(item.id, item.quantity + 1)
                        }
                    >
                        <Ionicons name="add" size={16} color="#666" />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeFromCart(item.id)}
                >
                    <Ionicons name="trash-outline" size={18} color="#FF6B6B" />
                </TouchableOpacity>
            </BlurView>
        </View>
    );

    const AutoCartItemComponent = ({ item }: { item: AutoCartItem }) => (
        <View style={styles.autoCartItem}>
            <Image source={{ uri: item.image }} style={styles.autoItemImage} />
            <View style={styles.autoItemDetails}>
                <Text style={styles.autoItemName}>{item.name}</Text>
                <Text style={styles.autoItemPrice}>
                    ₹{item.price} × {item.quantity}
                </Text>
                <Text style={styles.nextDelivery}>
                    Next: {item.nextDelivery}
                </Text>
            </View>
        </View>
    );

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <Text>Loading cart...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={["#FF6B6B", "#4ECDC4"]}
                style={styles.header}
            >
                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>Shopping Cart</Text>
                    <Text style={styles.headerSubtitle}>
                        {cartItems.length} item
                        {cartItems.length !== 1 ? "s" : ""}
                    </Text>
                    {cartItems.length > 0 && (
                        <TouchableOpacity
                            style={styles.clearButton}
                            onPress={clearCart}
                        >
                            <Ionicons
                                name="trash-outline"
                                size={20}
                                color="white"
                            />
                        </TouchableOpacity>
                    )}
                </View>
            </LinearGradient>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* Auto-Cart Section */}
                {autoCartItems.length > 0 && (
                    <View style={styles.autoCartSection}>
                        <BlurView
                            intensity={20}
                            style={styles.autoCartContainer}
                        >
                            <View style={styles.autoCartHeader}>
                                <TouchableOpacity
                                    style={styles.autoCartToggle}
                                    onPress={() =>
                                        setShowAutoCart(!showAutoCart)
                                    }
                                >
                                    <Ionicons
                                        name="sync-outline"
                                        size={20}
                                        color="#4ECDC4"
                                    />
                                    <Text style={styles.autoCartTitle}>
                                        Auto-Cart ({autoCartItems.length})
                                    </Text>
                                    <Ionicons
                                        name={
                                            showAutoCart
                                                ? "chevron-up"
                                                : "chevron-down"
                                        }
                                        size={20}
                                        color="#666"
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.addAutoCartButton}
                                    onPress={addAutoCartToRegularCart}
                                >
                                    <Ionicons
                                        name="add-circle-outline"
                                        size={16}
                                        color="#FF6B6B"
                                    />
                                    <Text style={styles.addAutoCartText}>
                                        Add All
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {showAutoCart && (
                                <View style={styles.autoCartItems}>
                                    {autoCartItems.map((item) => (
                                        <AutoCartItemComponent
                                            key={item.id}
                                            item={item}
                                        />
                                    ))}
                                </View>
                            )}
                        </BlurView>
                    </View>
                )}

                {/* Regular Cart Items */}
                {cartItems.length > 0 ? (
                    <View style={styles.cartItemsSection}>
                        <FlatList
                            data={cartItems}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <CartItemComponent item={item} />
                            )}
                            scrollEnabled={false}
                        />
                    </View>
                ) : (
                    <View style={styles.emptyCart}>
                        <Ionicons name="bag-outline" size={80} color="#ccc" />
                        <Text style={styles.emptyTitle}>
                            Your cart is empty
                        </Text>
                        <Text style={styles.emptySubtitle}>
                            Add some products to get started
                        </Text>
                        <TouchableOpacity
                            style={styles.shopNowButton}
                            onPress={() => router.push("/(tabs)/index")}
                        >
                            <LinearGradient
                                colors={["#FF6B6B", "#4ECDC4"]}
                                style={styles.shopNowGradient}
                            >
                                <Text style={styles.shopNowText}>Shop Now</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Quick Links */}
                <View style={styles.quickLinksSection}>
                    <Text style={styles.quickLinksTitle}>Quick Links</Text>
                    <TouchableOpacity
                        style={styles.quickLinkItem}
                        onPress={() => router.push("/(tabs)/orders")}
                    >
                        <BlurView intensity={20} style={styles.quickLinkBlur}>
                            <Ionicons
                                name="bag-check-outline"
                                size={24}
                                color="#4ECDC4"
                            />
                            <Text style={styles.quickLinkText}>
                                Your Orders
                            </Text>
                            <Ionicons
                                name="chevron-forward"
                                size={20}
                                color="#666"
                            />
                        </BlurView>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.quickLinkItem}
                        onPress={() => router.push("/(tabs)/social")}
                    >
                        <BlurView intensity={20} style={styles.quickLinkBlur}>
                            <Ionicons
                                name="people-outline"
                                size={24}
                                color="#FF6B6B"
                            />
                            <Text style={styles.quickLinkText}>
                                Social Shopping
                            </Text>
                            <Ionicons
                                name="chevron-forward"
                                size={20}
                                color="#666"
                            />
                        </BlurView>
                    </TouchableOpacity>
                </View>

                <View style={{ height: cartItems.length > 0 ? 150 : 50 }} />
            </ScrollView>

            {/* Bottom Summary - Only show when cart has items */}
            {cartItems.length > 0 && (
                <BlurView intensity={80} style={styles.bottomSummary}>
                    <View style={styles.summaryContent}>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>
                                Total ({cartItems.length} items)
                            </Text>
                            <Text style={styles.summaryValue}>
                                ₹{calculateTotal()}
                            </Text>
                        </View>
                        {calculateSavings() > 0 && (
                            <View style={styles.summaryRow}>
                                <Text style={styles.savingsLabel}>
                                    You save
                                </Text>
                                <Text style={styles.savingsValue}>
                                    ₹{calculateSavings()}
                                </Text>
                            </View>
                        )}
                        <TouchableOpacity
                            style={styles.checkoutButton}
                            onPress={placeOrder}
                        >
                            <LinearGradient
                                colors={["#FF6B6B", "#4ECDC4"]}
                                style={styles.checkoutGradient}
                            >
                                <Ionicons
                                    name="card-outline"
                                    size={20}
                                    color="white"
                                />
                                <Text style={styles.checkoutText}>
                                    Place Order
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </BlurView>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f9fa",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    header: {
        paddingTop: 20,
        paddingBottom: 25,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
    },
    headerContent: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
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
        flex: 1,
    },
    clearButton: {
        padding: 8,
    },
    content: {
        flex: 1,
        marginTop: -15,
    },
    autoCartSection: {
        paddingHorizontal: 20,
        paddingTop: 20,
        marginBottom: 10,
    },
    autoCartContainer: {
        backgroundColor: "rgba(255,255,255,0.9)",
        borderRadius: 15,
        padding: 15,
    },
    autoCartHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    autoCartToggle: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    autoCartTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
        marginLeft: 8,
        marginRight: 8,
    },
    addAutoCartButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFF5F5",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
    },
    addAutoCartText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#FF6B6B",
        marginLeft: 4,
    },
    autoCartItems: {
        marginTop: 15,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: "#eee",
    },
    autoCartItem: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    autoItemImage: {
        width: 40,
        height: 40,
        borderRadius: 8,
        marginRight: 12,
    },
    autoItemDetails: {
        flex: 1,
    },
    autoItemName: {
        fontSize: 14,
        fontWeight: "600",
        color: "#333",
    },
    autoItemPrice: {
        fontSize: 12,
        color: "#666",
        marginTop: 2,
    },
    nextDelivery: {
        fontSize: 11,
        color: "#4ECDC4",
        marginTop: 2,
    },
    cartItemsSection: {
        paddingHorizontal: 20,
    },
    cartItem: {
        marginBottom: 15,
        borderRadius: 15,
        overflow: "hidden",
    },
    cartItemBlur: {
        flexDirection: "row",
        padding: 15,
        backgroundColor: "rgba(255,255,255,0.9)",
    },
    itemImage: {
        width: 80,
        height: 80,
        borderRadius: 10,
        marginRight: 15,
    },
    itemDetails: {
        flex: 1,
    },
    itemName: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
        marginBottom: 5,
    },
    itemSpecs: {
        flexDirection: "row",
        marginBottom: 8,
    },
    specText: {
        fontSize: 12,
        color: "#666",
        marginRight: 15,
    },
    priceContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    itemPrice: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#FF6B6B",
    },
    originalPrice: {
        fontSize: 14,
        color: "#999",
        textDecorationLine: "line-through",
        marginLeft: 8,
    },
    quantityContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: 15,
    },
    quantityButton: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: "#f5f5f5",
        justifyContent: "center",
        alignItems: "center",
    },
    quantityText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
        marginHorizontal: 15,
        minWidth: 20,
        textAlign: "center",
    },
    removeButton: {
        padding: 5,
    },
    emptyCart: {
        alignItems: "center",
        paddingVertical: 80,
        paddingHorizontal: 40,
    },
    emptyTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#999",
        marginTop: 20,
    },
    emptySubtitle: {
        fontSize: 16,
        color: "#ccc",
        textAlign: "center",
        marginTop: 10,
        lineHeight: 24,
    },
    shopNowButton: {
        marginTop: 30,
        borderRadius: 25,
        overflow: "hidden",
    },
    shopNowGradient: {
        paddingHorizontal: 30,
        paddingVertical: 15,
    },
    shopNowText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "white",
    },
    quickLinksSection: {
        paddingHorizontal: 20,
        marginTop: 20,
    },
    quickLinksTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 15,
    },
    quickLinkItem: {
        marginBottom: 10,
        borderRadius: 15,
        overflow: "hidden",
    },
    quickLinkBlur: {
        flexDirection: "row",
        alignItems: "center",
        padding: 15,
        backgroundColor: "rgba(255,255,255,0.9)",
    },
    quickLinkText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
        marginLeft: 15,
        flex: 1,
    },
    bottomSummary: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "rgba(255,255,255,0.95)",
        paddingBottom: 40,
    },
    summaryContent: {
        padding: 20,
    },
    summaryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    summaryLabel: {
        fontSize: 16,
        color: "#666",
    },
    summaryValue: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
    },
    savingsLabel: {
        fontSize: 14,
        color: "#4ECDC4",
    },
    savingsValue: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#4ECDC4",
    },
    checkoutButton: {
        marginTop: 15,
        borderRadius: 25,
        overflow: "hidden",
    },
    checkoutGradient: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 15,
    },
    checkoutText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "white",
        marginLeft: 8,
    },
});
