import React, { useState, useEffect } from "react";
import { apiFetch } from "./AdminUtils.jsx";

const CAT_BASE = "https://lyra-backend-gilt.vercel.app/api/admin/categories";

// ── tiny fetch wrapper scoped to /api/admin/categories ────────────
const catFetch = (path = "", opts = {}) =>
  fetch(`${CAT_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
    ...opts,
  }).then((r) => r.json());

// ══════════════════════════════════════════════════════════════════
// MODALS
// ══════════════════════════════════════════════════════════════════

// ── Primary category modal ─────────────────────────────────────────
const CategoryModal = ({ cat, onSave, onClose }) => {
  const blank = { name:"", label:"", icon:"✦", slug:"", color:"#7c3aed", badge:"", badgeColor:"", noMenu:false, featuredLabel:"", featuredImg:"", heroImg:"", order:0, active:true };
  const [form, setForm] = useState(cat ? { ...blank, ...cat } : blank);
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.name) return alert("Name is required");
    setSaving(true);
    try { await onSave(form); } finally { setSaving(false); }
  };

  const f = (label, key, opts = {}) => (
    <div className={opts.col2 ? "col-span-2" : ""}>
      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">{label}</label>
      {opts.textarea ? (
        <textarea value={form[key]||"#7c3aed"} onChange={(e)=>set(key,e.target.value)} rows={2} placeholder={opts.placeholder}
          className="w-full px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-white text-sm outline-none focus:border-violet-500 resize-none" />
      ) : (
        <input type={opts.type||"text"} value={form[key]||""} onChange={(e)=>set(key,opts.type==="number"?Number(e.target.value):e.target.value)} placeholder={opts.placeholder}
          className="w-full px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-white text-sm outline-none focus:border-violet-500" />
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#1a0d35] border border-white/10 rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto mx-4 z-10">
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/8 sticky top-0 bg-[#1a0d35] z-10">
          <h2 className="font-semibold text-white text-lg">{cat ? "Edit Category" : "New Primary Category"}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/60 hover:bg-white/20 text-sm">✕</button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {f("Name *",       "name",         { placeholder:"e.g. Men" })}
            {f("Display Label","label",         { placeholder:"e.g. Men's Fashion" })}
            {f("Slug",         "slug",          { placeholder:"auto-generated" })}
            {f("Icon",         "icon",          { placeholder:"emoji e.g. 👔" })}
            {f("Color",        "color",         { type:"color" })}
            {f("Order",        "order",         { type:"number", placeholder:"0" })}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {f("Sale Badge Text",  "badge",      { placeholder:"UP TO 70% OFF" })}
            {f("Badge Color",      "badgeColor", { type:"color" })}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {f("Featured Label", "featuredLabel", { placeholder:"New Arrivals" })}
            {f("Featured Image URL", "featuredImg", { placeholder:"https://..." })}
          </div>
          {f("Hero Image URL", "heroImg", { col2:true, placeholder:"https://... (used on category page)" })}
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <div onClick={()=>set("noMenu",!form.noMenu)} className={`w-10 h-5 rounded-full relative transition-all ${form.noMenu?"bg-violet-600":"bg-white/10"}`}>
                <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all" style={{left:form.noMenu?"calc(100% - 18px)":"2px"}}/>
              </div>
              <span className="text-white/60 text-sm">No mega-menu dropdown</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <div onClick={()=>set("active",!form.active)} className={`w-10 h-5 rounded-full relative transition-all ${form.active?"bg-emerald-500":"bg-white/10"}`}>
                <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all" style={{left:form.active?"calc(100% - 18px)":"2px"}}/>
              </div>
              <span className="text-white/60 text-sm">Active</span>
            </label>
          </div>
        </div>
        <div className="flex gap-3 px-6 py-5 border-t border-white/8 sticky bottom-0 bg-[#1a0d35]">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-white/10 text-white/60 text-sm font-semibold hover:bg-white/5">Cancel</button>
          <button onClick={handleSave} disabled={saving}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-bold hover:shadow-lg disabled:opacity-60">
            {saving ? "Saving…" : cat ? "Save Changes" : "Create Category"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Column modal ───────────────────────────────────────────────────
const ColumnModal = ({ col, onSave, onClose }) => {
  const [form, setForm] = useState(col ? { ...col } : { title:"", order:0 });
  const [saving, setSaving] = useState(false);
  const handleSave = async () => { if (!form.title) return alert("Title required"); setSaving(true); try { await onSave(form); } finally { setSaving(false); } };
  return (
    <div className="fixed inset-0 z-[210] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#1a0d35] border border-white/10 rounded-2xl shadow-2xl w-80 mx-4 z-10 p-6">
        <h3 className="text-white font-semibold mb-4">{col ? "Edit Column" : "Add Column"}</h3>
        <input value={form.title} onChange={(e)=>setForm(f=>({...f,title:e.target.value}))} placeholder="Column title (e.g. Clothing)"
          className="w-full px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-white text-sm outline-none focus:border-violet-500 mb-3" />
        <input type="number" value={form.order} onChange={(e)=>setForm(f=>({...f,order:Number(e.target.value)}))} placeholder="Order"
          className="w-full px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-white text-sm outline-none focus:border-violet-500 mb-4" />
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/60 text-sm hover:bg-white/5">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="flex-1 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-bold disabled:opacity-60">{saving?"Saving…":col?"Save":"Add"}</button>
        </div>
      </div>
    </div>
  );
};

// ── Sub-category modal ─────────────────────────────────────────────
const SubModal = ({ onSave, onClose }) => {
  const [name, setName]     = useState("");
  const [bulk, setBulk]     = useState("");
  const [saving, setSaving] = useState(false);
  const handleSave = async () => {
    const names = bulk ? bulk.split(",").map(s=>s.trim()).filter(Boolean) : [name.trim()];
    if (!names.length || !names[0]) return alert("Enter at least one sub-category name");
    setSaving(true);
    try { await onSave(names); } finally { setSaving(false); }
  };
  return (
    <div className="fixed inset-0 z-[210] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#1a0d35] border border-white/10 rounded-2xl shadow-2xl w-96 mx-4 z-10 p-6">
        <h3 className="text-white font-semibold mb-4">Add Sub-Categories</h3>
        <p className="text-white/40 text-xs mb-3">Single name or comma-separated list</p>
        <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="e.g. Shirts"
          className="w-full px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-white text-sm outline-none focus:border-violet-500 mb-2" />
        <textarea value={bulk} onChange={(e)=>setBulk(e.target.value)} placeholder="Or bulk: Shirts, T-Shirts, Jeans, Trousers" rows={3}
          className="w-full px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-white text-sm outline-none focus:border-violet-500 mb-4 resize-none" />
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/60 text-sm hover:bg-white/5">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="flex-1 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-bold disabled:opacity-60">{saving?"Saving…":"Add"}</button>
        </div>
      </div>
    </div>
  );
};

// ── Delete confirm ─────────────────────────────────────────────────
const Confirm = ({ message, onConfirm, onCancel, loading }) => (
  <div className="fixed inset-0 z-[220] flex items-center justify-center">
    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} />
    <div className="relative bg-[#1a0d35] border border-white/10 rounded-2xl p-6 w-80 mx-4 text-center z-10">
      <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4"><span className="text-xl">🗑</span></div>
      <p className="text-white font-semibold mb-2">Confirm Delete</p>
      <p className="text-white/40 text-xs mb-5">{message}</p>
      <div className="flex gap-3">
        <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/60 text-sm hover:bg-white/5">Cancel</button>
        <button onClick={onConfirm} disabled={loading} className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 disabled:opacity-60">{loading?"Deleting…":"Delete"}</button>
      </div>
    </div>
  </div>
);

// ══════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════════
const AdminCategories = ({ notify }) => {
  const [categories,  setCategories]  = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [expanded,    setExpanded]    = useState(null);  // category id being expanded
  const [catModal,    setCatModal]    = useState(null);  // null | "new" | cat object
  const [colModal,    setColModal]    = useState(null);  // null | { catId, col|null }
  const [subModal,    setSubModal]    = useState(null);  // null | { catId, colId }
  const [delConfirm,  setDelConfirm]  = useState(null);  // null | { type, catId, colId?, subId?, message }
  const [deleting,    setDeleting]    = useState(false);
  const [seeding,     setSeeding]     = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await catFetch("");
      setCategories(data.categories || []);
    } catch (e) { notify?.(e.message, "error"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  // ── SEED ──────────────────────────────────────────────────────
  const handleSeed = async () => {
    setSeeding(true);
    try {
      const data = await catFetch("/seed", { method:"POST" });
      notify?.(data.message || "Seeded successfully");
      load();
    } catch (e) { notify?.(e.message, "error"); }
    finally { setSeeding(false); }
  };

  // ── CREATE / UPDATE category ──────────────────────────────────
  const handleSaveCat = async (form) => {
    try {
      if (form._id) {
        const data = await catFetch(`/${form._id}`, { method:"PUT", body:JSON.stringify(form) });
        setCategories((prev) => prev.map((c) => c._id===form._id ? data.category : c));
        notify?.("Category updated");
      } else {
        const data = await catFetch("", { method:"POST", body:JSON.stringify(form) });
        setCategories((prev) => [...prev, data.category]);
        notify?.("Category created");
      }
      setCatModal(null);
    } catch (e) { notify?.(e.message, "error"); throw e; }
  };

  // ── DELETE category ───────────────────────────────────────────
  const handleDeleteCat = async () => {
    setDeleting(true);
    try {
      await catFetch(`/${delConfirm.catId}`, { method:"DELETE" });
      setCategories((prev) => prev.filter((c) => c._id !== delConfirm.catId));
      notify?.("Category deleted");
      setDelConfirm(null);
    } catch (e) { notify?.(e.message, "error"); }
    finally { setDeleting(false); }
  };

  // ── ADD / UPDATE column ───────────────────────────────────────
  const handleSaveCol = async (form) => {
    const { catId, col } = colModal;
    try {
      let data;
      if (col?._id) {
        data = await catFetch(`/${catId}/columns/${col._id}`, { method:"PUT", body:JSON.stringify(form) });
      } else {
        data = await catFetch(`/${catId}/columns`, { method:"POST", body:JSON.stringify(form) });
      }
      setCategories((prev) => prev.map((c) => c._id===catId ? data.category : c));
      notify?.(col?._id ? "Column updated" : "Column added");
      setColModal(null);
    } catch (e) { notify?.(e.message, "error"); throw e; }
  };

  // ── DELETE column ─────────────────────────────────────────────
  const handleDeleteCol = async () => {
    setDeleting(true);
    const { catId, colId } = delConfirm;
    try {
      const data = await catFetch(`/${catId}/columns/${colId}`, { method:"DELETE" });
      setCategories((prev) => prev.map((c) => c._id===catId ? data.category : c));
      notify?.("Column deleted");
      setDelConfirm(null);
    } catch (e) { notify?.(e.message, "error"); }
    finally { setDeleting(false); }
  };

  // ── ADD sub-categories (bulk) ─────────────────────────────────
  const handleAddSubs = async (names) => {
    const { catId, colId } = subModal;
    try {
      let updatedCat;
      for (const name of names) {
        const data = await catFetch(`/${catId}/columns/${colId}/sub`, { method:"POST", body:JSON.stringify({ name }) });
        updatedCat = data.category;
      }
      setCategories((prev) => prev.map((c) => c._id===catId ? updatedCat : c));
      notify?.(`${names.length} sub-categor${names.length===1?"y":"ies"} added`);
      setSubModal(null);
    } catch (e) { notify?.(e.message, "error"); throw e; }
  };

  // ── DELETE sub-category ───────────────────────────────────────
  const handleDeleteSub = async () => {
    setDeleting(true);
    const { catId, colId, subId } = delConfirm;
    try {
      const data = await catFetch(`/${catId}/columns/${colId}/sub/${subId}`, { method:"DELETE" });
      setCategories((prev) => prev.map((c) => c._id===catId ? data.category : c));
      notify?.("Sub-category deleted");
      setDelConfirm(null);
    } catch (e) { notify?.(e.message, "error"); }
    finally { setDeleting(false); }
  };

  const handleDelete = () => {
    if (delConfirm.type === "cat") handleDeleteCat();
    else if (delConfirm.type === "col") handleDeleteCol();
    else if (delConfirm.type === "sub") handleDeleteSub();
  };

  // ════════════════════════════════════════════════════════════════
  // RENDER
  // ════════════════════════════════════════════════════════════════
  return (
    <div className="space-y-4">
      {/* Header toolbar */}
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <p className="text-white/40 text-sm">{categories.length} categories</p>
        <div className="flex gap-2 flex-wrap">
          <button onClick={handleSeed} disabled={seeding}
            className="text-xs text-amber-400 hover:text-amber-300 px-3 py-2 rounded-xl border border-amber-500/20 hover:border-amber-500/40 transition-all disabled:opacity-50">
            {seeding ? "Seeding…" : "🌱 Seed Defaults"}
          </button>
          <button onClick={load} className="text-xs text-violet-400 hover:text-violet-300 px-3 py-2 rounded-xl border border-violet-500/20 hover:border-violet-500/40 transition-all">
            ↻ Refresh
          </button>
          <button onClick={() => setCatModal("new")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-semibold hover:shadow-lg hover:shadow-violet-900/50 transition-all">
            + New Category
          </button>
        </div>
      </div>

      {/* Category list */}
      {loading ? (
        <div className="space-y-3">{Array.from({length:4}).map((_,i)=>(
          <div key={i} className="bg-[#130d24] border border-white/5 rounded-2xl h-20 animate-pulse"/>
        ))}</div>
      ) : categories.length === 0 ? (
        <div className="text-center py-16 text-white/30">
          <p className="text-4xl mb-4">📂</p>
          <p className="text-sm mb-3">No categories yet.</p>
          <button onClick={handleSeed} className="text-violet-400 hover:underline text-sm">Seed default categories →</button>
        </div>
      ) : (
        <div className="space-y-3">
          {categories.map((cat) => (
            <div key={cat._id} className="bg-[#130d24] border border-white/5 rounded-2xl overflow-hidden hover:border-violet-500/20 transition-all">
              {/* Category header row */}
              <div className="flex items-center gap-4 p-4">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{ background: cat.color ? `${cat.color}22` : "#7c3aed22" }}>
                  {cat.icon || "✦"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-white font-semibold text-sm">{cat.label || cat.name}</p>
                    {cat.badge && <span className="text-[9px] font-bold px-2 py-0.5 rounded-full text-white" style={{ background: cat.badgeColor || "#ef4444" }}>{cat.badge}</span>}
                    {!cat.active && <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-gray-500/20 text-gray-400">Inactive</span>}
                    {cat.noMenu && <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-white/40">No Menu</span>}
                  </div>
                  <p className="text-white/30 text-xs mt-0.5">/{cat.slug} · {cat.columns?.length || 0} columns · order {cat.order}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => setExpanded(expanded === cat._id ? null : cat._id)}
                    className="text-xs text-violet-400 hover:text-violet-300 px-3 py-1.5 rounded-lg border border-violet-500/20 hover:border-violet-500/40 transition-all">
                    {expanded === cat._id ? "▲ Collapse" : "▼ Expand"}
                  </button>
                  <button onClick={() => setCatModal(cat)} className="w-8 h-8 rounded-lg bg-white/5 text-white/50 hover:bg-violet-500/20 hover:text-violet-300 flex items-center justify-center text-sm transition-all">✏️</button>
                  <button onClick={() => setDelConfirm({ type:"cat", catId:cat._id, message:`Delete category "${cat.name}" and all its columns/sub-categories?` })}
                    className="w-8 h-8 rounded-lg bg-white/5 text-white/50 hover:bg-red-500/20 hover:text-red-400 flex items-center justify-center text-sm transition-all">🗑</button>
                </div>
              </div>

              {/* Expanded — columns + sub-categories */}
              {expanded === cat._id && (
                <div className="border-t border-white/5 px-4 pb-4 pt-3 space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Mega-menu Columns</p>
                    <button onClick={() => setColModal({ catId:cat._id, col:null })}
                      className="text-xs text-violet-400 hover:text-violet-300 px-3 py-1 rounded-lg border border-violet-500/20 hover:border-violet-500/40 transition-all">
                      + Add Column
                    </button>
                  </div>

                  {(!cat.columns || cat.columns.length === 0) ? (
                    <p className="text-white/20 text-xs text-center py-4">No columns yet. Add one above.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                      {cat.columns.map((col) => (
                        <div key={col._id} className="bg-white/3 border border-white/5 rounded-xl p-3">
                          {/* Column header */}
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-violet-300 text-xs font-bold uppercase tracking-wider">{col.title}</p>
                            <div className="flex gap-1">
                              <button onClick={()=>setColModal({catId:cat._id,col})} className="w-6 h-6 rounded-lg bg-white/5 text-white/40 hover:bg-violet-500/20 hover:text-violet-300 flex items-center justify-center text-xs transition-all">✏</button>
                              <button onClick={()=>setDelConfirm({type:"col",catId:cat._id,colId:col._id,message:`Delete column "${col.title}"?`})} className="w-6 h-6 rounded-lg bg-white/5 text-white/40 hover:bg-red-500/20 hover:text-red-400 flex items-center justify-center text-xs transition-all">✕</button>
                            </div>
                          </div>

                          {/* Sub-categories */}
                          <div className="flex flex-wrap gap-1 mb-2">
                            {(col.subCategories || []).map((sub) => (
                              <span key={sub._id} className="group inline-flex items-center gap-1 bg-white/5 hover:bg-white/10 text-white/60 text-[10px] px-2 py-0.5 rounded-full transition-all">
                                {sub.name}
                                <button onClick={()=>setDelConfirm({type:"sub",catId:cat._id,colId:col._id,subId:sub._id,message:`Delete sub-category "${sub.name}"?`})} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-all leading-none">×</button>
                              </span>
                            ))}
                          </div>
                          <button onClick={()=>setSubModal({catId:cat._id,colId:col._id})}
                            className="w-full py-1.5 rounded-lg border border-dashed border-white/10 text-white/30 text-[10px] hover:border-violet-500/30 hover:text-violet-400 transition-all">
                            + Add Sub-categories
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {catModal && <CategoryModal cat={catModal === "new" ? null : catModal} onSave={handleSaveCat} onClose={() => setCatModal(null)} />}
      {colModal && <ColumnModal col={colModal.col} onSave={handleSaveCol} onClose={() => setColModal(null)} />}
      {subModal && <SubModal onSave={handleAddSubs} onClose={() => setSubModal(null)} />}
      {delConfirm && <Confirm message={delConfirm.message} onConfirm={handleDelete} onCancel={() => setDelConfirm(null)} loading={deleting} />}
    </div>
  );
};

export default AdminCategories;