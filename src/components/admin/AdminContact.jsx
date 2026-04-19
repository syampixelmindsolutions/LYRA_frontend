// AdminContacts.jsx
// Drop this as a tab/route inside your existing admin panel.
// Fetches GET http://localhost:6055/api/contact  (admin-protected)
// PATCH  http://localhost:6055/api/contact/:id/status  → { status }
// DELETE http://localhost:6055/api/contact/:id

import React, { useEffect, useState, useCallback } from "react";

const STATUS_OPTS = ["all", "new", "in-progress", "resolved", "closed"];

const STATUS_META = {
  new:          { label: "New",         color: "#7c3aed", bg: "#f5f3ff" },
  "in-progress":{ label: "In Progress", color: "#d97706", bg: "#fffbeb" },
  resolved:     { label: "Resolved",    color: "#059669", bg: "#ecfdf5" },
  closed:       { label: "Closed",      color: "#64748b", bg: "#f1f5f9" },
};

const adminToken = () => {
  try {
    const a = JSON.parse(sessionStorage.getItem("admin") || "{}");
    const u = JSON.parse(sessionStorage.getItem("user")  || "{}");
    return a.token || u.token || "";
  } catch { return ""; }
};

const apiFetch = (path, opts = {}) =>
  fetch(`https://lyra-backend-gilt.vercel.app/api${path}`, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${adminToken()}`,
      ...(opts.headers || {}),
    },
  });

// ── Relative time ──────────────────────────────────────────────────
const relTime = (iso) => {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)   return "Just now";
  if (m < 60)  return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24)  return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
};

// ── Detail modal ───────────────────────────────────────────────────
const DetailModal = ({ contact, onClose, onStatusChange, onDelete }) => {
  const [status, setStatus]   = useState(contact.status || "new");
  const [saving, setSaving]   = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [replyNote, setReplyNote] = useState("");

  const saveStatus = async () => {
    setSaving(true);
    try {
      await apiFetch(`/contact/${contact._id}/status`, {
        method: "PATCH",
        body:   JSON.stringify({ status }),
      });
      onStatusChange(contact._id, status);
    } catch (e) { alert("Failed to update: " + e.message); }
    setSaving(false);
  };

  const doDelete = async () => {
    if (!window.confirm("Delete this contact message permanently?")) return;
    setDeleting(true);
    try {
      await apiFetch(`/contact/${contact._id}`, { method: "DELETE" });
      onDelete(contact._id);
      onClose();
    } catch (e) { alert("Delete failed: " + e.message); }
    setDeleting(false);
  };

  const meta = STATUS_META[status] || STATUS_META.new;

  return (
    <>
      <div
        style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.45)",backdropFilter:"blur(4px)",zIndex:1000 }}
        onClick={onClose}
      />
      <div style={{
        position:"fixed",top:"50%",left:"50%",transform:"translate(-50%,-50%)",
        width:"min(96vw,640px)",maxHeight:"90vh",overflowY:"auto",
        background:"white",borderRadius:"20px",zIndex:1001,
        boxShadow:"0 40px 80px -12px rgba(15,5,30,0.35)",
      }}>
        {/* Header */}
        <div style={{ background:"linear-gradient(145deg,#0f0820,#1e0a3c,#2d1060)", padding:"24px 28px", borderRadius:"20px 20px 0 0", position:"relative" }}>
          <button onClick={onClose} style={{ position:"absolute",top:16,right:16,background:"rgba(255,255,255,0.1)",border:"none",color:"rgba(255,255,255,0.6)",width:30,height:30,borderRadius:"50%",cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center" }}>✕</button>
          <p style={{ fontSize:9,fontWeight:700,color:"rgba(167,139,250,0.6)",letterSpacing:"0.25em",textTransform:"uppercase",marginBottom:8 }}>Contact Submission</p>
          <h2 style={{ fontFamily:"'Cormorant Garamond',serif",color:"white",fontSize:22,fontWeight:400,margin:"0 0 4px" }}>{contact.name}</h2>
          <p style={{ color:"rgba(216,180,254,0.6)",fontSize:12,margin:0 }}>{contact.email} · {relTime(contact.createdAt)}</p>
        </div>

        {/* Body */}
        <div style={{ padding:"24px 28px" }}>
          {/* Meta row */}
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:20 }}>
            {[
              { label:"Subject",  value: contact.subject  || "—" },
              { label:"Phone",    value: contact.phone    || "—" },
              { label:"Order ID", value: contact.orderId  || "—" },
              { label:"Received", value: new Date(contact.createdAt).toLocaleString("en-IN",{ dateStyle:"medium",timeStyle:"short" }) },
            ].map(({ label, value }) => (
              <div key={label} style={{ background:"#f9fafb",borderRadius:12,padding:"10px 14px" }}>
                <p style={{ fontSize:9,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:4 }}>{label}</p>
                <p style={{ fontSize:13,fontWeight:600,color:"#111827",margin:0 }}>{value}</p>
              </div>
            ))}
          </div>

          {/* Message */}
          <div style={{ background:"#f9fafb",borderRadius:14,padding:"16px 18px",marginBottom:20,borderLeft:"3px solid #7c3aed" }}>
            <p style={{ fontSize:9,fontWeight:700,color:"#a78bfa",textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:8 }}>Message</p>
            <p style={{ fontSize:14,color:"#374151",lineHeight:1.7,margin:0,whiteSpace:"pre-wrap" }}>{contact.message}</p>
          </div>

          {/* Status update */}
          <div style={{ marginBottom:20 }}>
            <p style={{ fontSize:11,fontWeight:600,color:"#4b5563",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:8 }}>Update Status</p>
            <div style={{ display:"flex",flexWrap:"wrap",gap:8,marginBottom:12 }}>
              {Object.entries(STATUS_META).map(([key, m]) => (
                <button key={key} onClick={() => setStatus(key)}
                  style={{
                    padding:"6px 14px",borderRadius:99,fontSize:12,fontWeight:600,cursor:"pointer",
                    border: status === key ? `2px solid ${m.color}` : "2px solid transparent",
                    background: status === key ? m.bg : "#f1f5f9",
                    color: status === key ? m.color : "#64748b",
                    transition:"all 0.15s",
                  }}>
                  {m.label}
                </button>
              ))}
            </div>
            <button onClick={saveStatus} disabled={saving}
              style={{
                padding:"10px 22px",borderRadius:12,border:"none",cursor:saving?"not-allowed":"pointer",
                background:"linear-gradient(135deg,#7c3aed,#a855f7)",color:"white",
                fontSize:13,fontWeight:700,opacity:saving?0.6:1,transition:"opacity 0.2s",
              }}>
              {saving ? "Saving…" : "Save Status"}
            </button>
          </div>

          {/* Reply note (UI only – extend to send email via backend) */}
          <div style={{ marginBottom:20 }}>
            <p style={{ fontSize:11,fontWeight:600,color:"#4b5563",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:8 }}>Internal Note / Reply Draft</p>
            <textarea
              value={replyNote}
              onChange={(e) => setReplyNote(e.target.value)}
              placeholder="Add an internal note or draft a reply…"
              style={{ width:"100%",padding:"12px 14px",borderRadius:12,border:"1.5px solid #e5e7eb",fontSize:13,outline:"none",resize:"vertical",minHeight:90,color:"#374151",background:"#fafafa",lineHeight:1.6 }}
            />
          </div>

          {/* Actions */}
          <div style={{ display:"flex",gap:10,justifyContent:"space-between",borderTop:"1px solid #f1f5f9",paddingTop:16 }}>
            <button onClick={doDelete} disabled={deleting}
              style={{ padding:"10px 18px",borderRadius:12,border:"1.5px solid #fee2e2",background:"#fef2f2",color:"#dc2626",fontSize:12,fontWeight:600,cursor:deleting?"not-allowed":"pointer",opacity:deleting?0.6:1 }}>
              {deleting ? "Deleting…" : "🗑 Delete"}
            </button>
            <a href={`mailto:${contact.email}?subject=Re: ${encodeURIComponent(contact.subject || "Your Lyra Query")}&body=${encodeURIComponent(replyNote)}`}
              style={{ padding:"10px 22px",borderRadius:12,background:"linear-gradient(135deg,#0891b2,#06b6d4)",color:"white",fontSize:13,fontWeight:700,textDecoration:"none",display:"inline-flex",alignItems:"center",gap:6 }}>
              📧 Reply via Email
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

// ══════════════════════════════════════════════════════════════════
// ADMIN CONTACTS — main component
// ══════════════════════════════════════════════════════════════════
const AdminContacts = () => {
  const [contacts,  setContacts]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState("");
  const [filter,    setFilter]    = useState("all");
  const [search,    setSearch]    = useState("");
  const [selected,  setSelected]  = useState(null); // contact for detail modal
  const [page,      setPage]      = useState(1);
  const PER_PAGE = 10;

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res  = await apiFetch("/contact");
      if (!res.ok) throw new Error(`${res.status}`);
      const data = await res.json();
      const arr  = Array.isArray(data) ? data : data.contacts || [];
      setContacts(arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (e) {
      setError("Could not load contacts: " + e.message);
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleStatusChange = (id, status) => {
    setContacts((prev) => prev.map((c) => c._id === id ? { ...c, status } : c));
  };
  const handleDelete = (id) => {
    setContacts((prev) => prev.filter((c) => c._id !== id));
  };

  // Filter + search
  const visible = contacts.filter((c) => {
    if (filter !== "all" && (c.status || "new") !== filter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        c.name?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.subject?.toLowerCase().includes(q) ||
        c.message?.toLowerCase().includes(q) ||
        c.orderId?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalPages = Math.ceil(visible.length / PER_PAGE);
  const paged = visible.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // Stats
  const stats = {
    total:      contacts.length,
    new:        contacts.filter((c) => (c.status || "new") === "new").length,
    inProgress: contacts.filter((c) => c.status === "in-progress").length,
    resolved:   contacts.filter((c) => c.status === "resolved").length,
  };

  return (
    <div style={{ fontFamily:"'DM Sans',system-ui,sans-serif", color:"#111827" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=DM+Sans:wght@400;500;600&display=swap');
        .ac-card{background:white;border-radius:16px;border:1px solid #f1f5f9;overflow:hidden;}
        .ac-row{display:grid;grid-template-columns:1fr 1fr minmax(100px,auto) 100px 80px;align-items:center;gap:16px;padding:14px 20px;border-bottom:1px solid #f8fafc;cursor:pointer;transition:background 0.15s;}
        .ac-row:hover{background:#faf5ff;}
        .ac-row:last-child{border-bottom:none;}
        @media(max-width:768px){.ac-row{grid-template-columns:1fr auto;}.ac-col-hide{display:none!important;}}
        .ac-stat{background:white;border-radius:14px;border:1px solid #f1f5f9;padding:16px 20px;text-align:center;}
        .ac-badge{display:inline-flex;align-items:center;padding:3px 10px;border-radius:99px;font-size:11px;font-weight:600;}
        .ac-input{padding:9px 14px;border-radius:10px;border:1.5px solid #e5e7eb;font-size:13px;outline:none;width:100%;transition:border-color 0.2s;}
        .ac-input:focus{border-color:#7c3aed;box-shadow:0 0 0 3px rgba(124,58,237,0.08);}
        .ac-filter-btn{padding:6px 14px;border-radius:99px;font-size:11px;font-weight:600;cursor:pointer;border:1.5px solid transparent;transition:all 0.15s;}
        .ac-empty{text-align:center;padding:60px 20px;color:#94a3b8;}
      `}</style>

      {/* Page header */}
      <div style={{ marginBottom:24 }}>
        <p style={{ fontSize:10,fontWeight:700,color:"#a78bfa",letterSpacing:"0.25em",textTransform:"uppercase",marginBottom:6 }}>Support</p>
        <h1 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:28,fontWeight:400,color:"#1e0a3c",margin:"0 0 4px" }}>
          Contact Messages
        </h1>
        <p style={{ color:"#94a3b8",fontSize:13,margin:0 }}>All customer enquiries submitted via the Contact Us form</p>
      </div>

      {/* Stats row */}
      <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:24 }}>
        {[
          { label:"Total",       value:stats.total,      color:"#7c3aed", from:"#7c3aed", to:"#a855f7" },
          { label:"New",         value:stats.new,        color:"#7c3aed", from:"#7c3aed", to:"#a855f7" },
          { label:"In Progress", value:stats.inProgress, color:"#d97706", from:"#f59e0b", to:"#d97706" },
          { label:"Resolved",    value:stats.resolved,   color:"#059669", from:"#10b981", to:"#059669" },
        ].map((s) => (
          <div key={s.label} className="ac-stat">
            <p style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:28,fontWeight:500,background:`linear-gradient(135deg,${s.from},${s.to})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",margin:"0 0 4px" }}>{s.value}</p>
            <p style={{ fontSize:10,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.1em",margin:0 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div style={{ display:"flex",flexWrap:"wrap",gap:12,alignItems:"center",marginBottom:16 }}>
        {/* Search */}
        <div style={{ flex:1,minWidth:220,position:"relative" }}>
          <svg style={{ position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",opacity:0.35 }} width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#111" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input className="ac-input" style={{ paddingLeft:36 }} placeholder="Search name, email, subject…" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
        </div>

        {/* Status filters */}
        <div style={{ display:"flex",flexWrap:"wrap",gap:6 }}>
          {STATUS_OPTS.map((s) => {
            const meta  = STATUS_META[s] || {};
            const active = filter === s;
            return (
              <button key={s} onClick={() => { setFilter(s); setPage(1); }} className="ac-filter-btn"
                style={{
                  background: active ? (meta.bg || "#f5f3ff") : "transparent",
                  borderColor: active ? (meta.color || "#7c3aed") : "#e5e7eb",
                  color: active ? (meta.color || "#7c3aed") : "#6b7280",
                }}>
                {s === "all" ? "All" : (meta.label || s)}
                {s !== "all" && <span style={{ marginLeft:4,opacity:0.7 }}>({contacts.filter((c) => (c.status || "new") === s).length})</span>}
              </button>
            );
          })}
        </div>

        {/* Refresh */}
        <button onClick={load} style={{ padding:"9px 16px",borderRadius:10,border:"1.5px solid #e5e7eb",background:"white",cursor:"pointer",fontSize:12,fontWeight:600,color:"#7c3aed",display:"flex",alignItems:"center",gap:6 }}>
          ↻ Refresh
        </button>
      </div>

      {/* Table */}
      <div className="ac-card">
        {/* Header */}
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr minmax(100px,auto) 100px 80px",gap:16,padding:"10px 20px",background:"#f9fafb",borderBottom:"1px solid #f1f5f9" }}>
          {["Sender","Subject","Received","Status",""].map((h, i) => (
            <p key={i} style={{ fontSize:9,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.15em",margin:0 }} className={i >= 2 && i !== 4 ? "ac-col-hide" : ""}>{h}</p>
          ))}
        </div>

        {loading ? (
          <div className="ac-empty">
            <div style={{ width:36,height:36,border:"3px solid #ede9fe",borderTopColor:"#7c3aed",borderRadius:"50%",animation:"spin 0.8s linear infinite",margin:"0 auto 12px" }} />
            <p style={{ fontSize:13 }}>Loading messages…</p>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        ) : error ? (
          <div className="ac-empty">
            <p style={{ fontSize:24,marginBottom:8 }}>⚠️</p>
            <p style={{ fontSize:13,color:"#ef4444" }}>{error}</p>
            <button onClick={load} style={{ marginTop:12,padding:"8px 18px",borderRadius:10,background:"#7c3aed",color:"white",border:"none",cursor:"pointer",fontSize:12,fontWeight:600 }}>Retry</button>
          </div>
        ) : paged.length === 0 ? (
          <div className="ac-empty">
            <p style={{ fontSize:32,marginBottom:8 }}>📭</p>
            <p style={{ fontSize:14,fontWeight:600,color:"#374151",marginBottom:4 }}>No messages found</p>
            <p style={{ fontSize:12 }}>Try adjusting your filters</p>
          </div>
        ) : (
          paged.map((c) => {
            const meta = STATUS_META[c.status || "new"] || STATUS_META.new;
            return (
              <div key={c._id} className="ac-row" onClick={() => setSelected(c)}>
                {/* Sender */}
                <div style={{ display:"flex",alignItems:"center",gap:10,minWidth:0 }}>
                  <div style={{ width:34,height:34,borderRadius:"50%",background:"linear-gradient(135deg,#a855f7,#7c3aed)",display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontSize:12,fontWeight:700,flexShrink:0 }}>
                    {(c.name||"?")[0].toUpperCase()}
                  </div>
                  <div style={{ minWidth:0 }}>
                    <p style={{ fontSize:13,fontWeight:600,color:"#111827",margin:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{c.name}</p>
                    <p style={{ fontSize:11,color:"#94a3b8",margin:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{c.email}</p>
                  </div>
                </div>

                {/* Subject */}
                <div style={{ minWidth:0 }}>
                  <p style={{ fontSize:13,fontWeight:500,color:"#374151",margin:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{c.subject || "—"}</p>
                  <p style={{ fontSize:11,color:"#94a3b8",margin:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{(c.message||"").slice(0,60)}…</p>
                </div>

                {/* Received */}
                <p className="ac-col-hide" style={{ fontSize:12,color:"#94a3b8",margin:0 }}>{relTime(c.createdAt)}</p>

                {/* Status badge */}
                <span className="ac-badge ac-col-hide" style={{ background:meta.bg,color:meta.color }}>{meta.label}</span>

                {/* Arrow */}
                <span style={{ color:"#d1d5db",fontSize:18 }}>›</span>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display:"flex",justifyContent:"center",alignItems:"center",gap:8,marginTop:16 }}>
          <button onClick={() => setPage((p) => Math.max(1, p-1))} disabled={page === 1}
            style={{ padding:"7px 14px",borderRadius:9,border:"1.5px solid #e5e7eb",background:"white",cursor:page===1?"not-allowed":"pointer",color:"#7c3aed",fontSize:12,fontWeight:600,opacity:page===1?0.4:1 }}>← Prev</button>
          <span style={{ fontSize:12,color:"#94a3b8" }}>Page {page} of {totalPages}</span>
          <button onClick={() => setPage((p) => Math.min(totalPages, p+1))} disabled={page === totalPages}
            style={{ padding:"7px 14px",borderRadius:9,border:"1.5px solid #e5e7eb",background:"white",cursor:page===totalPages?"not-allowed":"pointer",color:"#7c3aed",fontSize:12,fontWeight:600,opacity:page===totalPages?0.4:1 }}>Next →</button>
        </div>
      )}

      {/* Detail modal */}
      {selected && (
        <DetailModal
          contact={selected}
          onClose={() => setSelected(null)}
          onStatusChange={(id, status) => {
            handleStatusChange(id, status);
            setSelected((prev) => prev && prev._id === id ? { ...prev, status } : prev);
          }}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default AdminContacts;