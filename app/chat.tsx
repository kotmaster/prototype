import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

interface ChatMessage {
    id: string;
    text: string;
    isUser: boolean;
    timestamp: Date;
    isTyping?: boolean;
}

export default function ChatScreen() {
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: "1",
            text: "👋 Hello! I'm your personal AI shopping companion! I've details about you and I remember your past preferences. I can:\n\n🧠 Remember what you love and suggest similar items\n🎯 Create personalized product bundles\n💰 Negotiate better deals for you\n👗 Generate complete outfit suggestions\n📦 Set up recurring orders for essentials\n\nI'm here to make shopping effortless and fun! What can I help you discover today?",
            isUser: false,
            timestamp: new Date(),
        },
    ]);
    const [inputText, setInputText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const flatListRef = useRef<FlatList>(null);

    // Simulated user preferences (in real app, this would come from backend)
    const userPreferences = {
        colors: ["pastel", "blue", "white"],
        style: ["casual", "ethnic"],
        size: "M",
        budget: "mid-range",
        previousPurchases: ["kurta", "earphones", "jeans"],
        location: "Dhanbad, Jharkhand",
    };

    const generateAIResponse = (userMessage: string): string => {
        const lowerMessage = userMessage.toLowerCase();

        // Personal memory and learning responses
        if (
            lowerMessage.includes("remember") ||
            lowerMessage.includes("preference")
        ) {
            return "🧠 **Your Personal Shopping Profile:**\n\nI remember you love:\n• Pastel colors (especially mint & lavender)\n• Casual ethnic wear in size M\n• Mid-range budget products (₹500-2000)\n• Quick delivery to Dhanbad\n\n**Recent Interests:** Cotton kurtas, wireless earphones, comfortable jeans\n\n**Smart Suggestions:** Based on your history, I think you'd love our new pastel kurta collection and the latest wireless earbuds with better battery life!\n\nWould you like me to update any preferences or show you items matching your taste?";
        }

        if (lowerMessage.includes("kurta") || lowerMessage.includes("ethnic")) {
            return "🎯 **Perfect! I found kurtas matching YOUR style:**\n\n**Recommended for you** (based on your pastel preference):\n• Mint Green Cotton Kurta - ₹899 ⭐ 4.8/5\n• Lavender Embroidered Kurta - ₹1299 (was ₹1899)\n• Cream White Casual Kurta - ₹599 \n\n**💡 AI Insight:** Since you bought a blue kurta last month, these pastels will complement your wardrobe perfectly!\n\n**🎁 Personal Bundle Offer:**\nKurta + Matching Palazzo + Dupatta = ₹1499 (Save ₹400!)\n\n**🚚 For Dhanbad:** Free express delivery in 2 days\n\nShould I create a complete ethnic outfit for you?";
        }

        if (
            lowerMessage.includes("earphone") ||
            lowerMessage.includes("headphone") ||
            lowerMessage.includes("wireless")
        ) {
            return "🎧 **Upgraded Recommendations Based on Your Profile:**\n\n**Since you prefer quality within budget:**\n• Premium Wireless Earbuds Pro - ₹1499 (45% off)\n  ✓ 8hr battery (you mentioned battery life matters)\n  ✓ IPX7 waterproof for Jharkhand monsoons\n  ✓ Quick charge: 15min = 2hrs music\n\n• Gaming Earphones - ₹899 (NEW)\n  ✓ Low latency for mobile games\n\n**🤝 I negotiated a special deal:** Extra ₹200 off if you order in next 2 hours!\n\n**📦 Auto-Cart Suggestion:** Since you use earphones daily, would you like me to set up quarterly automatic orders for replacement earbuds at 15% discount?";
        }

        if (
            lowerMessage.includes("outfit") ||
            lowerMessage.includes("complete look") ||
            lowerMessage.includes("style")
        ) {
            return "👗 **Creating Your Personalized Outfit:**\n\n**AI Style Analysis:** Based on your body type (Medium), color preference (pastels), and lifestyle (casual-professional), here's your complete look:\n\n**🌟 'Dhanbad Day-Out' Ensemble:**\n• Mint kurta with subtle embroidery - ₹999\n• Cream palazzo pants - ₹699  \n• Silver jhumkas - ₹399\n• Beige sandals - ₹799\n• Pastel dupatta - ₹299\n\n**💰 Bundle Price:** ₹2499 *(Individual: ₹3195)*\n**Savings:** ₹696 + Free styling consultation\n\n**🎨 Alternative Looks:** I can create 3 more outfits with these pieces!\n**📸 Virtual Try-On:** Available for the kurta\n\nShall I finalize this bundle or would you like to see the other outfit combinations?";
        }

        if (
            lowerMessage.includes("budget") ||
            lowerMessage.includes("cheap") ||
            lowerMessage.includes("affordable")
        ) {
            return "💰 **Smart Budget Shopping - Personalized for You:**\n\n**Your Budget Profile:** Mid-range (₹500-2000)\n**AI-Found Deals:**\n\n**Under ₹500 (Quality Picks):**\n• Cotton casual tees - ₹299 (bulk discount available)\n• Basic accessories - ₹199\n• Phone cases - ₹149\n\n**₹500-1000 (Sweet Spot for You):**\n• Designer kurtas - ₹799\n• Wireless earphones - ₹899\n• Comfortable jeans - ₹999\n\n**🧠 AI Insight:** Based on your purchase history, investing ₹800-1200 gives you the best quality-value ratio.\n\n**💡 Smart Saving Strategy:**\n• Bundle purchases = Extra 15% off\n• Auto-cart essentials = 5% recurring discount\n• Loyalty points = ₹50 earned on every ₹1000\n\nWant me to create a budget-optimized shopping plan for this month?";
        }

        if (
            lowerMessage.includes("delivery") ||
            lowerMessage.includes("shipping")
        ) {
            return "🚚 **Personalized Delivery Options for Dhanbad:**\n\n**Your Delivery Profile:**\n• Address: Dhanbad, Jharkhand ✓\n• Preferred time: Evenings (based on your order history)\n• Special instructions: Call before delivery\n\n**Available Options:**\n• **Express (24hrs)** - ₹99 (FREE for orders ₹999+)\n• **Standard (2-3 days)** - FREE\n• **Scheduled Delivery** - Choose your preferred time slot\n• **Weekend Special** - Saturday/Sunday delivery available\n\n**🎯 Smart Delivery:**\n• Group multiple orders to save costs\n• Auto-cart items delivered monthly on 15th\n• Weather alerts for Jharkhand (monsoon delays)\n\n**💰 Your Savings:** You've saved ₹450 on delivery charges this year through smart bundling!\n\nWant me to schedule your next delivery optimally?";
        }

        if (
            lowerMessage.includes("return") ||
            lowerMessage.includes("exchange")
        ) {
            return "🔄 **Hassle-Free Returns - Tailored for You:**\n\n**Your Return History:** 2 returns, both processed smoothly ✅\n\n**Personalized Return Policy:**\n• **15-day return** (extended for loyal customers like you)\n• **Size exchanges** - FREE (since you sometimes need size adjustments)\n• **Color exchanges** - FREE within 7 days\n• **Instant refunds** to your preferred payment method\n\n**🚛 Dhanbad Pickup Service:**\n• Free pickup from your location\n• Same-day pickup available\n• WhatsApp updates throughout process\n\n**🧠 AI Recommendation:** Based on your measurements, I can now suggest the perfect size for each brand to avoid returns!\n\n**💡 Try Before Buy:** Selected items now available for 'try at home' service in Dhanbad area.\n\nNeed help with a current return or want size guidance for future purchases?";
        }

        if (
            lowerMessage.includes("sale") ||
            lowerMessage.includes("offer") ||
            lowerMessage.includes("discount")
        ) {
            return "🔥 **Exclusive Offers Curated for YOU:**\n\n**Personal Sale Dashboard:**\n\n**💎 VIP Member Benefits:**\n• Extra 20% off on your favorite categories\n• Early access to flash sales (24hrs before others)\n• Exclusive pastel collection preview\n\n**🎯 Targeted Deals (Expiring Soon!):**\n• Ethnic wear: Up to 60% off + free styling\n• Electronics: Buy 2 earphones, get 1 FREE\n• Combo offers: Kurta + Accessories = Flat 40% off\n\n**🤖 AI-Negotiated Deals:**\nI secured special prices for you:\n• That mint kurta you liked: ₹899 → ₹699\n• Wireless earbuds: ₹1499 → ₹1199\n\n**📱 Flash Sale Alert:** Your wishlist items are 50% off for next 3 hours!\n\n**💰 Your Total Savings This Month:** ₹2,340\n\nWhich deal excites you most? Should I add any to your cart before they expire?";
        }

        if (
            lowerMessage.includes("auto cart") ||
            lowerMessage.includes("recurring") ||
            lowerMessage.includes("subscription")
        ) {
            return "📦 **Smart Auto-Cart - Your Personal Shopping Butler:**\n\n**Current Auto-Cart Setup:**\n• Monthly: Rice (5kg), Cooking oil, Detergent\n• Quarterly: Phone accessories, basic clothing\n• Bi-annual: Seasonal ethnic wear\n\n**🧠 AI Recommendations for Your Auto-Cart:**\n\nBased on your consumption pattern:\n• **Monthly Essentials:** ₹800-1200 budget\n  - Groceries, toiletries, basic needs\n• **Quarterly Fashion:** ₹2000 budget\n  - 2 kurtas, 1 bottom wear, accessories\n• **Tech Refresh:** Every 6 months\n  - Earphone upgrades, phone accessories\n\n**💰 Auto-Cart Benefits:**\n• 15% discount on all recurring items\n• Priority delivery slots\n• Flexible skip/modify options\n• Weather-based delivery adjustments\n\n**🎯 Smart Feature:** AI predicts when you'll run out and auto-adjusts quantities!\n\n**Seasonal Intelligence:** Monsoon = more indoor items, Winter = warm clothes\n\nWant me to set up your personalized auto-cart schedule?";
        }

        if (
            lowerMessage.includes("negotiate") ||
            lowerMessage.includes("better price") ||
            lowerMessage.includes("deal")
        ) {
            return "🤝 **AI Negotiation in Progress...**\n\n**Negotiation Status:** ✅ SUCCESS!\n\n**What I secured for you:**\n• Original Price: ₹1,899\n• Market Average: ₹1,599  \n• **Your Price: ₹1,299** (31% off!)\n\n**How I did it:**\n• Leveraged your loyalty status (50+ orders)\n• Bundled with complementary items\n• Found seller's inventory clearance need\n• Applied seasonal discount stacking\n\n**🎁 Bonus Additions:**\n• FREE express delivery (₹99 value)\n• Extended warranty (+6 months)\n• Free gift wrapping\n• Priority customer support\n\n**⏰ Deal Valid:** Next 45 minutes only\n**💳 Payment Options:** EMI available at 0% interest\n\n**🧠 AI Tip:** This price is 23% below market average - excellent deal!\n\nShall I lock in this negotiated price and add to your cart? The seller has confirmed stock availability in Dhanbad!";
        }

        if (
            lowerMessage.includes("bundle") ||
            lowerMessage.includes("complete") ||
            lowerMessage.includes("set")
        ) {
            return "🎁 **AI-Curated Bundles Just for You:**\n\n**Bundle Intelligence:** Based on your style, budget, and past purchases\n\n**🌟 'The Dhanbad Professional' Bundle:**\n• 3 Cotton kurtas (your preferred pastels) - ₹2,397\n• 2 Matching palazzos - ₹1,398\n• Ethnic accessories set - ₹699\n• Professional footwear - ₹1,299\n\n**Individual Total:** ₹5,793\n**Bundle Price:** ₹3,999 (Save ₹1,794!)\n\n**🎯 'Weekend Casual' Bundle:**\n• 2 Comfortable jeans - ₹1,998\n• 3 Trendy tops - ₹1,497\n• Casual sneakers - ₹1,499\n• Accessories - ₹499\n\n**Individual Total:** ₹5,493\n**Bundle Price:** ₹3,599 (Save ₹1,894!)\n\n**🤖 Why these bundles work for you:**\n• Match your size (M) and color preferences\n• Fit your ₹500-2000 budget per item\n• Perfect for Dhanbad's climate\n• Mix-and-match possibilities: 15+ outfit combinations!\n\n**📦 Bundle Perks:**\n• Free styling guide with 20 outfit ideas\n• Priority delivery\n• Easy returns on individual items\n\nWhich bundle speaks to your style? Or shall I create a custom bundle?";
        }

        if (
            lowerMessage.includes("personalized") ||
            lowerMessage.includes("recommendation") ||
            lowerMessage.includes("suggest")
        ) {
            return "🎯 **Your Personalized Shopping Universe:**\n\n**AI Profile Analysis Complete:**\n\n**👤 Your Shopping DNA:**\n• Style: 70% Ethnic, 30% Western casual\n• Color Psychology: Pastels for calmness, blues for confidence\n• Quality vs Price: 60% quality, 40% budget-conscious\n• Shopping Frequency: Every 2-3 weeks\n• Decision Style: Research-based, reviews matter\n\n**🔮 Predictive Recommendations:**\n\n**This Week's Perfect Picks:**\n1. **Lavender Cotton Kurta** - 95% match score\n   *Why: Matches color preference, season, and budget*\n\n2. **Wireless Earbuds Pro** - 88% match score\n   *Why: Upgrade from your current ones, tech enthusiast*\n\n3. **Comfortable Palazzo Set** - 92% match score\n   *Why: Complements existing kurtas, casual comfort*\n\n**🧠 AI Insights:**\n• You shop more during monsoons (comfort priority)\n• 73% of your purchases are evening/weekend orders\n• You respond well to bundle offers (saved ₹3,200 so far)\n\n**🎁 Surprise Element:**\nBased on your adventurous 15%, I found a beautiful Indo-western top that's 85% your style but adds a trendy twist!\n\nReady to explore these personalized picks?";
        }

        if (
            lowerMessage.includes("wishlist") ||
            lowerMessage.includes("favorite") ||
            lowerMessage.includes("saved")
        ) {
            return "⭐ **Your Smart Wishlist Dashboard:**\n\n**Current Wishlist (AI-Organized):**\n\n**🔥 Price Drop Alerts:**\n• Mint kurta set: ₹1,299 → ₹999 (25% off) - **ACT NOW!**\n• Wireless earbuds: ₹1,899 → ₹1,399 (26% off)\n• Silver jhumkas: ₹599 → ₹449\n\n**📊 Wishlist Analytics:**\n• Total items: 12\n• Average savings if bought now: 32%\n• Best time to buy: Next 48 hours\n• Budget needed for all items: ₹8,999\n\n**🎯 Smart Recommendations:**\n• Buy top 3 priority items now (max savings)\n• Wait 2 weeks for seasonal sale on accessories\n• Bundle opportunity: Kurta + palazzo + dupatta\n\n**🤖 AI Actions:**\n• Monitoring price drops 24/7\n• Tracking stock levels (2 items low stock!)\n• Predicting future discounts\n• Finding similar items at better prices\n\n**⚡ Urgent:** That mint kurta you've been watching is almost out of stock in size M!\n\n**🛒 Quick Action:** Should I move your top 3 wishlist items to cart with current discounts?";
        }

        if (
            lowerMessage.includes("compare") ||
            lowerMessage.includes("vs") ||
            lowerMessage.includes("which is better")
        ) {
            return "⚖️ **AI-Powered Product Comparison:**\n\n**Smart Comparison Based on YOUR Priorities:**\n\n**🏆 Winner Analysis:**\n\n**Option A: Premium Kurta (₹1,299)**\n• Quality Score: 9.2/10 ⭐\n• Your Style Match: 94%\n• Durability: Excellent (2+ years)\n• Reviews: 4.6/5 (2,847 reviews)\n• **Your Match**: Perfect for special occasions\n\n**Option B: Budget Kurta (₹699)**\n• Quality Score: 7.8/10 ⭐\n• Your Style Match: 87%\n• Durability: Good (1+ year)\n• Reviews: 4.3/5 (1,203 reviews)\n• **Your Match**: Great for daily wear\n\n**🧠 AI Recommendation:**\nBased on your purchase history (you prefer quality), **Option A** is 73% more aligned with your satisfaction pattern.\n\n**💡 Smart Strategy:**\n• Buy Option A for special occasions\n• Get Option B for daily comfort\n• **Bundle Deal**: Both for ₹1,699 (save ₹299)\n\n**🎯 Decision Helper:**\nYour budget comfort zone: ₹800-1,200\nRecommended choice: Option A (worth the extra ₹600)\n\nNeed more comparison points or ready to decide?";
        }

        if (
            lowerMessage.includes("size") ||
            lowerMessage.includes("fit") ||
            lowerMessage.includes("measurement")
        ) {
            return "📏 **Your Personal Fit Assistant:**\n\n**Your Saved Measurements:**\n• Kurta Size: M (fits perfectly based on returns history)\n• Jean Size: 32 (regular fit preferred)\n• Footwear: 7 UK / 8 US\n• Preferred Fit: Comfortable, not too tight\n\n**🎯 Size Recommendations:**\n\n**For This Item:**\n• **Size M** - 95% perfect fit probability\n• **Size L** - If you prefer looser fit (monsoon comfort)\n\n**🧠 AI Size Intelligence:**\n• This brand runs slightly small - M will fit like your usual M\n• Material: 100% cotton (might shrink 2-3% after wash)\n• Cut: Regular fit with comfortable room\n\n**📊 Fit Prediction:**\n• Shoulder: Perfect fit ✅\n• Chest: Comfortable ✅\n• Length: Ideal for your height ✅\n• Sleeve: Just right ✅\n\n**🔄 Size Exchange Promise:**\n• FREE size exchange if not perfect\n• Try at home service available\n• Virtual measurement guide\n\n**💡 Pro Tip:** 89% of customers with your build choose size M in this brand.\n\nConfident about size M or need more measurement details?";
        }

        if (
            lowerMessage.includes("color") ||
            lowerMessage.includes("shade") ||
            lowerMessage.includes("tone")
        ) {
            return "🎨 **Your Personal Color Consultant:**\n\n**Your Color DNA:**\n• **Signature Colors**: Pastels (85% of purchases)\n• **Power Colors**: Mint green, lavender, cream\n• **Accent Colors**: Soft blues, pale yellows\n• **Avoid**: Neon, very dark colors (based on returns)\n\n**🌈 Perfect Matches for You:**\n\n**This Season's Recommendations:**\n• **Lavender Mist** - 96% your style ⭐\n• **Mint Breeze** - 94% your style ⭐\n• **Cream Silk** - 91% your style ⭐\n• **Powder Blue** - 88% your style (new addition!)\n\n**🧠 Color Psychology for You:**\n• Pastels enhance your calm personality\n• Light colors suit Dhanbad's climate\n• Versatile enough for work & casual\n\n**👗 Wardrobe Harmony:**\nThese colors will pair perfectly with:\n• Your existing blue kurta\n• That cream palazzo you bought\n• Silver accessories (your preference)\n\n**📸 Virtual Preview:**\nWant to see how these colors look together? I can create a virtual wardrobe combination!\n\n**🎁 Color Bonus:** Buy 3 items in complementary pastels, get color coordination guide FREE!\n\nWhich color speaks to you today?";
        }

        // General personalized responses
        const personalizedResponses = [
            "🤖 I'm constantly learning about your preferences! Based on your shopping pattern from Dhanbad, I notice you love quality products in the ₹500-2000 range. What specific category can I help you explore today? I have some exciting personalized recommendations!",

            "✨ Your shopping journey with me has been amazing! I remember you prefer comfortable ethnic wear in pastels, and you're always looking for smart deals. Let me know what you need, and I'll create a personalized shopping experience just for you!",

            "🎯 I've been analyzing the best deals for someone with your taste and budget in Dhanbad. I have curated bundles, negotiated special prices, and found items that match your style perfectly. What would you like to discover today?",

            "🧠 Based on your shopping DNA (casual-ethnic style, pastel colors, mid-range budget), I can predict what you might love! I'm also tracking price drops on items similar to your past purchases. How can I make your shopping smarter today?",
        ];

        return personalizedResponses[
            Math.floor(Math.random() * personalizedResponses.length)
        ];
    };

    const sendMessage = async () => {
        if (!inputText.trim()) return;

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            text: inputText.trim(),
            isUser: true,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputText("");
        setIsLoading(true);

        // Add typing indicator
        const typingMessage: ChatMessage = {
            id: "typing",
            text: "AI is analyzing your request...",
            isUser: false,
            timestamp: new Date(),
            isTyping: true,
        };
        setMessages((prev) => [...prev, typingMessage]);

        // Simulate API delay
        setTimeout(() => {
            setIsLoading(false);
            const aiResponse = generateAIResponse(userMessage.text);

            const responseMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                text: aiResponse,
                isUser: false,
                timestamp: new Date(),
            };

            setMessages((prev) =>
                prev.filter((m) => m.id !== "typing").concat([responseMessage])
            );
        }, 2000);
    };

    useEffect(() => {
        // Scroll to bottom when new messages arrive
        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
    }, [messages]);

    const renderMessage = ({ item }: { item: ChatMessage }) => (
        <View
            style={[
                styles.messageContainer,
                item.isUser ? styles.userMessage : styles.aiMessage,
            ]}
        >
            <BlurView
                intensity={item.isUser ? 80 : 40}
                style={[
                    styles.messageBubble,
                    item.isUser ? styles.userBubble : styles.aiBubble,
                ]}
            >
                {item.isTyping ? (
                    <View style={styles.typingIndicator}>
                        <View style={styles.typingDot} />
                        <View style={styles.typingDot} />
                        <View style={styles.typingDot} />
                    </View>
                ) : (
                    <Text
                        style={[
                            styles.messageText,
                            item.isUser ? styles.userText : styles.aiText,
                        ]}
                    >
                        {item.text}
                    </Text>
                )}
            </BlurView>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={["#FF6B6B", "#4ECDC4"]}
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
                            Your AI Shopping Companion
                        </Text>
                        <Text style={styles.headerSubtitle}>
                            🧠 Learning • 💰 Negotiating • 🎯 Personalizing
                        </Text>
                    </View>
                    <View style={styles.statusIndicator}>
                        <View style={styles.onlineDot} />
                    </View>
                </View>
            </LinearGradient>

            <KeyboardAvoidingView
                style={styles.chatContainer}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
            >
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    keyExtractor={(item) => item.id}
                    renderItem={renderMessage}
                    style={styles.messagesList}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.messagesContent}
                />

                <BlurView intensity={80} style={styles.inputContainer}>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.textInput}
                            value={inputText}
                            onChangeText={setInputText}
                            placeholder="Tell me what you need, I'll personalize everything!"
                            placeholderTextColor="#999"
                            multiline={false}
                            returnKeyType="send"
                            onSubmitEditing={sendMessage}
                            editable={!isLoading}
                        />
                        <TouchableOpacity
                            style={[
                                styles.sendButton,
                                { opacity: inputText.trim() ? 1 : 0.5 },
                            ]}
                            onPress={sendMessage}
                            disabled={!inputText.trim() || isLoading}
                        >
                            <Ionicons name="send" size={20} color="white" />
                        </TouchableOpacity>
                    </View>
                </BlurView>
            </KeyboardAvoidingView>
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
        fontSize: 18,
        fontWeight: "bold",
        color: "white",
    },
    headerSubtitle: {
        fontSize: 12,
        color: "rgba(255,255,255,0.8)",
        marginTop: 2,
    },
    statusIndicator: {
        alignItems: "center",
    },
    onlineDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: "#4CAF50",
    },
    chatContainer: {
        flex: 1,
    },
    messagesList: {
        flex: 1,
    },
    messagesContent: {
        padding: 20,
        paddingBottom: 10,
    },
    messageContainer: {
        marginBottom: 15,
        maxWidth: "85%",
    },
    userMessage: {
        alignSelf: "flex-end",
    },
    aiMessage: {
        alignSelf: "flex-start",
    },
    messageBubble: {
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderRadius: 20,
    },
    userBubble: {
        backgroundColor: "rgba(255,107,107,0.9)",
        borderBottomRightRadius: 5,
    },
    aiBubble: {
        backgroundColor: "rgba(255,255,255,0.9)",
        borderBottomLeftRadius: 5,
    },
    messageText: {
        fontSize: 16,
        lineHeight: 22,
    },
    userText: {
        color: "white",
    },
    aiText: {
        color: "#333",
    },
    typingIndicator: {
        flexDirection: "row",
        alignItems: "center",
    },
    typingDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#999",
        marginRight: 4,
        opacity: 0.4,
    },
    inputContainer: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderTopWidth: 1,
        borderTopColor: "rgba(0,0,0,0.1)",
    },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "flex-end",
        backgroundColor: "rgba(255,255,255,0.9)",
        borderRadius: 25,
        paddingHorizontal: 15,
        paddingVertical: 5,
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 12,
        paddingRight: 10,
        color: "#333",
        maxHeight: 100,
    },
    sendButton: {
        backgroundColor: "#FF6B6B",
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 5,
    },
});
