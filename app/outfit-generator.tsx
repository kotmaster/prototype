import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import {
    Alert,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

interface OutfitItem {
    id: string;
    name: string;
    price: number;
    image: string;
    category: "top" | "bottom" | "accessory";
}

interface GeneratedOutfit {
    id: string;
    theme: string;
    items: OutfitItem[];
    totalPrice: number;
    description: string;
}

export default function OutfitGeneratorScreen() {
    const [prompt, setPrompt] = useState("");
    const [generatedOutfits, setGeneratedOutfits] = useState<GeneratedOutfit[]>(
        []
    );
    const [isLoading, setIsLoading] = useState(false);

    const samplePrompts = [
        "Casual weekend in Goa, minimalist but trendy",
        "Office meeting, professional and confident",
        "Date night, romantic and elegant",
        "Festival celebration, traditional and colorful",
        "Gym workout, comfortable and sporty",
    ];

    const generateOutfits = async () => {
        if (!prompt.trim()) {
            Alert.alert("Please enter a style description");
            return;
        }

        setIsLoading(true);

        // Simulate AI generation
        setTimeout(() => {
            const mockOutfits: GeneratedOutfit[] = [
                {
                    id: "1",
                    theme: "Casual Chic",
                    items: [
                        {
                            id: "1",
                            name: "Cotton Crop Top",
                            price: 599,
                            image: "https://dummyimage.com/150x200/FF6B6B/FFFFFF?text=Top",
                            category: "top",
                        },
                        {
                            id: "2",
                            name: "High-Waist Jeans",
                            price: 1299,
                            image: "https://dummyimage.com/150x200/4ECDC4/FFFFFF?text=Jeans",
                            category: "bottom",
                        },
                        {
                            id: "3",
                            name: "Minimalist Earrings",
                            price: 399,
                            image: "https://dummyimage.com/150x200/45B7D1/FFFFFF?text=Earrings",
                            category: "accessory",
                        },
                    ],
                    totalPrice: 2297,
                    description:
                        "Perfect for a relaxed day out while maintaining that effortless style.",
                },
                {
                    id: "2",
                    theme: "Boho Vibes",
                    items: [
                        {
                            id: "4",
                            name: "Flowy Maxi Dress",
                            price: 1599,
                            image: "https://dummyimage.com/150x200/96CEB4/FFFFFF?text=Dress",
                            category: "top",
                        },
                        {
                            id: "5",
                            name: "Layered Necklace",
                            price: 699,
                            image: "https://dummyimage.com/150x200/FFEAA7/FFFFFF?text=Necklace",
                            category: "accessory",
                        },
                        {
                            id: "6",
                            name: "Crossbody Bag",
                            price: 999,
                            image: "https://dummyimage.com/150x200/DDA0DD/FFFFFF?text=Bag",
                            category: "accessory",
                        },
                    ],
                    totalPrice: 3297,
                    description:
                        "Embrace free-spirited fashion with this bohemian-inspired look.",
                },
            ];

            setGeneratedOutfits(mockOutfits);
            setIsLoading(false);
        }, 2000);
    };

    const addOutfitToCart = (outfit: GeneratedOutfit) => {
        Alert.alert(
            "Add Complete Outfit?",
            `This will add all ${outfit.items.length} items to your cart for ₹${outfit.totalPrice}`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Add All",
                    onPress: () => {
                        Alert.alert("Success", "Outfit added to cart!");
                    },
                },
            ]
        );
    };

    const OutfitCard = ({ outfit }: { outfit: GeneratedOutfit }) => (
        <View style={styles.outfitCard}>
            <BlurView intensity={20} style={styles.outfitBlur}>
                <View style={styles.outfitHeader}>
                    <Text style={styles.outfitTheme}>{outfit.theme}</Text>
                    <Text style={styles.outfitPrice}>₹{outfit.totalPrice}</Text>
                </View>

                <Text style={styles.outfitDescription}>
                    {outfit.description}
                </Text>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.itemsContainer}
                >
                    {outfit.items.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.itemCard}
                            onPress={() => router.push(`/product/${item.id}`)}
                        >
                            <Image
                                source={{ uri: item.image }}
                                style={styles.itemImage}
                            />
                            <Text style={styles.itemName} numberOfLines={2}>
                                {item.name}
                            </Text>
                            <Text style={styles.itemPrice}>₹{item.price}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <View style={styles.outfitActions}>
                    <TouchableOpacity style={styles.saveButton}>
                        <Ionicons
                            name="bookmark-outline"
                            size={16}
                            color="#666"
                        />
                        <Text style={styles.saveText}>Save Look</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.addToCartButton}
                        onPress={() => addOutfitToCart(outfit)}
                    >
                        <Ionicons name="bag-outline" size={16} color="white" />
                        <Text style={styles.addToCartText}>Add Outfit</Text>
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
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <View style={styles.headerInfo}>
                        <Text style={styles.headerTitle}>
                            AI Outfit Generator
                        </Text>
                        <Text style={styles.headerSubtitle}>
                            Create perfect looks instantly
                        </Text>
                    </View>
                    <Ionicons
                        name="color-wand-outline"
                        size={24}
                        color="white"
                    />
                </View>
            </LinearGradient>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* Input Section */}
                <View style={styles.inputSection}>
                    <Text style={styles.inputTitle}>
                        Describe your style or occasion:
                    </Text>
                    <BlurView intensity={20} style={styles.inputContainer}>
                        <TextInput
                            style={styles.textInput}
                            value={prompt}
                            onChangeText={setPrompt}
                            placeholder="E.g., Casual weekend in Goa, minimalist but trendy"
                            placeholderTextColor="#999"
                            multiline={true}
                            numberOfLines={3}
                        />
                    </BlurView>

                    <TouchableOpacity
                        style={[
                            styles.generateButton,
                            { opacity: prompt.trim() ? 1 : 0.6 },
                        ]}
                        onPress={generateOutfits}
                        disabled={!prompt.trim() || isLoading}
                    >
                        <LinearGradient
                            colors={["#FF6B6B", "#4ECDC4"]}
                            style={styles.generateGradient}
                        >
                            {isLoading ? (
                                <Text style={styles.generateText}>
                                    Generating...
                                </Text>
                            ) : (
                                <>
                                    <Ionicons
                                        name="sparkles"
                                        size={20}
                                        color="white"
                                    />
                                    <Text style={styles.generateText}>
                                        Generate Outfits
                                    </Text>
                                </>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                {/* Sample Prompts */}
                <View style={styles.sampleSection}>
                    <Text style={styles.sampleTitle}>Try these ideas:</Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                    >
                        {samplePrompts.map((sample, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.samplePrompt}
                                onPress={() => setPrompt(sample)}
                            >
                                <Text style={styles.sampleText}>{sample}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Generated Outfits */}
                {generatedOutfits.length > 0 && (
                    <View style={styles.outfitsSection}>
                        <Text style={styles.outfitsTitle}>
                            Generated Looks for You
                        </Text>
                        {generatedOutfits.map((outfit) => (
                            <OutfitCard key={outfit.id} outfit={outfit} />
                        ))}
                    </View>
                )}

                {/* Tips Section */}
                <View style={styles.tipsSection}>
                    <Text style={styles.tipsTitle}>
                        💡 Tips for better results:
                    </Text>
                    <View style={styles.tipItem}>
                        <Ionicons
                            name="checkmark-circle"
                            size={16}
                            color="#4ECDC4"
                        />
                        <Text style={styles.tipText}>
                            Be specific about the occasion
                        </Text>
                    </View>
                    <View style={styles.tipItem}>
                        <Ionicons
                            name="checkmark-circle"
                            size={16}
                            color="#4ECDC4"
                        />
                        <Text style={styles.tipText}>
                            Mention your preferred style (casual, formal, etc.)
                        </Text>
                    </View>
                    <View style={styles.tipItem}>
                        <Ionicons
                            name="checkmark-circle"
                            size={16}
                            color="#4ECDC4"
                        />
                        <Text style={styles.tipText}>
                            Include color preferences or budget range
                        </Text>
                    </View>
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
    },
    headerContent: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    backButton: {
        marginRight: 15,
    },
    headerInfo: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "white",
    },
    headerSubtitle: {
        fontSize: 14,
        color: "rgba(255,255,255,0.8)",
        marginTop: 2,
    },
    content: {
        flex: 1,
        marginTop: -15,
    },
    inputSection: {
        padding: 20,
    },
    inputTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 15,
    },
    inputContainer: {
        borderRadius: 15,
        overflow: "hidden",
        marginBottom: 15,
    },
    textInput: {
        padding: 15,
        fontSize: 16,
        color: "#333",
        backgroundColor: "rgba(255,255,255,0.9)",
        minHeight: 80,
        textAlignVertical: "top",
    },
    generateButton: {
        borderRadius: 25,
        overflow: "hidden",
    },
    generateGradient: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 15,
    },
    generateText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "white",
        marginLeft: 8,
    },
    sampleSection: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    sampleTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#666",
        marginBottom: 10,
    },
    samplePrompt: {
        backgroundColor: "rgba(255,255,255,0.9)",
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 20,
        marginRight: 10,
        borderWidth: 1,
        borderColor: "#e0e0e0",
    },
    sampleText: {
        fontSize: 14,
        color: "#333",
    },
    outfitsSection: {
        paddingHorizontal: 20,
    },
    outfitsTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 15,
    },
    outfitCard: {
        marginBottom: 20,
        borderRadius: 20,
        overflow: "hidden",
    },
    outfitBlur: {
        padding: 20,
        backgroundColor: "rgba(255,255,255,0.9)",
    },
    outfitHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    outfitTheme: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
    },
    outfitPrice: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#FF6B6B",
    },
    outfitDescription: {
        fontSize: 14,
        color: "#666",
        marginBottom: 15,
        lineHeight: 20,
    },
    itemsContainer: {
        marginBottom: 15,
    },
    itemCard: {
        width: 120,
        marginRight: 15,
        backgroundColor: "rgba(255,255,255,0.8)",
        borderRadius: 10,
        padding: 10,
    },
    itemImage: {
        width: 100,
        height: 120,
        borderRadius: 8,
        marginBottom: 8,
    },
    itemName: {
        fontSize: 12,
        fontWeight: "600",
        color: "#333",
        marginBottom: 4,
    },
    itemPrice: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#FF6B6B",
    },
    outfitActions: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    saveButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.8)",
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#ddd",
    },
    saveText: {
        fontSize: 14,
        color: "#666",
        marginLeft: 5,
        fontWeight: "600",
    },
    addToCartButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FF6B6B",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
    },
    addToCartText: {
        fontSize: 14,
        color: "white",
        marginLeft: 5,
        fontWeight: "bold",
    },
    tipsSection: {
        margin: 20,
        backgroundColor: "rgba(255,255,255,0.9)",
        padding: 20,
        borderRadius: 15,
    },
    tipsTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 15,
    },
    tipItem: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    tipText: {
        fontSize: 14,
        color: "#666",
        marginLeft: 8,
        flex: 1,
    },
});
