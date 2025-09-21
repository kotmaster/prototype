import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: "transparent",
                    borderTopWidth: 0,
                    elevation: 0,
                    height: 80,
                },
                tabBarBackground: () => (
                    <BlurView intensity={100} style={{ flex: 1 }} />
                ),
                tabBarActiveTintColor: "#FF6B6B",
                tabBarInactiveTintColor: "#666",
                tabBarLabelStyle: {
                    fontSize: 12,
                    marginBottom: 10,
                },
                tabBarIconStyle: {
                    marginTop: 5,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons
                            name="home-outline"
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="categories"
                options={{
                    title: "Categories",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons
                            name="grid-outline"
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="cart"
                options={{
                    title: "Cart",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons
                            name="bag-outline"
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="social"
                options={{
                    title: "Social",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons
                            name="people-outline"
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="account"
                options={{
                    title: "Account",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons
                            name="person-outline"
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}
