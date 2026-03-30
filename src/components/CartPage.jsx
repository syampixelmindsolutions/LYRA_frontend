// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useCart } from "./CartContext";
// import axios from "axios";

// // ── API instances ─────────────────────────────────────────────────
// const AUTH_HEADER = () => {
//   const user  = JSON.parse(sessionStorage.getItem("user") || "{}");
//   const token = user.token || "";
//   return token ? { Authorization: `Bearer ${token}` } : {};
// };

// const ADDRESS_API = axios.create({ baseURL: "http://localhost:6055/api/addresses" });
// const ORDER_API   = axios.create({ baseURL: "http://localhost:6055/api/orders" });
// const COUPON_API  = axios.create({ baseURL: "http://localhost:6055/api/coupons" });

// [ADDRESS_API, ORDER_API, COUPON_API].forEach((api) => {
//   api.interceptors.request.use((config) => {
//     Object.assign(config.headers, AUTH_HEADER());
//     return config;
//   });
// });

// // ── Step bar ──────────────────────────────────────────────────────
// const STEPS = ["Cart", "Address", "Payment", "Confirmed"];
// const StepBar = ({ current }) => (
//   <div className="flex items-center justify-center gap-0 mb-8">
//     {STEPS.map((step, i) => (
//       <React.Fragment key={step}>
//         <div className="flex flex-col items-center">
//           <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
//             i < current ? "bg-green-500 text-white" :
//             i === current ? "bg-violet-600 text-white shadow-lg shadow-violet-200" :
//             "bg-gray-100 text-gray-400"
//           }`}>
//             {i < current ? "✓" : i + 1}
//           </div>
//           <span className={`text-xs mt-1 font-medium ${i === current ? "text-violet-600" : i < current ? "text-green-600" : "text-gray-400"}`}>
//             {step}
//           </span>
//         </div>
//         {i < STEPS.length - 1 && (
//           <div className={`h-0.5 w-16 mb-4 transition-all ${i < current ? "bg-green-400" : "bg-gray-200"}`} />
//         )}
//       </React.Fragment>
//     ))}
//   </div>
// );

// // ── Address field ─────────────────────────────────────────────────
// const AddressField = ({ label, fieldKey, placeholder, type = "text", half = false, value, onChange, error }) => (
//   <div className={half ? "flex-1" : "w-full"}>
//     <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{label}</label>
//     <input type={type} value={value} placeholder={placeholder} onChange={onChange}
//       maxLength={fieldKey === "phone" ? 10 : fieldKey === "pincode" ? 6 : undefined}
//       className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${
//         error ? "border-red-400 bg-red-50" : "border-purple-100 focus:border-violet-500 focus:bg-violet-50/30"
//       }`} />
//     {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
//   </div>
// );

// // ── Address form ──────────────────────────────────────────────────
// const AddressForm = ({ onSave, onCancel, initial = {}, saving }) => {
//   const [form, setForm] = useState({
//     fullName: initial.fullName || "", phone: initial.phone    || "",
//     street:   initial.street   || "", city:  initial.city     || "",
//     state:    initial.state    || "", pincode: initial.pincode || "",
//     label:    initial.label    || "Home",
//   });
//   const [errors, setErrors] = useState({});

//   const set = (k, v) => { setForm((f) => ({ ...f, [k]: v })); setErrors((e) => ({ ...e, [k]: "" })); };

//   const validate = () => {
//     const e = {};
//     if (!form.fullName.trim())       e.fullName = "Required";
//     if (form.phone.length !== 10)    e.phone    = "Enter valid 10-digit number";
//     if (!form.street.trim())         e.street   = "Required";
//     if (!form.city.trim())           e.city     = "Required";
//     if (!form.state.trim())          e.state    = "Required";
//     if (form.pincode.length !== 6)   e.pincode  = "Enter valid 6-digit pincode";
//     return e;
//   };

//   const handleSave = () => {
//     const e = validate();
//     if (Object.keys(e).length > 0) { setErrors(e); return; }
//     onSave(form);
//   };

//   return (
//     <div className="bg-white rounded-2xl border border-purple-100 p-6">
//       <h3 className="font-serif text-lg text-gray-900 mb-5">{initial._id || initial.id ? "Edit Address" : "Add New Address"}</h3>
//       <div className="flex gap-2 mb-4">
//         {["Home", "Work", "Other"].map((l) => (
//           <button key={l} onClick={() => set("label", l)}
//             className={`px-4 py-1.5 rounded-xl text-xs font-semibold border-2 transition-all ${form.label === l ? "border-violet-600 bg-violet-600 text-white" : "border-gray-200 text-gray-600 hover:border-violet-300"}`}>
//             {l === "Home" ? "🏠" : l === "Work" ? "💼" : "📍"} {l}
//           </button>
//         ))}
//       </div>
//       <div className="space-y-4">
//         <div className="flex gap-3">
//           <AddressField label="Full Name" fieldKey="fullName" placeholder="Recipient name" half value={form.fullName} error={errors.fullName} onChange={(e) => set("fullName", e.target.value)} />
//           <AddressField label="Phone" fieldKey="phone" placeholder="10-digit mobile" type="tel" half value={form.phone} error={errors.phone} onChange={(e) => set("phone", e.target.value.replace(/\D/g, ""))} />
//         </div>
//         <AddressField label="Street / Flat / Area" fieldKey="street" placeholder="House no, building, street name" value={form.street} error={errors.street} onChange={(e) => set("street", e.target.value)} />
//         <div className="flex gap-3">
//           <AddressField label="City" fieldKey="city" placeholder="City" half value={form.city} error={errors.city} onChange={(e) => set("city", e.target.value)} />
//           <AddressField label="State" fieldKey="state" placeholder="State" half value={form.state} error={errors.state} onChange={(e) => set("state", e.target.value)} />
//         </div>
//         <AddressField label="Pincode" fieldKey="pincode" placeholder="6-digit pincode" type="tel" value={form.pincode} error={errors.pincode} onChange={(e) => set("pincode", e.target.value.replace(/\D/g, ""))} />
//       </div>
//       <div className="flex gap-3 mt-6">
//         <button onClick={handleSave} disabled={saving}
//           className="flex-1 py-3 bg-gradient-to-r from-violet-600 to-purple-500 text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-purple-200 transition-all disabled:opacity-60">
//           {saving ? "Saving..." : "Save Address"}
//         </button>
//         {onCancel && (
//           <button onClick={onCancel} className="px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-600 text-sm font-semibold hover:border-gray-300 transition-all">Cancel</button>
//         )}
//       </div>
//     </div>
//   );
// };

// // ══════════════════════════════════════════════════════════════════
// // MAIN CART PAGE
// // ══════════════════════════════════════════════════════════════════
// const CartPage = () => {
//   const navigate = useNavigate();
//   const { cartItems, removeFromCart, updateQuantity, cartTotal, shippingFee, grandTotal, clearCart } = useCart();

//   const [step,        setStep]        = useState(0);
//   const [coupon,      setCoupon]      = useState("");
//   const [couponMsg,   setCouponMsg]   = useState("");
//   const [couponValid, setCouponValid] = useState(false);
//   const [discount,    setDiscount]    = useState(0);
//   const [couponCode,  setCouponCode]  = useState("");
//   const [removingId,  setRemovingId]  = useState(null);

//   // ── Address state (from backend) ─────────────────────────────────
//   const [addresses,     setAddresses]    = useState([]);
//   const [addrLoading,   setAddrLoading]  = useState(false);
//   const [addrSaving,    setAddrSaving]   = useState(false);
//   const [selectedAddr,  setSelectedAddr] = useState(null);
//   const [showAddrForm,  setShowAddrForm] = useState(false);
//   const [editingAddr,   setEditingAddr]  = useState(null);

//   // ── Payment state ─────────────────────────────────────────────────
//   const [payMethod,  setPayMethod]  = useState("");
//   const [upiId,      setUpiId]      = useState("");
//   const [upiError,   setUpiError]   = useState("");
//   const [cardNum,    setCardNum]    = useState("");
//   const [cardName,   setCardName]   = useState("");
//   const [cardExpiry, setCardExpiry] = useState("");
//   const [cardCvv,    setCardCvv]    = useState("");
//   const [placing,    setPlacing]    = useState(false);

//   // ── Order confirmation state ──────────────────────────────────────
//   const [placedOrder, setPlacedOrder] = useState(null);

//   const finalTotal = grandTotal - discount;

//   // ── Fetch addresses from backend ──────────────────────────────────
//   // GET /api/addresses
//   useEffect(() => {
//     const loadAddresses = async () => {
//       setAddrLoading(true);
//       try {
//         const { data } = await ADDRESS_API.get("");
//         const list = Array.isArray(data) ? data : data.addresses || [];
//         setAddresses(list);
//         // Auto-select default address if exists
//         const def = list.find((a) => a.isDefault || a.default);
//         if (def) setSelectedAddr(def._id || def.id);
//       } catch (err) {
//         console.error("Address load error:", err.response?.data || err.message);
//       } finally {
//         setAddrLoading(false);
//       }
//     };
//     loadAddresses();
//   }, []);

//   // ── Save address to backend ──────────────────────────────────────
//   // POST /api/addresses  or  PUT /api/addresses/:id
//   const handleSaveAddress = async (form) => {
//     setAddrSaving(true);
//     try {
//       if (editingAddr) {
//         const id = editingAddr._id || editingAddr.id;
//         const { data } = await ADDRESS_API.put(`/${id}`, form);
//         const updated = data.address || data;
//         setAddresses((prev) => prev.map((a) => (a._id || a.id) === id ? updated : a));
//       } else {
//         const { data } = await ADDRESS_API.post("", form);
//         const newAddr = data.address || data;
//         setAddresses((prev) => [...prev, newAddr]);
//         setSelectedAddr(newAddr._id || newAddr.id);
//       }
//       setShowAddrForm(false);
//       setEditingAddr(null);
//     } catch (err) {
//       console.error("Save address error:", err.response?.data || err.message);
//       alert(err.response?.data?.message || "Failed to save address. Please try again.");
//     } finally {
//       setAddrSaving(false);
//     }
//   };

//   // ── Delete address ────────────────────────────────────────────────
//   // DELETE /api/addresses/:id
//   const handleDeleteAddress = async (id) => {
//     try {
//       await ADDRESS_API.delete(`/${id}`);
//       setAddresses((prev) => prev.filter((a) => (a._id || a.id) !== id));
//       if (selectedAddr === id) setSelectedAddr(null);
//     } catch (err) {
//       console.error("Delete address error:", err.response?.data || err.message);
//     }
//   };

//   // ── Validate coupon ───────────────────────────────────────────────
//   // POST /api/coupons/validate  { code, cartTotal }
//   const applyCoupon = async () => {
//     const code = coupon.trim().toUpperCase();
//     if (!code) return;
//     try {
//       const { data } = await COUPON_API.post("/validate", { code, cartTotal });
//       setDiscount(data.discountAmount || Math.round(cartTotal * (data.discountPercent || 0) / 100));
//       setCouponMsg(`✓ ${data.message || `Coupon applied! You save ${data.discountPercent}%`}`);
//       setCouponValid(true);
//       setCouponCode(code);
//     } catch (err) {
//       // Fallback to hardcoded coupons if API not ready
//       const COUPONS = { LYRA10: { pct: 10, min: 300 }, SAVE20: { pct: 20, min: 800 }, FIRST50: { pct: 50, min: 1500 } };
//       const c = COUPONS[code];
//       if (!c) { setCouponMsg("✗ Invalid coupon code"); setCouponValid(false); setDiscount(0); return; }
//       if (cartTotal < c.min) { setCouponMsg(`Minimum order ₹${c.min} required`); setCouponValid(false); return; }
//       setDiscount(Math.round(cartTotal * c.pct / 100));
//       setCouponMsg(`✓ Coupon applied! You save ${c.pct}%`);
//       setCouponValid(true);
//       setCouponCode(code);
//     }
//   };

//   const handleRemove = (cartItemId) => {
//     setRemovingId(cartItemId);
//     setTimeout(() => { removeFromCart(cartItemId); setRemovingId(null); }, 300);
//   };

//   // ── Place order ───────────────────────────────────────────────────
//   // POST /api/orders
//   // Body: { items, addressId, paymentMethod, couponCode, total, subtotal, discount, shippingFee }
//   const handlePlaceOrder = async () => {
//     if (!payMethod) return;
//     if (payMethod === "upi" && !upiId.includes("@")) { setUpiError("Enter valid UPI ID (e.g. name@upi)"); return; }

//     const addr = addresses.find((a) => (a._id || a.id) === selectedAddr);
//     if (!addr) return;

//     setPlacing(true);
//     try {
//       const orderPayload = {
//         items: cartItems.map((item) => ({
//           product:  item._id || item.productId || item.id,
//           name:     item.name,
//           brand:    item.brand,
//           image:    item.images?.[0] || item.image,
//           price:    item.price,
//           originalPrice: item.originalPrice,
//           size:     item.size,
//           color:    item.color,
//           quantity: item.quantity,
//         })),
//         addressId:      selectedAddr,
//         address:        addr,            // send full address as fallback
//         paymentMethod:  payMethod,
//         couponCode:     couponCode || null,
//         subtotal:       cartTotal,
//         discount,
//         shippingFee,
//         total:          finalTotal,
//         upiId:          payMethod === "upi" ? upiId : undefined,
//       };

//       const { data } = await ORDER_API.post("", orderPayload);
//       const order = data.order || data;

//       // Clear cart from backend
//       await clearCart();

//       setPlacedOrder(order);
//       setStep(3);
//     } catch (err) {
//       console.error("Place order error:", err.response?.data || err.message);
//       alert(err.response?.data?.message || "Failed to place order. Please try again.");
//     } finally {
//       setPlacing(false);
//     }
//   };

//   // ── Price summary component ───────────────────────────────────────
//   const PriceSummary = ({ showCheckout = false }) => (
//     <div className="bg-white rounded-2xl border border-purple-100 p-5 sticky top-20">
//       <p className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">Order Summary</p>
//       <div className="space-y-3 text-sm">
//         <div className="flex justify-between text-gray-600">
//           <span>Items ({cartItems.reduce((s, i) => s + i.quantity, 0)})</span>
//           <span>₹{cartItems.reduce((s, i) => s + (i.originalPrice || i.price) * i.quantity, 0).toLocaleString()}</span>
//         </div>
//         <div className="flex justify-between text-green-600 font-medium">
//           <span>Product Discount</span>
//           <span>− ₹{cartItems.reduce((s, i) => s + ((i.originalPrice || i.price) - i.price) * i.quantity, 0).toLocaleString()}</span>
//         </div>
//         {discount > 0 && (
//           <div className="flex justify-between text-green-600 font-medium">
//             <span>Coupon Discount</span>
//             <span>− ₹{discount.toLocaleString()}</span>
//           </div>
//         )}
//         <div className="flex justify-between text-gray-600">
//           <span>Delivery</span>
//           <span className={shippingFee === 0 ? "text-green-600 font-semibold" : ""}>{shippingFee === 0 ? "FREE" : `₹${shippingFee}`}</span>
//         </div>
//         <div className="border-t border-purple-50 pt-3">
//           <div className="flex justify-between font-bold text-gray-900 text-base">
//             <span>Total</span>
//             <span>₹{finalTotal.toLocaleString()}</span>
//           </div>
//           {(cartItems.reduce((s, i) => s + ((i.originalPrice || i.price) - i.price) * i.quantity, 0) + discount) > 0 && (
//             <p className="text-green-600 text-xs font-semibold mt-1">
//               🎉 You save ₹{(cartItems.reduce((s, i) => s + ((i.originalPrice || i.price) - i.price) * i.quantity, 0) + discount).toLocaleString()}
//             </p>
//           )}
//         </div>
//       </div>
//       {showCheckout && (
//         <button onClick={() => setStep(1)} className="w-full mt-4 py-4 bg-gradient-to-r from-violet-600 to-purple-500 text-white rounded-2xl font-bold text-sm hover:shadow-xl hover:shadow-purple-200 hover:-translate-y-0.5 transition-all">
//           Proceed to Checkout →
//         </button>
//       )}
//       <div className="flex items-center justify-center gap-4 mt-4">
//         {["🔒 Secure", "↩ Returns", "✓ Genuine"].map((t) => <span key={t} className="text-xs text-gray-400">{t}</span>)}
//       </div>
//     </div>
//   );

//   // ── Empty cart ────────────────────────────────────────────────────
//   if (cartItems.length === 0 && step !== 3) {
//     return (
//       <div className="min-h-screen bg-gray-50 font-sans">
//         <div className="sticky top-0 z-50 bg-[#1e0a3c] flex items-center gap-4 px-6 h-14 shadow-lg shadow-purple-900/30">
//           <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/70 hover:text-white text-sm px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all">← Back</button>
//           <span className="font-serif text-base text-purple-200 tracking-wide">My Cart</span>
//         </div>
//         <div className="flex flex-col items-center justify-center min-h-[80vh] gap-5 px-4 text-center">
//           <div className="w-32 h-32 bg-purple-50 rounded-full flex items-center justify-center"><span className="text-6xl">🛒</span></div>
//           <h2 className="font-serif text-2xl text-gray-900">Your cart is empty</h2>
//           <p className="text-gray-400 text-sm">Looks like you haven't added anything yet.</p>
//           <button onClick={() => navigate("/dashboard")} className="px-8 py-3.5 bg-gradient-to-r from-violet-600 to-purple-500 text-white rounded-2xl font-semibold text-sm hover:shadow-xl hover:shadow-purple-200 hover:-translate-y-0.5 transition-all">Start Shopping →</button>
//           <div className="bg-violet-50 rounded-2xl px-6 py-4 text-sm text-violet-600">
//             <p className="font-semibold mb-1">🎁 Available Coupons</p>
//             <p className="text-xs text-violet-400">LYRA10 · SAVE20 · FIRST50</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 font-sans">

//       {/* TOPBAR */}
//       <div className="sticky top-0 z-50 bg-[#1e0a3c] flex items-center gap-4 px-6 h-14 shadow-lg shadow-purple-900/30">
//         <button onClick={() => step > 0 ? setStep(step - 1) : navigate(-1)} className="flex items-center gap-2 text-white/70 hover:text-white text-sm px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all">← Back</button>
//         <span className="font-serif text-base text-purple-200 tracking-wide">
//           {["My Cart", "Delivery Address", "Payment", "Order Confirmed"][step]}
//           {step === 0 && <span className="text-white/40 font-sans text-sm ml-2">({cartItems.length} items)</span>}
//         </span>
//         {step === 0 && <button onClick={clearCart} className="ml-auto text-xs text-red-400 hover:text-red-300 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all">Clear All</button>}
//       </div>

//       {/* BREADCRUMB */}
//       <div className="bg-white border-b border-purple-50 px-6 py-3 flex items-center gap-2 text-xs text-gray-400">
//         <span className="cursor-pointer hover:text-violet-600" onClick={() => navigate("/dashboard")}>Home</span>
//         <span>›</span>
//         <span className={step === 0 ? "text-gray-700 font-medium" : "cursor-pointer hover:text-violet-600"} onClick={() => step > 0 && setStep(0)}>Cart</span>
//         {step >= 1 && <><span>›</span><span className={step === 1 ? "text-gray-700 font-medium" : "cursor-pointer hover:text-violet-600"} onClick={() => step > 1 && setStep(1)}>Address</span></>}
//         {step >= 2 && <><span>›</span><span className={step === 2 ? "text-gray-700 font-medium" : ""}>Payment</span></>}
//         {step === 3 && <><span>›</span><span className="text-green-600 font-medium">Confirmed</span></>}
//       </div>

//       <div className="max-w-screen-xl mx-auto px-4 py-6">
//         <StepBar current={step} />

//         {/* ════ STEP 0 — CART ════ */}
//         {step === 0 && (
//           <div className="flex gap-6 items-start flex-col lg:flex-row">
//             <div className="flex-1 min-w-0 space-y-4">

//               {/* Free delivery banner */}
//               {cartTotal < 999 ? (
//                 <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-3 flex items-center gap-3">
//                   <span className="text-xl">🚚</span>
//                   <div className="flex-1">
//                     <p className="text-sm font-semibold text-amber-800">Add ₹{(999 - cartTotal).toLocaleString()} more for FREE delivery!</p>
//                     <div className="mt-1.5 h-1.5 bg-amber-100 rounded-full overflow-hidden">
//                       <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${Math.min(100, (cartTotal / 999) * 100)}%` }} />
//                     </div>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="bg-green-50 border border-green-200 rounded-2xl px-5 py-3 flex items-center gap-3">
//                   <span className="text-xl">🎉</span>
//                   <p className="text-sm font-semibold text-green-700">You've unlocked FREE delivery!</p>
//                 </div>
//               )}

//               {/* Cart items */}
//               {cartItems.map((item) => {
//                 const itemId = item._id || item.cartItemId;
//                 return (
//                   <div key={itemId}
//                     className={`bg-white rounded-2xl border border-purple-100 p-4 transition-all duration-300 ${removingId === itemId ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}>
//                     <div className="flex gap-4">
//                       <div className="w-28 h-28 flex-shrink-0 rounded-xl overflow-hidden bg-purple-50 cursor-pointer" onClick={() => navigate(`/product/${item._id || item.productId || item.id}`)}>
//                         <img src={item.images?.[0] || item.image} alt={item.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
//                           onError={(e) => { e.target.src = "https://placehold.co/112x112/f3f4f6/9ca3af?text=L"; }} />
//                       </div>
//                       <div className="flex-1 min-w-0">
//                         <div className="flex items-start justify-between gap-2">
//                           <div className="min-w-0">
//                             <p className="text-xs font-bold text-violet-400 uppercase tracking-wider mb-0.5">{item.brand}</p>
//                             <p className="font-medium text-gray-900 text-sm leading-tight cursor-pointer hover:text-violet-600 truncate" onClick={() => navigate(`/product/${item._id || item.productId || item.id}`)}>{item.name}</p>
//                           </div>
//                           <button onClick={() => handleRemove(itemId)} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-red-50 text-gray-300 hover:text-red-400 transition-all text-sm flex-shrink-0">✕</button>
//                         </div>
//                         <div className="flex items-center gap-2 mt-2 flex-wrap">
//                           <span className="text-xs bg-purple-50 text-violet-600 font-semibold px-2.5 py-1 rounded-lg border border-purple-100">Size: {item.size}</span>
//                           <span className="text-xs bg-purple-50 text-violet-600 font-semibold px-2.5 py-1 rounded-lg border border-purple-100 flex items-center gap-1.5">
//                             <span className="w-3 h-3 rounded-full border border-white shadow-sm" style={{ background: item.color === "White" ? "#f9fafb" : item.color?.toLowerCase() || "#ccc" }} />{item.color}
//                           </span>
//                         </div>
//                         <div className="flex items-center justify-between mt-3">
//                           <div>
//                             <span className="text-lg font-bold text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</span>
//                             {item.quantity > 1 && <span className="text-xs text-gray-400 ml-1">₹{item.price.toLocaleString()} each</span>}
//                             {item.originalPrice && <span className="text-xs text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full ml-2">{Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% off</span>}
//                           </div>
//                           <div className="flex items-center border-2 border-purple-100 rounded-xl overflow-hidden">
//                             <button onClick={() => updateQuantity(itemId, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-violet-50 hover:text-violet-600 transition-colors text-lg">−</button>
//                             <span className="w-8 text-center font-bold text-gray-900 text-sm">{item.quantity}</span>
//                             <button onClick={() => updateQuantity(itemId, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-violet-50 hover:text-violet-600 transition-colors text-lg">+</button>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}

//               {/* Coupon */}
//               <div className="bg-white rounded-2xl border border-purple-100 p-5">
//                 <p className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">🎟 Apply Coupon</p>
//                 <div className="flex gap-2">
//                   <input type="text" value={coupon} onChange={(e) => { setCoupon(e.target.value.toUpperCase()); setCouponMsg(""); }}
//                     placeholder="Enter coupon code"
//                     className="flex-1 px-4 py-2.5 rounded-xl border border-purple-100 text-sm outline-none focus:border-violet-400 uppercase tracking-widest font-semibold" />
//                   <button onClick={applyCoupon} className="px-4 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition-colors">Apply</button>
//                 </div>
//                 {couponMsg && <p className={`text-xs mt-2 font-semibold ${couponValid ? "text-green-600" : "text-red-500"}`}>{couponMsg}</p>}
//                 <div className="flex gap-2 mt-3">
//                   {["LYRA10", "SAVE20", "FIRST50"].map((c) => (
//                     <button key={c} onClick={() => { setCoupon(c); setCouponMsg(""); }}
//                       className="text-xs px-3 py-1.5 rounded-lg border border-violet-200 text-violet-600 hover:bg-violet-50 font-semibold tracking-wider">{c}</button>
//                   ))}
//                 </div>
//               </div>

//               <button onClick={() => navigate("/dashboard")} className="w-full py-3.5 rounded-2xl border-2 border-purple-100 text-sm font-semibold text-violet-600 hover:border-violet-300 hover:bg-violet-50 transition-all">← Continue Shopping</button>
//             </div>
//             <div className="w-full lg:w-96 flex-shrink-0"><PriceSummary showCheckout /></div>
//           </div>
//         )}

//         {/* ════ STEP 1 — ADDRESS ════ */}
//         {step === 1 && (
//           <div className="flex gap-6 items-start flex-col lg:flex-row">
//             <div className="flex-1 space-y-4">
//               <div className="flex items-center justify-between">
//                 <h2 className="font-serif text-xl text-gray-900">Delivery Address</h2>
//                 {!showAddrForm && (
//                   <button onClick={() => { setShowAddrForm(true); setEditingAddr(null); }}
//                     className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors">
//                     + Add New Address
//                   </button>
//                 )}
//               </div>

//               {showAddrForm && (
//                 <AddressForm
//                   key={editingAddr ? `edit-${editingAddr._id || editingAddr.id}` : "new"}
//                   initial={editingAddr || {}}
//                   onSave={handleSaveAddress}
//                   onCancel={() => { setShowAddrForm(false); setEditingAddr(null); }}
//                   saving={addrSaving}
//                 />
//               )}

//               {addrLoading ? (
//                 <div className="space-y-3">
//                   {[1,2].map((i) => <div key={i} className="bg-white rounded-2xl border border-purple-100 p-5 animate-pulse h-24" />)}
//                 </div>
//               ) : addresses.length === 0 && !showAddrForm ? (
//                 <div className="bg-white rounded-2xl border border-purple-100 p-10 text-center">
//                   <p className="text-4xl mb-3">📍</p>
//                   <p className="font-serif text-lg text-gray-700 mb-2">No addresses saved</p>
//                   <p className="text-sm text-gray-400 mb-4">Add a delivery address to continue</p>
//                   <button onClick={() => setShowAddrForm(true)} className="px-6 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition-colors">+ Add Address</button>
//                 </div>
//               ) : (
//                 addresses.map((addr) => {
//                   const id = addr._id || addr.id;
//                   return (
//                     <div key={id} onClick={() => setSelectedAddr(id)}
//                       className={`bg-white rounded-2xl border-2 p-5 cursor-pointer transition-all ${selectedAddr === id ? "border-violet-600 shadow-md shadow-violet-100" : "border-purple-100 hover:border-violet-200"}`}>
//                       <div className="flex items-start justify-between gap-3">
//                         <div className="flex items-start gap-3 flex-1">
//                           <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center ${selectedAddr === id ? "border-violet-600" : "border-gray-300"}`}>
//                             {selectedAddr === id && <div className="w-2.5 h-2.5 rounded-full bg-violet-600" />}
//                           </div>
//                           <div>
//                             <div className="flex items-center gap-2 mb-1 flex-wrap">
//                               <span className="text-xs font-bold bg-violet-100 text-violet-700 px-2 py-0.5 rounded-lg">{addr.label || "Home"}</span>
//                               {(addr.isDefault || addr.default) && <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-lg">✓ Default</span>}
//                               <span className="font-semibold text-gray-900 text-sm">{addr.fullName}</span>
//                               <span className="text-xs text-gray-500">{addr.phone}</span>
//                             </div>
//                             <p className="text-sm text-gray-600">{addr.street}, {addr.city}, {addr.state} - {addr.pincode}</p>
//                           </div>
//                         </div>
//                         <div className="flex gap-2 flex-shrink-0">
//                           <button onClick={(e) => { e.stopPropagation(); setEditingAddr(addr); setShowAddrForm(true); }} className="text-xs text-violet-600 hover:underline font-semibold px-2 py-1">Edit</button>
//                           <button onClick={(e) => { e.stopPropagation(); handleDeleteAddress(id); }} className="text-xs text-red-400 hover:underline font-semibold px-2 py-1">Delete</button>
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })
//               )}

//               {addresses.length > 0 && !showAddrForm && (
//                 <button onClick={() => { if (selectedAddr) setStep(2); }} disabled={!selectedAddr}
//                   className={`w-full py-4 rounded-2xl font-bold text-sm transition-all ${selectedAddr ? "bg-gradient-to-r from-violet-600 to-purple-500 text-white hover:shadow-xl hover:shadow-purple-200 hover:-translate-y-0.5" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}>
//                   {selectedAddr ? "Deliver to this Address →" : "Please select an address"}
//                 </button>
//               )}
//             </div>
//             <div className="w-full lg:w-96 flex-shrink-0"><PriceSummary /></div>
//           </div>
//         )}

//         {/* ════ STEP 2 — PAYMENT ════ */}
//         {step === 2 && (
//           <div className="flex gap-6 items-start flex-col lg:flex-row">
//             <div className="flex-1 space-y-4">
//               <h2 className="font-serif text-xl text-gray-900">Choose Payment Method</h2>

//               {[
//                 { id: "upi",        icon: "📱", label: "UPI",                sub: "Pay via UPI ID (GPay, PhonePe, Paytm)" },
//                 { id: "cod",        icon: "💵", label: "Cash on Delivery",   sub: "Pay when your order arrives" },
//                 { id: "netbanking", icon: "🏦", label: "Net Banking",        sub: "All major banks supported" },
//                 { id: "card",       icon: "💳", label: "Credit / Debit Card",sub: "Visa, Mastercard, RuPay" },
//                 { id: "wallet",     icon: "👛", label: "Wallet",             sub: "Paytm, PhonePe, Amazon Pay" },
//               ].map((pm) => (
//                 <div key={pm.id} onClick={() => { setPayMethod(pm.id); setUpiError(""); }}
//                   className={`bg-white rounded-2xl border-2 p-5 cursor-pointer transition-all ${payMethod === pm.id ? "border-violet-600 shadow-md shadow-violet-100" : "border-purple-100 hover:border-violet-200"}`}>
//                   <div className="flex items-center gap-4">
//                     <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${payMethod === pm.id ? "border-violet-600" : "border-gray-300"}`}>
//                       {payMethod === pm.id && <div className="w-2.5 h-2.5 rounded-full bg-violet-600" />}
//                     </div>
//                     <span className="text-2xl">{pm.icon}</span>
//                     <div>
//                       <p className="font-semibold text-gray-900 text-sm">{pm.label}</p>
//                       <p className="text-xs text-gray-400">{pm.sub}</p>
//                     </div>
//                   </div>

//                   {payMethod === "upi" && pm.id === "upi" && (
//                     <div className="mt-4 pl-9" onClick={(e) => e.stopPropagation()}>
//                       <input type="text" value={upiId} onChange={(e) => { setUpiId(e.target.value); setUpiError(""); }} placeholder="yourname@upi"
//                         className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none ${upiError ? "border-red-400 bg-red-50" : "border-purple-100 focus:border-violet-500"}`} />
//                       {upiError && <p className="text-xs text-red-500 mt-1">{upiError}</p>}
//                       <div className="flex gap-2 mt-3">
//                         {[{ name: "GPay", icon: "🟢" }, { name: "PhonePe", icon: "🟣" }, { name: "Paytm", icon: "🔵" }].map((app) => (
//                           <button key={app.name} className="flex-1 py-2 rounded-xl border border-purple-100 text-xs font-semibold text-gray-600 hover:border-violet-300 hover:bg-violet-50">{app.icon} {app.name}</button>
//                         ))}
//                       </div>
//                     </div>
//                   )}

//                   {payMethod === "netbanking" && pm.id === "netbanking" && (
//                     <div className="mt-4 pl-9 grid grid-cols-3 gap-2" onClick={(e) => e.stopPropagation()}>
//                       {["SBI","HDFC","ICICI","Axis","Kotak","Others"].map((bank) => (
//                         <button key={bank} className="py-2 rounded-xl border border-purple-100 text-xs font-semibold text-gray-600 hover:border-violet-300 hover:bg-violet-50">🏦 {bank}</button>
//                       ))}
//                     </div>
//                   )}

//                   {payMethod === "card" && pm.id === "card" && (
//                     <div className="mt-4 pl-9 space-y-3" onClick={(e) => e.stopPropagation()}>
//                       <div>
//                         <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Card Number</label>
//                         <input type="text" value={cardNum} onChange={(e) => setCardNum(e.target.value.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim())} placeholder="1234 5678 9012 3456" maxLength={19}
//                           className="w-full px-4 py-2.5 rounded-xl border border-purple-100 text-sm outline-none focus:border-violet-500 tracking-widest" />
//                       </div>
//                       <div>
//                         <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Cardholder Name</label>
//                         <input type="text" value={cardName} onChange={(e) => setCardName(e.target.value)} placeholder="Name on card" className="w-full px-4 py-2.5 rounded-xl border border-purple-100 text-sm outline-none focus:border-violet-500" />
//                       </div>
//                       <div className="flex gap-3">
//                         <div className="flex-1">
//                           <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Expiry</label>
//                           <input type="text" value={cardExpiry} onChange={(e) => { let v=e.target.value.replace(/\D/g,""); if(v.length>=2) v=v.slice(0,2)+"/"+v.slice(2,4); setCardExpiry(v); }} placeholder="MM/YY" maxLength={5} className="w-full px-4 py-2.5 rounded-xl border border-purple-100 text-sm outline-none focus:border-violet-500" />
//                         </div>
//                         <div className="flex-1">
//                           <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">CVV</label>
//                           <input type="password" value={cardCvv} onChange={(e) => setCardCvv(e.target.value.replace(/\D/g,"").slice(0,3))} placeholder="•••" maxLength={3} autoComplete="off" className="w-full px-4 py-2.5 rounded-xl border border-purple-100 text-sm outline-none focus:border-violet-500" />
//                         </div>
//                       </div>
//                     </div>
//                   )}

//                   {payMethod === "wallet" && pm.id === "wallet" && (
//                     <div className="mt-4 pl-9 flex gap-2" onClick={(e) => e.stopPropagation()}>
//                       {["Paytm","PhonePe","Amazon Pay"].map((w) => (
//                         <button key={w} className="flex-1 py-2 rounded-xl border border-purple-100 text-xs font-semibold text-gray-600 hover:border-violet-300 hover:bg-violet-50">👛 {w}</button>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               ))}

//               {/* Address preview */}
//               {selectedAddr && (() => {
//                 const addr = addresses.find((a) => (a._id || a.id) === selectedAddr);
//                 return addr ? (
//                   <div className="bg-violet-50 rounded-2xl p-4 border border-violet-100">
//                     <div className="flex items-center justify-between mb-2">
//                       <p className="text-xs font-bold text-violet-700 uppercase tracking-wider">📍 Delivering to</p>
//                       <button onClick={() => setStep(1)} className="text-xs text-violet-600 hover:underline font-semibold">Change</button>
//                     </div>
//                     <p className="text-sm text-gray-700">
//                       <span className="font-semibold">{addr.fullName}</span> · {addr.phone}<br />
//                       {addr.street}, {addr.city}, {addr.state} - {addr.pincode}
//                     </p>
//                   </div>
//                 ) : null;
//               })()}

//               <button onClick={handlePlaceOrder} disabled={!payMethod || placing}
//                 className={`w-full py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${payMethod && !placing ? "bg-gradient-to-r from-violet-600 to-purple-500 text-white hover:shadow-xl hover:shadow-purple-200 hover:-translate-y-0.5" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}>
//                 {placing ? (
//                   <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg> Placing Order...</>
//                 ) : `Place Order · ₹${finalTotal.toLocaleString()} →`}
//               </button>
//             </div>
//             <div className="w-full lg:w-96 flex-shrink-0"><PriceSummary /></div>
//           </div>
//         )}

//         {/* ════ STEP 3 — CONFIRMATION ════ */}
//         {step === 3 && placedOrder && (
//           <div className="max-w-lg mx-auto text-center py-12">
//             <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"><span className="text-5xl">✅</span></div>
//             <h1 className="font-serif text-3xl text-gray-900 mb-2">Order Placed!</h1>
//             <p className="text-gray-500 mb-6">Thank you for shopping with Lyra ✦</p>

//             <div className="bg-violet-50 rounded-2xl p-6 mb-6 text-left space-y-3">
//               {[
//                 { label: "Order ID",  value: <span className="font-mono font-bold text-violet-600">{placedOrder._id || placedOrder.id || placedOrder.orderId}</span> },
//                 { label: "Amount Paid", value: `₹${finalTotal.toLocaleString()}` },
//                 { label: "Payment",   value: { cod:"Cash on Delivery", upi:"UPI", card:"Card", netbanking:"Net Banking", wallet:"Wallet" }[payMethod] },
//                 { label: "Estimated Delivery", value: <span className="text-green-600 font-semibold">{new Date(Date.now() + 5 * 86400000).toLocaleDateString("en-IN", { day:"numeric", month:"short" })} – {new Date(Date.now() + 7 * 86400000).toLocaleDateString("en-IN", { day:"numeric", month:"short" })}</span> },
//               ].map(({ label, value }) => (
//                 <div key={label} className="flex justify-between">
//                   <span className="font-bold text-gray-700 text-sm">{label}</span>
//                   <span className="font-semibold text-gray-900 text-sm">{value}</span>
//                 </div>
//               ))}
//             </div>

//             {/* Tracking timeline */}
//             <div className="bg-white rounded-2xl border border-purple-100 p-5 mb-6 text-left">
//               <p className="font-semibold text-gray-700 mb-4 text-sm uppercase tracking-wider">Order Tracking</p>
//               {[
//                 { label: "Order Confirmed",  active: true,  time: "Just now" },
//                 { label: "Being Processed",  active: false, time: "In 1-2 hrs" },
//                 { label: "Shipped",          active: false, time: "In 1-2 days" },
//                 { label: "Out for Delivery", active: false, time: "In 4-5 days" },
//                 { label: "Delivered",        active: false, time: "In 5-7 days" },
//               ].map((s, i) => (
//                 <div key={s.label} className="flex items-start gap-3 mb-3 last:mb-0">
//                   <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold ${s.active ? "bg-green-500 text-white" : "bg-gray-100 text-gray-400"}`}>
//                     {s.active ? "✓" : i + 1}
//                   </div>
//                   <div>
//                     <p className={`text-sm font-semibold ${s.active ? "text-green-600" : "text-gray-400"}`}>{s.label}</p>
//                     <p className="text-xs text-gray-400">{s.time}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <div className="flex gap-3">
//               <button onClick={() => navigate("/dashboard")} className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-500 text-white font-bold text-sm hover:shadow-xl hover:shadow-purple-200 hover:-translate-y-0.5 transition-all">Continue Shopping →</button>
//               <button onClick={() => navigate("/profile?tab=orders")} className="px-6 py-3.5 rounded-2xl border-2 border-violet-200 text-violet-600 font-bold text-sm hover:bg-violet-50 transition-all">My Orders</button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CartPage;



import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "./CartContext";
import axios from "axios";

// ══════════════════════════════════════════════════════════════════
// API INSTANCES
// Base: http://localhost:6055  (matches server.js PORT)
//
// Routes mounted in server.js:
//   app.use("/api/addresses", addressRoutes)
//   app.use("/api/orders",    orderRoutes)
//   app.use("/api/coupons",   couponRoutes)
// ══════════════════════════════════════════════════════════════════
const API_BASE = "http://localhost:6055";

const getAuthHeader = () => {
  const user  = JSON.parse(sessionStorage.getItem("user") || "{}");
  const token = user.token || "";
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Each axios instance auto-attaches Bearer token
const makeAPI = (base) => {
  const instance = axios.create({ baseURL: base });
  instance.interceptors.request.use((config) => {
    Object.assign(config.headers, getAuthHeader());
    return config;
  });
  return instance;
};

const ADDRESS_API = makeAPI(`${API_BASE}/api/addresses`);
// GET    /api/addresses              → list all addresses (protect)
// POST   /api/addresses              → create address    (protect)
// PUT    /api/addresses/:id          → update address    (protect)
// DELETE /api/addresses/:id          → delete address    (protect)
// PATCH  /api/addresses/:id/default  → set default       (protect)

const ORDER_API = makeAPI(`${API_BASE}/api/orders`);
// POST   /api/orders                 → place order       (protect)
// GET    /api/orders/my              → user's orders     (protect)
// GET    /api/orders/:id             → single order      (protect)
// PATCH  /api/orders/:id/cancel      → cancel order      (protect)

const COUPON_API = makeAPI(`${API_BASE}/api/coupons`);
// POST   /api/coupons/validate       → validate coupon   (protect)

// ── Step bar ──────────────────────────────────────────────────────
const STEPS = ["Cart", "Address", "Payment", "Confirmed"];
const StepBar = ({ current }) => (
  <div className="flex items-center justify-center gap-0 mb-8">
    {STEPS.map((step, i) => (
      <React.Fragment key={step}>
        <div className="flex flex-col items-center">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
            i < current ? "bg-green-500 text-white" :
            i === current ? "bg-violet-600 text-white shadow-lg shadow-violet-200" :
            "bg-gray-100 text-gray-400"
          }`}>
            {i < current ? "✓" : i + 1}
          </div>
          <span className={`text-xs mt-1 font-medium ${i === current ? "text-violet-600" : i < current ? "text-green-600" : "text-gray-400"}`}>
            {step}
          </span>
        </div>
        {i < STEPS.length - 1 && (
          <div className={`h-0.5 w-16 mb-4 transition-all ${i < current ? "bg-green-400" : "bg-gray-200"}`} />
        )}
      </React.Fragment>
    ))}
  </div>
);

// ── Address field ──────────────────────────────────────────────────
const AddressField = ({ label, fieldKey, placeholder, type = "text", half = false, value, onChange, error }) => (
  <div className={half ? "flex-1" : "w-full"}>
    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{label}</label>
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      maxLength={fieldKey === "phone" ? 10 : fieldKey === "pincode" ? 6 : undefined}
      className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${
        error ? "border-red-400 bg-red-50" : "border-purple-100 focus:border-violet-500 focus:bg-violet-50/30"
      }`}
    />
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

// ── Address form component ─────────────────────────────────────────
const AddressForm = ({ onSave, onCancel, initial = {}, saving }) => {
  const [form, setForm] = useState({
    label:    initial.label    || "Home",
    fullName: initial.fullName || "",
    phone:    initial.phone    || "",
    street:   initial.street   || "",
    city:     initial.city     || "",
    state:    initial.state    || "",
    pincode:  initial.pincode  || "",
  });
  const [errors, setErrors] = useState({});

  const set = (k, v) => { setForm((f) => ({ ...f, [k]: v })); setErrors((e) => ({ ...e, [k]: "" })); };

  const validate = () => {
    const e = {};
    if (!form.fullName.trim())       e.fullName = "Required";
    if (!/^\d{10}$/.test(form.phone))  e.phone    = "Enter valid 10-digit number";
    if (!form.street.trim())         e.street   = "Required";
    if (!form.city.trim())           e.city     = "Required";
    if (!form.state.trim())          e.state    = "Required";
    if (!/^\d{6}$/.test(form.pincode)) e.pincode  = "Enter valid 6-digit pincode";
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    onSave(form);
  };

  return (
    <div className="bg-white rounded-2xl border border-purple-100 p-6">
      <h3 className="font-serif text-lg text-gray-900 mb-5">
        {initial._id ? "Edit Address" : "Add New Address"}
      </h3>
      <div className="flex gap-2 mb-4">
        {["Home", "Work", "Other"].map((l) => (
          <button key={l} onClick={() => set("label", l)}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold border-2 transition-all ${
              form.label === l ? "border-violet-600 bg-violet-600 text-white" : "border-gray-200 text-gray-600 hover:border-violet-300"
            }`}>
            {l === "Home" ? "🏠" : l === "Work" ? "💼" : "📍"} {l}
          </button>
        ))}
      </div>
      <div className="space-y-4">
        <div className="flex gap-3">
          <AddressField label="Full Name" fieldKey="fullName" placeholder="Recipient name" half
            value={form.fullName} error={errors.fullName}
            onChange={(e) => set("fullName", e.target.value)} />
          <AddressField label="Phone" fieldKey="phone" placeholder="10-digit mobile" type="tel" half
            value={form.phone} error={errors.phone}
            onChange={(e) => set("phone", e.target.value.replace(/\D/g, ""))} />
        </div>
        <AddressField label="Street / Flat / Area" fieldKey="street" placeholder="House no, building, street name"
          value={form.street} error={errors.street}
          onChange={(e) => set("street", e.target.value)} />
        <div className="flex gap-3">
          <AddressField label="City" fieldKey="city" placeholder="City" half
            value={form.city} error={errors.city}
            onChange={(e) => set("city", e.target.value)} />
          <AddressField label="State" fieldKey="state" placeholder="State" half
            value={form.state} error={errors.state}
            onChange={(e) => set("state", e.target.value)} />
        </div>
        <AddressField label="Pincode" fieldKey="pincode" placeholder="6-digit pincode" type="tel"
          value={form.pincode} error={errors.pincode}
          onChange={(e) => set("pincode", e.target.value.replace(/\D/g, ""))} />
      </div>
      <div className="flex gap-3 mt-6">
        <button onClick={handleSave} disabled={saving}
          className="flex-1 py-3 bg-gradient-to-r from-violet-600 to-purple-500 text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-purple-200 transition-all disabled:opacity-60">
          {saving ? "Saving..." : "Save Address"}
        </button>
        {onCancel && (
          <button onClick={onCancel}
            className="px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-600 text-sm font-semibold hover:border-gray-300 transition-all">
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════
// MAIN CART PAGE
// ══════════════════════════════════════════════════════════════════
const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, cartTotal, shippingFee, grandTotal, clearCart } = useCart();

  const [step,       setStep]       = useState(0);
  const [removingId, setRemovingId] = useState(null);

  // ── Coupon state ───────────────────────────────────────────────
  const [coupon,      setCoupon]      = useState("");
  const [couponMsg,   setCouponMsg]   = useState("");
  const [couponValid, setCouponValid] = useState(false);
  const [discount,    setDiscount]    = useState(0);
  const [couponCode,  setCouponCode]  = useState("");

  // ── Address state ──────────────────────────────────────────────
  const [addresses,    setAddresses]    = useState([]);
  const [addrLoading,  setAddrLoading]  = useState(false);
  const [addrSaving,   setAddrSaving]   = useState(false);
  const [selectedAddr, setSelectedAddr] = useState(null);  // stores _id string
  const [showAddrForm, setShowAddrForm] = useState(false);
  const [editingAddr,  setEditingAddr]  = useState(null);

  // ── Payment state ──────────────────────────────────────────────
  const [payMethod,  setPayMethod]  = useState("");
  const [upiId,      setUpiId]      = useState("");
  const [upiError,   setUpiError]   = useState("");
  const [cardNum,    setCardNum]    = useState("");
  const [cardName,   setCardName]   = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv,    setCardCvv]    = useState("");
  const [placing,    setPlacing]    = useState(false);

  // ── Confirmed order ────────────────────────────────────────────
  const [placedOrder, setPlacedOrder] = useState(null);

  const finalTotal = grandTotal - discount;

  // ════════════════════════════════════════════════════════════════
  // LOAD ADDRESSES on mount
  // GET /api/addresses
  // Returns: [ { _id, label, fullName, phone, street, city, state, pincode, isDefault } ]
  // ════════════════════════════════════════════════════════════════
  useEffect(() => {
    const loadAddresses = async () => {
      setAddrLoading(true);
      try {
        const { data } = await ADDRESS_API.get("/");
        const list = Array.isArray(data) ? data : data.addresses || [];
        setAddresses(list);
        // Auto-select the default address
        const def = list.find((a) => a.isDefault);
        if (def) setSelectedAddr(String(def._id));
      } catch (err) {
        console.error("Load addresses:", err.response?.data || err.message);
      } finally {
        setAddrLoading(false);
      }
    };
    loadAddresses();
  }, []);

  // ════════════════════════════════════════════════════════════════
  // SAVE ADDRESS
  // POST /api/addresses           → create new
  //   body: { label, fullName, phone, street, city, state, pincode }
  //   returns: { message, address }
  //
  // PUT  /api/addresses/:id       → update existing
  //   body: { label, fullName, phone, street, city, state, pincode }
  //   returns: { message, address }
  // ════════════════════════════════════════════════════════════════
  const handleSaveAddress = async (form) => {
    setAddrSaving(true);
    try {
      if (editingAddr) {
        // PUT /api/addresses/:id
        const { data } = await ADDRESS_API.put(`/${editingAddr._id}`, form);
        const updated = data.address || data;
        setAddresses((prev) =>
          prev.map((a) => String(a._id) === String(editingAddr._id) ? updated : a)
        );
      } else {
        // POST /api/addresses
        const { data } = await ADDRESS_API.post("/", form);
        const newAddr = data.address || data;
        setAddresses((prev) => [...prev, newAddr]);
        setSelectedAddr(String(newAddr._id));
      }
      setShowAddrForm(false);
      setEditingAddr(null);
    } catch (err) {
      console.error("Save address:", err.response?.data || err.message);
      alert(err.response?.data?.error || "Failed to save address. Please try again.");
    } finally {
      setAddrSaving(false);
    }
  };

  // ════════════════════════════════════════════════════════════════
  // DELETE ADDRESS
  // DELETE /api/addresses/:id
  // Returns: { message }
  // ════════════════════════════════════════════════════════════════
  const handleDeleteAddress = async (id) => {
    try {
      await ADDRESS_API.delete(`/${id}`);
      setAddresses((prev) => prev.filter((a) => String(a._id) !== String(id)));
      if (selectedAddr === String(id)) setSelectedAddr(null);
    } catch (err) {
      console.error("Delete address:", err.response?.data || err.message);
    }
  };

  // ════════════════════════════════════════════════════════════════
  // VALIDATE COUPON
  // POST /api/coupons/validate
  //   body: { code, cartTotal }
  //   returns: { valid, discountAmount, discountPercent, couponCode, message }
  // ════════════════════════════════════════════════════════════════
  const applyCoupon = async () => {
    const code = coupon.trim().toUpperCase();
    if (!code) return;

    try {
      const { data } = await COUPON_API.post("/validate", { code, cartTotal });
      // data.discountAmount is the server-computed ₹ discount
      setDiscount(data.discountAmount || 0);
      setCouponMsg(`✓ ${data.message || "Coupon applied!"}`);
      setCouponValid(true);
      setCouponCode(data.couponCode || code);
    } catch (err) {
      const msg = err.response?.data?.error || "Invalid coupon code";
      setCouponMsg(`✗ ${msg}`);
      setCouponValid(false);
      setDiscount(0);
      setCouponCode("");
    }
  };

  const handleRemove = (cartItemId) => {
    setRemovingId(cartItemId);
    setTimeout(() => { removeFromCart(cartItemId); setRemovingId(null); }, 300);
  };

  // ════════════════════════════════════════════════════════════════
  // PLACE ORDER
  // POST /api/orders
  //   body: {
  //     addressId,            ← _id of the selected Address document
  //     address,              ← full address snapshot (backend uses this as fallback)
  //     items: [{
  //       product,            ← product._id (ObjectId ref)
  //       name, brand, image,
  //       price, originalPrice,
  //       size, color, quantity
  //     }],
  //     paymentMethod,        ← "cod"|"upi"|"card"|"netbanking"|"wallet"
  //     couponCode,
  //     subtotal, discount, shippingFee, total,
  //     upiId                 ← only when paymentMethod === "upi"
  //   }
  //   returns: { message, order: { _id, orderNumber, status, items, address, total, ... } }
  //
  // After success → clears cart via CartContext.clearCart()
  //   which calls POST /api/cart/clear
  // ════════════════════════════════════════════════════════════════
  const handlePlaceOrder = async () => {
    if (!payMethod) return;
    if (payMethod === "upi" && !upiId.includes("@")) {
      setUpiError("Enter valid UPI ID (e.g. name@upi)");
      return;
    }

    const addr = addresses.find((a) => String(a._id) === selectedAddr);
    if (!addr) {
      alert("Please select a delivery address.");
      return;
    }

    setPlacing(true);
    try {
      const orderPayload = {
        // Address — send both ID and snapshot so backend can verify + fall back
        addressId: addr._id,
        address: {
          addressId: addr._id,
          label:     addr.label,
          fullName:  addr.fullName,
          phone:     addr.phone,
          street:    addr.street,
          city:      addr.city,
          state:     addr.state,
          pincode:   addr.pincode,
        },

        // Items — map from CartContext's flat item format to order item format
        items: cartItems.map((item) => ({
          product:       item.productId || item._id || null, // ObjectId ref to Product
          name:          item.name,
          brand:         item.brand          || "",
          image:         item.images?.[0]    || item.image || "",
          price:         item.price,
          originalPrice: item.originalPrice  || item.price,
          size:          item.size,
          color:         item.color,
          quantity:      item.quantity,
        })),

        // Payment
        paymentMethod: payMethod,
        upiId: payMethod === "upi" ? upiId : undefined,

        // Financials — backend re-computes these from DB prices and validates
        couponCode:  couponCode || null,
        subtotal:    cartTotal,
        discount:    discount,
        shippingFee: shippingFee,
        total:       finalTotal,
      };

      // POST /api/orders
      const { data } = await ORDER_API.post("/", orderPayload);
      const order = data.order || data;

      // Clear cart — calls POST /api/cart/clear (via CartContext)
      await clearCart();

      setPlacedOrder(order);
      setStep(3);
    } catch (err) {
      console.error("Place order:", err.response?.data || err.message);
      alert(err.response?.data?.error || "Failed to place order. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  // ── Price summary ──────────────────────────────────────────────
  const PriceSummary = ({ showCheckout = false }) => (
    <div className="bg-white rounded-2xl border border-purple-100 p-5 sticky top-20">
      <p className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">Order Summary</p>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Items ({cartItems.reduce((s, i) => s + i.quantity, 0)})</span>
          <span>₹{cartItems.reduce((s, i) => s + (i.originalPrice || i.price) * i.quantity, 0).toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-green-600 font-medium">
          <span>Product Discount</span>
          <span>− ₹{cartItems.reduce((s, i) => s + ((i.originalPrice || i.price) - i.price) * i.quantity, 0).toLocaleString()}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-green-600 font-medium">
            <span>Coupon ({couponCode})</span>
            <span>− ₹{discount.toLocaleString()}</span>
          </div>
        )}
        <div className="flex justify-between text-gray-600">
          <span>Delivery</span>
          <span className={shippingFee === 0 ? "text-green-600 font-semibold" : ""}>
            {shippingFee === 0 ? "FREE" : `₹${shippingFee}`}
          </span>
        </div>
        <div className="border-t border-purple-50 pt-3">
          <div className="flex justify-between font-bold text-gray-900 text-base">
            <span>Total</span>
            <span>₹{finalTotal.toLocaleString()}</span>
          </div>
          {(cartItems.reduce((s, i) => s + ((i.originalPrice || i.price) - i.price) * i.quantity, 0) + discount) > 0 && (
            <p className="text-green-600 text-xs font-semibold mt-1">
              🎉 You save ₹{(cartItems.reduce((s, i) => s + ((i.originalPrice || i.price) - i.price) * i.quantity, 0) + discount).toLocaleString()}
            </p>
          )}
        </div>
      </div>
      {showCheckout && (
        <button onClick={() => setStep(1)}
          className="w-full mt-4 py-4 bg-gradient-to-r from-violet-600 to-purple-500 text-white rounded-2xl font-bold text-sm hover:shadow-xl hover:shadow-purple-200 hover:-translate-y-0.5 transition-all">
          Proceed to Checkout →
        </button>
      )}
      <div className="flex items-center justify-center gap-4 mt-4">
        {["🔒 Secure", "↩ Returns", "✓ Genuine"].map((t) => (
          <span key={t} className="text-xs text-gray-400">{t}</span>
        ))}
      </div>
    </div>
  );

  // ── Empty cart ─────────────────────────────────────────────────
  if (cartItems.length === 0 && step !== 3) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans">
        <div className="sticky top-0 z-50 bg-[#1e0a3c] flex items-center gap-4 px-6 h-14 shadow-lg shadow-purple-900/30">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/70 hover:text-white text-sm px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all">← Back</button>
          <span className="font-serif text-base text-purple-200 tracking-wide">My Cart</span>
        </div>
        <div className="flex flex-col items-center justify-center min-h-[80vh] gap-5 px-4 text-center">
          <div className="w-32 h-32 bg-purple-50 rounded-full flex items-center justify-center"><span className="text-6xl">🛒</span></div>
          <h2 className="font-serif text-2xl text-gray-900">Your cart is empty</h2>
          <p className="text-gray-400 text-sm">Looks like you haven't added anything yet.</p>
          <button onClick={() => navigate("/dashboard")}
            className="px-8 py-3.5 bg-gradient-to-r from-violet-600 to-purple-500 text-white rounded-2xl font-semibold text-sm hover:shadow-xl hover:shadow-purple-200 hover:-translate-y-0.5 transition-all">
            Start Shopping →
          </button>
          <div className="bg-violet-50 rounded-2xl px-6 py-4 text-sm text-violet-600">
            <p className="font-semibold mb-1">🎁 Available Coupons</p>
            <p className="text-xs text-violet-400">LYRA10 · SAVE20 · FIRST50</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* TOPBAR */}
      <div className="sticky top-0 z-50 bg-[#1e0a3c] flex items-center gap-4 px-6 h-14 shadow-lg shadow-purple-900/30">
        <button onClick={() => step > 0 ? setStep(step - 1) : navigate(-1)}
          className="flex items-center gap-2 text-white/70 hover:text-white text-sm px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all">
          ← Back
        </button>
        <span className="font-serif text-base text-purple-200 tracking-wide">
          {["My Cart","Delivery Address","Payment","Order Confirmed"][step]}
          {step === 0 && <span className="text-white/40 font-sans text-sm ml-2">({cartItems.length} items)</span>}
        </span>
        {step === 0 && (
          <button onClick={clearCart} className="ml-auto text-xs text-red-400 hover:text-red-300 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all">
            Clear All
          </button>
        )}
      </div>

      {/* BREADCRUMB */}
      <div className="bg-white border-b border-purple-50 px-6 py-3 flex items-center gap-2 text-xs text-gray-400">
        <span className="cursor-pointer hover:text-violet-600" onClick={() => navigate("/dashboard")}>Home</span>
        <span>›</span>
        <span className={step === 0 ? "text-gray-700 font-medium" : "cursor-pointer hover:text-violet-600"}
          onClick={() => step > 0 && setStep(0)}>Cart</span>
        {step >= 1 && <><span>›</span><span className={step === 1 ? "text-gray-700 font-medium" : "cursor-pointer hover:text-violet-600"} onClick={() => step > 1 && setStep(1)}>Address</span></>}
        {step >= 2 && <><span>›</span><span className={step === 2 ? "text-gray-700 font-medium" : ""}>Payment</span></>}
        {step === 3 && <><span>›</span><span className="text-green-600 font-medium">Confirmed</span></>}
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-6">
        <StepBar current={step} />

        {/* ════ STEP 0 — CART ════ */}
        {step === 0 && (
          <div className="flex gap-6 items-start flex-col lg:flex-row">
            <div className="flex-1 min-w-0 space-y-4">

              {/* Free delivery nudge */}
              {cartTotal < 999 ? (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-3 flex items-center gap-3">
                  <span className="text-xl">🚚</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-amber-800">Add ₹{(999 - cartTotal).toLocaleString()} more for FREE delivery!</p>
                    <div className="mt-1.5 h-1.5 bg-amber-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${Math.min(100, (cartTotal / 999) * 100)}%` }} />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-2xl px-5 py-3 flex items-center gap-3">
                  <span className="text-xl">🎉</span>
                  <p className="text-sm font-semibold text-green-700">You've unlocked FREE delivery!</p>
                </div>
              )}

              {/* Cart items */}
              {cartItems.map((item) => {
                const itemId = String(item._id || item.cartItemId);
                return (
                  <div key={itemId}
                    className={`bg-white rounded-2xl border border-purple-100 p-4 transition-all duration-300 ${
                      removingId === itemId ? "opacity-0 scale-95" : "opacity-100 scale-100"
                    }`}>
                    <div className="flex gap-4">
                      <div className="w-28 h-28 flex-shrink-0 rounded-xl overflow-hidden bg-purple-50 cursor-pointer"
                        onClick={() => navigate(`/product/${item.productId || item._id}`)}>
                        <img src={item.images?.[0] || item.image} alt={item.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          onError={(e) => { e.target.src = "https://placehold.co/112x112/f3f4f6/9ca3af?text=L"; }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-violet-400 uppercase tracking-wider mb-0.5">{item.brand}</p>
                            <p className="font-medium text-gray-900 text-sm leading-tight cursor-pointer hover:text-violet-600 truncate"
                              onClick={() => navigate(`/product/${item.productId || item._id}`)}>
                              {item.name}
                            </p>
                          </div>
                          <button onClick={() => handleRemove(itemId)}
                            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-red-50 text-gray-300 hover:text-red-400 transition-all text-sm flex-shrink-0">
                            ✕
                          </button>
                        </div>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <span className="text-xs bg-purple-50 text-violet-600 font-semibold px-2.5 py-1 rounded-lg border border-purple-100">
                            Size: {item.size}
                          </span>
                          <span className="text-xs bg-purple-50 text-violet-600 font-semibold px-2.5 py-1 rounded-lg border border-purple-100 flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded-full border border-white shadow-sm"
                              style={{ background: item.color === "White" ? "#f9fafb" : item.color?.toLowerCase() || "#ccc" }} />
                            {item.color}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div>
                            <span className="text-lg font-bold text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</span>
                            {item.quantity > 1 && <span className="text-xs text-gray-400 ml-1">₹{item.price.toLocaleString()} each</span>}
                            {item.originalPrice && item.originalPrice > item.price && (
                              <span className="text-xs text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full ml-2">
                                {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% off
                              </span>
                            )}
                          </div>
                          {/* updateQuantity calls PUT /api/cart/:cartItemId { quantity } */}
                          <div className="flex items-center border-2 border-purple-100 rounded-xl overflow-hidden">
                            <button onClick={() => updateQuantity(itemId, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-violet-50 hover:text-violet-600 transition-colors text-lg">−</button>
                            <span className="w-8 text-center font-bold text-gray-900 text-sm">{item.quantity}</span>
                            <button onClick={() => updateQuantity(itemId, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-violet-50 hover:text-violet-600 transition-colors text-lg">+</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Coupon — POST /api/coupons/validate */}
              <div className="bg-white rounded-2xl border border-purple-100 p-5">
                <p className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">🎟 Apply Coupon</p>
                <div className="flex gap-2">
                  <input type="text" value={coupon}
                    onChange={(e) => { setCoupon(e.target.value.toUpperCase()); setCouponMsg(""); }}
                    placeholder="Enter coupon code"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-purple-100 text-sm outline-none focus:border-violet-400 uppercase tracking-widest font-semibold" />
                  <button onClick={applyCoupon}
                    className="px-4 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition-colors">
                    Apply
                  </button>
                </div>
                {couponMsg && <p className={`text-xs mt-2 font-semibold ${couponValid ? "text-green-600" : "text-red-500"}`}>{couponMsg}</p>}
                <div className="flex gap-2 mt-3">
                  {["LYRA10", "SAVE20", "FIRST50"].map((c) => (
                    <button key={c} onClick={() => { setCoupon(c); setCouponMsg(""); }}
                      className="text-xs px-3 py-1.5 rounded-lg border border-violet-200 text-violet-600 hover:bg-violet-50 font-semibold tracking-wider">
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={() => navigate("/dashboard")}
                className="w-full py-3.5 rounded-2xl border-2 border-purple-100 text-sm font-semibold text-violet-600 hover:border-violet-300 hover:bg-violet-50 transition-all">
                ← Continue Shopping
              </button>
            </div>
            <div className="w-full lg:w-96 flex-shrink-0"><PriceSummary showCheckout /></div>
          </div>
        )}

        {/* ════ STEP 1 — ADDRESS ════ */}
        {step === 1 && (
          <div className="flex gap-6 items-start flex-col lg:flex-row">
            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-xl text-gray-900">Delivery Address</h2>
                {!showAddrForm && (
                  <button onClick={() => { setShowAddrForm(true); setEditingAddr(null); }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors">
                    + Add New Address
                  </button>
                )}
              </div>

              {/* Address form — POST/PUT /api/addresses */}
              {showAddrForm && (
                <AddressForm
                  key={editingAddr ? `edit-${editingAddr._id}` : "new"}
                  initial={editingAddr || {}}
                  onSave={handleSaveAddress}
                  onCancel={() => { setShowAddrForm(false); setEditingAddr(null); }}
                  saving={addrSaving}
                />
              )}

              {/* Address list */}
              {addrLoading ? (
                <div className="space-y-3">
                  {[1, 2].map((i) => <div key={i} className="bg-white rounded-2xl border border-purple-100 p-5 animate-pulse h-24" />)}
                </div>
              ) : addresses.length === 0 && !showAddrForm ? (
                <div className="bg-white rounded-2xl border border-purple-100 p-10 text-center">
                  <p className="text-4xl mb-3">📍</p>
                  <p className="font-serif text-lg text-gray-700 mb-2">No addresses saved</p>
                  <p className="text-sm text-gray-400 mb-4">Add a delivery address to continue</p>
                  <button onClick={() => setShowAddrForm(true)}
                    className="px-6 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition-colors">
                    + Add Address
                  </button>
                </div>
              ) : (
                addresses.map((addr) => {
                  const id = String(addr._id);
                  return (
                    <div key={id} onClick={() => setSelectedAddr(id)}
                      className={`bg-white rounded-2xl border-2 p-5 cursor-pointer transition-all ${
                        selectedAddr === id ? "border-violet-600 shadow-md shadow-violet-100" : "border-purple-100 hover:border-violet-200"
                      }`}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1">
                          <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center ${selectedAddr === id ? "border-violet-600" : "border-gray-300"}`}>
                            {selectedAddr === id && <div className="w-2.5 h-2.5 rounded-full bg-violet-600" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="text-xs font-bold bg-violet-100 text-violet-700 px-2 py-0.5 rounded-lg">{addr.label}</span>
                              {addr.isDefault && <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-lg">✓ Default</span>}
                              <span className="font-semibold text-gray-900 text-sm">{addr.fullName}</span>
                              <span className="text-xs text-gray-500">{addr.phone}</span>
                            </div>
                            <p className="text-sm text-gray-600">{addr.street}, {addr.city}, {addr.state} - {addr.pincode}</p>
                          </div>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <button onClick={(e) => { e.stopPropagation(); setEditingAddr(addr); setShowAddrForm(true); }}
                            className="text-xs text-violet-600 hover:underline font-semibold px-2 py-1">Edit</button>
                          {/* DELETE /api/addresses/:id */}
                          <button onClick={(e) => { e.stopPropagation(); handleDeleteAddress(id); }}
                            className="text-xs text-red-400 hover:underline font-semibold px-2 py-1">Delete</button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}

              {addresses.length > 0 && !showAddrForm && (
                <button onClick={() => { if (selectedAddr) setStep(2); }} disabled={!selectedAddr}
                  className={`w-full py-4 rounded-2xl font-bold text-sm transition-all ${
                    selectedAddr
                      ? "bg-gradient-to-r from-violet-600 to-purple-500 text-white hover:shadow-xl hover:shadow-purple-200 hover:-translate-y-0.5"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}>
                  {selectedAddr ? "Deliver to this Address →" : "Please select an address"}
                </button>
              )}
            </div>
            <div className="w-full lg:w-96 flex-shrink-0"><PriceSummary /></div>
          </div>
        )}

        {/* ════ STEP 2 — PAYMENT ════ */}
        {step === 2 && (
          <div className="flex gap-6 items-start flex-col lg:flex-row">
            <div className="flex-1 space-y-4">
              <h2 className="font-serif text-xl text-gray-900">Choose Payment Method</h2>

              {[
                { id: "upi",        icon: "📱", label: "UPI",                 sub: "Pay via UPI ID (GPay, PhonePe, Paytm)" },
                { id: "cod",        icon: "💵", label: "Cash on Delivery",    sub: "Pay when your order arrives" },
                { id: "netbanking", icon: "🏦", label: "Net Banking",         sub: "All major banks supported" },
                { id: "card",       icon: "💳", label: "Credit / Debit Card", sub: "Visa, Mastercard, RuPay" },
                { id: "wallet",     icon: "👛", label: "Wallet",              sub: "Paytm, PhonePe, Amazon Pay" },
              ].map((pm) => (
                <div key={pm.id} onClick={() => { setPayMethod(pm.id); setUpiError(""); }}
                  className={`bg-white rounded-2xl border-2 p-5 cursor-pointer transition-all ${
                    payMethod === pm.id ? "border-violet-600 shadow-md shadow-violet-100" : "border-purple-100 hover:border-violet-200"
                  }`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${payMethod === pm.id ? "border-violet-600" : "border-gray-300"}`}>
                      {payMethod === pm.id && <div className="w-2.5 h-2.5 rounded-full bg-violet-600" />}
                    </div>
                    <span className="text-2xl">{pm.icon}</span>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{pm.label}</p>
                      <p className="text-xs text-gray-400">{pm.sub}</p>
                    </div>
                  </div>

                  {payMethod === "upi" && pm.id === "upi" && (
                    <div className="mt-4 pl-9" onClick={(e) => e.stopPropagation()}>
                      <input type="text" value={upiId}
                        onChange={(e) => { setUpiId(e.target.value); setUpiError(""); }}
                        placeholder="yourname@upi"
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none ${upiError ? "border-red-400 bg-red-50" : "border-purple-100 focus:border-violet-500"}`} />
                      {upiError && <p className="text-xs text-red-500 mt-1">{upiError}</p>}
                      <div className="flex gap-2 mt-3">
                        {[{ name: "GPay", icon: "🟢" }, { name: "PhonePe", icon: "🟣" }, { name: "Paytm", icon: "🔵" }].map((app) => (
                          <button key={app.name} className="flex-1 py-2 rounded-xl border border-purple-100 text-xs font-semibold text-gray-600 hover:border-violet-300 hover:bg-violet-50">{app.icon} {app.name}</button>
                        ))}
                      </div>
                    </div>
                  )}
                  {payMethod === "netbanking" && pm.id === "netbanking" && (
                    <div className="mt-4 pl-9 grid grid-cols-3 gap-2" onClick={(e) => e.stopPropagation()}>
                      {["SBI","HDFC","ICICI","Axis","Kotak","Others"].map((bank) => (
                        <button key={bank} className="py-2 rounded-xl border border-purple-100 text-xs font-semibold text-gray-600 hover:border-violet-300 hover:bg-violet-50">🏦 {bank}</button>
                      ))}
                    </div>
                  )}
                  {payMethod === "card" && pm.id === "card" && (
                    <div className="mt-4 pl-9 space-y-3" onClick={(e) => e.stopPropagation()}>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Card Number</label>
                        <input type="text" value={cardNum}
                          onChange={(e) => setCardNum(e.target.value.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim())}
                          placeholder="1234 5678 9012 3456" maxLength={19}
                          className="w-full px-4 py-2.5 rounded-xl border border-purple-100 text-sm outline-none focus:border-violet-500 tracking-widest" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Cardholder Name</label>
                        <input type="text" value={cardName} onChange={(e) => setCardName(e.target.value)} placeholder="Name on card" className="w-full px-4 py-2.5 rounded-xl border border-purple-100 text-sm outline-none focus:border-violet-500" />
                      </div>
                      <div className="flex gap-3">
                        <div className="flex-1">
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Expiry</label>
                          <input type="text" value={cardExpiry}
                            onChange={(e) => { let v = e.target.value.replace(/\D/g,""); if (v.length >= 2) v = v.slice(0,2) + "/" + v.slice(2,4); setCardExpiry(v); }}
                            placeholder="MM/YY" maxLength={5} className="w-full px-4 py-2.5 rounded-xl border border-purple-100 text-sm outline-none focus:border-violet-500" />
                        </div>
                        <div className="flex-1">
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">CVV</label>
                          <input type="password" value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value.replace(/\D/g,"").slice(0,3))}
                            placeholder="•••" maxLength={3} autoComplete="off" className="w-full px-4 py-2.5 rounded-xl border border-purple-100 text-sm outline-none focus:border-violet-500" />
                        </div>
                      </div>
                    </div>
                  )}
                  {payMethod === "wallet" && pm.id === "wallet" && (
                    <div className="mt-4 pl-9 flex gap-2" onClick={(e) => e.stopPropagation()}>
                      {["Paytm","PhonePe","Amazon Pay"].map((w) => (
                        <button key={w} className="flex-1 py-2 rounded-xl border border-purple-100 text-xs font-semibold text-gray-600 hover:border-violet-300 hover:bg-violet-50">👛 {w}</button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Address preview */}
              {selectedAddr && (() => {
                const addr = addresses.find((a) => String(a._id) === selectedAddr);
                return addr ? (
                  <div className="bg-violet-50 rounded-2xl p-4 border border-violet-100">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-bold text-violet-700 uppercase tracking-wider">📍 Delivering to</p>
                      <button onClick={() => setStep(1)} className="text-xs text-violet-600 hover:underline font-semibold">Change</button>
                    </div>
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">{addr.fullName}</span> · {addr.phone}<br />
                      {addr.street}, {addr.city}, {addr.state} - {addr.pincode}
                    </p>
                  </div>
                ) : null;
              })()}

              {/* Place order — POST /api/orders */}
              <button onClick={handlePlaceOrder} disabled={!payMethod || placing}
                className={`w-full py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                  payMethod && !placing
                    ? "bg-gradient-to-r from-violet-600 to-purple-500 text-white hover:shadow-xl hover:shadow-purple-200 hover:-translate-y-0.5"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}>
                {placing ? (
                  <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg> Placing Order...</>
                ) : `Place Order · ₹${finalTotal.toLocaleString()} →`}
              </button>
            </div>
            <div className="w-full lg:w-96 flex-shrink-0"><PriceSummary /></div>
          </div>
        )}

        {/* ════ STEP 3 — CONFIRMATION ════ */}
        {step === 3 && placedOrder && (
          <div className="max-w-lg mx-auto text-center py-12">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-5xl">✅</span>
            </div>
            <h1 className="font-serif text-3xl text-gray-900 mb-2">Order Placed!</h1>
            <p className="text-gray-500 mb-6">Thank you for shopping with Lyra ✦</p>

            <div className="bg-violet-50 rounded-2xl p-6 mb-6 text-left space-y-3">
              {[
                { label: "Order ID",   value: <span className="font-mono font-bold text-violet-600">{placedOrder.orderNumber || String(placedOrder._id).slice(-8).toUpperCase()}</span> },
                { label: "Amount Paid",value: `₹${finalTotal.toLocaleString()}` },
                { label: "Payment",    value: { cod:"Cash on Delivery", upi:"UPI", card:"Card", netbanking:"Net Banking", wallet:"Wallet" }[payMethod] },
                { label: "Estimated Delivery", value: (
                  <span className="text-green-600 font-semibold">
                    {new Date(Date.now() + 5 * 86400000).toLocaleDateString("en-IN",{ day:"numeric", month:"short" })} –{" "}
                    {new Date(Date.now() + 7 * 86400000).toLocaleDateString("en-IN",{ day:"numeric", month:"short" })}
                  </span>
                )},
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between">
                  <span className="font-bold text-gray-700 text-sm">{label}</span>
                  <span className="font-semibold text-gray-900 text-sm">{value}</span>
                </div>
              ))}
            </div>

            {/* Tracking timeline */}
            <div className="bg-white rounded-2xl border border-purple-100 p-5 mb-6 text-left">
              <p className="font-semibold text-gray-700 mb-4 text-sm uppercase tracking-wider">Order Tracking</p>
              {[
                { label: "Order Confirmed",  active: true,  time: "Just now" },
                { label: "Being Processed",  active: false, time: "In 1-2 hrs" },
                { label: "Shipped",          active: false, time: "In 1-2 days" },
                { label: "Out for Delivery", active: false, time: "In 4-5 days" },
                { label: "Delivered",        active: false, time: "In 5-7 days" },
              ].map((s, i) => (
                <div key={s.label} className="flex items-start gap-3 mb-3 last:mb-0">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold ${s.active ? "bg-green-500 text-white" : "bg-gray-100 text-gray-400"}`}>
                    {s.active ? "✓" : i + 1}
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${s.active ? "text-green-600" : "text-gray-400"}`}>{s.label}</p>
                    <p className="text-xs text-gray-400">{s.time}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button onClick={() => navigate("/dashboard")}
                className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-500 text-white font-bold text-sm hover:shadow-xl hover:shadow-purple-200 hover:-translate-y-0.5 transition-all">
                Continue Shopping →
              </button>
              {/* Navigate to profile orders tab — fetches from GET /api/orders/my */}
              <button onClick={() => navigate("/profile?tab=orders")}
                className="px-6 py-3.5 rounded-2xl border-2 border-violet-200 text-violet-600 font-bold text-sm hover:bg-violet-50 transition-all">
                My Orders
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;