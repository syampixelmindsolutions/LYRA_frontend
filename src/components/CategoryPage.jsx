import React, { useState, useMemo, useEffect} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCart } from "./CartContext";
import AddToCartModal from "./AddToCartModal";
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:6055/api/admin",
});

const SORT_OPTIONS = [
  { value: "popular",    label: "Most Popular" },
  { value: "newest",     label: "Newest" },
  { value: "price_asc",  label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating",     label: "Top Rated" },
  { value: "discount",   label: "Best Discount" },
];

const COLOR_MAP = {
  Black: "#111", White: "#fff", Navy: "#1e3a5f", Grey: "#9ca3af",
  Blue: "#3b82f6", Red: "#ef4444", Brown: "#92400e", Beige: "#d6c5a3",
  Gold: "#f59e0b", Silver: "#9ca3af", Pink: "#ec4899", Green: "#22c55e",
  Olive: "#65a30d", Nude: "#e8c9a4", Khaki: "#a3885a", Tan: "#c5956a",
  Cream: "#f5f0e8", Natural: "#d4c5a9", "Rose Gold": "#d4a0a0",
  Tortoise: "#8b5e3c", Floral: "#f9a8d4", Yellow: "#fbbf24",
};

const Stars = ({ rating }) => (
  <div className="flex items-center gap-1">
    <span className="text-amber-400 text-xs">{"★".repeat(Math.floor(rating))}{"☆".repeat(5 - Math.floor(rating))}</span>
    <span className="text-gray-400 text-xs">{rating}</span>
  </div>
);

const CategoryPage = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const category = decodeURIComponent(categoryName || "All");

  const [sort,         setSort]         = useState("popular");
  const [maxPrice,     setMaxPrice]     = useState(20000);
  const [selBrands,    setSelBrands]    = useState([]);
  const [selRatings,   setSelRatings]   = useState([]);
  const [selGenders,   setSelGenders]   = useState([]);
  const [selColors,    setSelColors]    = useState([]);
  const [wishlist,     setWishlist]     = useState([]);
  const [addedCart,    setAddedCart]    = useState([]);
  const [viewMode,     setViewMode]     = useState("grid");
  const [modalProduct, setModalProduct] = useState(null);

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await API.get("/products");

        const filtered =
          category === "All"
            ? data
            : data.filter((p) => p.category === category);

        setProducts(filtered);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProducts();
  }, [category]);

  const base = useMemo(() => products, [products]);

  const brands  = [...new Set(base.map((p) => p.brand))];
  const genders = [...new Set(base.map((p) => p.gender))];
  const colors  = [...new Set(base.flatMap((p) => p.colors))];

  const filtered = useMemo(() => {
    let r = [...base].filter((p) => p.price <= maxPrice);
    if (selBrands.length)  r = r.filter((p) => selBrands.includes(p.brand));
    if (selRatings.length) r = r.filter((p) => selRatings.some((rt) => p.rating >= Number(rt)));
    if (selGenders.length) r = r.filter((p) => selGenders.includes(p.gender));
    if (selColors.length)  r = r.filter((p) => p.colors.some((c) => selColors.includes(c)));
    switch (sort) {
      case "price_asc":  r.sort((a, b) => a.price - b.price); break;
      case "price_desc": r.sort((a, b) => b.price - a.price); break;
      case "rating":     r.sort((a, b) => b.rating - a.rating); break;
      case "discount":   r.sort((a, b) => (b.originalPrice - b.price) / b.originalPrice - (a.originalPrice - a.price) / a.originalPrice); break;
      case "newest":     r.sort((a, b) => b.id - a.id); break;
      default:           r.sort((a, b) => b.reviews - a.reviews);
    }
    return r;
  }, [base, sort, maxPrice, selBrands, selRatings, selGenders, selColors]);

  const toggle = (arr, setArr, val) =>
    setArr((prev) => prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]);

  const clearFilters = () => { setMaxPrice(20000); setSelBrands([]); setSelRatings([]); setSelGenders([]); setSelColors([]); };

  const activeCount = selBrands.length + selRatings.length + selGenders.length + selColors.length + (maxPrice < 20000 ? 1 : 0);

  const handleCart = (id) => {
    setAddedCart((p) => [...p, id]);
    setTimeout(() => setAddedCart((p) => p.filter((i) => i !== id)), 2000);
  };

  const FilterSection = ({ title, children }) => (
    <div className="py-4 border-b border-purple-50">
      <p className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-3">{title}</p>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* Topbar */}
      <div className="sticky top-0 z-50 bg-[#1e0a3c] shadow-lg shadow-purple-900/30 flex items-center gap-4 px-6 h-14">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-white/70 hover:text-white text-sm px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all"
        >
          ← Back
        </button>
        <h1 className="font-serif text-lg text-purple-200 tracking-wide">
          {category}
          <span className="text-white/40 text-sm ml-2 font-sans">({filtered.length} items)</span>
        </h1>
        <button
          onClick={() => navigate("/cart")}
          className="ml-auto relative flex items-center gap-2 text-white/70 hover:text-white text-sm px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all"
        >
          <span className="text-xl">🛒</span>
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-purple-50 px-6 py-3 flex items-center gap-2 text-xs text-gray-400">
        <span className="cursor-pointer hover:text-violet-600" onClick={() => navigate("/dashboard")}>Home</span>
        <span>›</span>
        <span className="cursor-pointer hover:text-violet-600" onClick={() => navigate("/dashboard")}>Shop</span>
        <span>›</span>
        <span className="text-gray-700 font-medium">{category}</span>
      </div>

      <div className="max-w-screen-xl mx-auto flex gap-6 px-4 py-6 items-start">

        {/* ══ FILTER SIDEBAR ══ */}
        <aside className="w-60 flex-shrink-0 bg-white rounded-2xl border border-purple-100 overflow-hidden sticky top-20 hidden md:block">

          {/* Header */}
          <div className="bg-gradient-to-r from-[#1e0a3c] to-violet-700 px-5 py-4 flex items-center justify-between">
            <span className="text-white text-sm font-semibold tracking-wide uppercase">
              🎛 Filters {activeCount > 0 && <span className="bg-pink-500 text-white text-xs px-2 py-0.5 rounded-full ml-1">{activeCount}</span>}
            </span>
            {activeCount > 0 && (
              <button onClick={clearFilters} className="text-purple-300 text-xs hover:text-white transition-colors">
                Clear All
              </button>
            )}
          </div>

          <div className="px-5">

            {/* Price */}
            <FilterSection title="Price Range">
              <div className="flex justify-between text-xs text-gray-600 mb-2">
                <span>₹0</span>
                <span className="text-violet-600 font-semibold">₹{maxPrice.toLocaleString()}</span>
              </div>
              <input
                type="range" min={0} max={20000} step={500} value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-violet-600 cursor-pointer"
              />
            </FilterSection>

            {/* Rating */}
            <FilterSection title="Customer Rating">
              {[4, 3, 2].map((r) => (
                <label key={r} className="flex items-center gap-2 mb-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selRatings.includes(String(r))}
                    onChange={() => toggle(selRatings, setSelRatings, String(r))}
                    className="accent-violet-600 w-3.5 h-3.5 cursor-pointer"
                  />
                  <span className="text-amber-400 text-sm">{"★".repeat(r)}{"☆".repeat(5 - r)}</span>
                  <span className="text-xs text-gray-500 group-hover:text-violet-600">& above</span>
                </label>
              ))}
            </FilterSection>

            {/* Gender */}
            <FilterSection title="Gender">
              {genders.map((g) => (
                <label key={g} className="flex items-center gap-2 mb-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selGenders.includes(g)}
                    onChange={() => toggle(selGenders, setSelGenders, g)}
                    className="accent-violet-600 w-3.5 h-3.5 cursor-pointer"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-violet-600">{g}</span>
                </label>
              ))}
            </FilterSection>

            {/* Brand */}
            <FilterSection title="Brand">
              {brands.map((b) => (
                <label key={b} className="flex items-center gap-2 mb-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selBrands.includes(b)}
                    onChange={() => toggle(selBrands, setSelBrands, b)}
                    className="accent-violet-600 w-3.5 h-3.5 cursor-pointer"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-violet-600">{b}</span>
                </label>
              ))}
            </FilterSection>

            {/* Color */}
            <FilterSection title="Color">
              <div className="flex flex-wrap gap-2">
                {colors.slice(0, 14).map((c) => (
                  <button
                    key={c}
                    title={c}
                    onClick={() => toggle(selColors, setSelColors, c)}
                    className={`w-7 h-7 rounded-full transition-all hover:scale-110 ${selColors.includes(c) ? "ring-2 ring-violet-600 ring-offset-2 scale-110" : ""}`}
                    style={{
                      background: COLOR_MAP[c] || "#ccc",
                      border: c === "White" ? "1px solid #e5e7eb" : "none",
                    }}
                  />
                ))}
              </div>
            </FilterSection>

          </div>
        </aside>

        {/* ══ MAIN CONTENT ══ */}
        <main className="flex-1 min-w-0">

          {/* Sort bar */}
          <div className="bg-white rounded-2xl border border-purple-100 px-5 py-3 mb-4 flex flex-wrap items-center gap-3">
            <span className="text-xs text-gray-400 font-semibold tracking-widest uppercase">Sort:</span>
            <div className="flex flex-wrap gap-2">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSort(opt.value)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all border ${
                    sort === opt.value
                      ? "bg-violet-600 text-white border-violet-600 shadow-md shadow-violet-200"
                      : "border-purple-100 text-gray-500 hover:border-violet-300 hover:text-violet-600"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <div className="ml-auto flex gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`w-8 h-8 rounded-lg border flex items-center justify-center text-sm transition-all ${viewMode === "grid" ? "bg-violet-600 text-white border-violet-600" : "border-purple-100 text-gray-400 hover:border-violet-300"}`}
              >⊞</button>
              <button
                onClick={() => setViewMode("list")}
                className={`w-8 h-8 rounded-lg border flex items-center justify-center text-sm transition-all ${viewMode === "list" ? "bg-violet-600 text-white border-violet-600" : "border-purple-100 text-gray-400 hover:border-violet-300"}`}
              >☰</button>
            </div>
          </div>

          {/* Active filter chips */}
          {activeCount > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {selBrands.map((b) => (
                <span key={b} className="flex items-center gap-1 bg-violet-50 border border-violet-200 text-violet-700 text-xs px-3 py-1 rounded-full">
                  {b} <button onClick={() => toggle(selBrands, setSelBrands, b)} className="hover:text-red-500 font-bold">✕</button>
                </span>
              ))}
              {selGenders.map((g) => (
                <span key={g} className="flex items-center gap-1 bg-violet-50 border border-violet-200 text-violet-700 text-xs px-3 py-1 rounded-full">
                  {g} <button onClick={() => toggle(selGenders, setSelGenders, g)} className="hover:text-red-500 font-bold">✕</button>
                </span>
              ))}
              {selRatings.map((r) => (
                <span key={r} className="flex items-center gap-1 bg-violet-50 border border-violet-200 text-violet-700 text-xs px-3 py-1 rounded-full">
                  {"★".repeat(Number(r))} & above <button onClick={() => toggle(selRatings, setSelRatings, r)} className="hover:text-red-500 font-bold">✕</button>
                </span>
              ))}
              {selColors.map((c) => (
                <span key={c} className="flex items-center gap-1 bg-violet-50 border border-violet-200 text-violet-700 text-xs px-3 py-1 rounded-full">
                  {c} <button onClick={() => toggle(selColors, setSelColors, c)} className="hover:text-red-500 font-bold">✕</button>
                </span>
              ))}
              {maxPrice < 20000 && (
                <span className="flex items-center gap-1 bg-violet-50 border border-violet-200 text-violet-700 text-xs px-3 py-1 rounded-full">
                  Up to ₹{maxPrice.toLocaleString()} <button onClick={() => setMaxPrice(20000)} className="hover:text-red-500 font-bold">✕</button>
                </span>
              )}
            </div>
          )}

          {/* Products */}
          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-purple-100 py-20 text-center">
              <p className="text-4xl mb-3">🔍</p>
              <p className="font-serif text-xl text-gray-700 mb-1">No products found</p>
              <p className="text-sm text-gray-400 mb-4">Try adjusting your filters</p>
              <button onClick={clearFilters} className="px-6 py-2 bg-violet-600 text-white rounded-xl text-sm font-medium hover:bg-violet-700 transition-colors">
                Clear Filters
              </button>
            </div>
          ) : (
            <div className={viewMode === "grid"
              ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
              : "flex flex-col gap-4"
            }>
              {filtered.map((p) => {
                const disc     = Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
                const isWished = wishlist.includes(p._id);
                const isAdded  = addedCart.includes(p._id);

                if (viewMode === "list") {
                  return (
                    <div key={p._id} onClick={() => navigate(`/product/${p._id}`)} className="bg-white rounded-2xl border border-purple-100 hover:border-violet-300 hover:shadow-lg hover:shadow-purple-50 transition-all flex overflow-hidden cursor-pointer">
                      <div className="w-44 h-44 flex-shrink-0 bg-purple-50 overflow-hidden">
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover"
                          onError={(e) => { e.target.src = "https://placehold.co/300x400/f3f4f6/9ca3af?text=Lyra"; }} />
                      </div>
                      <div className="flex-1 p-5 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-xs font-semibold text-violet-400 uppercase tracking-wider mb-1">{p.brand}</p>
                              <p className="font-medium text-gray-900 text-base">{p.name}</p>
                            </div>
                            {p.badge && (
                              <span className="bg-gradient-to-r from-violet-600 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide flex-shrink-0">
                                {p.badge}
                              </span>
                            )}
                          </div>
                          <div className="mt-2 flex items-center gap-2">
                            <Stars rating={p.rating} />
                            <span className="text-xs text-gray-400">({p.reviews.toLocaleString()})</span>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {p.sizes.slice(0, 5).map((s) => (
                              <span key={s} className="text-xs border border-purple-100 text-gray-500 px-2 py-0.5 rounded">{s}</span>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xl font-bold text-gray-900">₹{p.price.toLocaleString()}</span>
                            <span className="text-sm text-gray-400 line-through">₹{p.originalPrice.toLocaleString()}</span>
                            <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded">{disc}% off</span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => { e.stopPropagation(); setWishlist((w) => w.includes(p._id) ? w.filter((i) => i !== p._id) : [...w, p._id]); }}
                              className="w-9 h-9 rounded-xl border border-purple-100 flex items-center justify-center text-lg hover:border-pink-300 transition-colors"
                              style={{ color: isWished ? "#ef4444" : "#d1d5db" }}
                            >
                              {isWished ? "♥" : "♡"}
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); setModalProduct(p); }}
                              className="px-5 py-2 rounded-xl text-sm font-semibold transition-all bg-gradient-to-r from-violet-600 to-purple-500 text-white hover:shadow-lg hover:shadow-purple-200"
                            >
                              Add to Cart
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={p._id} onClick={() => navigate(`/product/${p._id}`)} className="bg-white rounded-2xl border border-purple-100 overflow-hidden group hover:border-violet-300 hover:shadow-xl hover:shadow-purple-100 hover:-translate-y-1 transition-all duration-300 relative cursor-pointer">
                    {p.badge && (
                      <span className="absolute top-2 left-2 z-10 bg-gradient-to-r from-violet-600 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                        {p.badge}
                      </span>
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); setWishlist((w) => w.includes(p._id) ? w.filter((i) => i !== p._id) : [...w, p._id]); }}
                      className="absolute top-2 right-2 z-10 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-lg hover:scale-110 transition-transform"
                      style={{ color: isWished ? "#ef4444" : "#d1d5db" }}
                    >
                      {isWished ? "♥" : "♡"}
                    </button>
                    <div className="h-56 overflow-hidden bg-purple-50">
                      <img src={p.image} alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { e.target.src = "https://placehold.co/300x400/f3f4f6/9ca3af?text=Lyra"; }}
                      />
                    </div>
                    <div className="p-3">
                      <p className="text-xs font-semibold text-violet-400 uppercase tracking-wider mb-1">{p.brand}</p>
                      <p className="text-sm font-medium text-gray-900 truncate mb-1">{p.name}</p>
                      <Stars rating={p.rating} />
                      <p className="text-xs text-gray-400 mt-0.5">({p.reviews.toLocaleString()})</p>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className="text-base font-bold text-gray-900">₹{p.price.toLocaleString()}</span>
                        <span className="text-xs text-gray-400 line-through">₹{p.originalPrice.toLocaleString()}</span>
                        <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded">{disc}% off</span>
                      </div>
                      <div className="flex gap-1 mt-2 flex-wrap">
                        {p.sizes.slice(0, 3).map((s) => (
                          <span key={s} className="text-xs border border-purple-100 text-gray-500 px-1.5 py-0.5 rounded">{s}</span>
                        ))}
                        {p.sizes.length > 3 && <span className="text-xs border border-purple-100 text-gray-500 px-1.5 py-0.5 rounded">+{p.sizes.length - 3}</span>}
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); setModalProduct(p); }}
                        className={`w-full mt-3 py-2 text-xs font-semibold rounded-xl transition-all duration-300 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-violet-600 to-purple-500 text-white hover:shadow-lg hover:shadow-purple-200`}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* Add to Cart Modal */}
      {modalProduct && (
        <AddToCartModal product={modalProduct} onClose={() => setModalProduct(null)} />
      )}
    </div>
  );
};

export default CategoryPage;