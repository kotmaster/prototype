import { addItemToCart } from "@/util/cart";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
    Alert,
    Animated,
    Dimensions,
    Image,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const { width } = Dimensions.get("window");

interface Product {
    id: string;
    name: string;
    price: number;
    originalPrice: number;
    discount: number;
    image: string;
    rating: number;
    category: string;
}

interface AutoCartItem {
    id: string;
    name: string;
    quantity: number;
    lastPurchased: string;
}

export default function HomeScreen() {
    const [searchText, setSearchText] = useState("");
    const [products, setProducts] = useState<Product[]>([]);
    const [autoCartItems, setAutoCartItems] = useState<AutoCartItem[]>([]);
    const [showAutoCartSuggestion, setShowAutoCartSuggestion] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(-50)).current;

    useEffect(() => {
        initializeData();
        startAnimations();
        checkAutoCartSuggestions();
    }, []);

    const initializeData = () => {
        const mockProducts: Product[] = [
            {
                id: "1",
                name: "Stylish Cotton Kurta",
                price: 599,
                originalPrice: 1299,
                discount: 54,
                image: "https://dummyimage.com/200x250/FF6B6B/FFFFFF?text=Kurta",
                rating: 4.2,
                category: "Fashion",
            },
            {
                id: "2",
                name: "Wireless Bluetooth Earphones",
                price: 899,
                originalPrice: 2999,
                discount: 70,
                image: "https://dummyimage.com/200x250/4ECDC4/FFFFFF?text=Earphones",
                rating: 4.0,
                category: "Electronics",
            },
            {
                id: "3",
                name: "Designer Handbag",
                price: 799,
                originalPrice: 1999,
                discount: 60,
                image: "https://dummyimage.com/200x250/45B7D1/FFFFFF?text=Handbag",
                rating: 4.5,
                category: "Accessories",
            },
            {
                id: "4",
                name: "Premium Face Cream",
                price: 299,
                originalPrice: 699,
                discount: 57,
                image: "https://dummyimage.com/200x250/96CEB4/FFFFFF?text=Cream",
                rating: 4.1,
                category: "Beauty",
            },
        ];
        setProducts(mockProducts);

        // Mock auto-cart items
        const mockAutoCart: AutoCartItem[] = [
            {
                id: "1",
                name: "Basmati Rice 5kg",
                quantity: 1,
                lastPurchased: "2024-08-15",
            },
            {
                id: "2",
                name: "Milk 1L",
                quantity: 2,
                lastPurchased: "2024-09-01",
            },
            {
                id: "3",
                name: "Detergent Powder",
                quantity: 1,
                lastPurchased: "2024-08-20",
            },
        ];
        setAutoCartItems(mockAutoCart);
    };

    const startAnimations = () => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const checkAutoCartSuggestions = () => {
        // Check if it's time for auto-cart refill (mock logic)
        const lastCheck = new Date().getDate();
        if (lastCheck > 15) {
            // Mid-month suggestion
            setShowAutoCartSuggestion(true);
        }
    };

    const handleAutoCartAccept = async () => {
        try {
            for (const item of autoCartItems) {
                await addItemToCart(item);
            }

            Alert.alert(
                "Auto-Cart Updated",
                "Your essentials were added to the cart!",
                [
                    { text: "OK", style: "default" },
                    {
                        text: "Go to Cart",
                        onPress: () => router.push("/(tabs)/cart"),
                    },
                ]
            );

            setShowAutoCartSuggestion(false);
        } catch (err) {
            Alert.alert("Error", "Something went wrong while adding items.");
        }
        // Add auto-cart items to cart
        // await AsyncStorage.setItem(
        //     "autoCartItems",
        //     JSON.stringify(autoCartItems)
        // );
        // setShowAutoCartSuggestion(false);
        // Navigate to cart or show success message
    };

    const onRefresh = () => {
        setRefreshing(true);
        // Simulate API call
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    };

    const ProductCard = ({ product }: { product: Product }) => (
        <TouchableOpacity
            style={styles.productCard}
            onPress={() => router.push(`/product/${product.id}`)}
            activeOpacity={0.9}
        >
            <BlurView intensity={20} style={styles.cardBlur}>
                <Image
                    source={{ uri: product.image }}
                    style={styles.productImage}
                />
                <View style={styles.productInfo}>
                    <Text style={styles.productName} numberOfLines={2}>
                        {product.name}
                    </Text>
                    <View style={styles.priceContainer}>
                        <Text style={styles.price}>₹{product.price}</Text>
                        <Text style={styles.originalPrice}>
                            ₹{product.originalPrice}
                        </Text>
                        <View style={styles.discountBadge}>
                            <Text style={styles.discountText}>
                                {product.discount}% OFF
                            </Text>
                        </View>
                    </View>
                    <View style={styles.ratingContainer}>
                        <Ionicons name="star" size={14} color="#FFD700" />
                        <Text style={styles.rating}>{product.rating}</Text>
                    </View>
                </View>
            </BlurView>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={["#FF6B6B", "#4ECDC4"]}
                style={styles.header}
            >
                <Animated.View
                    style={[
                        styles.headerContent,
                        { transform: [{ translateY: slideAnim }] },
                    ]}
                >
                    <View style={styles.headerTop}>
                        <View>
                            <Text style={styles.greeting}>Hello! 👋</Text>
                            <Text style={styles.location}>Let's shop</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.chatButton}
                            onPress={() => router.push("/chat")}
                        >
                            <Ionicons
                                name="chatbubble-outline"
                                size={24}
                                color="white"
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.searchContainer}>
                        <BlurView intensity={20} style={styles.searchBlur}>
                            <Ionicons
                                name="search-outline"
                                size={20}
                                color="#666"
                            />
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Search products..."
                                value={searchText}
                                onChangeText={setSearchText}
                                placeholderTextColor="#999"
                            />
                            <TouchableOpacity
                                onPress={() => router.push("/outfit-generator")}
                            >
                                <Ionicons
                                    name="color-wand-outline"
                                    size={20}
                                    color="#FF6B6B"
                                />
                            </TouchableOpacity>
                        </BlurView>
                    </View>
                </Animated.View>
            </LinearGradient>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                {/* Auto Cart Suggestion */}
                {showAutoCartSuggestion && (
                    <Animated.View
                        style={[
                            styles.autoCartSuggestion,
                            { opacity: fadeAnim },
                        ]}
                    >
                        <BlurView intensity={80} style={styles.suggestionBlur}>
                            <View style={styles.suggestionHeader}>
                                <Ionicons
                                    name="cart-outline"
                                    size={24}
                                    color="#FF6B6B"
                                />
                                <Text style={styles.suggestionTitle}>
                                    Auto-Cart Refill Ready!
                                </Text>
                                <TouchableOpacity
                                    onPress={() =>
                                        setShowAutoCartSuggestion(false)
                                    }
                                >
                                    <Ionicons
                                        name="close"
                                        size={20}
                                        color="#666"
                                    />
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.suggestionText}>
                                Your monthly essentials are ready to be added to
                                cart
                            </Text>
                            <View style={styles.suggestionItems}>
                                {autoCartItems.slice(0, 3).map((item) => (
                                    <Text
                                        key={item.id}
                                        style={styles.suggestionItem}
                                    >
                                        • {item.name} (Qty: {item.quantity})
                                    </Text>
                                ))}
                            </View>
                            <View style={styles.suggestionButtons}>
                                <TouchableOpacity style={styles.skipButton}>
                                    <Text style={styles.skipText}>Skip</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.acceptButton}
                                    onPress={handleAutoCartAccept}
                                >
                                    <Text style={styles.acceptText}>
                                        Add to Cart
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </BlurView>
                    </Animated.View>
                )}

                {/* Banner Ads */}
                <View style={styles.bannerContainer}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                    >
                        {[1, 2, 3].map((banner) => (
                            <View key={banner} style={styles.bannerCard}>
                                <LinearGradient
                                    colors={["#667eea", "#764ba2"]}
                                    style={styles.bannerGradient}
                                >
                                    <Text style={styles.bannerText}>
                                        Special Offer {banner}
                                    </Text>
                                    <Text style={styles.bannerSubtext}>
                                        Up to 70% OFF
                                    </Text>
                                </LinearGradient>
                            </View>
                        ))}
                    </ScrollView>
                </View>

                {/* Categories */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Shop by Category</Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                    >
                        {[
                            "Fashion",
                            "Electronics",
                            "Beauty",
                            "Home",
                            "Sports",
                        ].map((category) => (
                            <TouchableOpacity
                                key={category}
                                style={styles.categoryCard}
                            >
                                <BlurView
                                    intensity={20}
                                    style={styles.categoryBlur}
                                >
                                    <Ionicons
                                        name="shirt-outline"
                                        size={30}
                                        color="#FF6B6B"
                                        style={styles.categoryIcon}
                                    />
                                    <Text style={styles.categoryText}>
                                        {category}
                                    </Text>
                                </BlurView>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Featured Products */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Trending Now</Text>
                        <TouchableOpacity>
                            <Text style={styles.seeAll}>See All</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.productsGrid}>
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </View>
                </View>

                {/* Ad Space */}
                <View style={styles.adContainer}>
                    <LinearGradient
                        colors={["#ff9a9e", "#fecfef"]}
                        style={styles.adGradient}
                    >
                        <Text style={styles.adTitle}>Download our App!</Text>
                        <Text style={styles.adText}>
                            Get exclusive deals and offers
                        </Text>
                    </LinearGradient>
                </View>

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
        paddingBottom: 20,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
    },
    headerContent: {
        paddingHorizontal: 20,
    },
    headerTop: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    greeting: {
        fontSize: 24,
        fontWeight: "bold",
        color: "white",
    },
    location: {
        fontSize: 14,
        color: "rgba(255,255,255,0.8)",
        marginTop: 2,
    },
    chatButton: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        backgroundColor: "rgba(255,255,255,0.2)",
        justifyContent: "center",
        alignItems: "center",
    },
    searchContainer: {
        marginBottom: 10,
    },
    searchBlur: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderRadius: 25,
        backgroundColor: "rgba(255,255,255,0.9)",
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
        color: "#333",
    },
    content: {
        flex: 1,
        marginTop: -15,
    },
    autoCartSuggestion: {
        margin: 20,
        borderRadius: 20,
        overflow: "hidden",
    },
    suggestionBlur: {
        padding: 20,
    },
    suggestionHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    suggestionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        flex: 1,
        marginLeft: 10,
    },
    suggestionText: {
        fontSize: 14,
        color: "#666",
        marginBottom: 15,
    },
    suggestionItems: {
        marginBottom: 15,
    },
    suggestionItem: {
        fontSize: 12,
        color: "#555",
        marginBottom: 3,
    },
    suggestionButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    skipButton: {
        flex: 0.4,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#ddd",
        alignItems: "center",
    },
    skipText: {
        color: "#666",
        fontWeight: "600",
    },
    acceptButton: {
        flex: 0.55,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: "#FF6B6B",
        alignItems: "center",
    },
    acceptText: {
        color: "white",
        fontWeight: "600",
    },
    bannerContainer: {
        marginVertical: 20,
    },
    bannerCard: {
        width: width * 0.8,
        height: 120,
        marginHorizontal: 10,
        borderRadius: 15,
        overflow: "hidden",
    },
    bannerGradient: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    bannerText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "white",
    },
    bannerSubtext: {
        fontSize: 14,
        color: "rgba(255,255,255,0.8)",
        marginTop: 5,
    },
    section: {
        paddingHorizontal: 20,
        marginBottom: 25,
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
    },
    seeAll: {
        fontSize: 14,
        color: "#FF6B6B",
        fontWeight: "600",
    },
    categoryCard: {
        width: 80,
        height: 80,
        marginRight: 15,
        borderRadius: 20,
        overflow: "hidden",
    },
    categoryBlur: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.8)",
    },
    categoryIcon: {
        marginBottom: 5,
    },
    categoryText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#333",
    },
    productsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    productCard: {
        width: "48%",
        marginBottom: 15,
        borderRadius: 15,
        overflow: "hidden",
    },
    cardBlur: {
        backgroundColor: "rgba(255,255,255,0.9)",
        padding: 10,
    },
    productImage: {
        width: "100%",
        height: 150,
        borderRadius: 10,
        marginBottom: 10,
    },
    productInfo: {
        paddingHorizontal: 5,
    },
    productName: {
        fontSize: 14,
        fontWeight: "600",
        color: "#333",
        marginBottom: 5,
    },
    priceContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 5,
    },
    price: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#FF6B6B",
    },
    originalPrice: {
        fontSize: 12,
        color: "#999",
        textDecorationLine: "line-through",
        marginLeft: 5,
    },
    discountBadge: {
        backgroundColor: "#4ECDC4",
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
        marginLeft: 5,
    },
    discountText: {
        fontSize: 10,
        color: "white",
        fontWeight: "bold",
    },
    ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    rating: {
        fontSize: 12,
        color: "#333",
        marginLeft: 3,
    },
    adContainer: {
        marginHorizontal: 20,
        marginBottom: 20,
        borderRadius: 15,
        overflow: "hidden",
    },
    adGradient: {
        padding: 20,
        alignItems: "center",
    },
    adTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "white",
    },
    adText: {
        fontSize: 14,
        color: "rgba(255,255,255,0.8)",
        marginTop: 5,
    },
});
