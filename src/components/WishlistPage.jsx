import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "./WishlistContext";
import { useCart } from "./CartContext";
import AddToCartModal from "./AddToCartModal";

const WishlistPage = () => {
  const navigate = useNavigate();
  const { wishlistItems, removeFromWishlist, wishlistCount } = useWishlist();
  const { cartCount } = useCart();
  const [modalProduct, setModalProduct] = useState(null);
  const [removingId,   setRemovingId]   = useState(null);

  const handleRemove = (productId) => {
    setRemovingId(productId);
    setTimeout(() => {
      removeFromWishlist(productId);
      setRemovingId(null);
    }, 300);
  };

  const handleMoveToCart = (product) => {
    setModalProduct(product);
  };

  // ── Empty state ──
  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans">
        <div className="sticky top-0 z-50 bg-[#1e0a3c] flex items-center gap-4 px-6 h-14 shadow-lg shadow-purple-900/30">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/70 hover:text-white text-sm px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all">
            ← Back
          </button>
          <span className="font-serif text-base text-purple-200 tracking-wide">My Wishlist</span>
          <button onClick={() => navigate("/cart")} className="ml-auto relative w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-lg hover:bg-white/20 transition-all text-white/60">
            🛒
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">{cartCount}</span>
            )}
          </button>
        </div>

        <div className="flex flex-col items-center justify-center min-h-[80vh] gap-5 px-4 text-center">
          <div className="w-32 h-32 bg-pink-50 rounded-full flex items-center justify-center">
            <span className="text-6xl">♡</span>
          </div>
          <div>
            <h2 className="font-serif text-2xl text-gray-900 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-400 text-sm">Save items you love by clicking the ♡ on any product.</p>
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-8 py-3.5 bg-gradient-to-r from-violet-600 to-purple-500 text-white rounded-2xl font-semibold text-sm hover:shadow-xl hover:shadow-purple-200 hover:-translate-y-0.5 transition-all"
          >
            Explore Products →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* ── TOPBAR ── */}
      <div className="sticky top-0 z-50 bg-[#1e0a3c] flex items-center gap-4 px-6 h-14 shadow-lg shadow-purple-900/30">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/70 hover:text-white text-sm px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all">
          ← Back
        </button>
        <span className="font-serif text-base text-purple-200 tracking-wide">
          My Wishlist <span className="text-white/40 font-sans text-sm">({wishlistCount} items)</span>
        </span>
        <button onClick={() => navigate("/cart")} className="ml-auto relative w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-lg hover:bg-white/20 transition-all text-white/60">
          🛒
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">{cartCount}</span>
          )}
        </button>
      </div>

      {/* ── BREADCRUMB ── */}
      <div className="bg-white border-b border-purple-50 px-6 py-3 flex items-center gap-2 text-xs text-gray-400">
        <span className="cursor-pointer hover:text-violet-600" onClick={() => navigate("/dashboard")}>Home</span>
        <span>›</span>
        <span className="text-gray-700 font-medium">Wishlist</span>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-serif text-2xl text-gray-900">
            My <span className="text-violet-600">Wishlist</span>
          </h1>
          <span className="text-sm text-gray-400">{wishlistCount} saved items</span>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {wishlistItems.map((product) => {
            const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
            const isRemoving = removingId === product.id;

            return (
              <div
                key={product.id}
                className={`bg-white rounded-2xl border border-purple-100 overflow-hidden group transition-all duration-300 relative ${isRemoving ? "opacity-0 scale-95" : "opacity-100 scale-100 hover:border-violet-300 hover:shadow-xl hover:shadow-purple-100 hover:-translate-y-1"}`}
              >
                {/* Remove from wishlist */}
                <button
                  onClick={() => handleRemove(product.id)}
                  className="absolute top-2 right-2 z-10 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-lg hover:scale-110 transition-transform text-pink-500 hover:text-red-500"
                >
                  ♥
                </button>

                {/* Badge */}
                {product.badge && (
                  <span className="absolute top-2 left-2 z-10 bg-gradient-to-r from-violet-600 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                    {product.badge}
                  </span>
                )}

                {/* Image */}
                <div
                  className="h-52 overflow-hidden bg-purple-50 cursor-pointer"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <img
                    src={product.images?.[0] || product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { e.target.src = "https://placehold.co/300x400/f3f4f6/9ca3af?text=Lyra"; }}
                  />
                </div>

                {/* Info */}
                <div className="p-3">
                  <p className="text-xs font-semibold text-violet-400 uppercase tracking-wider mb-1">{product.brand}</p>
                  <p
                    className="text-sm font-medium text-gray-900 truncate mb-1 cursor-pointer hover:text-violet-600"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    {product.name}
                  </p>

                  {/* Stars */}
                  <div className="flex items-center gap-1 mb-2">
                    <span className="text-amber-400 text-xs">{"★".repeat(Math.floor(product.rating))}{"☆".repeat(5 - Math.floor(product.rating))}</span>
                    <span className="text-gray-400 text-xs">{product.rating}</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2 flex-wrap mb-3">
                    <span className="text-base font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                    <span className="text-xs text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
                    <span className="text-xs font-semibold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">{discount}% off</span>
                  </div>

                  {/* Add to Cart button */}
                  <button
                    onClick={() => handleMoveToCart(product)}
                    className="w-full py-2 bg-gradient-to-r from-violet-600 to-purple-500 text-white text-xs font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-200 transition-all"
                  >
                    🛒 Add to Cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add to Cart Modal */}
      {modalProduct && (
        <AddToCartModal product={modalProduct} onClose={() => setModalProduct(null)} />
      )}
    </div>
  );
};

export default WishlistPage;