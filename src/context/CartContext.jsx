import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity = 1, size, color, preventOpen = false) => {
    setCart(prevCart => {
      const existingProductIndex = prevCart.findIndex(
        item => item.id === product.id && item.size === size && item.color === color
      );
      
      if (existingProductIndex >= 0) {
        // Increment quantity if identical product+size+color exists
        const updatedCart = [...prevCart];
        updatedCart[existingProductIndex].quantity += quantity;
        return updatedCart;
      }
      
      // Add new item
      return [...prevCart, { ...product, quantity, size, color }];
    });
    
    // Auto open cart on add (unless prevented)
    if (!preventOpen) {
      setIsCartOpen(true);
    }
  };

  const removeFromCart = (productId, size, color) => {
    setCart(prevCart => 
      prevCart.filter(item => !(item.id === productId && item.size === size && item.color === color))
    );
  };

  const updateQuantity = (productId, size, color, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId, size, color);
      return;
    }
    
    setCart(prevCart => 
      prevCart.map(item => 
        (item.id === productId && item.size === size && item.color === color)
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart,
      isCartOpen,
      setIsCartOpen,
      toggleCart,
      subtotal,
      totalItems
    }}>
      {children}
    </CartContext.Provider>
  );
};
