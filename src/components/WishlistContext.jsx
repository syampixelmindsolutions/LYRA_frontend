import React, { createContext, useContext, useState } from "react";

const WishlistContext = createContext({
  wishlistItems: [],
  addToWishlist: () => {},
  removeFromWishlist: () => {},
  toggleWishlist: () => {},
  isWishlisted: () => false,
  wishlistCount: 0,
});

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);

  // Toggle — add if not present, remove if present
  const toggleWishlist = (product) => {
    setWishlistItems((prev) => {
      const exists = prev.find((i) => i.id === product.id);
      if (exists) return prev.filter((i) => i.id !== product.id);
      return [...prev, product];
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems((prev) => prev.filter((i) => i.id !== productId));
  };

  const isWishlisted = (productId) =>
    wishlistItems.some((i) => i.id === productId);

  const wishlistCount = wishlistItems.length;

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      toggleWishlist,
      removeFromWishlist,
      isWishlisted,
      wishlistCount,
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);

export default WishlistContext;