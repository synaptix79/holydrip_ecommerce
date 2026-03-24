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
        item => item.id === product.id && item.color === color
      );
      
      if (existingProductIndex >= 0) {
        // Increment quantity and append size if identical product+color exists
        const updatedCart = [...prevCart];
        const existingItem = updatedCart[existingProductIndex];
        
        // Split existing sizes into an array to check for duplicates
        let sizes = existingItem.size ? existingItem.size.split(', ') : [];
        if (size && !sizes.includes(size)) {
            sizes.push(size);
        }
        
        updatedCart[existingProductIndex] = {
            ...existingItem,
            quantity: existingItem.quantity + quantity,
            size: sizes.join(', ')
        };
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
      prevCart.filter(item => !(item.id === productId && item.color === color))
    );
  };

  const updateQuantity = (productId, size, color, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId, size, color);
      return;
    }
    
    setCart(prevCart => 
      prevCart.map(item => 
        (item.id === productId && item.color === color)
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
