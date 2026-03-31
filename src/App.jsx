import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import CategoryPage from "./components/CategoryPage";
import ProductDetails from "./components/ProductDetails";
import CartPage from "./components/CartPage";
import { CartProvider } from "./components/CartContext";
import { WishlistProvider } from "./components/WishlistContext";
import WishlistPage from "./components/WishlistPage";
import ProfilePage from "./ProfilePage";
import AdminPanel from "./components/AdminPanel";
import { useMemo } from "react";


const ProtectedRoute = ({ children }) => {
  const isLoggedIn = useMemo(() => {
    try {
      const stored = sessionStorage.getItem("user");
      if (!stored) return false;
      const user = JSON.parse(stored);
      return !!(user && user.token);
    } catch {
      return false;
    }
  }, []);
  return isLoggedIn ? children : <Navigate to="/" replace />;
};

function App() {
  return (
    <CartProvider>
    <WishlistProvider>     
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/category/:categoryName" element={<ProtectedRoute><CategoryPage /></ProtectedRoute>} />
        <Route path="/product/:productId" element={<ProtectedRoute><ProductDetails /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
        <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
        <Route path="/wishlist" element={<ProtectedRoute><WishlistProvider /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
      </Routes>
    </Router>
    </WishlistProvider >
    </CartProvider>
  );
};

export default App;