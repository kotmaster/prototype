import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface Setting {
    id: string;
    title: string;
    description?: string;
    type: "toggle" | "navigation" | "action";
    value?: boolean;
    icon: string;
    color: string;
    onPress?: () => void;
}

export default function SettingsScreen() {
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [autoCartEnabled, setAutoCartEnabled] = useState(true);
    const [biometricEnabled, setBiometricEnabled] = useState(false);
    const [darkModeEnabled, setDarkModeEnabled] = useState(false);

    const settingsData: Setting[] = [
        {
            id: "1",
            title: "Notifications",
            description: "Receive updates about orders and offers",
            type: "toggle",
            value: notificationsEnabled,
            icon: "notifications-outline",
            color: "#FF6B6B",
            onPress: () => setNotificationsEnabled(!notificationsEnabled),
        },
        {
            id: "2",
            title: "Auto-Cart Reminders",
            description: "Monthly reminders for recurring purchases",
            type: "toggle",
            value: autoCartEnabled,
            icon: "sync-outline",
            color: "#4ECDC4",
            onPress: () => setAutoCartEnabled(!autoCartEnabled),
        },
        {
            id: "3",
            title: "Biometric Login",
            description: "Use fingerprint or face ID to login",
            type: "toggle",
            value: biometricEnabled,
            icon: "finger-print-outline",
            color: "#45B7D1",
            onPress: () => setBiometricEnabled(!biometricEnabled),
        },
        {
            id: "4",
            title: "Dark Mode",
            description: "Switch to dark theme",
            type: "toggle",
            value: darkModeEnabled,
            icon: "moon-outline",
            color: "#6C5CE7",
            onPress: () => setDarkModeEnabled(!darkModeEnabled),
        },
        {
            id: "5",
            title: "Language",
            description: "English",
            type: "navigation",
            icon: "language-outline",
            color: "#96CEB4",
            onPress: () =>
                Alert.alert("Language", "Language selection coming soon!"),
        },
        {
            id: "6",
            title: "Privacy Policy",
            type: "navigation",
            icon: "shield-outline",
            color: "#FECA57",
            onPress: () =>
                Alert.alert("Privacy Policy", "Opening privacy policy..."),
        },
        {
            id: "7",
            title: "Terms of Service",
            type: "navigation",
            icon: "document-text-outline",
            color: "#FF9FF3",
            onPress: () =>
                Alert.alert("Terms of Service", "Opening terms of service..."),
        },
        {
            id: "8",
            title: "Clear Cache",
            description: "Free up storage space",
            type: "action",
            icon: "trash-outline",
            color: "#A29BFE",
            onPress: () => {
                Alert.alert(
                    "Clear Cache",
                    "This will clear app cache and temporary files. Continue?",
                    [
                        { text: "Cancel", style: "cancel" },
                        {
                            text: "Clear",
                            onPress: () =>
                                Alert.alert("Success", "Cache cleared!"),
                        },
                    ]
                );
            },
        },
    ];

    const SettingItem = ({ setting }: { setting: Setting }) => (
        <TouchableOpacity
            style={styles.settingItem}
            onPress={setting.onPress}
            activeOpacity={0.8}
            disabled={setting.type === "toggle"}
        >
            <BlurView intensity={20} style={styles.settingBlur}>
                <View
                    style={[
                        styles.settingIcon,
                        { backgroundColor: `${setting.color}20` },
                    ]}
                >
                    <Ionicons
                        name={setting.icon as any}
                        size={22}
                        color={setting.color}
                    />
                </View>
                <View style={styles.settingContent}>
                    <Text style={styles.settingTitle}>{setting.title}</Text>
                    {setting.description && (
                        <Text style={styles.settingDescription}>
                            {setting.description}
                        </Text>
                    )}
                </View>
                {setting.type === "toggle" ? (
                    <Switch
                        value={setting.value}
                        onValueChange={setting.onPress}
                        trackColor={{ false: "#767577", true: setting.color }}
                        thumbColor={setting.value ? "#fff" : "#f4f3f4"}
                    />
                ) : (
                    <Ionicons name="chevron-forward" size={18} color="#ccc" />
                )}
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
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <View style={styles.headerInfo}>
                        <Text style={styles.headerTitle}>Settings</Text>
                        <Text style={styles.headerSubtitle}>
                            Customize your app experience
                        </Text>
                    </View>
                </View>
            </LinearGradient>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* Account Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Preferences</Text>
                    {settingsData.slice(0, 4).map((setting) => (
                        <SettingItem key={setting.id} setting={setting} />
                    ))}
                </View>

                {/* General Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>General</Text>
                    {settingsData.slice(4, 7).map((setting) => (
                        <SettingItem key={setting.id} setting={setting} />
                    ))}
                </View>

                {/* Storage Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Storage</Text>
                    {settingsData.slice(7).map((setting) => (
                        <SettingItem key={setting.id} setting={setting} />
                    ))}
                </View>

                {/* App Info */}
                <View style={styles.appInfo}>
                    <BlurView intensity={20} style={styles.appInfoBlur}>
                        <Text style={styles.appName}>Meesho Clone</Text>
                        <Text style={styles.appVersion}>Version 1.0.0</Text>
                        <Text style={styles.appDescription}>
                            Built with React Native & Expo
                        </Text>
                    </BlurView>
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
        fontSize: 22,
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
    section: {
        paddingHorizontal: 20,
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 15,
        marginLeft: 5,
    },
    settingItem: {
        marginBottom: 10,
        borderRadius: 15,
        overflow: "hidden",
    },
    settingBlur: {
        flexDirection: "row",
        alignItems: "center",
        padding: 15,
        backgroundColor: "rgba(255,255,255,0.9)",
    },
    settingIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    settingContent: {
        flex: 1,
        marginLeft: 15,
    },
    settingTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
    },
    settingDescription: {
        fontSize: 12,
        color: "#666",
        marginTop: 2,
    },
    appInfo: {
        marginHorizontal: 20,
        marginTop: 10,
        borderRadius: 15,
        overflow: "hidden",
    },
    appInfoBlur: {
        alignItems: "center",
        padding: 20,
        backgroundColor: "rgba(255,255,255,0.9)",
    },
    appName: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
    },
    appVersion: {
        fontSize: 14,
        color: "#666",
        marginTop: 4,
    },
    appDescription: {
        fontSize: 12,
        color: "#999",
        marginTop: 8,
        textAlign: "center",
    },
});
