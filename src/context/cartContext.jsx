import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
    // Initialize empty cart - no storage persistence
    const [cartItems, setCartItems] = useState([]);

    const addToCart = (movie) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.imdbID === movie.imdbID);
            if (existingItem) {
                return prevItems.map(item =>
                    item.imdbID === movie.imdbID
                        ? { ...item, quantity: (item.quantity || 1) + 1 }
                        : item
                );
            }
            return [...prevItems, { ...movie, quantity: 1 }];
        });
    };

    const removeFromCart = (movieId) => {
        setCartItems(prevItems => prevItems.filter(item => item.imdbID !== movieId));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const updateQuantity = (movieId, newQuantity) => {
        if (newQuantity < 1 || newQuantity > 99) return;
        setCartItems(prevItems => 
            prevItems.map(item => 
                item.imdbID === movieId 
                    ? { ...item, quantity: newQuantity }
                    : item
            )
        );
    };

    const calculateItemPrice = (item) => {
        const quantity = item.quantity || 1;
        
        const formatPrice = (price) => {
            return Number(price).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        };

        return {
            original: formatPrice(parseFloat(item.price.original) * quantity),
            sale: item.price.isOnSale 
                ? formatPrice(parseFloat(item.price.sale) * quantity)
                : null,
            isOnSale: item.price.isOnSale
        };
    };

    return (
        <CartContext.Provider value={{ 
            cartItems, 
            setCartItems, 
            addToCart, 
            removeFromCart, 
            clearCart,
            updateQuantity,
            calculateItemPrice 
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}

export default CartContext;