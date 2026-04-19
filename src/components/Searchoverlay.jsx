import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "./WishlistContext";
import axios from "axios";

const API = axios.create({ baseURL: "https://lyra-backend-gilt.vercel.app/api/admin" });

// ── Attach JWT ────────────────────────────────────────────────────
API.interceptors.request.use((cfg) => {
  try {
    const u = JSON.parse(sessionStorage.getItem("user") || "{}");
    if (u.token) cfg.headers.Authorization = `Bearer ${u.token}`;
  } catch {}
  return cfg;
});

const TRENDING = [
  "Silk Saree", "Sneakers", "Watches", "Kurta Set", "Handbags",
  "Sunglasses", "Linen Shirt", "Earrings", "Sports Shoes", "Smart Watch",
];

const CATEGORIES_QUICK = [
  { icon: "👔", label: "Men",        slug: "men"         },
  { icon: "👗", label: "Women",      slug: "women"       },
  { icon: "🧒", label: "Kids",       slug: "kids"        },
  { icon: "💄", label: "Beauty",     slug: "beauty"      },
  { icon: "🏠", label: "Home",       slug: "home"        },
  { icon: "📱", label: "Electronics",slug: "electronics" },
  { icon: "⚽", label: "Sports",     slug: "sports"      },
  { icon: "⌚", label: "Watches",    slug: "watches"     },
];

// ─── Star rating component ────────────────────────────────────────
const Stars = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <svg key={i} className={`w-2.5 h-2.5 ${i < Math.floor(rating || 0) ? "text-amber-400" : "text-gray-200"}`}
        fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

// ─── Search result product card ───────────────────────────────────
const ResultCard = ({ product, onNavigate, onAddToCart, view = "list" }) => {
  const { toggleWishlist, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(product._id);
  const disc = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  if (view === "grid") {
    return (
      <div onClick={() => onNavigate(product._id)}
        className="so-grid-card group cursor-pointer bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-violet-200 hover:shadow-xl hover:shadow-violet-50 transition-all duration-300 hover:-translate-y-1">
        <div className="relative overflow-hidden bg-gray-50" style={{ height: "180px" }}>
          <img src={product.image || product.images?.[0]} alt={product.name}
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
            onError={(e) => { e.target.src = "https://placehold.co/200x180/f3f4f6/9ca3af?text=Lyra"; }} />
          {disc >= 20 && (
            <div className="absolute top-2.5 left-2.5 bg-emerald-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">{disc}% OFF</div>
          )}
          <button onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
            className="absolute top-2.5 right-2.5 w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
            style={{ color: wishlisted ? "#ef4444" : "#9ca3af", fontSize: "13px" }}>
            {wishlisted ? "♥" : "♡"}
          </button>
          {/* Add to cart slides up on hover */}
          <div className="absolute bottom-0 left-0 right-0 p-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
              className="w-full py-2 text-[10px] font-bold text-white rounded-xl tracking-wider"
              style={{ background: "linear-gradient(135deg, #1e0a3c, #7c3aed)" }}>
              ADD TO CART
            </button>
          </div>
        </div>
        <div className="p-3">
          <p className="text-[9px] font-bold text-violet-400 uppercase tracking-widest mb-0.5 truncate">{product.brand || product.category}</p>
          <p className="text-xs font-semibold text-gray-900 truncate mb-1.5 leading-tight">{product.name}</p>
          <Stars rating={product.rating} />
          <div className="flex items-baseline gap-1.5 mt-1.5 flex-wrap">
            <span className="text-sm font-bold text-gray-900">₹{(product.price || 0).toLocaleString()}</span>
            {product.originalPrice > product.price && (
              <span className="text-[10px] text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // List view (default - for initial results in overlay)
  return (
    <button onClick={() => onNavigate(product._id)}
      className="so-list-card w-full flex items-center gap-3.5 px-5 py-3.5 group transition-all duration-150 text-left"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
      {/* Thumbnail */}
      <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border border-white/8"
        style={{ background: "rgba(255,255,255,0.04)" }}>
        <img src={product.image || product.images?.[0]} alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          onError={(e) => { e.target.src = "https://placehold.co/56x56/1a0a2e/6d28d9?text=L"; }} />
      </div>
      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "#a78bfa" }}>
            {product.brand || product.category}
          </p>
          {product.category && (
            <span className="text-[8px] px-1.5 py-0.5 rounded-md font-semibold"
              style={{ background: "rgba(124,58,237,0.15)", color: "#c4b5fd" }}>
              {product.category}
            </span>
          )}
        </div>
        <p className="text-sm font-medium truncate" style={{ color: "rgba(255,255,255,0.9)" }}>{product.name}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <Stars rating={product.rating} />
          <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.25)" }}>({(product.reviews || 0).toLocaleString()})</span>
        </div>
      </div>
      {/* Price + arrow */}
      <div className="flex-shrink-0 text-right">
        <p className="text-sm font-bold" style={{ color: "rgba(255,255,255,0.95)" }}>
          ₹{(product.price || 0).toLocaleString()}
        </p>
        {product.originalPrice > product.price && (
          <p className="text-[10px] line-through" style={{ color: "rgba(255,255,255,0.25)" }}>
            ₹{product.originalPrice.toLocaleString()}
          </p>
        )}
        {disc >= 10 && (
          <p className="text-[9px] font-bold text-emerald-400">{disc}% off</p>
        )}
      </div>
      <svg className="w-4 h-4 flex-shrink-0 ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ color: "#a78bfa" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  );
};

// ══════════════════════════════════════════════════════════════════
// SEARCH OVERLAY — full screen premium search
// ══════════════════════════════════════════════════════════════════
const SearchOverlay = ({ open, onClose, onAddToCart }) => {
  const navigate    = useNavigate();
  const inputRef    = useRef(null);
  const [query,     setQuery]     = useState("");
  const [products,  setProducts]  = useState([]);
  const [loading,   setLoading]   = useState(false);
  const [viewMode,  setViewMode]  = useState("list"); // "list" | "grid"
  const [activeIdx, setActiveIdx] = useState(-1);

  // Load products once on mount
  useEffect(() => {
    API.get("/products")
      .then(({ data }) => setProducts(Array.isArray(data) ? data : data.products || []))
      .catch(() => {});
  }, []);

  // Focus input when overlay opens
  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIdx(-1);
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [open]);

  // Escape key closes
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === "Escape") { onClose(); } };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Computed search results
  const results = useMemo(() => {
    if (!query.trim() || query.length < 1) return [];
    const q = query.toLowerCase();
    return products
      .filter((p) =>
        p.name?.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
      )
      .slice(0, viewMode === "grid" ? 12 : 8);
  }, [products, query, viewMode]);

  const handleNavigate = useCallback((productId) => {
    onClose();
    setQuery("");
    navigate(`/product/${productId}`);
  }, [navigate, onClose]);

  const handleCategoryNav = useCallback((slug) => {
    onClose();
    setQuery("");
    navigate(`/category/${encodeURIComponent(slug)}`);
  }, [navigate, onClose]);

  const handleViewAll = useCallback(() => {
    onClose();
    navigate(`/category/All?q=${encodeURIComponent(query)}`);
  }, [navigate, onClose, query]);

  const handleTrending = useCallback((term) => {
    setQuery(term);
    inputRef.current?.focus();
  }, []);

  // Keyboard navigation through results
  const handleKeyDown = useCallback((e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveIdx((v) => Math.min(v + 1, results.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActiveIdx((v) => Math.max(v - 1, -1)); }
    else if (e.key === "Enter") {
      if (activeIdx >= 0 && results[activeIdx]) handleNavigate(results[activeIdx]._id);
      else if (query.trim()) handleViewAll();
    }
  }, [results, activeIdx, query, handleNavigate, handleViewAll]);

  if (!open) return null;

  const hasQuery = query.trim().length >= 1;
  const hasResults = results.length > 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');

        .so-overlay{
          position:fixed;inset:0;z-index:9999;
          display:flex;flex-direction:column;
          background:linear-gradient(160deg, #06020f 0%, #0f0520 35%, #120730 65%, #0a0218 100%);
          animation:soReveal 0.28s cubic-bezier(0.16,1,0.3,1) forwards;
        }
        @keyframes soReveal{from{opacity:0;transform:translateY(-12px)}to{opacity:1;transform:translateY(0)}}

        /* Noise texture overlay */
        .so-noise{
          position:fixed;inset:0;pointer-events:none;z-index:0;opacity:0.035;
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size:200px;
        }

        /* Ambient glow blobs */
        .so-blob{position:absolute;border-radius:50%;filter:blur(120px);pointer-events:none;}

        /* Input wrapper */
        .so-input-wrap{
          position:relative;z-index:10;
          display:flex;align-items:center;gap:14px;
          padding:20px 24px 18px;
          border-bottom:1px solid rgba(255,255,255,0.055);
        }
        .so-input{
          flex:1;background:transparent;border:none;outline:none;
          font-family:'DM Sans',sans-serif;font-size:clamp(18px,3vw,26px);
          font-weight:400;color:white;caret-color:#a78bfa;
          letter-spacing:-0.01em;
        }
        .so-input::placeholder{color:rgba(255,255,255,0.18);}

        /* Close btn */
        .so-close{
          width:36px;height:36px;border-radius:50%;border:none;cursor:pointer;
          display:flex;align-items:center;justify-content:center;flex-shrink:0;
          background:rgba(255,255,255,0.06);color:rgba(255,255,255,0.45);
          font-size:14px;transition:all 0.18s;
        }
        .so-close:hover{background:rgba(255,255,255,0.12);color:rgba(255,255,255,0.85);}

        /* Scrollable body */
        .so-body{
          flex:1;overflow-y:auto;position:relative;z-index:10;
          scrollbar-width:thin;scrollbar-color:rgba(124,58,237,0.25) transparent;
        }
        .so-body::-webkit-scrollbar{width:4px;}
        .so-body::-webkit-scrollbar-thumb{background:rgba(124,58,237,0.25);border-radius:4px;}

        /* Section label */
        .so-label{
          font-size:9px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;
          color:rgba(255,255,255,0.22);padding:18px 24px 10px;display:flex;align-items:center;gap:10px;
        }
        .so-label::after{content:'';flex:1;height:1px;background:rgba(255,255,255,0.06);}

        /* Trending pill */
        .so-pill{
          display:inline-flex;align-items:center;gap:6px;
          padding:7px 14px;border-radius:99px;cursor:pointer;
          border:1px solid rgba(255,255,255,0.08);
          background:rgba(255,255,255,0.04);
          color:rgba(255,255,255,0.55);font-size:12px;font-weight:500;
          transition:all 0.18s;white-space:nowrap;
        }
        .so-pill:hover{
          background:rgba(124,58,237,0.2);border-color:rgba(124,58,237,0.4);
          color:rgba(255,255,255,0.9);transform:translateY(-1px);
        }

        /* Category quick btn */
        .so-cat{
          display:flex;flex-direction:column;align-items:center;gap:6px;padding:14px 8px;
          border-radius:16px;cursor:pointer;border:1px solid rgba(255,255,255,0.06);
          background:rgba(255,255,255,0.03);transition:all 0.2s;
        }
        .so-cat:hover{background:rgba(124,58,237,0.15);border-color:rgba(124,58,237,0.3);transform:translateY(-2px);}
        .so-cat-icon{font-size:22px;line-height:1;}
        .so-cat-label{font-size:10px;font-weight:600;color:rgba(255,255,255,0.45);text-transform:uppercase;letter-spacing:0.08em;text-align:center;}

        /* List result item hover */
        .so-list-card:hover{background:rgba(124,58,237,0.08);}

        /* Grid card scale */
        .so-grid-card:hover .so-grid-card-img{transform:scale(1.08);}

        /* View toggle */
        .so-view-btn{
          width:32px;height:32px;border-radius:9px;border:none;cursor:pointer;
          display:flex;align-items:center;justify-content:center;font-size:13px;
          transition:all 0.18s;
        }
        .so-view-btn.active{background:rgba(124,58,237,0.35);color:#c4b5fd;}
        .so-view-btn:not(.active){background:rgba(255,255,255,0.05);color:rgba(255,255,255,0.3);}
        .so-view-btn:not(.active):hover{background:rgba(255,255,255,0.09);color:rgba(255,255,255,0.6);}

        /* Result count bar */
        .so-result-bar{
          display:flex;align-items:center;justify-content:space-between;
          padding:12px 24px;border-bottom:1px solid rgba(255,255,255,0.05);
          background:rgba(0,0,0,0.15);
        }

        /* View all button */
        .so-view-all{
          width:calc(100% - 48px);margin:16px 24px 24px;
          padding:14px;border-radius:16px;border:1px solid rgba(124,58,237,0.3);
          background:rgba(124,58,237,0.1);cursor:pointer;
          font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;
          color:rgba(167,139,250,0.9);transition:all 0.2s;
          display:flex;align-items:center;justify-content:center;gap:8px;
        }
        .so-view-all:hover{background:rgba(124,58,237,0.2);border-color:rgba(124,58,237,0.5);color:#c4b5fd;}

        /* No results */
        .so-empty{
          display:flex;flex-direction:column;align-items:center;justify-content:center;
          padding:64px 24px;text-align:center;
        }

        /* Kbd hint */
        .so-kbd{
          display:inline-flex;align-items:center;gap:3px;padding:3px 7px;
          border-radius:6px;border:1px solid rgba(255,255,255,0.1);
          background:rgba(255,255,255,0.05);
          font-size:10px;color:rgba(255,255,255,0.25);font-weight:500;
        }

        /* Serif */
        .so-serif{font-family:'Cormorant Garamond',Georgia,serif;}

        /* Footer bar */
        .so-footer{
          flex-shrink:0;padding:10px 24px;border-top:1px solid rgba(255,255,255,0.05);
          display:flex;align-items:center;gap:16px;
          background:rgba(0,0,0,0.25);z-index:10;
        }
        .so-footer-hint{display:flex;align-items:center;gap:6px;font-size:10px;color:rgba(255,255,255,0.2);}
      `}</style>

      <div className="so-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
        {/* Noise texture */}
        <div className="so-noise" />

        {/* Ambient glow blobs */}
        <div className="so-blob" style={{ width:600, height:600, top:-200, left:-100, background:"rgba(109,40,217,0.12)" }} />
        <div className="so-blob" style={{ width:400, height:400, bottom:-100, right:-50, background:"rgba(236,72,153,0.07)" }} />

        {/* ── INPUT ROW ── */}
        <div className="so-input-wrap">
          {/* Search icon */}
          <svg className="flex-shrink-0 w-6 h-6" style={{ color: hasQuery ? "#a78bfa" : "rgba(255,255,255,0.2)" }}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>

          <input
            ref={inputRef}
            className="so-input"
            placeholder="Search fashion, brands, products…"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActiveIdx(-1); }}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            spellCheck={false}
          />

          {/* Clear + view toggle (when results exist) */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {hasQuery && (
              <>
                <div className="flex gap-1 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <button onClick={() => setViewMode("list")} className={`so-view-btn ${viewMode === "list" ? "active" : ""}`} title="List view">
                    ☰
                  </button>
                  <button onClick={() => setViewMode("grid")} className={`so-view-btn ${viewMode === "grid" ? "active" : ""}`} title="Grid view">
                    ⊞
                  </button>
                </div>
                <button onClick={() => setQuery("")}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0"
                  style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)" }}>
                  ✕
                </button>
              </>
            )}
            <button onClick={onClose} className="so-close">✕</button>
          </div>
        </div>

        {/* ── SCROLLABLE BODY ── */}
        <div className="so-body">

          {/* ── NO QUERY → default state ── */}
          {!hasQuery && (
            <>
              {/* Trending searches */}
              <div>
                <div className="so-label">Trending Searches</div>
                <div className="flex flex-wrap gap-2 px-6 pb-2">
                  {TRENDING.map((t) => (
                    <button key={t} className="so-pill" onClick={() => handleTrending(t)}>
                      <svg className="w-3 h-3 flex-shrink-0" style={{ color: "#a78bfa" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick category grid */}
              <div>
                <div className="so-label">Browse Categories</div>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 px-6 pb-6">
                  {CATEGORIES_QUICK.map((cat) => (
                    <button key={cat.slug} className="so-cat" onClick={() => handleCategoryNav(cat.slug)}>
                      <span className="so-cat-icon">{cat.icon}</span>
                      <span className="so-cat-label">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recently viewed hint */}
              <div className="px-6 pb-8 text-center">
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.12)" }}>
                  Start typing to search across 50,000+ products
                </p>
              </div>
            </>
          )}

          {/* ── HAS QUERY + RESULTS ── */}
          {hasQuery && hasResults && (
            <>
              {/* Result count + view toggle bar */}
              <div className="so-result-bar">
                <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", fontWeight: 500 }}>
                  <span style={{ color: "#a78bfa", fontWeight: 700 }}>{results.length}</span>
                  {results.length === 8 ? "+" : ""} result{results.length !== 1 ? "s" : ""} for{" "}
                  <span style={{ color: "rgba(255,255,255,0.7)" }}>"{query}"</span>
                </p>
              </div>

              {/* Results */}
              {viewMode === "list" ? (
                <div>
                  {results.map((p, idx) => (
                    <div key={p._id}
                      style={{ background: activeIdx === idx ? "rgba(124,58,237,0.1)" : "transparent" }}
                      onMouseEnter={() => setActiveIdx(idx)}>
                      <ResultCard product={p} onNavigate={handleNavigate} onAddToCart={onAddToCart} view="list" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-6">
                  {results.map((p) => (
                    <ResultCard key={p._id} product={p} onNavigate={handleNavigate} onAddToCart={onAddToCart} view="grid" />
                  ))}
                </div>
              )}

              {/* View all CTA */}
              <button className="so-view-all" onClick={handleViewAll}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                View all results for "{query}"
              </button>
            </>
          )}

          {/* ── HAS QUERY + NO RESULTS ── */}
          {hasQuery && !hasResults && query.length >= 2 && (
            <div className="so-empty">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
                style={{ background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.2)" }}>
                <svg className="w-7 h-7" style={{ color: "#7c3aed" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                </svg>
              </div>
              <p className="so-serif text-2xl text-white mb-2" style={{ fontWeight: 400 }}>No results found</p>
              <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.3)" }}>
                Try a different keyword or browse a category
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {CATEGORIES_QUICK.slice(0, 5).map((cat) => (
                  <button key={cat.slug} className="so-pill" onClick={() => handleCategoryNav(cat.slug)}>
                    {cat.icon} {cat.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── FOOTER HINTS ── */}
        <div className="so-footer">
          <div className="so-footer-hint">
            <span className="so-kbd">↑</span><span className="so-kbd">↓</span> navigate
          </div>
          <div className="so-footer-hint">
            <span className="so-kbd">↵</span> open
          </div>
          <div className="so-footer-hint">
            <span className="so-kbd">Esc</span> close
          </div>
          <div className="ml-auto">
            <p className="so-serif text-sm" style={{ color: "rgba(255,255,255,0.12)" }}>
              LY<span style={{ color: "#ec4899" }}>R</span>A Search
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchOverlay;