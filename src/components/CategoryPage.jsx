import React, { useState, useMemo, useEffect, useCallback, useRef, memo } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useCart }     from "./CartContext";
import { useWishlist } from "./WishlistContext";
import AddToCartModal  from "./AddToCartModal";
import axios from "axios";

const PRODUCT_API = axios.create({ baseURL: "http://localhost:6055/api/admin/products" });
const CAT_API     = axios.create({ baseURL: "http://localhost:6055/api" });

const COLOR_MAP = {
  Black:"#111827",White:"#f9fafb",Navy:"#1e3a5f",Grey:"#9ca3af",Blue:"#3b82f6",
  Red:"#ef4444",Brown:"#92400e",Beige:"#d6c5a3",Gold:"#f59e0b",Silver:"#9ca3af",
  Pink:"#ec4899",Green:"#22c55e",Olive:"#65a30d",Nude:"#e8c9a4",Khaki:"#a3885a",
  Tan:"#c5956a",Cream:"#f5f0e8",Natural:"#d4c5a9","Rose Gold":"#d4a0a0",
  Tortoise:"#8b5e3c",Floral:"#f9a8d4",Yellow:"#fbbf24",Purple:"#7c3aed",Orange:"#f97316",Maroon:"#881337",
};

const SORT_OPTIONS = [
  { value:"popular",    label:"Popular"   },
  { value:"newest",     label:"Newest"    },
  { value:"price_asc",  label:"Price ↑"  },
  { value:"price_desc", label:"Price ↓"  },
  { value:"rating",     label:"Top Rated" },
  { value:"discount",   label:"Best Deal" },
];

const SkeletonCard = () => (
  <div className="cat-card animate-pulse">
    <div className="aspect-[3/4] bg-gray-100 rounded-2xl mb-3" />
    <div className="space-y-2">
      <div className="h-2.5 bg-gray-100 rounded w-1/3" />
      <div className="h-4 bg-gray-100 rounded w-4/5" />
      <div className="h-3 bg-gray-100 rounded w-1/2" />
    </div>
  </div>
);

const Stars = memo(({ rating }) => (
  <div className="flex items-center gap-1">
    {Array.from({ length:5 }).map((_,i) => <span key={i} className={`text-xs ${i<Math.floor(rating||0)?"text-amber-400":"text-gray-200"}`}>★</span>)}
    <span className="text-gray-400 text-xs ml-0.5">{(rating||0).toFixed(1)}</span>
  </div>
));

const FilterBlock = memo(({ title, children, open:defaultOpen=true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button onClick={()=>setOpen(v=>!v)} className="w-full flex items-center justify-between py-4 text-xs font-bold tracking-[0.15em] uppercase text-gray-400 hover:text-violet-600 transition-colors">
        {title}<span className={`transition-transform duration-200 text-gray-300 ${open?"rotate-180":""}`} style={{fontSize:"10px"}}>▾</span>
      </button>
      {open && <div className="pb-4">{children}</div>}
    </div>
  );
});

const GridCard = memo(({ p, onAddToCart }) => {
  const navigate = useNavigate();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(p._id);
  const disc = p.originalPrice > p.price ? Math.round(((p.originalPrice-p.price)/p.originalPrice)*100) : 0;
  return (
    <div onClick={()=>navigate(`/product/${p._id}`)} className="cat-card group cursor-pointer">
      <div className="relative overflow-hidden rounded-2xl bg-gray-50 aspect-[3/4] mb-3">
        <img src={p.image||p.images?.[0]} alt={p.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          onError={(e)=>{e.target.src="https://placehold.co/300x400/f9f9f9/d1d5db?text=Lyra";}} />
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {p.badge && <span className="cat-badge-hot">{p.badge}</span>}
          {disc >= 30 && !p.badge && <span className="cat-badge-sale">{disc}% OFF</span>}
        </div>
        <button onClick={(e)=>{e.stopPropagation();toggleWishlist(p);}}
          className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
          style={{color:wishlisted?"#ef4444":"#9ca3af"}}>
          {wishlisted?"♥":"♡"}
        </button>
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button onClick={(e)=>{e.stopPropagation();onAddToCart(p);}} className="cat-atc-btn">ADD TO CART</button>
        </div>
      </div>
      <div>
        <p className="text-xs text-violet-500 font-semibold tracking-widest uppercase mb-0.5">{p.brand}</p>
        <p className="text-sm font-medium text-gray-900 leading-tight truncate mb-1.5">{p.name}</p>
        <Stars rating={p.rating} />
        <div className="flex items-baseline gap-2 mt-1.5 flex-wrap">
          <span className="font-bold text-gray-900">₹{(p.price||0).toLocaleString()}</span>
          {p.originalPrice>p.price && <span className="text-xs text-gray-400 line-through">₹{p.originalPrice.toLocaleString()}</span>}
          {disc>0&&disc<30&&<span className="text-xs text-emerald-600 font-semibold">{disc}% off</span>}
        </div>
      </div>
    </div>
  );
});

const ListCard = memo(({ p, onAddToCart }) => {
  const navigate = useNavigate();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(p._id);
  const disc = p.originalPrice > p.price ? Math.round(((p.originalPrice-p.price)/p.originalPrice)*100) : 0;
  return (
    <div onClick={()=>navigate(`/product/${p._id}`)}
      className="bg-white rounded-2xl border border-gray-100 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-50 transition-all flex overflow-hidden cursor-pointer group">
      <div className="w-36 sm:w-48 flex-shrink-0 bg-gray-50 overflow-hidden">
        <img src={p.image||p.images?.[0]} alt={p.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e)=>{e.target.src="https://placehold.co/200x250/f9f9f9/d1d5db?text=Lyra";}} />
      </div>
      <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between min-w-0">
        <div>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-violet-500 font-semibold tracking-widest uppercase mb-1">{p.brand}</p>
              <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{p.name}</p>
              {p.subCategory && <p className="text-xs text-gray-400 mt-0.5">{[p.category,p.subCategory,p.subCategoryItem].filter(Boolean).join(" › ")}</p>}
              {p.description && <p className="text-xs text-gray-400 mt-1.5 line-clamp-2 leading-relaxed hidden sm:block">{p.description}</p>}
            </div>
            {p.badge && <span className="cat-badge-hot flex-shrink-0">{p.badge}</span>}
          </div>
          <div className="mt-3 flex items-center gap-2"><Stars rating={p.rating} /><span className="text-xs text-gray-300">({(p.reviews||0).toLocaleString()})</span></div>
          <div className="flex flex-wrap gap-1 mt-2">{(p.sizes||[]).slice(0,5).map((s)=><span key={s} className="text-xs border border-gray-200 text-gray-500 px-2 py-0.5 rounded-lg">{s}</span>)}</div>
        </div>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50 gap-2">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-lg sm:text-xl font-bold text-gray-900">₹{(p.price||0).toLocaleString()}</span>
            {p.originalPrice>p.price && <span className="text-sm text-gray-400 line-through">₹{p.originalPrice.toLocaleString()}</span>}
            {disc>0 && <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{disc}% off</span>}
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button onClick={(e)=>{e.stopPropagation();toggleWishlist(p);}} className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center hover:border-pink-300 transition-colors" style={{color:wishlisted?"#ef4444":"#d1d5db"}}>{wishlisted?"♥":"♡"}</button>
            <button onClick={(e)=>{e.stopPropagation();onAddToCart(p);}} className="cat-atc-btn-sm">Add</button>
          </div>
        </div>
      </div>
    </div>
  );
});

// ══════════════════════════════════════════════════════════════════════════════
// CATEGORY PAGE
// ══════════════════════════════════════════════════════════════════════════════
const CategoryPage = () => {
  const { categoryName }  = useParams();
  const [searchParams]    = useSearchParams();
  const navigate          = useNavigate();
  const navigateRef       = useRef(navigate);
  useEffect(() => { navigateRef.current = navigate; }, [navigate]);

  const { cartCount }                    = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const [activeCategory, setActiveCategory] = useState(() => decodeURIComponent(categoryName || "All"));
  const [activeSubCat,   setActiveSubCat]   = useState(() => searchParams.get("sub") || "");

  useEffect(() => {
    setActiveCategory(decodeURIComponent(categoryName || "All"));
    setActiveSubCat(searchParams.get("sub") || "");
  }, [categoryName, searchParams]);

  const [dbCategories,  setDbCategories]  = useState([]);
  const [allProducts,   setAllProducts]   = useState([]);
  const [loading,       setLoading]       = useState(true);

  useEffect(() => {
    CAT_API.get("/categories").then(({ data }) => setDbCategories(data.categories || [])).catch(() => {});
  }, []);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try { const { data } = await PRODUCT_API.get(""); if (!cancelled) setAllProducts(Array.isArray(data) ? data : data.products || []); }
      catch (e) { console.error(e.message); }
      finally { if (!cancelled) setLoading(false); }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const sidebarCats = useMemo(() => [
    { _id:"all", name:"All", label:"Everything", icon:"✦", color:"#7c3aed", slug:"All", columns:[] },
    ...dbCategories,
  ], [dbCategories]);

  const activeCatObj  = sidebarCats.find((c) => c.name === activeCategory || c.slug === activeCategory) || sidebarCats[0];
  const subCatOptions = activeCatObj?.columns || [];

  const [search,       setSearch]       = useState("");
  const [sort,         setSort]         = useState("popular");
  const [maxPrice,     setMaxPrice]     = useState(20000);
  const [minRating,    setMinRating]    = useState(0);
  const [selBrands,    setSelBrands]    = useState([]);
  const [selGenders,   setSelGenders]   = useState([]);
  const [selColors,    setSelColors]    = useState([]);
  const [selSizes,     setSelSizes]     = useState([]);
  const [onlyDiscount, setOnlyDiscount] = useState(false);
  const [onlyInStock,  setOnlyInStock]  = useState(false);
  const [viewMode,     setViewMode]     = useState("grid");
  const [modalProduct, setModalProduct] = useState(null);
  const [filtersOpen,  setFiltersOpen]  = useState(true);



  const categoryProducts = useMemo(() => {
    if (activeCategory === "All") return allProducts;
    return allProducts.filter((p) => p.category === activeCategory || p.primaryCategory === activeCategory || p.category === activeCatObj?.name || p.primaryCategory === activeCatObj?.name);
  }, [allProducts, activeCategory, activeCatObj]);

  const subFilteredProducts = useMemo(() => {
    if (!activeSubCat) return categoryProducts;
    return categoryProducts.filter((p) => p.subCategory === activeSubCat || p.subCategoryItem === activeSubCat);
  }, [categoryProducts, activeSubCat]);

  const availableBrands  = useMemo(() => [...new Set(subFilteredProducts.map((p)=>p.brand).filter(Boolean))].sort(), [subFilteredProducts]);
  const availableGenders = useMemo(() => [...new Set(subFilteredProducts.map((p)=>p.gender).filter(Boolean))], [subFilteredProducts]);
  const availableColors  = useMemo(() => [...new Set(subFilteredProducts.flatMap((p)=>Array.isArray(p.colors)?p.colors:[]).filter(Boolean))], [subFilteredProducts]);
  const availableSizes   = useMemo(() => [...new Set(subFilteredProducts.flatMap((p)=>Array.isArray(p.sizes)?p.sizes:[]).filter(Boolean))], [subFilteredProducts]);
  const maxProductPrice  = useMemo(() => Math.max(20000, ...subFilteredProducts.map((p)=>p.price||0)), [subFilteredProducts]);

  useEffect(() => {
    setSearch(""); setMaxPrice(20000); setMinRating(0);
    setSelBrands([]); setSelGenders([]); setSelColors([]); setSelSizes([]);
    setOnlyDiscount(false); setOnlyInStock(false); setSort("popular");
  }, [activeCategory, activeSubCat]);

  const filtered = useMemo(() => {
    let r = subFilteredProducts.filter((p) => {
      if (search) { const q=search.toLowerCase(); if (!p.name?.toLowerCase().includes(q)&&!p.brand?.toLowerCase().includes(q)) return false; }
      if (p.price > maxPrice) return false;
      if (minRating > 0 && (p.rating||0) < minRating) return false;
      if (selBrands.length  && !selBrands.includes(p.brand)) return false;
      if (selGenders.length && !selGenders.includes(p.gender)) return false;
      if (selColors.length  && !p.colors?.some((c)=>selColors.includes(c))) return false;
      if (selSizes.length   && !p.sizes?.some((s)=>selSizes.includes(s))) return false;
      if (onlyDiscount && !(p.originalPrice > p.price)) return false;
      if (onlyInStock  && p.stock === 0) return false;
      return true;
    });
    switch (sort) {
      case "price_asc":  r.sort((a,b)=>a.price-b.price); break;
      case "price_desc": r.sort((a,b)=>b.price-a.price); break;
      case "rating":     r.sort((a,b)=>(b.rating||0)-(a.rating||0)); break;
      case "discount":   r.sort((a,b)=>{ const da=a.originalPrice>0?(a.originalPrice-a.price)/a.originalPrice:0; const db=b.originalPrice>0?(b.originalPrice-b.price)/b.originalPrice:0; return db-da; }); break;
      case "newest":     r.sort((a,b)=>b._id>a._id?1:-1); break;
      default:           r.sort((a,b)=>(b.reviews||0)-(a.reviews||0));
    }
    return r;
  }, [subFilteredProducts, search, maxPrice, minRating, selBrands, selGenders, selColors, selSizes, onlyDiscount, onlyInStock, sort]);

  const toggle       = useCallback((setArr, val) => setArr((prev) => prev.includes(val) ? prev.filter((v)=>v!==val) : [...prev, val]), []);
  const clearFilters = useCallback(() => { setSearch(""); setMaxPrice(20000); setMinRating(0); setSelBrands([]); setSelGenders([]); setSelColors([]); setSelSizes([]); setOnlyDiscount(false); setOnlyInStock(false); setSort("popular"); }, []);

  const handleCategory = useCallback((cat) => { setActiveCategory(cat.name); navigateRef.current(`/category/${encodeURIComponent(cat.slug||cat.name)}`, { replace:true }); }, []);
  const handleSubCat   = useCallback((sub) => {
    const next = activeSubCat === sub ? "" : sub;
    setActiveSubCat(next);
    const slug = encodeURIComponent(activeCategory);
    navigateRef.current(next ? `/category/${slug}?sub=${encodeURIComponent(next)}` : `/category/${slug}`, { replace:true });
  }, [activeCategory, activeSubCat]);

  const activeCount = selBrands.length+selGenders.length+selColors.length+selSizes.length+(maxPrice<maxProductPrice?1:0)+(minRating>0?1:0)+(onlyDiscount?1:0)+(onlyInStock?1:0);

  return (
    <div className="min-h-screen" style={{ background:"#f9f9fb", fontFamily:"'DM Sans',system-ui,sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        .cat-serif { font-family:'Cormorant Garamond',Georgia,serif !important; }

        /* ── Topbar ── */
        .cat-topbar{
          position:sticky;top:0;z-index:50;
          background:linear-gradient(to right,#0f0820,#1e0a3c);
          border-bottom:1px solid rgba(255,255,255,0.06);
          box-shadow:0 4px 30px rgba(15,5,30,0.4);
        }

        /* ── Cards ── */
        .cat-card{transition:transform 0.25s;}
        .cat-badge-hot{background:linear-gradient(135deg,#7c3aed,#ec4899);color:white;font-size:10px;font-weight:700;padding:4px 10px;border-radius:20px;text-transform:uppercase;letter-spacing:0.05em;display:inline-block;}
        .cat-badge-sale{background:#10b981;color:white;font-size:10px;font-weight:700;padding:4px 10px;border-radius:20px;display:inline-block;}
        .cat-atc-btn{width:100%;padding:10px;background:linear-gradient(135deg,#1e0a3c,#7c3aed);color:white;font-size:11px;font-weight:700;border-radius:14px;border:none;cursor:pointer;letter-spacing:0.06em;transition:all 0.2s;}
        .cat-atc-btn:hover{background:linear-gradient(135deg,#2d1060,#a855f7);}
        .cat-atc-btn-sm{padding:8px 16px;border-radius:12px;font-size:12px;font-weight:700;letter-spacing:0.05em;background:linear-gradient(135deg,#1e0a3c,#7c3aed);color:white;border:none;cursor:pointer;text-transform:uppercase;transition:all 0.2s;}
        .cat-atc-btn-sm:hover{background:linear-gradient(135deg,#2d1060,#a855f7);}

        /* ── Filter range ── */
        .filter-range{appearance:none;width:100%;height:3px;outline:none;cursor:pointer;border-radius:3px;background:#ede9fe;}
        .filter-range::-webkit-slider-thumb{-webkit-appearance:none;width:18px;height:18px;background:linear-gradient(135deg,#7c3aed,#a855f7);border-radius:50%;cursor:pointer;box-shadow:0 2px 8px rgba(124,58,237,0.35);}

        /* ── Sidebar category pills ── */
        .cat-sidebar-item{width:100%;display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:14px;font-size:13px;font-weight:500;transition:all 0.2s;text-align:left;border:none;cursor:pointer;}
        .cat-sidebar-item.active{color:white;box-shadow:0 4px 16px rgba(124,58,237,0.25);}
        .cat-sidebar-item:not(.active){background:transparent;color:#4b5563;}
        .cat-sidebar-item:not(.active):hover{background:#faf5ff;color:#7c3aed;}

        /* ── Toggle ── */
        .lyra-toggle{width:40px;height:20px;border-radius:10px;position:relative;cursor:pointer;transition:background 0.25s;border:none;}
        .lyra-toggle-knob{position:absolute;top:2px;width:16px;height:16px;border-radius:50%;background:white;transition:left 0.25s;box-shadow:0 1px 4px rgba(0,0,0,0.15);}

        /* ── Fade in ── */
        @keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        .cat-fade{animation:fadeIn 0.35s ease forwards;}

        /* ── Grid ── */
        .cat-grid{display:grid;gap:20px;}
        .cat-grid.g4{grid-template-columns:repeat(4,1fr);}
        @media(max-width:1280px){.cat-grid.g4{grid-template-columns:repeat(3,1fr)}}
        @media(max-width:768px){.cat-grid.g4{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:480px){.cat-grid.g4{grid-template-columns:1fr; gap:14px}}

        /* ── Sort select ── */
        .cat-sort{background:white;border:1px solid #e9d5ff;color:#4b5563;font-size:12px;font-weight:500;border-radius:12px;padding:8px 12px;outline:none;cursor:pointer;transition:border-color 0.2s;}
        .cat-sort:hover,.cat-sort:focus{border-color:#a855f7;}

        /* ── View toggle ── */
        .cat-view-btn{width:36px;height:36px;display:flex;align-items:center;justify-content:center;font-size:14px;transition:all 0.2s;cursor:pointer;border:none;}
        .cat-view-btn.active{background:linear-gradient(135deg,#1e0a3c,#7c3aed);color:white;}
        .cat-view-btn:not(.active){background:white;color:#9ca3af;}
        .cat-view-btn:not(.active):hover{color:#7c3aed;}

        /* ── Filter chip ── */
        .cat-chip{display:inline-flex;align-items:center;gap:6px;background:#f5f3ff;border:1px solid #ddd6fe;color:#6d28d9;font-size:11px;font-weight:600;padding:5px 12px;border-radius:20px;}
        .cat-chip button{color:#a78bfa;font-weight:700;background:none;border:none;cursor:pointer;font-size:12px;}
        .cat-chip button:hover{color:#ef4444;}

        .scrollbar-thin::-webkit-scrollbar{width:3px;}
        .scrollbar-thin::-webkit-scrollbar-track{background:transparent;}
        .scrollbar-thin::-webkit-scrollbar-thumb{background:#ddd6fe;border-radius:3px;}
      `}</style>

      {/* ─── TOPBAR ─── */}
      <div className="cat-topbar">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-3 sm:gap-4">
          <button onClick={()=>navigate("/dashboard")}
            className="flex items-center gap-2 text-white/60 hover:text-white text-xs font-semibold tracking-wider uppercase transition-colors px-3 py-1.5 rounded-xl hover:bg-white/8">
            ← Home
          </button>
          <div className="flex items-center gap-2 text-xs text-white/30 hidden sm:flex">
            <span className="hover:text-white/60 cursor-pointer" onClick={()=>navigate("/dashboard")}>Lyra</span>
            <span>/</span>
            <span className="hover:text-white/60 cursor-pointer" onClick={()=>handleCategory(sidebarCats[0])}>Shop</span>
            {activeCategory !== "All" && <><span>/</span><span className="text-white/70 font-semibold">{activeCategory}</span></>}
            {activeSubCat && <><span>/</span><span className="text-white/50">{activeSubCat}</span></>}
          </div>
          <div className="flex-1 max-w-md mx-auto relative">
            <input
              className="w-full bg-white/8 border border-white/10 text-white placeholder-white/25 rounded-xl px-4 py-2 pr-9 text-xs outline-none focus:bg-white focus:text-gray-900 focus:placeholder-gray-400 focus:border-violet-400 transition-all duration-300"
              placeholder={`Search ${activeCategory === "All" ? "all products" : activeCategory.toLowerCase()}...`}
              value={search} onChange={(e)=>setSearch(e.target.value)} />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 text-sm pointer-events-none">⌕</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button onClick={()=>setFiltersOpen(v=>!v)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all ${filtersOpen?"bg-violet-600 text-white":"bg-white/8 text-white/50 hover:text-white"}`}>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M7 12h10M11 20h2"/></svg>
              Filters {activeCount>0 && <span className="bg-pink-500 text-white rounded-full px-1.5" style={{fontSize:"9px"}}>{activeCount}</span>}
            </button>
            <button onClick={()=>navigate("/cart")} className="relative w-9 h-9 rounded-xl bg-white/8 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/15 transition-all">
              🛒
              {cartCount>0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 rounded-full text-white flex items-center justify-center font-bold" style={{fontSize:"8px"}}>{cartCount}</span>}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-6 sm:py-8 flex flex-col lg:flex-row gap-6 items-start">


        {/* ─── MOBILE FILTER DRAWER ─── */}
        {filtersOpen && (
          <div className="fixed inset-0 z-[100] lg:hidden">
            {/* Overlay */}
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setFiltersOpen(false)}
            />

            {/* Drawer */}
            <div className="absolute left-0 top-0 h-full w-[85%] max-w-sm bg-white overflow-y-auto shadow-xl p-4">
              
              {/* Close button */}
              <div className="flex justify-between items-center mb-4">
                <p className="font-bold text-gray-800">Filters</p>
                <button onClick={() => setFiltersOpen(false)}>✕</button>
              </div>

              {/* 👉 MOVE YOUR SIDEBAR CONTENT HERE */}
              
              {/* Categories */}
              <div className="mb-4">
                {sidebarCats.map((cat) => (
                  <button
                    key={cat._id}
                    onClick={() => {
                      handleCategory(cat);
                      setFiltersOpen(false);
                    }}
                    className="block w-full text-left py-2 text-sm"
                  >
                    {cat.label || cat.name}
                  </button>
                ))}
              </div>

              {/* Filters */}
              <div>
                {/* reuse FilterBlock */}
                <FilterBlock title="Price">
                  <input
                    type="range"
                    min={0}
                    max={maxProductPrice}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="filter-range"
                  />
                </FilterBlock>
              </div>
            </div>
          </div>
        )}

        {/* ─── SIDEBAR ─── */}
        {filtersOpen && (
          <aside className="hidden lg:block w-60 flex-shrink-0 sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto space-y-4 scrollbar-thin">

            {/* Categories */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              <div className="px-5 pt-5 pb-3">
                <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-violet-400 mb-4">Categories</p>
                <div className="space-y-1">
                  {sidebarCats.map((cat) => {
                    const isActive = activeCategory===cat.name||activeCategory===cat.slug;
                    return (
                      <button key={cat._id} onClick={()=>handleCategory(cat)}
                        className={`cat-sidebar-item ${isActive?"active":""}`}
                        style={isActive ? { background: cat.color||"#7c3aed" } : {}}>
                        <span className="text-base flex-shrink-0">{cat.icon}</span>
                        <span className="flex-1 truncate">{cat.label||cat.name}</span>
                        {isActive && <span style={{color:"rgba(255,255,255,0.5)",fontSize:"11px"}}>{categoryProducts.length}</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Sub-categories */}
            {subCatOptions.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                <div className="px-5 pt-5 pb-3">
                  <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-violet-400 mb-4">Browse {activeCatObj?.label||activeCatObj?.name}</p>
                  {subCatOptions.map((col) => (
                    <div key={col._id} className="mb-3">
                      <button onClick={()=>handleSubCat(col.title)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeSubCat===col.title?"bg-violet-100 text-violet-700":"text-gray-400 hover:text-gray-800 hover:bg-gray-50"}`}>
                        {col.title}
                        <svg className={`w-3 h-3 transition-transform ${activeSubCat===col.title?"rotate-180":""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
                      </button>
                      {activeSubCat === col.title && (
                        <div className="ml-3 mt-1.5 space-y-1">
                          {(col.subCategories||[]).map((sub) => (
                            <button key={sub._id} onClick={()=>handleSubCat(sub.name)}
                              className="w-full text-left text-xs text-gray-500 hover:text-violet-600 px-3 py-1 rounded-lg hover:bg-violet-50 transition-all">
                              {sub.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Filters */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
                <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-violet-400">
                  Filters {activeCount>0&&<span className="ml-2 bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full text-[10px]">{activeCount}</span>}
                </p>
                {activeCount>0 && <button onClick={clearFilters} className="text-xs text-red-400 hover:text-red-600 font-semibold">Clear</button>}
              </div>
              <div className="px-5">
                <FilterBlock title="Price Range">
                  <div className="flex justify-between text-xs text-gray-500 mb-3"><span>₹0</span><span className="font-bold text-violet-600">₹{maxPrice.toLocaleString()}</span></div>
                  <input type="range" className="filter-range" min={0} max={maxProductPrice} step={500} value={maxPrice} onChange={(e)=>setMaxPrice(Number(e.target.value))} />
                  <div className="flex gap-1.5 mt-3 flex-wrap">
                    {[1000,3000,5000,10000].map((v) => (
                      <button key={v} onClick={()=>setMaxPrice(v)} className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${maxPrice===v?"bg-violet-600 text-white border-violet-600":"border-violet-100 text-gray-500 hover:border-violet-400"}`}>
                        ₹{v>=1000?`${v/1000}K`:v}
                      </button>
                    ))}
                  </div>
                </FilterBlock>

                <FilterBlock title="Rating">
                  <div className="space-y-2">
                    {[4,3,2].map((r)=>(
                      <label key={r} className="flex items-center gap-2.5 cursor-pointer group">
                        <input type="radio" name="rating" checked={minRating===r} onChange={()=>setMinRating(minRating===r?0:r)} className="accent-violet-600"/>
                        <span className="text-amber-400 text-sm">{"★".repeat(r)}{"☆".repeat(5-r)}</span>
                        <span className="text-xs text-gray-400">& up</span>
                        <span className="ml-auto text-xs text-gray-300">({subFilteredProducts.filter((p)=>(p.rating||0)>=r).length})</span>
                      </label>
                    ))}
                  </div>
                </FilterBlock>

                {availableGenders.length>0 && <FilterBlock title="For">
                  <div className="flex flex-wrap gap-2">
                    {availableGenders.map((g)=>(
                      <button key={g} onClick={()=>toggle(setSelGenders,g)} className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${selGenders.includes(g)?"bg-violet-600 text-white border-violet-600":"border-violet-100 text-gray-600 hover:border-violet-400"}`}>{g}</button>
                    ))}
                  </div>
                </FilterBlock>}

                {availableSizes.length>0 && <FilterBlock title="Size" open={false}>
                  <div className="flex flex-wrap gap-1.5">
                    {availableSizes.map((s)=>(
                      <button key={s} onClick={()=>toggle(setSelSizes,s)} className={`min-w-[36px] px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all text-center ${selSizes.includes(s)?"bg-violet-600 text-white border-violet-600":"border-violet-100 text-gray-600 hover:border-violet-400"}`}>{s}</button>
                    ))}
                  </div>
                </FilterBlock>}

                {availableBrands.length>0 && <FilterBlock title="Brand" open={false}>
                  <div className="space-y-2 max-h-44 overflow-y-auto pr-1 scrollbar-thin">
                    {availableBrands.map((b)=>(
                      <label key={b} className="flex items-center gap-2.5 cursor-pointer group py-0.5">
                        <input type="checkbox" checked={selBrands.includes(b)} onChange={()=>toggle(setSelBrands,b)} className="accent-violet-600 w-3.5 h-3.5 flex-shrink-0"/>
                        <span className="text-sm text-gray-700 group-hover:text-violet-600 flex-1 truncate transition-colors">{b}</span>
                        <span className="text-xs text-gray-300 flex-shrink-0">({subFilteredProducts.filter((p)=>p.brand===b).length})</span>
                      </label>
                    ))}
                  </div>
                </FilterBlock>}

                {availableColors.length>0 && <FilterBlock title="Color" open={false}>
                  <div className="flex flex-wrap gap-2.5">
                    {availableColors.map((c)=>(
                      <button key={c} title={c} onClick={()=>toggle(setSelColors,c)}
                        className={`w-7 h-7 rounded-full transition-all hover:scale-110 flex-shrink-0 ${selColors.includes(c)?"ring-2 ring-violet-600 ring-offset-2 scale-110":""}`}
                        style={{background:COLOR_MAP[c]||"#ccc",border:c==="White"?"1.5px solid #e5e7eb":"none"}}/>
                    ))}
                  </div>
                </FilterBlock>}

                <FilterBlock title="Offers" open={false}>
                  {[{label:"On Sale",state:onlyDiscount,set:setOnlyDiscount},{label:"In Stock",state:onlyInStock,set:setOnlyInStock}].map(({label,state,set})=>(
                    <div key={label} className="flex items-center justify-between mb-3">
                      <span className="text-sm text-gray-700">{label}</span>
                      <button onClick={()=>set(v=>!v)} className="lyra-toggle" style={{background:state?"#7c3aed":"#e5e7eb"}}>
                        <div className="lyra-toggle-knob" style={{left:state?"22px":"2px"}}/>
                      </button>
                    </div>
                  ))}
                </FilterBlock>
                <div className="pb-4"/>
              </div>
            </div>
          </aside>
        )}

        {/* ─── MAIN ─── */}
        <main className="flex-1 min-w-0">
          {/* Header */}
          <div className="mb-5 flex items-end justify-between flex-wrap gap-3">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase mb-1" style={{color:activeCatObj?.color||"#7c3aed"}}>
                ✦ Lyra · {activeCatObj?.icon} {activeCatObj?.label||activeCatObj?.name}
                {activeSubCat && <span className="text-gray-400"> › {activeSubCat}</span>}
              </p>
              <h1 className="cat-serif text-3xl sm:text-4xl font-light text-gray-900">
                {activeCategory==="All" ? <>All <em className="text-violet-600">Products</em></> : <>{activeCatObj?.label||activeCatObj?.name} {activeSubCat && <span className="text-gray-400 text-2xl">· {activeSubCat}</span>} <em style={{color:activeCatObj?.color||"#7c3aed"}}>Collection</em></>}
              </h1>
              <p className="text-sm text-gray-400 mt-1 font-light">{loading?"Loading…":`${filtered.length} product${filtered.length===1?"":"s"} found`}</p>
            </div>
            <div className="flex items-center gap-2">
              <select value={sort} onChange={(e)=>setSort(e.target.value)} className="cat-sort">
                {SORT_OPTIONS.map((o)=><option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <div className="flex rounded-xl border border-violet-100 overflow-hidden">
                {[{mode:"grid",icon:"⊞"},{mode:"list",icon:"☰"}].map(({mode,icon})=>(
                  <button key={mode} onClick={()=>setViewMode(mode)} className={`cat-view-btn ${viewMode===mode?"active":""}`}>{icon}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Sub-cat pills */}
          {subCatOptions.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              <button onClick={()=>handleSubCat("")} className={`text-xs px-3 py-1.5 rounded-full border font-semibold transition-all ${!activeSubCat?"bg-violet-600 text-white border-violet-600":"border-violet-100 text-gray-600 hover:border-violet-400"}`}>All</button>
              {subCatOptions.map((col)=>(
                <button key={col._id} onClick={()=>handleSubCat(col.title)} className={`text-xs px-3 py-1.5 rounded-full border font-semibold transition-all ${activeSubCat===col.title?"bg-violet-600 text-white border-violet-600":"border-violet-100 text-gray-600 hover:border-violet-400"}`}>{col.title}</button>
              ))}
            </div>
          )}

          {/* Active filter chips */}
          {(activeCount > 0 || search) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {search && <span className="cat-chip">"{search}" <button onClick={()=>setSearch("")}>✕</button></span>}
              {maxPrice<maxProductPrice && <span className="cat-chip">Up to ₹{maxPrice.toLocaleString()} <button onClick={()=>setMaxPrice(maxProductPrice)}>✕</button></span>}
              {selBrands.map((b)=><span key={b} className="cat-chip">{b} <button onClick={()=>toggle(setSelBrands,b)}>✕</button></span>)}
              {activeCount > 1 && <button onClick={clearFilters} className="text-xs text-red-400 hover:text-red-600 font-semibold px-2 py-1">Clear all</button>}
            </div>
          )}

          {/* Products */}
          {loading ? (
            <div className="cat-grid g4">{Array.from({length:8}).map((_,i)=><SkeletonCard key={i}/>)}</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
              <p className="text-5xl mb-5">🔍</p>
              <p className="cat-serif text-3xl text-gray-700 mb-2">Nothing found</p>
              <p className="text-gray-400 text-sm mb-6">{search?`No results for "${search}"`:"Try adjusting your filters"}</p>
              <div className="flex gap-3 justify-center flex-wrap">
                <button onClick={clearFilters} className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-purple-500 text-white rounded-xl text-sm font-medium">Clear Filters</button>
                <button onClick={()=>handleCategory(sidebarCats[0])} className="px-6 py-2.5 border border-violet-100 text-gray-600 rounded-xl text-sm font-medium hover:border-violet-400 hover:text-violet-600 transition-colors">Browse All</button>
              </div>
            </div>
          ) : viewMode === "grid" ? (
            <div className="cat-grid g4 cat-fade">{filtered.map((p)=><GridCard key={p._id} p={p} onAddToCart={setModalProduct}/>)}</div>
          ) : (
            <div className="flex flex-col gap-4 cat-fade">{filtered.map((p)=><ListCard key={p._id} p={p} onAddToCart={setModalProduct}/>)}</div>
          )}
        </main>
      </div>

      {modalProduct && <AddToCartModal product={modalProduct} onClose={()=>setModalProduct(null)}/>}
    </div>
  );
};

export default CategoryPage;