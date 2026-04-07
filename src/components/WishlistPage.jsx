import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "./WishlistContext";
import { useCart } from "./CartContext";
import AddToCartModal from "./AddToCartModal";

const CardSkeleton = () => (
  <div className="lyra-wish-card animate-pulse">
    <div className="h-52 bg-gray-100 rounded-t-2xl" />
    <div className="p-3 space-y-2">
      <div className="h-3 bg-gray-100 rounded w-1/2" />
      <div className="h-4 bg-gray-100 rounded w-3/4" />
      <div className="h-8 bg-gray-100 rounded-xl mt-3" />
    </div>
  </div>
);

const WishlistPage = () => {
  const navigate = useNavigate();
  const { wishlistItems, removeFromWishlist, wishlistCount, loading } = useWishlist();
  const { cartCount } = useCart();
  const [modalProduct, setModalProduct] = useState(null);
  const [removingId,   setRemovingId]   = useState(null);

  const handleRemove = async (productId) => {
    setRemovingId(productId);
    await removeFromWishlist(productId);
    setTimeout(() => setRemovingId(null), 350);
  };

  if (loading) {
    return (
      <div className="min-h-screen lyra-wish-bg" style={{fontFamily:"'DM Sans',system-ui,sans-serif"}}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');.lyra-wish-bg{background:#f9f9fb;}.lyra-topbar{background:linear-gradient(to right,#0f0820,#1e0a3c);border-bottom:1px solid rgba(255,255,255,0.06);box-shadow:0 4px 30px rgba(15,5,30,0.4);}`}</style>
        <div className="lyra-topbar sticky top-0 z-50 flex items-center gap-4 px-6 h-14">
          <button onClick={() => navigate(-1)} className="text-white/60 hover:text-white text-xs font-semibold tracking-wider uppercase px-3 py-1.5 rounded-xl hover:bg-white/8 transition-all">← Back</button>
          <span style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-base text-purple-200 tracking-wide">My Wishlist</span>
        </div>
        <div className="max-w-screen-xl mx-auto px-4 py-6">
          <div className="h-8 w-40 bg-gray-200 rounded-xl animate-pulse mb-6" />
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:"16px"}}>
            {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        </div>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen" style={{background:"#f9f9fb",fontFamily:"'DM Sans',system-ui,sans-serif"}}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');
          .lyra-topbar{background:linear-gradient(to right,#0f0820,#1e0a3c);border-bottom:1px solid rgba(255,255,255,0.06);box-shadow:0 4px 30px rgba(15,5,30,0.4);}
          .lyra-serif{font-family:'Cormorant Garamond',Georgia,serif!important;}
        `}</style>
        <div className="lyra-topbar sticky top-0 z-50 flex items-center gap-4 px-6 h-14">
          <button onClick={() => navigate(-1)} className="text-white/60 hover:text-white text-xs font-semibold tracking-wider uppercase px-3 py-1.5 rounded-xl hover:bg-white/8 transition-all flex items-center gap-2">← Back</button>
          <span className="lyra-serif text-base text-purple-200 tracking-wide">My Wishlist</span>
          <button onClick={() => navigate("/cart")} className="ml-auto relative w-9 h-9 rounded-xl bg-white/8 flex items-center justify-center text-lg hover:bg-white/20 transition-all text-white/60">
            🛒
            {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">{cartCount}</span>}
          </button>
        </div>
        <div className="flex flex-col items-center justify-center min-h-[80vh] gap-5 text-center px-4">
          <div className="w-28 h-28 rounded-full flex items-center justify-center" style={{background:"linear-gradient(135deg,#f5f3ff,#fdf2f8)"}}>
            <span style={{fontSize:"48px",lineHeight:1}}>♡</span>
          </div>
          <h2 className="lyra-serif text-3xl text-gray-900">Your wishlist is empty</h2>
          <p className="text-gray-400 text-sm max-w-xs">Tap the ♡ on any product to save it here for later.</p>
          <button onClick={() => navigate("/dashboard")}
            className="px-8 py-3.5 text-white rounded-2xl font-semibold text-sm transition-all hover:-translate-y-0.5"
            style={{background:"linear-gradient(135deg,#7c3aed,#a855f7,#ec4899)"}}>
            Explore Products →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{background:"#f9f9fb",fontFamily:"'DM Sans',system-ui,sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');
        .lyra-serif{font-family:'Cormorant Garamond',Georgia,serif!important;}
        .lyra-topbar{background:linear-gradient(to right,#0f0820,#1e0a3c);border-bottom:1px solid rgba(255,255,255,0.06);box-shadow:0 4px 30px rgba(15,5,30,0.4);}

        .lyra-wish-card{
          background:white;border-radius:20px;
          border:1px solid #f1f5f9;overflow:hidden;
          position:relative;
          transition:all 0.3s cubic-bezier(0.16,1,0.3,1);
        }
        .lyra-wish-card:hover{
          border-color:#ddd6fe;
          box-shadow:0 16px 40px -8px rgba(124,58,237,0.14);
          transform:translateY(-4px);
        }
        .lyra-wish-remove{
          position:absolute;top:12px;right:12px;z-index:10;
          width:32px;height:32px;
          background:white;border-radius:50%;
          box-shadow:0 2px 8px rgba(0,0,0,0.12);
          display:flex;align-items:center;justify-content:center;
          color:#ec4899;font-size:18px;border:none;cursor:pointer;
          transition:all 0.2s;
        }
        .lyra-wish-remove:hover{transform:scale(1.15);background:#fdf2f8;box-shadow:0 4px 12px rgba(236,72,153,0.25);}

        .lyra-wish-atc{
          width:100%;padding:10px;margin-top:12px;
          background:linear-gradient(135deg,#7c3aed,#a855f7);
          color:white;font-size:11px;font-weight:700;
          border-radius:14px;border:none;cursor:pointer;
          letter-spacing:0.05em;text-transform:uppercase;
          transition:all 0.25s;
        }
        .lyra-wish-atc:hover{background:linear-gradient(135deg,#6d28d9,#9333ea);transform:translateY(-1px);}

        .wish-grid{display:grid;gap:16px;grid-template-columns:repeat(2,1fr);}
        @media(min-width:640px){.wish-grid{grid-template-columns:repeat(3,1fr)}}
        @media(min-width:1024px){.wish-grid{grid-template-columns:repeat(4,1fr)}}
        @media(min-width:1280px){.wish-grid{grid-template-columns:repeat(5,1fr)}}

        @keyframes fadeOut{to{opacity:0;transform:scale(0.92)}}
        .wish-removing{animation:fadeOut 0.3s ease forwards;pointer-events:none;}

        .wish-breadcrumb{background:white;border-bottom:1px solid #f5f3ff;padding:10px 24px;display:flex;align-items:center;gap:8px;font-size:12px;color:#9ca3af;}
      `}</style>

      {/* TOPBAR */}
      <div className="lyra-topbar sticky top-0 z-50 flex items-center gap-4 px-6 h-14">
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/60 hover:text-white text-xs font-semibold tracking-wider uppercase px-3 py-1.5 rounded-xl hover:bg-white/8 transition-all">
          ← Back
        </button>
        <span className="lyra-serif text-base text-purple-200 tracking-wide">
          My Wishlist <span className="text-white/30" style={{fontSize:"13px",fontFamily:"sans-serif"}}>({wishlistCount})</span>
        </span>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={() => navigate("/dashboard")}
            className="text-white/50 hover:text-white text-xs font-semibold tracking-wider uppercase px-3 py-1.5 rounded-xl hover:bg-white/8 transition-all hidden sm:block">
            Shop More
          </button>
          <button onClick={() => navigate("/cart")} className="relative w-9 h-9 rounded-xl bg-white/8 flex items-center justify-center text-lg hover:bg-white/20 transition-all text-white/60">
            🛒
            {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">{cartCount}</span>}
          </button>
        </div>
      </div>

      {/* BREADCRUMB */}
      <div className="wish-breadcrumb">
        <span className="cursor-pointer hover:text-violet-600 transition-colors" onClick={() => navigate("/dashboard")}>Home</span>
        <span>›</span>
        <span className="text-gray-700 font-semibold">Wishlist</span>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-6 sm:py-8">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div>
            <h1 className="lyra-serif text-2xl sm:text-3xl text-gray-900">My <span className="text-violet-600">Wishlist</span></h1>
            <p className="text-gray-400 text-sm mt-1">{wishlistCount} saved item{wishlistCount !== 1 ? "s" : ""}</p>
          </div>
          <button onClick={() => navigate("/dashboard")}
            className="text-xs text-violet-600 font-semibold border border-violet-200 hover:border-violet-400 hover:bg-violet-50 px-4 py-2 rounded-full transition-all">
            + Add More
          </button>
        </div>

        <div className="wish-grid">
          {wishlistItems.map((product) => {
            const id       = product._id || product.id;
            const discount = product.originalPrice
              ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
            const thumb    = product.images?.[0] || product.image;

            return (
              <div key={id} className={`lyra-wish-card ${removingId === id ? "wish-removing" : ""}`}>
                <button onClick={() => handleRemove(id)} className="lyra-wish-remove" title="Remove">♥</button>

                {product.badge && (
                  <span className="absolute top-3 left-3 z-10 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide" style={{background:"linear-gradient(135deg,#7c3aed,#ec4899)"}}>
                    {product.badge}
                  </span>
                )}

                <div className="h-52 overflow-hidden cursor-pointer bg-gradient-to-b from-gray-50 to-gray-100" onClick={() => navigate(`/product/${id}`)}>
                  <img src={thumb} alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    onError={(e) => { e.target.src = "https://placehold.co/300x400/f3f4f6/9ca3af?text=Lyra"; }} />
                </div>

                <div className="p-3">
                  <p className="text-[10px] font-semibold text-violet-400 uppercase tracking-widest mb-1">{product.brand}</p>
                  <p className="text-sm font-medium text-gray-900 truncate cursor-pointer hover:text-violet-600 transition-colors" onClick={() => navigate(`/product/${id}`)}>
                    {product.name}
                  </p>

                  {product.rating > 0 && (
                    <div className="flex items-center gap-1 mt-1.5">
                      <span className="text-amber-400 text-xs">{"★".repeat(Math.floor(product.rating))}{"☆".repeat(5 - Math.floor(product.rating))}</span>
                      <span className="text-gray-400 text-xs">{product.rating}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="font-bold text-gray-900">₹{(product.price || 0).toLocaleString()}</span>
                    {product.originalPrice && (<span className="text-xs text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>)}
                    {discount > 0 && (<span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-lg">{discount}% off</span>)}
                  </div>

                  <button onClick={() => setModalProduct(product)} className="lyra-wish-atc">
                    🛒 Add to Cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {modalProduct && <AddToCartModal product={modalProduct} onClose={() => setModalProduct(null)} />}
    </div>
  );
};

export default WishlistPage;