'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '@/lib/products';
import { useToast } from "@/hooks/use-toast";
import { LensOption } from '@/components/LensOptions';

export interface CartItem {
  product: Product;
  quantity: number;
  lens?: LensOption;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number, lens?: LensOption) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  itemCount: number;
  lensTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  const addToCart = (product: Product, quantity = 1, lens?: LensOption) => {
    const cartItemId = lens ? `${product.id}_${lens.title.replace(/\s+/g, '-')}` : product.id;
    
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => 
        (item.lens ? `${item.product.id}_${item.lens.title.replace(/\s+/g, '-')}` : item.product.id) === cartItemId
      );

      if (existingItem) {
        return prevItems.map(item =>
          ((item.lens ? `${item.product.id}_${item.lens.title.replace(/\s+/g, '-')}` : item.product.id) === cartItemId)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      const newCartItem: CartItem = { product, quantity, lens };
      return [...prevItems, newCartItem];
    });
    
    toast({
      title: "Item added to cart",
      description: `${product.name}${lens ? ` with ${lens.title}` : ''} has been added.`,
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCartItems(prevItems => prevItems.filter(item => {
       const currentItemId = item.lens ? `${item.product.id}_${item.lens.title.replace(/\s+/g, '-')}` : item.product.id;
       return currentItemId !== cartItemId;
    }));
     toast({
      title: "Item removed",
      description: "The item has been removed from your cart.",
      variant: 'destructive',
    });
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item => {
           const currentItemId = item.lens ? `${item.product.id}_${item.lens.title.replace(/\s+/g, '-')}` : item.product.id;
           return currentItemId === cartItemId ? { ...item, quantity } : item;
        })
      );
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce((total, item) => {
    const itemPrice = item.product.price + (item.lens?.price || 0);
    return total + itemPrice * item.quantity;
  }, 0);

  const lensTotal = cartItems.reduce((total, item) => {
    return total + (item.lens?.price || 0) * item.quantity;
  }, 0);

  const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        itemCount,
        lensTotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
