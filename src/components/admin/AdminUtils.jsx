// ── Admin API helper ──────────────────────────────────────────────
export const API_BASE = "https://lyra-backend-gilt.vercel.app/api/admin";

export const apiFetch = async (path, options = {}) => {
  const user  = JSON.parse(sessionStorage.getItem("user") || "{}");
  const token = user.token || "";
  const isFormData = options.body instanceof FormData;

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      Authorization: token ? `Bearer ${token}` : "",
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || err.error || `HTTP ${res.status}`);
  }
  return res.json();
};

// ── Shared constants ──────────────────────────────────────────────
export const STATUS_STYLES = {
  Delivered:  "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Shipped:    "bg-blue-50 text-blue-700 border border-blue-200",
  Processing: "bg-amber-50 text-amber-700 border border-amber-200",
  Pending:    "bg-gray-50 text-gray-600 border border-gray-200",
  Cancelled:  "bg-red-50 text-red-600 border border-red-200",
};

export const CATEGORIES = [
  "Fashion","Footwear","Watches","Accessories",
  "Bags","Sunglasses","Ethnic Wear","Activewear",
];

// ── Shared UI components ──────────────────────────────────────────
export const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse bg-white/10 rounded-xl ${className}`} />
);

export const ErrorBanner = ({ msg, onRetry }) => (
  <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">
    <span>⚠</span>
    <span className="flex-1">{msg}</span>
    {onRetry && (
      <button onClick={onRetry} className="text-xs underline hover:text-red-300 transition-colors">Retry</button>
    )}
  </div>
);

export const SparkBar = ({ data = [], color = "#7c3aed" }) => {
  if (!data.length) return null;
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end gap-0.5 h-10">
      {data.map((v, i) => (
        <div key={i} className="flex-1 rounded-sm transition-all"
          style={{ height: `${(v / max) * 100}%`, background: color, opacity: 0.35 + (i / data.length) * 0.65 }} />
      ))}
    </div>
  );
};

// ── Input field ───────────────────────────────────────────────────
export const AdminInput = ({ label, value, onChange, placeholder, type = "text", textarea = false }) => (
  <div>
    <label className="block text-xs font-semibold text-white/30 uppercase tracking-wider mb-1.5">{label}</label>
    {textarea ? (
      <textarea value={value} onChange={onChange} rows={3} placeholder={placeholder}
        className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-violet-500/50 transition-all resize-none" />
    ) : (
      <input type={type} value={value} onChange={onChange} placeholder={placeholder}
        className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-violet-500/50 transition-all" />
    )}
  </div>
);

// ── Toggle switch ─────────────────────────────────────────────────
export const Toggle = ({ value, onChange }) => (
  <div onClick={onChange} className={`w-11 h-6 rounded-full relative cursor-pointer transition-all ${value ? "bg-violet-600" : "bg-white/10"}`}>
    <div className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all" style={{ left: value ? "calc(100% - 22px)" : "2px" }} />
  </div>
);