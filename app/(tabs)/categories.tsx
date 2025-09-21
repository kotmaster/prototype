import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
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

interface Category {
    id: string;
    name: string;
    icon: string;
    color: string;
    itemCount: number;
    subcategories: string[];
}

interface Product {
    id: string;
    name: string;
    price: number;
    originalPrice: number;
    image: string;
    rating: number;
    category: string;
}

export default function CategoriesScreen() {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(
        null
    );

    const categories: Category[] = [
        {
            id: "1",
            name: "Fashion",
            icon: "shirt-outline",
            color: "#FF6B6B",
            itemCount: 1250,
            subcategories: [
                "Kurtas",
                "Dresses",
                "Tops",
                "Bottoms",
                "Ethnic Wear",
            ],
        },
        {
            id: "2",
            name: "Electronics",
            icon: "phone-portrait-outline",
            color: "#4ECDC4",
            itemCount: 850,
            subcategories: ["Mobiles", "Headphones", "Gadgets", "Accessories"],
        },
        {
            id: "3",
            name: "Beauty",
            icon: "flower-outline",
            color: "#45B7D1",
            itemCount: 650,
            subcategories: ["Skincare", "Makeup", "Haircare", "Fragrances"],
        },
        {
            id: "4",
            name: "Home & Kitchen",
            icon: "home-outline",
            color: "#96CEB4",
            itemCount: 920,
            subcategories: ["Decor", "Kitchen", "Furniture", "Storage"],
        },
        {
            id: "5",
            name: "Sports",
            icon: "fitness-outline",
            color: "#FECA57",
            itemCount: 450,
            subcategories: ["Fitness", "Outdoor", "Sports Wear", "Equipment"],
        },
        {
            id: "6",
            name: "Books",
            icon: "book-outline",
            color: "#FF9FF3",
            itemCount: 320,
            subcategories: ["Fiction", "Non-fiction", "Educational", "Comics"],
        },
    ];

    const products: Product[] = [
        {
            id: "1",
            name: "Designer Kurta Set",
            price: 899,
            originalPrice: 1999,
            image: "https://dummyimage.com/150x200/FF6B6B/FFFFFF?text=Kurta",
            rating: 4.3,
            category: "Fashion",
        },
        {
            id: "2",
            name: "Wireless Earbuds",
            price: 1299,
            originalPrice: 3999,
            image: "https://dummyimage.com/150x200/4ECDC4/FFFFFF?text=Earbuds",
            rating: 4.1,
            category: "Electronics",
        },
        {
            id: "3",
            name: "Vitamin C Serum",
            price: 599,
            originalPrice: 1299,
            image: "https://dummyimage.com/150x200/45B7D1/FFFFFF?text=Serum",
            rating: 4.5,
            category: "Beauty",
        },
        {
            id: "4",
            name: "Decorative Lamp",
            price: 799,
            originalPrice: 1599,
            image: "https://dummyimage.com/150x200/96CEB4/FFFFFF?text=Lamp",
            rating: 4.2,
            category: "Home & Kitchen",
        },
    ];

    const CategoryCard = ({ category }: { category: Category }) => (
        <TouchableOpacity
            style={styles.categoryCard}
            onPress={() => setSelectedCategory(category.name)}
            activeOpacity={0.8}
        >
            <LinearGradient
                colors={[category.color, `${category.color}80`]}
                style={styles.categoryGradient}
            >
                <Ionicons name={category.icon as any} size={40} color="white" />
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.categoryCount}>
                    {category.itemCount} items
                </Text>
            </LinearGradient>
        </TouchableOpacity>
    );

    const ProductCard = ({ product }: { product: Product }) => (
        <TouchableOpacity
            style={styles.productCard}
            onPress={() => router.push(`/product/${product.id}`)}
            activeOpacity={0.9}
        >
            <BlurView intensity={20} style={styles.productBlur}>
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
                    </View>
                    <View style={styles.ratingContainer}>
                        <Ionicons name="star" size={12} color="#FFD700" />
                        <Text style={styles.rating}>{product.rating}</Text>
                    </View>
                </View>
            </BlurView>
        </TouchableOpacity>
    );

    if (selectedCategory) {
        const category = categories.find((c) => c.name === selectedCategory);
        const categoryProducts = products.filter(
            (p) => p.category === selectedCategory
        );

        return (
            <SafeAreaView style={styles.container}>
                <LinearGradient
                    colors={[category?.color || "#FF6B6B", "#764ba2"]}
                    style={styles.header}
                >
                    <View style={styles.headerContent}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => setSelectedCategory(null)}
                        >
                            <Ionicons
                                name="arrow-back"
                                size={24}
                                color="white"
                            />
                        </TouchableOpacity>
                        <View style={styles.headerInfo}>
                            <Text style={styles.headerTitle}>
                                {selectedCategory}
                            </Text>
                            <Text style={styles.headerSubtitle}>
                                {category?.itemCount} products
                            </Text>
                        </View>
                    </View>
                </LinearGradient>

                <ScrollView
                    style={styles.content}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Subcategories */}
                    <View style={styles.subcategoriesContainer}>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                        >
                            {category?.subcategories.map((sub, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.subcategoryTag}
                                >
                                    <Text style={styles.subcategoryText}>
                                        {sub}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Products Grid */}
                    <View style={styles.productsContainer}>
                        <Text style={styles.sectionTitle}>
                            Popular in {selectedCategory}
                        </Text>
                        <View style={styles.productsGrid}>
                            {categoryProducts.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                />
                            ))}
                        </View>
                    </View>

                    <View style={{ height: 100 }} />
                </ScrollView>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={["#667eea", "#764ba2"]}
                style={styles.header}
            >
                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>Categories</Text>
                    <Text style={styles.headerSubtitle}>Shop by category</Text>
                </View>
            </LinearGradient>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* Categories Grid */}
                <View style={styles.categoriesGrid}>
                    {categories.map((category) => (
                        <CategoryCard key={category.id} category={category} />
                    ))}
                </View>

                {/* Trending Section */}
                <View style={styles.trendingSection}>
                    <Text style={styles.sectionTitle}>Trending Now</Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                    >
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </ScrollView>
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
        paddingBottom: 30,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
    },
    headerContent: {
        paddingHorizontal: 20,
        flexDirection: "row",
        alignItems: "center",
    },
    backButton: {
        marginRight: 15,
    },
    headerInfo: {
        flex: 1,
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
    content: {
        flex: 1,
        marginTop: -15,
    },
    categoriesGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        paddingHorizontal: 10,
        paddingTop: 20,
        justifyContent: "space-between",
    },
    categoryCard: {
        width: "48%",
        height: 120,
        marginBottom: 15,
        borderRadius: 15,
        overflow: "hidden",
    },
    categoryGradient: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 15,
    },
    categoryName: {
        fontSize: 16,
        fontWeight: "bold",
        color: "white",
        marginTop: 8,
    },
    categoryCount: {
        fontSize: 12,
        color: "rgba(255,255,255,0.8)",
        marginTop: 2,
    },
    subcategoriesContainer: {
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    subcategoryTag: {
        backgroundColor: "rgba(255,255,255,0.9)",
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 10,
        borderWidth: 1,
        borderColor: "#e0e0e0",
    },
    subcategoryText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#333",
    },
    productsContainer: {
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 15,
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
    productBlur: {
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
    ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    rating: {
        fontSize: 12,
        color: "#333",
        marginLeft: 3,
    },
    trendingSection: {
        paddingHorizontal: 20,
        marginTop: 20,
    },
});
