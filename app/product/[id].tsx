import { useEffect, useState } from "react";

import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BlurView } from "expo-blur";
import { router, useLocalSearchParams } from "expo-router";
import {
    Alert,
    Dimensions,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { addItemToCart } from "../../util/cart";

const { width } = Dimensions.get("window");

interface ProductDetail {
    id: string;
    name: string;
    price: number;
    originalPrice: number;
    discount: number;
    images: string[];
    rating: number;
    reviews: number;
    description: string;
    features: string[];
    sizes: string[];
    colors: string[];
    category: string;
    seller: string;
    inStock: boolean;
}

export default function ProductScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [product, setProduct] = useState<ProductDetail | null>(null);
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false);

    useEffect(() => {
        loadProductDetails();
        checkWishlistStatus();
    }, [id]);

    const loadProductDetails = () => {
        // Mock product data - In real app, fetch from API
        const mockProduct: ProductDetail = {
            id: id || "1",
            name: "Stylish Cotton Kurta Set",
            price: 599,
            originalPrice: 1299,
            discount: 54,
            images: [
                "https://dummyimage.com/400x500/FF6B6B/FFFFFF?text=Kurta+Front",
                "https://dummyimage.com/400x500/4ECDC4/FFFFFF?text=Kurta+Back",
                "https://dummyimage.com/400x500/45B7D1/FFFFFF?text=Kurta+Side",
            ],
            rating: 4.2,
            reviews: 156,
            description:
                "Beautiful hand-block printed cotton kurta set perfect for casual and semi-formal occasions. Made with premium quality cotton fabric that ensures comfort throughout the day.",
            features: [
                "Hand-block printed design",
                "100% Pure Cotton",
                "Machine washable",
                "Comfortable fit",
                "Breathable fabric",
            ],
            sizes: ["S", "M", "L", "XL", "XXL"],
            colors: ["Blue", "Red", "Green", "Yellow"],
            category: "Ethnic Wear",
            seller: "Fashion Hub",
            inStock: true,
        };
        setProduct(mockProduct);
        setSelectedSize(mockProduct.sizes[0]);
        setSelectedColor(mockProduct.colors[0]);
    };

    const checkWishlistStatus = async () => {
        try {
            const wishlist = await AsyncStorage.getItem("wishlist");
            if (wishlist) {
                const wishlistItems = JSON.parse(wishlist);
                setIsWishlisted(wishlistItems.includes(id));
            }
        } catch (error) {
            console.error("Error checking wishlist:", error);
        }
    };

    const toggleWishlist = async () => {
        try {
            const wishlist = await AsyncStorage.getItem("wishlist");
            let wishlistItems = wishlist ? JSON.parse(wishlist) : [];

            if (isWishlisted) {
                wishlistItems = wishlistItems.filter(
                    (item: string) => item !== id
                );
                setIsWishlisted(false);
            } else {
                wishlistItems.push(id);
                setIsWishlisted(true);
            }

            await AsyncStorage.setItem(
                "wishlist",
                JSON.stringify(wishlistItems)
            );
        } catch (error) {
            console.error("Error updating wishlist:", error);
        }
    };

    // const addToCart = async () => {
    //     if (!selectedSize || !selectedColor) {
    //         Alert.alert("Please select size and color");
    //         return;
    //     }

    //     try {
    //         const cartItem = {
    //             id: `${
    //                 product?.id
    //             }_${selectedSize}_${selectedColor}_${Date.now()}`, // Unique ID for each cart item
    //             name: product?.name,
    //             price: product?.price,
    //             originalPrice: product?.originalPrice,
    //             size: selectedSize,
    //             color: selectedColor,
    //             quantity,
    //             image: product?.images[0],
    //             category: product?.category,
    //         };

    //         const cart = await AsyncStorage.getItem("cart");
    //         const cartItems = cart ? JSON.parse(cart) : [];

    //         // Check if same item with same specs already exists
    //         const existingItemIndex = cartItems.findIndex(
    //             (item: any) =>
    //                 item.name === cartItem.name &&
    //                 item.size === cartItem.size &&
    //                 item.color === cartItem.color
    //         );

    //         if (existingItemIndex >= 0) {
    //             // Update quantity of existing item
    //             cartItems[existingItemIndex].quantity += quantity;
    //         } else {
    //             // Add new item
    //             cartItems.push(cartItem);
    //         }

    //         await AsyncStorage.setItem("cart", JSON.stringify(cartItems));

    //         Alert.alert(
    //             "Added to Cart!",
    //             `${product?.name} has been added to your cart.`,
    //             [
    //                 { text: "Continue Shopping", style: "cancel" },
    //                 {
    //                     text: "View Cart",
    //                     onPress: () => router.push("/(tabs)/cart"),
    //                 },
    //             ]
    //         );
    //     } catch (error) {
    //         console.error("Error adding to cart:", error);
    //         Alert.alert(
    //             "Error",
    //             "Failed to add item to cart. Please try again."
    //         );
    //     }
    // };

    const addToCart = async () => {
        if (!selectedSize || !selectedColor) {
            Alert.alert("Please select size and color");
            return;
        }

        const cartItem = {
            id: `${product?.id}_${selectedSize}_${selectedColor}_${Date.now()}`,
            name: product?.name,
            price: product?.price,
            originalPrice: product?.originalPrice,
            size: selectedSize,
            color: selectedColor,
            quantity,
            image: product?.images[0],
            category: product?.category,
        };

        const success = await addItemToCart(cartItem);

        if (success) {
            Alert.alert(
                "Added to Cart!",
                `${product?.name} has been added to your cart.`,
                [
                    { text: "Continue Shopping", style: "cancel" },
                    {
                        text: "View Cart",
                        onPress: () => router.push("/(tabs)/cart"),
                    },
                ]
            );
        } else {
            Alert.alert(
                "Error",
                "Failed to add item to cart. Please try again."
            );
        }
    };

    const buyNow = async () => {
        await addToCart();
        // Navigate to cart for checkout
        router.push("/(tabs)/cart");
    };

    if (!product) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <Text>Loading...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Product Details</Text>
                <TouchableOpacity
                    style={styles.wishlistButton}
                    onPress={toggleWishlist}
                >
                    <Ionicons
                        name={isWishlisted ? "heart" : "heart-outline"}
                        size={24}
                        color={isWishlisted ? "#FF6B6B" : "#333"}
                    />
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* Product Images */}
                <View style={styles.imageContainer}>
                    <ScrollView
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onMomentumScrollEnd={(event) => {
                            const index = Math.round(
                                event.nativeEvent.contentOffset.x / width
                            );
                            setSelectedImageIndex(index);
                        }}
                    >
                        {product.images.map((image, index) => (
                            <Image
                                key={index}
                                source={{ uri: image }}
                                style={styles.productImage}
                            />
                        ))}
                    </ScrollView>
                    <View style={styles.imageIndicator}>
                        {product.images.map((_, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.indicator,
                                    {
                                        opacity:
                                            index === selectedImageIndex
                                                ? 1
                                                : 0.3,
                                    },
                                ]}
                            />
                        ))}
                    </View>

                    {/* Discount Badge */}
                    <View style={styles.discountBadge}>
                        <Text style={styles.discountText}>
                            {product.discount}% OFF
                        </Text>
                    </View>
                </View>

                {/* Product Info */}
                <View style={styles.productInfo}>
                    <Text style={styles.productName}>{product.name}</Text>
                    <Text style={styles.category}>{product.category}</Text>

                    <View style={styles.ratingContainer}>
                        <View style={styles.rating}>
                            <Ionicons name="star" size={16} color="#FFD700" />
                            <Text style={styles.ratingText}>
                                {product.rating}
                            </Text>
                        </View>
                        <Text style={styles.reviews}>
                            ({product.reviews} reviews)
                        </Text>
                    </View>

                    <View style={styles.priceContainer}>
                        <Text style={styles.price}>₹{product.price}</Text>
                        <Text style={styles.originalPrice}>
                            ₹{product.originalPrice}
                        </Text>
                    </View>

                    {/* Size Selection */}
                    <View style={styles.selectionContainer}>
                        <Text style={styles.selectionTitle}>Size:</Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                        >
                            {product.sizes.map((size) => (
                                <TouchableOpacity
                                    key={size}
                                    style={[
                                        styles.selectionOption,
                                        selectedSize === size &&
                                            styles.selectedOption,
                                    ]}
                                    onPress={() => setSelectedSize(size)}
                                >
                                    <Text
                                        style={[
                                            styles.selectionText,
                                            selectedSize === size &&
                                                styles.selectedText,
                                        ]}
                                    >
                                        {size}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Color Selection */}
                    <View style={styles.selectionContainer}>
                        <Text style={styles.selectionTitle}>Color:</Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                        >
                            {product.colors.map((color) => (
                                <TouchableOpacity
                                    key={color}
                                    style={[
                                        styles.selectionOption,
                                        selectedColor === color &&
                                            styles.selectedOption,
                                    ]}
                                    onPress={() => setSelectedColor(color)}
                                >
                                    <Text
                                        style={[
                                            styles.selectionText,
                                            selectedColor === color &&
                                                styles.selectedText,
                                        ]}
                                    >
                                        {color}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Quantity */}
                    <View style={styles.quantityContainer}>
                        <Text style={styles.selectionTitle}>Quantity:</Text>
                        <View style={styles.quantitySelector}>
                            <TouchableOpacity
                                style={styles.quantityButton}
                                onPress={() =>
                                    setQuantity(Math.max(1, quantity - 1))
                                }
                            >
                                <Ionicons
                                    name="remove"
                                    size={20}
                                    color="#666"
                                />
                            </TouchableOpacity>
                            <Text style={styles.quantityText}>{quantity}</Text>
                            <TouchableOpacity
                                style={styles.quantityButton}
                                onPress={() => setQuantity(quantity + 1)}
                            >
                                <Ionicons name="add" size={20} color="#666" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Description */}
                    <View style={styles.descriptionContainer}>
                        <Text style={styles.descriptionTitle}>Description</Text>
                        <Text style={styles.descriptionText}>
                            {product.description}
                        </Text>
                    </View>

                    {/* Features */}
                    <View style={styles.featuresContainer}>
                        <Text style={styles.featuresTitle}>Key Features</Text>
                        {product.features.map((feature, index) => (
                            <View key={index} style={styles.featureItem}>
                                <Ionicons
                                    name="checkmark-circle"
                                    size={16}
                                    color="#4ECDC4"
                                />
                                <Text style={styles.featureText}>
                                    {feature}
                                </Text>
                            </View>
                        ))}
                    </View>

                    {/* Seller Info */}
                    <View style={styles.sellerContainer}>
                        <Text style={styles.sellerTitle}>
                            Sold by: {product.seller}
                        </Text>
                        <View style={styles.sellerRating}>
                            <Ionicons name="star" size={14} color="#FFD700" />
                            <Text style={styles.sellerRatingText}>
                                4.5 Seller Rating
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Bottom Action Bar */}
            <BlurView intensity={80} style={styles.bottomBar}>
                <TouchableOpacity
                    style={styles.addToCartButton}
                    onPress={addToCart}
                >
                    <Ionicons name="bag-outline" size={20} color="#333" />
                    <Text style={styles.addToCartText}>Add to Cart</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buyNowButton} onPress={buyNow}>
                    <Text style={styles.buyNowText}>Buy Now</Text>
                </TouchableOpacity>
            </BlurView>
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
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: "white",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
    },
    wishlistButton: {
        padding: 5,
    },
    content: {
        flex: 1,
    },
    imageContainer: {
        position: "relative",
        height: 400,
    },
    productImage: {
        width,
        height: 400,
        resizeMode: "cover",
    },
    imageIndicator: {
        position: "absolute",
        bottom: 20,
        left: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "center",
    },
    indicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "white",
        marginHorizontal: 3,
    },
    discountBadge: {
        position: "absolute",
        top: 20,
        left: 20,
        backgroundColor: "#FF6B6B",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
    },
    discountText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 12,
    },
    productInfo: {
        backgroundColor: "white",
        padding: 20,
        marginTop: -20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    productName: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 5,
    },
    category: {
        fontSize: 14,
        color: "#666",
        marginBottom: 10,
    },
    ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15,
    },
    rating: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f0f8f0",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    ratingText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#333",
        marginLeft: 3,
    },
    reviews: {
        fontSize: 14,
        color: "#666",
        marginLeft: 10,
    },
    priceContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    price: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#FF6B6B",
    },
    originalPrice: {
        fontSize: 18,
        color: "#999",
        textDecorationLine: "line-through",
        marginLeft: 10,
    },
    selectionContainer: {
        marginBottom: 20,
    },
    selectionTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
        marginBottom: 10,
    },
    selectionOption: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 20,
        marginRight: 10,
    },
    selectedOption: {
        backgroundColor: "#FF6B6B",
        borderColor: "#FF6B6B",
    },
    selectionText: {
        fontSize: 14,
        color: "#666",
        fontWeight: "500",
    },
    selectedText: {
        color: "white",
    },
    quantityContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    quantitySelector: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 25,
    },
    quantityButton: {
        padding: 10,
        width: 40,
        alignItems: "center",
    },
    quantityText: {
        fontSize: 16,
        fontWeight: "600",
        paddingHorizontal: 15,
        color: "#333",
    },
    descriptionContainer: {
        marginBottom: 20,
    },
    descriptionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 10,
    },
    descriptionText: {
        fontSize: 14,
        color: "#666",
        lineHeight: 22,
    },
    featuresContainer: {
        marginBottom: 20,
    },
    featuresTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 10,
    },
    featureItem: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    featureText: {
        fontSize: 14,
        color: "#666",
        marginLeft: 8,
    },
    sellerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: "#eee",
    },
    sellerTitle: {
        fontSize: 14,
        fontWeight: "600",
        color: "#333",
    },
    sellerRating: {
        flexDirection: "row",
        alignItems: "center",
    },
    sellerRatingText: {
        fontSize: 12,
        color: "#666",
        marginLeft: 3,
    },
    bottomBar: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: "row",
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: "rgba(255,255,255,0.95)",
    },
    addToCartButton: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        paddingVertical: 15,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: "#ddd",
        marginRight: 10,
    },
    addToCartText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
        marginLeft: 5,
    },
    buyNowButton: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FF6B6B",
        paddingVertical: 15,
        borderRadius: 25,
    },
    buyNowText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "white",
    },
});
