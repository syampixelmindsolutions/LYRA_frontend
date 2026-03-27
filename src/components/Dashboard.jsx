
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "./CartContext";
import { useWishlist } from "./WishlistContext";
import { bannerApiFetch } from "../utils/bannerApi";
import AddToCartModal from "./AddToCartModal";
import axios from "axios";
import LyraFooter from "./Footer";


const API = axios.create({
  baseURL: "http://localhost:6055/api/admin",
});

const CATEGORIES = [
  { id: 1, name: "Fashion",     icon: "👗", bg: "bg-purple-50" },
  { id: 2, name: "Footwear",    icon: "👟", bg: "bg-pink-50" },
  { id: 3, name: "Watches",     icon: "⌚", bg: "bg-blue-50" },
  { id: 4, name: "Accessories", icon: "💍", bg: "bg-yellow-50" },
  { id: 5, name: "Bags",        icon: "👜", bg: "bg-green-50" },
  { id: 6, name: "Sunglasses",  icon: "🕶️", bg: "bg-orange-50" },
  { id: 7, name: "Ethnic Wear", icon: "🥻", bg: "bg-red-50" },
  { id: 8, name: "Activewear",  icon: "🏃", bg: "bg-teal-50" },
];


// ── Brand logos — mix of real CDN logos + in-app brands ──
const BRANDS = [
  // Real popular brands — logos via brand CDNs
  {
    name: "Nike",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg",
    category: "Footwear",
    bg: "#f5f5f5",
  },
  {
    name: "Adidas",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg",
    category: "Footwear",
    bg: "#f5f5f5",
  },
  {
    name: "Zara",
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/fd/Zara_Logo.svg",
    category: "Fashion",
    bg: "#f5f5f5",
  },
  {
    name: "H&M",
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/53/H%26M-Logo.svg",
    category: "Fashion",
    bg: "#fff0f0",
  },
  {
    name: "Puma",
    logo: "https://upload.wikimedia.org/wikipedia/commons/8/88/Puma_logo.svg",
    category: "Footwear",
    bg: "#f5f5f5",
  },
  {
    name: "Levi's",
    logo: "https://upload.wikimedia.org/wikipedia/commons/7/7d/Levi%27s_logo_red.svg",
    category: "Denim",
    bg: "#fff0f0",
  },
  {
    name: "Gucci",
    logo: "https://upload.wikimedia.org/wikipedia/commons/7/79/1000x1000_Gucci_logo.svg",
    category: "Luxury",
    bg: "#fafaf5",
  },
  {
    name: "Rolex",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Rolex_Logo.png/640px-Rolex_Logo.png",
    category: "Watches",
    bg: "#f5faf5",
  },
  {
    name: "Fossil",
    logo: "https://upload.wikimedia.org/wikipedia/commons/e/e9/Fossil_Group_logo.svg",
    category: "Watches",
    bg: "#f5f5f5",
  },
  {
    name: "Tommy Hilfiger",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Tommy_Hilfiger_logo.svg/640px-Tommy_Hilfiger_logo.svg.png",
    category: "Fashion",
    bg: "#f5f5ff",
  },
  {
    name: "Calvin Klein",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Calvin_Klein_color_logo.svg/640px-Calvin_Klein_color_logo.svg.png",
    category: "Fashion",
    bg: "#f5f5f5",
  },
  {
    name: "Ray-Ban",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Ray-Ban_logo.svg/640px-Ray-Ban_logo.svg.png",
    category: "Sunglasses",
    bg: "#fff5f5",
  },
  // In-app brands — styled text pill logos
  {
    name: "Lyra Studio",
    logoText: "LYRA",
    color: "#7F77DD",
    category: "Fashion · Bags",
    bg: "#f0efff",
  },
  {
    name: "Elliot & Co",
    logoText: "E&Co",
    color: "#1D9E75",
    category: "Fashion",
    bg: "#edfaf5",
  },
  {
    name: "StreetLux",
    logoText: "SLX",
    color: "#D85A30",
    category: "Fashion",
    bg: "#fff3ef",
  },
  {
    name: "BloomWear",
    logoText: "bloom",
    color: "#D4537E",
    category: "Fashion",
    bg: "#fff0f5",
  },
  {
    name: "TimeLux",
    logoText: "TL",
    color: "#BA7517",
    category: "Watches",
    bg: "#fdf6ec",
  },
  {
    name: "FlexFit",
    logoText: "FF",
    color: "#0F6E56",
    category: "Activewear",
    bg: "#edf7f4",
  },
  {
    name: "RunElite",
    logoText: "RE",
    color: "#639922",
    category: "Footwear",
    bg: "#f3f9ea",
  },
  {
    name: "ShadeHouse",
    logoText: "SH",
    color: "#185FA5",
    category: "Sunglasses",
    bg: "#edf4fc",
  },
  {
    name: "EthnicLux",
    logoText: "EL",
    color: "#A32D2D",
    category: "Ethnic Wear",
    bg: "#fdf0f0",
  },
  {
    name: "EcoLux",
    logoText: "eco",
    color: "#3B6D11",
    category: "Bags",
    bg: "#f0f7ea",
  },
];

// ── Brand Logo Scrollbar Component ──
const BrandScrollBar = ({ onBrandClick }) => {
  const trackRef = useRef(null);
  const animRef  = useRef(null);
  const posRef   = useRef(0);
  const pausedRef = useRef(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const speed = 0.6; // px per frame

    const step = () => {
      if (!pausedRef.current) {
        posRef.current += speed;
        // Reset when first half scrolled
        if (posRef.current >= track.scrollWidth / 2) {
          posRef.current = 0;
        }
        track.style.transform = `translateX(-${posRef.current}px)`;
      }
      animRef.current = requestAnimationFrame(step);
    };

    animRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const allBrands = [...BRANDS, ...BRANDS]; // duplicate for seamless loop

  return (
    <div className="mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-serif text-2xl text-gray-900">
          Top <span className="text-violet-600">Brands</span>
        </h2>
        <button className="text-sm text-violet-600 font-medium hover:underline">
          View All →
        </button>
      </div>

      {/* Scroll strip */}
      <div
        className="relative overflow-hidden bg-white rounded-2xl border border-purple-100 py-4"
        onMouseEnter={() => { pausedRef.current = true; }}
        onMouseLeave={() => { pausedRef.current = false; }}
      >
        {/* Fade edges */}
        <div
          className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, white, transparent)" }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, white, transparent)" }}
        />

        {/* Scrolling track */}
        <div
          ref={trackRef}
          className="flex items-center gap-3 px-4 will-change-transform"
          style={{ width: "max-content" }}
        >
          {allBrands.map((brand, i) => (
            <button
              key={`${brand.name}-${i}`}
              onClick={() => onBrandClick(brand.name)}
              title={`${brand.name} · ${brand.category}`}
              className="flex-shrink-0 flex flex-col items-center gap-2 group"
            >
              {/* Logo card */}
              <div
                className="w-24 h-14 rounded-xl flex items-center justify-center border border-purple-100 group-hover:border-violet-300 group-hover:shadow-md group-hover:-translate-y-0.5 transition-all duration-200 overflow-hidden px-3"
                style={{ background: brand.bg || "#f9f9f9" }}
              >
                {brand.logo ? (
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="max-w-full max-h-full object-contain"
                    style={{ maxHeight: "36px" }}
                    onError={(e) => {
                      // fallback to text badge if logo fails
                      e.target.style.display = "none";
                      e.target.nextSibling && (e.target.nextSibling.style.display = "flex");
                    }}
                  />
                ) : null}
                {/* Text logo for in-app brands or fallback */}
                <span
                  className="font-bold tracking-tight text-sm"
                  style={{
                    color: brand.color || "#1e0a3c",
                    display: brand.logo ? "none" : "flex",
                    fontFamily: "serif",
                    letterSpacing: "0.05em",
                  }}
                >
                  {brand.logoText || brand.name}
                </span>
              </div>
              {/* Brand name label */}
              <span className="text-xs text-gray-500 group-hover:text-violet-600 transition-colors font-medium whitespace-nowrap">
                {brand.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const Stars = ({ rating }) => (
  <div className="flex items-center gap-1">
    <span className="text-amber-400 text-xs">{"★".repeat(Math.floor(rating))}{"☆".repeat(5 - Math.floor(rating))}</span>
    <span className="text-gray-400 text-xs">{rating}</span>
  </div>
);

const ProductCard = ({ product, onAddToCart }) => {
  const navigate = useNavigate();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(product._id);
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  return (
    <div
      onClick={() => navigate(`/product/${product._id}`)}
      className="bg-white rounded-2xl border border-purple-100 overflow-hidden group hover:border-purple-300 hover:shadow-xl hover:shadow-purple-100 hover:-translate-y-1 transition-all duration-300 relative cursor-pointer"
    >
      {product.badge && (
        <span className="absolute top-2 left-2 z-10 bg-gradient-to-r from-violet-600 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
          {product.badge}
        </span>
      )}
      <button
        onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
        className="absolute top-2 right-2 z-10 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-lg hover:scale-110 transition-transform"
        style={{ color: wishlisted ? "#ef4444" : "#d1d5db" }}
      >
        {wishlisted ? "♥" : "♡"}
      </button>
      <div className="h-56 overflow-hidden bg-purple-50">
        <img
          src={product.image} alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.target.src = "https://placehold.co/300x400/f3f4f6/9ca3af?text=Lyra"; }}
        />
      </div>
      <div className="p-3">
        <p className="text-xs font-semibold text-violet-400 uppercase tracking-wider mb-1">{product.category}</p>
        <p className="text-sm font-medium text-gray-900 truncate mb-1">{product.name}</p>
        <div className="flex items-center gap-1 mb-1">
          <span className="text-amber-400 text-xs">{"★".repeat(Math.floor(product.rating))}{"☆".repeat(5 - Math.floor(product.rating))}</span>
          <span className="text-gray-400 text-xs">{product.rating}</span>
        </div>
        <p className="text-xs text-gray-400 mt-0.5">({product.reviews.toLocaleString()} reviews)</p>
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <span className="text-base font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
          <span className="text-xs text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
          <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded">{discount}% off</span>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
          className="w-full mt-3 py-2 bg-gradient-to-r from-violet-600 to-purple-500 text-white text-xs font-semibold rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:shadow-lg hover:shadow-purple-200"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const [user, setUser]                 = useState({});
  const [search, setSearch]             = useState("");
  const [currentBanner, setCurrent]     = useState(0);
  const [showMenu, setShowMenu]         = useState(false);
  const [activeTab, setActiveTab]       = useState("All");
  const [activeBrand, setActiveBrand]   = useState(null);
  const [modalProduct, setModalProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loadingBanners, setLoadingBanners] = useState(false);


  useEffect(() => {
    const loadData = async () => {
      try {
        const stored = sessionStorage.getItem("user");
        if (!stored) { navigate("/"); return; }
        setUser(JSON.parse(stored));

        const { data } = await API.get("/products");
        setProducts(data);

        setLoadingBanners(true);
        try {
          const bannersData = await bannerApiFetch("/active");
          setBanners(bannersData);
        } catch (err) {
          console.error("Failed to fetch banners:", err);
          setBanners([]); // Fallback to empty array
        } finally {
          setLoadingBanners(false);
        }

      } catch (err) {
        console.error(err);
      }
    };

    loadData();
  }, [navigate]);

  // Update banner rotation effect
  useEffect(() => {
    if (banners.length > 0) {
      const t = setInterval(() => {
        setCurrent((c) => (c + 1) % banners.length);
      }, 5000);
      return () => clearInterval(t);
    }
  }, [banners]);


  const handleLogout = () => { sessionStorage.removeItem("user"); navigate("/"); };

  // Brand click handler — filters products if brand exists in data, else shows toast
  const handleBrandClick = (brandName) => {
    const match = products.find(
      (p) => p.brand?.toLowerCase() === brandName.toLowerCase()
    );
    if (match) {
      setActiveBrand(brandName);
      setActiveTab("All");
      setSearch("");
    } else {
      // Brand not in product data — just visually select it
      setActiveBrand(brandName);
    }
  };

  const filtered = products.filter((p) => {
    const matchTab    = activeTab === "All" || p.category === activeTab;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchBrand  = !activeBrand || p.brand?.toLowerCase() === activeBrand.toLowerCase();
    return matchTab && matchSearch && matchBrand;
  });

  const banner = banners[currentBanner];
  const HeroBanner = ({ banner }) => {
    if (!banner) return null;
    
    return (
      <div className={`relative rounded-2xl overflow-hidden mb-8 h-72 bg-gradient-to-r ${banner.colorFrom || 'from-purple-900'} ${banner.colorVia || 'via-violet-800'} ${banner.colorTo || 'to-purple-600'} shadow-xl flex`}>
        <div className="relative z-10 flex flex-col justify-center px-12 w-1/2 flex-shrink-0">
          <p className="text-xs tracking-widest text-white/60 uppercase mb-2">✦ Lyra Exclusive</p>
          <h1 className="font-serif text-4xl font-light text-white leading-tight mb-2">{banner.title}</h1>
          <p className="text-white/70 text-sm mb-6">{banner.subtitle}</p>
          <button 
            onClick={() => banner.link && navigate(banner.link)}
            className="w-fit px-7 py-3 bg-white text-[#1e0a3c] text-sm font-semibold rounded-xl hover:bg-violet-100 transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            {banner.ctaText || "Shop Now"} →
          </button>
          <div className="flex gap-2 mt-6">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
                className={`h-1 rounded-full transition-all ${i === currentBanner ? "w-8 bg-white" : "w-5 bg-white/40"}`}
              />
            ))}
          </div>
        </div>
        <div className="w-1/2 flex-shrink-0 relative overflow-hidden">
          <img
            src={banner.image}
            alt={banner.title}
            className="absolute inset-0 w-full h-full object-cover object-center"
            style={{ 
              maskImage: "linear-gradient(to right, transparent 0%, black 30%)", 
              WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 30%)" 
            }}
            onError={(e) => { 
              e.target.style.display = "none"; 
              e.target.parentElement.classList.add("bg-gradient-to-r", "from-purple-900", "to-pink-600");
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* ── NAVBAR ── */}
      <nav className="sticky top-0 z-50 bg-[#1e0a3c] shadow-lg shadow-purple-900/30">
        <div className="flex items-center gap-4 px-6 h-16">
          <div
            className="font-serif text-2xl tracking-widest text-purple-200 cursor-pointer flex-shrink-0 select-none"
            onClick={() => { navigate("/dashboard"); setActiveBrand(null); }}
          >
            LY<span className="text-pink-400">R</span>A
          </div>

          <div className="flex-1 max-w-xl relative">
            <input
              className="w-full bg-white/10 text-white placeholder-white/40 rounded-xl px-4 py-2.5 pr-10 text-sm outline-none focus:bg-white focus:text-gray-900 focus:placeholder-gray-400 transition-all duration-200 border border-transparent focus:border-violet-400"
              placeholder="Search clothes, shoes, watches..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setActiveBrand(null); }}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 text-sm">🔍</span>
          </div>

          <div className="flex items-center gap-1 ml-auto">
            <button
              onClick={() => navigate("/wishlist")}
              className="flex flex-col items-center px-3 py-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all text-xs gap-0.5 relative"
            >
              <span className="text-lg">{wishlistCount > 0 ? "♥" : "♡"}</span>
              <span className="tracking-wide">Wishlist</span>
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">{wishlistCount}</span>
              )}
            </button>

            <button
              className="flex flex-col items-center px-3 py-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all text-xs gap-0.5 relative"
              onClick={() => navigate("/cart")}
            >
              <span className="text-lg">🛒</span>
              <span className="tracking-wide">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">{cartCount}</span>
              )}
            </button>

            <div className="relative">
              <button
                onClick={() => setShowMenu((v) => !v)}
                className="flex flex-col items-center px-3 py-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all text-xs gap-0.5"
              >
                <span className="text-lg">👤</span>
                <span className="tracking-wide">{user.fullName?.split(" ")[0] || "Account"}</span>
              </button>

              {showMenu && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl shadow-purple-100 border border-purple-50 overflow-hidden z-50">
                  <div className="bg-gradient-to-r from-[#1e0a3c] to-violet-700 px-4 py-3">
                    <p className="text-white font-semibold text-sm">{user.fullName || "Guest"}</p>
                    <p className="text-purple-300 text-xs mt-0.5">{user.email || ""}</p>
                  </div>
                  {[
                    { label: "📦 My Orders",  tab: "orders" },
                    { label: "👤 My Profile", tab: "profile" },
                    { label: "♡ Wishlist",    tab: "wishlist" },
                    { label: "📍 Addresses",  tab: "addresses" },
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={() => { setShowMenu(false); navigate(`/profile?tab=${item.tab}`); }}
                      className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-purple-50 hover:text-violet-700 transition-colors"
                    >
                      {item.label}
                    </button>
                  ))}
                  <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors border-t border-gray-100">
                    🚪 Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Category tab bar */}
        <div className="flex overflow-x-auto bg-white border-b border-purple-100 scrollbar-hide">
          <button
            onClick={() => { setActiveTab("All"); setActiveBrand(null); }}
            className={`flex flex-col items-center px-5 py-2.5 text-xs font-medium flex-shrink-0 border-b-2 transition-all gap-1 ${activeTab === "All" && !activeBrand ? "border-violet-600 text-violet-700" : "border-transparent text-gray-500 hover:text-violet-600 hover:bg-violet-50"}`}
          >
            <span className="text-xl">🏪</span>
            <span className="tracking-wide uppercase text-xs">All</span>
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => navigate(`/category/${encodeURIComponent(cat.name)}`)}
              className={`flex flex-col items-center px-5 py-2.5 text-xs font-medium flex-shrink-0 border-b-2 transition-all gap-1 ${activeTab === cat.name ? "border-violet-600 text-violet-700" : "border-transparent text-gray-500 hover:text-violet-600 hover:bg-violet-50"}`}
            >
              <span className="text-xl">{cat.icon}</span>
              <span className="tracking-wide uppercase text-xs whitespace-nowrap">{cat.name}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* ── BODY ── */}
      <div className="max-w-screen-xl mx-auto px-4 py-6" onClick={() => setShowMenu(false)}>

        {/* Hero Banner - conditionally render based on loading state */}
        {loadingBanners ? (
          <div className="relative rounded-2xl overflow-hidden mb-8 h-72 bg-gradient-to-r from-purple-100 to-purple-200 animate-pulse flex items-center justify-center">
            <p className="text-purple-400">Loading banners...</p>
          </div>
        ) : banners.length > 0 ? (
          <HeroBanner banner={banners[currentBanner]} />
        ) : (
          <div className="relative rounded-2xl overflow-hidden mb-8 h-72 bg-gradient-to-r from-purple-900 to-pink-600 flex items-center justify-center">
            <p className="text-white">No banners available</p>
          </div>
        )}

        {/* Category Cards */}
        <div className="mb-2 flex items-center justify-between">
          <h2 className="font-serif text-2xl text-gray-900">Shop by <span className="text-violet-600">Category</span></h2>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3 mb-8">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              onClick={() => navigate(`/category/${encodeURIComponent(cat.name)}`)}
              className={`${cat.bg} rounded-2xl p-4 flex flex-col items-center cursor-pointer border-2 border-transparent hover:border-violet-300 hover:-translate-y-1 hover:shadow-md transition-all duration-200`}
            >
              <span className="text-3xl mb-2">{cat.icon}</span>
              <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide text-center">{cat.name}</span>
            </div>
          ))}
        </div>

        {/* Offer Banners */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { icon: "🚚", title: "Free Delivery",   sub: "On orders above ₹999",      from: "from-violet-700", to: "to-purple-600" },
            { icon: "↩",  title: "Easy Returns",    sub: "30-day hassle-free returns", from: "from-teal-600",   to: "to-cyan-500" },
            { icon: "🔒", title: "Secure Payments", sub: "100% safe & encrypted",      from: "from-amber-600",  to: "to-orange-500" },
          ].map((o) => (
            <div key={o.title} className={`bg-gradient-to-r ${o.from} ${o.to} rounded-2xl p-5 flex items-center gap-4 cursor-pointer hover:-translate-y-1 transition-all shadow-md`}>
              <span className="text-3xl">{o.icon}</span>
              <div>
                <p className="text-white font-semibold text-sm">{o.title}</p>
                <p className="text-white/70 text-xs mt-0.5">{o.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Flash Sale Bar */}
        <div className="bg-gradient-to-r from-[#1e0a3c] to-violet-800 rounded-2xl px-6 py-4 mb-6 flex items-center gap-4">
          <h3 className="font-serif text-xl text-white">Flash Sale</h3>
          <span className="bg-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full tracking-widest animate-pulse">⚡ LIVE</span>
          <div className="ml-auto flex items-center gap-2">
            {[["04", "HRS"], ["23", "MIN"], ["59", "SEC"]].map(([n, l], i) => (
              <React.Fragment key={l}>
                {i > 0 && <span className="text-white/40 font-bold">:</span>}
                <div className="bg-white/10 rounded-lg px-3 py-1.5 text-center min-w-12">
                  <span className="text-white font-bold text-lg block font-serif">{n}</span>
                  <span className="text-white/40 text-xs uppercase tracking-widest">{l}</span>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* ── BRAND LOGO SCROLLBAR ── */}
        <BrandScrollBar onBrandClick={handleBrandClick} />

        {/* Active brand filter pill */}
        {activeBrand && (
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-gray-500">Filtering by:</span>
            <span className="bg-violet-100 text-violet-700 text-sm font-semibold px-4 py-1 rounded-full flex items-center gap-2">
              {activeBrand}
              <button
                onClick={() => setActiveBrand(null)}
                className="ml-1 text-violet-400 hover:text-violet-700 font-bold text-base leading-none"
              >
                ×
              </button>
            </span>
          </div>
        )}

        {/* Products Section */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-2xl text-gray-900">
            {activeBrand
              ? <>{activeBrand} <span className="text-violet-600">Collection</span></>
              : activeTab === "All"
                ? <>New <span className="text-violet-600">Arrivals</span></>
                : <>{activeTab} <span className="text-violet-600">Collection</span></>
            }
          </h2>
          <button className="text-sm text-violet-600 font-medium hover:underline">View All →</button>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filtered.map((p) => (
              <ProductCard key={p._id} product={p} onAddToCart={setModalProduct} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-purple-100">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-gray-500 text-sm">
              {activeBrand
                ? `No products found for "${activeBrand}" brand`
                : `No products found for "${search}"`
              }
            </p>
            {activeBrand && (
              <button
                onClick={() => setActiveBrand(null)}
                className="mt-4 text-sm text-violet-600 font-medium hover:underline"
              >
                Clear brand filter
              </button>
            )}
          </div>
        )}
      </div>

      <LyraFooter />

      {/* Add to Cart Modal */}
      {modalProduct && (
        <AddToCartModal product={modalProduct} onClose={() => setModalProduct(null)} />
      )}
    </div>
  );
};

export default Dashboard;