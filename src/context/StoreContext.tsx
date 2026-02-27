import React, { createContext, useContext, useState, useCallback } from "react";
import { CartItem, Product, WishlistItem } from "@/types/product";
import { toast } from "sonner";

interface StoreContextType {
  cart: CartItem[];
  wishlist: WishlistItem[];
  addToCart: (product: Product, size: string, color: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  moveToCart: (productId: string, size: string, color: string) => void;
  cartTotal: number;
  cartCount: number;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  const addToCart = useCallback((product: Product, size: string, color: string) => {
    setCart(prev => {
      const existing = prev.find(
        item => item.product.id === product.id && item.selectedSize === size && item.selectedColor === color
      );
      if (existing) {
        toast.success("Updated quantity in cart");
        return prev.map(item =>
          item.product.id === product.id && item.selectedSize === size && item.selectedColor === color
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      toast.success("Added to cart");
      return [...prev, { product, quantity: 1, selectedSize: size, selectedColor: color }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
    toast.info("Removed from cart");
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity < 1) return;
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const toggleWishlist = useCallback((product: Product) => {
    setWishlist(prev => {
      const exists = prev.find(item => item.product.id === product.id);
      if (exists) {
        toast.info("Removed from wishlist");
        return prev.filter(item => item.product.id !== product.id);
      }
      toast.success("Added to wishlist");
      return [...prev, { product }];
    });
  }, []);

  const isInWishlist = useCallback(
    (productId: string) => wishlist.some(item => item.product.id === productId),
    [wishlist]
  );

  const moveToCart = useCallback((productId: string, size: string, color: string) => {
    const item = wishlist.find(w => w.product.id === productId);
    if (item) {
      addToCart(item.product, size, color);
      setWishlist(prev => prev.filter(w => w.product.id !== productId));
    }
  }, [wishlist, addToCart]);

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.product.discountPrice * item.quantity,
    0
  );

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <StoreContext.Provider
      value={{
        cart,
        wishlist,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        moveToCart,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
};
