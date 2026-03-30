import React, { useState } from "react";
import { Skeleton, ErrorBanner, CATEGORIES, apiFetch } from "./AdminUtils.jsx";

// ── Product modal ─────────────────────────────────────────────────
const ProductModal = ({ product, onSave, onClose }) => {
  const blank = { name:"",category:"Fashion",brand:"",price:"",originalPrice:"",gender:"Unisex",badge:"",description:"",material:"",care:"",sizes:"",colors:"",image:"",sku:"" };
  const [form, setForm] = useState(product
    ? { ...product, sizes: Array.isArray(product.sizes) ? product.sizes.join(", ") : product.sizes || "", colors: Array.isArray(product.colors) ? product.colors.join(", ") : product.colors || "" }
    : blank);
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.name || !form.price || !form.brand) { alert("Name, brand and price are required"); return; }
    setSaving(true);
    try { await onSave(form); } finally { setSaving(false); }
  };

  const field = (label, key, opts = {}) => (
    <div className={opts.col2 ? "col-span-2" : ""}>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
      {opts.textarea ? (
        <textarea value={form[key]} onChange={(e) => set(key, e.target.value)} placeholder={opts.placeholder} rows={3}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all resize-none" />
      ) : opts.select ? (
        <select value={form[key]} onChange={(e) => set(key, e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-violet-500 bg-white">
          {opts.options.map((o) => <option key={o}>{o}</option>)}
        </select>
      ) : (
        <input type={opts.type || "text"} value={form[key]} onChange={(e) => set(key, e.target.value)} placeholder={opts.placeholder}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all" />
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4 z-10">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 sticky top-0 bg-white z-10">
          <div>
            <h2 className="font-semibold text-gray-900 text-lg">{product ? "Edit Product" : "Add New Product"}</h2>
            <p className="text-xs text-gray-400 mt-0.5">Fields marked * required</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 text-sm">✕</button>
        </div>

        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            {field("Product Name *", "name", { col2: true, placeholder: "e.g. Silk Noir Dress" })}
            {field("Brand *", "brand", { placeholder: "Brand name" })}
            {field("Category *", "category", { select: true, options: CATEGORIES })}
          </div>
          <div className="grid grid-cols-3 gap-4">
            {field("Selling Price ₹ *", "price", { type: "number", placeholder: "4999" })}
            {field("MRP ₹ *", "originalPrice", { type: "number", placeholder: "7999" })}
            {field("Badge", "badge", { placeholder: "New / Hot" })}
          </div>
          <div className="grid grid-cols-3 gap-4">
            {field("Sizes (comma-separated)", "sizes", { placeholder: "S, M, L, XL" })}
            {field("Colors (comma-separated)", "colors", { placeholder: "Black, White" })}
            {field("Gender", "gender", { select: true, options: ["Men","Women","Unisex"] })}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {field("Image URL", "image", { placeholder: "https://..." })}
            {field("SKU", "sku", { placeholder: "LYR-XX-001" })}
          </div>
          {field("Description", "description", { col2: false, textarea: true, placeholder: "Product description..." })}
          <div className="grid grid-cols-2 gap-4">
            {field("Material", "material", { placeholder: "e.g. 100% Cotton" })}
            {field("Care Instructions", "care", { placeholder: "e.g. Machine wash cold" })}
          </div>
        </div>

        {form.image && (
          <div className="px-6 pb-2">
            <img src={form.image} alt="preview" className="w-20 h-20 rounded-xl object-cover border border-gray-200"
              onError={(e) => { e.target.style.display = "none"; }} />
          </div>
        )}

        <div className="flex gap-3 px-6 py-5 border-t border-gray-100 sticky bottom-0 bg-white">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50">Cancel</button>
          <button onClick={handleSave} disabled={saving}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-bold hover:shadow-lg hover:shadow-violet-200 disabled:opacity-60">
            {saving ? "Saving…" : product ? "Save Changes" : "Add Product"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Delete confirm ────────────────────────────────────────────────
const DeleteConfirm = ({ onConfirm, onCancel, loading }) => (
  <div className="fixed inset-0 z-[200] flex items-center justify-center">
    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} />
    <div className="relative bg-[#1a0d35] border border-white/10 rounded-2xl p-8 w-96 mx-4 text-center z-10">
      <div className="w-14 h-14 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4"><span className="text-2xl">🗑</span></div>
      <h3 className="text-white font-bold text-lg mb-2">Delete Product?</h3>
      <p className="text-white/40 text-sm mb-6">This action cannot be undone.</p>
      <div className="flex gap-3">
        <button onClick={onCancel} className="flex-1 py-3 rounded-xl border border-white/10 text-white/60 text-sm font-semibold hover:bg-white/5">Cancel</button>
        <button onClick={onConfirm} disabled={loading}
          className="flex-1 py-3 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 disabled:opacity-60">
          {loading ? "Deleting…" : "Delete"}
        </button>
      </div>
    </div>
  </div>
);

// ══ MAIN ══════════════════════════════════════════════════════════
const AdminProducts = ({ products, setProducts, loading, errors, onRetry, notify, searchQuery }) => {
  const [productModal,  setProductModal]  = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting,      setDeleting]      = useState(false);

  const filtered = searchQuery
    ? products.filter((p) => [p.name, p.category, p.brand].some((f) => (f || "").toLowerCase().includes(searchQuery.toLowerCase())))
    : products;

  // POST / PUT
  const handleSaveProduct = async (form) => {
    const parsed = {
      ...form,
      price:         Number(form.price),
      originalPrice: Number(form.originalPrice),
      sizes:  typeof form.sizes  === "string" ? form.sizes.split(",").map((s) => s.trim()).filter(Boolean)  : form.sizes,
      colors: typeof form.colors === "string" ? form.colors.split(",").map((c) => c.trim()).filter(Boolean) : form.colors,
    };
    try {
      if (form._id || form.id) {
        const id = form._id || form.id;
        const res = await apiFetch(`/products/${id}`, { method: "PUT", body: JSON.stringify(parsed) });
        setProducts((prev) => prev.map((p) => (p._id || p.id) === id ? (res?.product || res || { ...parsed, _id: id }) : p));
        notify("Product updated!");
      } else {
        const res = await apiFetch("/products", { method: "POST", body: JSON.stringify(parsed) });
        setProducts((prev) => [...prev, res?.product || res]);
        notify("Product added!");
      }
      setProductModal(null);
    } catch (e) {
      notify(e.message, "error");
    }
  };

  // DELETE
  const handleDelete = async () => {
    setDeleting(true);
    try {
      await apiFetch(`/products/${deleteConfirm}`, { method: "DELETE" });
      setProducts((prev) => prev.filter((p) => (p._id || p.id) !== deleteConfirm));
      setDeleteConfirm(null);
      notify("Product deleted.");
    } catch (e) {
      notify(e.message, "error");
    } finally { setDeleting(false); }
  };

  return (
    <div className="space-y-4">
      {errors.products && <ErrorBanner msg={errors.products} onRetry={onRetry} />}

      <div className="flex items-center justify-between">
        <p className="text-white/40 text-sm">{filtered.length} products</p>
        <div className="flex gap-2">
          <button onClick={onRetry} className="text-xs text-violet-400 hover:text-violet-300 px-3 py-2 rounded-xl border border-violet-500/20 hover:border-violet-500/40 transition-all">
            ↻ Refresh
          </button>
          <button onClick={() => setProductModal("new")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-semibold hover:shadow-lg hover:shadow-violet-900/50 transition-all">
            + Add Product
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-40" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((p) => {
            const id   = p._id || p.id;
            const disc = p.originalPrice ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0;
            return (
              <div key={id} className="bg-[#130d24] border border-white/5 rounded-2xl overflow-hidden hover:border-violet-500/20 transition-all">
                <div className="flex gap-4 p-4">
                  <img src={p.image || p.images?.[0]} alt={p.name}
                    className="w-20 h-20 rounded-xl object-cover bg-white/5 flex-shrink-0"
                    onError={(e) => { e.target.src = "https://placehold.co/80x80/1e0a3c/a855f7?text=L"; }} />
                  <div className="flex-1 min-w-0">
                    {p.badge && <span className="text-xs bg-violet-500/20 text-violet-300 px-2 py-0.5 rounded-full border border-violet-500/20 font-semibold">{p.badge}</span>}
                    <p className="text-white text-sm font-semibold mt-1 truncate">{p.name}</p>
                    <p className="text-white/30 text-xs">{p.brand} · {p.category}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-white font-bold text-sm">₹{(p.price || 0).toLocaleString()}</span>
                      {p.originalPrice && <span className="text-white/30 text-xs line-through">₹{p.originalPrice.toLocaleString()}</span>}
                      {disc > 0 && <span className="text-emerald-400 text-xs font-semibold">{disc}% off</span>}
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-amber-400 text-xs">★ {p.rating || "—"}</span>
                      <span className="text-white/30 text-xs">{(p.reviews || 0).toLocaleString()} reviews</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 px-4 pb-4">
                  <button onClick={() => setProductModal(p)} className="flex-1 py-2 rounded-lg bg-white/5 text-white/60 text-xs font-semibold hover:bg-violet-500/20 hover:text-violet-300 transition-all border border-white/5">✏️ Edit</button>
                  <button onClick={() => setDeleteConfirm(id)} className="flex-1 py-2 rounded-lg bg-white/5 text-white/60 text-xs font-semibold hover:bg-red-500/20 hover:text-red-400 transition-all border border-white/5">🗑 Delete</button>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && !loading && <div className="col-span-3 text-center py-12 text-white/30 text-sm">No products found</div>}
        </div>
      )}

      {productModal && <ProductModal product={productModal === "new" ? null : productModal} onSave={handleSaveProduct} onClose={() => setProductModal(null)} />}
      {deleteConfirm && <DeleteConfirm onConfirm={handleDelete} onCancel={() => setDeleteConfirm(null)} loading={deleting} />}
    </div>
  );
};

export default AdminProducts;