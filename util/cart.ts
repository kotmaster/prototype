// utils/cart.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

export const addItemToCart = async (item: any) => {
    try {
        const cart = await AsyncStorage.getItem("cart");
        const cartItems = cart ? JSON.parse(cart) : [];

        const existingItemIndex = cartItems.findIndex(
            (cartItem: any) =>
                cartItem.name === item.name &&
                cartItem.size === item.size &&
                cartItem.color === item.color
        );

        if (existingItemIndex >= 0) {
            cartItems[existingItemIndex].quantity += item.quantity;
        } else {
            cartItems.push(item);
        }

        await AsyncStorage.setItem("cart", JSON.stringify(cartItems));
        return true;
    } catch (error) {
        console.error("Error adding to cart:", error);
        return false;
    }
};
