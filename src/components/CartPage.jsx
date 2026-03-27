import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "./CartContext";

// ── Step indicator ──────────────────────────
const STEPS = ["Cart", "Address", "Payment", "Confirmed"];

const StepBar = ({ current }) => (
  <div className="flex items-center justify-center gap-0 mb-8">
    {STEPS.map((step, i) => (
      <React.Fragment key={step}>
        <div className="flex flex-col items-center">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
            i < current   ? "bg-green-500 text-white" :
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

// ── Address Field — defined OUTSIDE AddressForm so it never remounts ──
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

// ── Address Form ────────────────────────────
const AddressForm = ({ onSave, onCancel, initial = {} }) => {
  const [form, setForm] = useState({
    fullName: initial.fullName || "",
    phone:    initial.phone    || "",
    street:   initial.street   || "",
    city:     initial.city     || "",
    state:    initial.state    || "",
    pincode:  initial.pincode  || "",
    label:    initial.label    || "Home",
  });
  const [errors, setErrors] = useState({});

  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "Required";
    if (form.phone.length !== 10) e.phone = "Enter valid 10-digit number";
    if (!form.street.trim()) e.street = "Required";
    if (!form.city.trim()) e.city = "Required";
    if (!form.state.trim()) e.state = "Required";
    if (form.pincode.length !== 6) e.pincode = "Enter valid 6-digit pincode";
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    onSave({ ...form, id: initial.id || Date.now() });
  };

  return (
    <div className="bg-white rounded-2xl border border-purple-100 p-6">
      <h3 className="font-serif text-lg text-gray-900 mb-5">{initial.id ? "Edit Address" : "Add New Address"}</h3>
      <div className="flex gap-2 mb-4">
        {["Home", "Work", "Other"].map((l) => (
          <button key={l} onClick={() => set("label", l)}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold border-2 transition-all ${form.label === l ? "border-violet-600 bg-violet-600 text-white" : "border-gray-200 text-gray-600 hover:border-violet-300"}`}>
            {l === "Home" ? "🏠" : l === "Work" ? "💼" : "📍"} {l}
          </button>
        ))}
      </div>
      <div className="space-y-4">
        <div className="flex gap-3">
          <AddressField
            label="Full Name" fieldKey="fullName" placeholder="Recipient name" half
            value={form.fullName} error={errors.fullName}
            onChange={(e) => set("fullName", e.target.value)}
          />
          <AddressField
            label="Phone" fieldKey="phone" placeholder="10-digit mobile" type="tel" half
            value={form.phone} error={errors.phone}
            onChange={(e) => set("phone", e.target.value.replace(/\D/g, ""))}
          />
        </div>
        <AddressField
          label="Street / Flat / Area" fieldKey="street" placeholder="House no, building, street name"
          value={form.street} error={errors.street}
          onChange={(e) => set("street", e.target.value)}
        />
        <div className="flex gap-3">
          <AddressField
            label="City" fieldKey="city" placeholder="City" half
            value={form.city} error={errors.city}
            onChange={(e) => set("city", e.target.value)}
          />
          <AddressField
            label="State" fieldKey="state" placeholder="State" half
            value={form.state} error={errors.state}
            onChange={(e) => set("state", e.target.value)}
          />
        </div>
        <AddressField
          label="Pincode" fieldKey="pincode" placeholder="6-digit pincode" type="tel"
          value={form.pincode} error={errors.pincode}
          onChange={(e) => set("pincode", e.target.value.replace(/\D/g, ""))}
        />
      </div>
      <div className="flex gap-3 mt-6">
        <button onClick={handleSave}
          className="flex-1 py-3 bg-gradient-to-r from-violet-600 to-purple-500 text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-purple-200 transition-all">
          Save Address
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

// ══════════════════════════════════════════════
// MAIN CART PAGE
// ══════════════════════════════════════════════
const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, cartTotal, shippingFee, grandTotal, clearCart } = useCart();

  const [step,        setStep]        = useState(0);
  const [coupon,      setCoupon]      = useState("");
  const [couponMsg,   setCouponMsg]   = useState("");
  const [couponValid, setCouponValid] = useState(false);
  const [discount,    setDiscount]    = useState(0);
  const [removingId,  setRemovingId]  = useState(null);

  // Address
  const [addresses,    setAddresses]    = useState([]);
  const [selectedAddr, setSelectedAddr] = useState(null);
  const [showAddrForm, setShowAddrForm] = useState(false);
  const [editingAddr,  setEditingAddr]  = useState(null);

  // Payment
  const [payMethod,  setPayMethod]  = useState("");
  const [upiId,      setUpiId]      = useState("");
  const [upiError,   setUpiError]   = useState("");
  const [cardNum,    setCardNum]    = useState("");
  const [cardName,   setCardName]   = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv,    setCardCvv]    = useState("");
  const [placing,    setPlacing]    = useState(false);
  const [orderId,    setOrderId]    = useState("");

  // Load saved addresses
useEffect(() => {
  const saved = localStorage.getItem("addresses");
  if (saved) setAddresses(JSON.parse(saved));
}, []);

// Save addresses
useEffect(() => {
  localStorage.setItem("addresses", JSON.stringify(addresses));
}, [addresses]);

  const COUPONS = {
    LYRA10: { discount: 10, min: 300 },
    SAVE20: { discount: 20, min: 800 },
    FIRST50: { discount: 50, min: 1500 },
  };  
  const finalTotal = grandTotal - discount;

  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    const couponData = COUPONS[code];

    if (!couponData) {
      setCouponMsg("✗ Invalid coupon code");
      setCouponValid(false);
      setDiscount(0);
      return;
    }

    if (cartTotal < couponData.min) {
      setCouponMsg(`Minimum order ₹${couponData.min} required`);
      setCouponValid(false);
      return;
    }

    const pct = couponData.discount;
    setDiscount(Math.round(cartTotal * pct / 100));
    setCouponMsg(`✓ Coupon applied! You save ${pct}%`);
    setCouponValid(true);
  };

  const handleRemove = (cartItemId) => {
    setRemovingId(cartItemId);
    setTimeout(() => { removeFromCart(cartItemId); setRemovingId(null); }, 300);
  };

  const handleSaveAddress = (addr) => {
    if (editingAddr) {
      setAddresses((prev) => prev.map((a) => a.id === addr.id ? addr : a));
      setEditingAddr(null);
    } else {
      setAddresses((prev) => [...prev, addr]);
      setSelectedAddr(addr.id);
    }
    setShowAddrForm(false);
  };

  const handlePlaceOrder = () => {
    if (!payMethod) return;
    if (payMethod === "upi" && !upiId.includes("@")) { setUpiError("Enter valid UPI ID (e.g. name@upi)"); return; }
    setPlacing(true);
    setTimeout(() => {
      const id = "LYR" + Math.random().toString(36).substring(2, 8).toUpperCase();
      setOrderId(id);

      // Save order
      const order = {
        id,
        items: cartItems,
        total: finalTotal,
        address: selectedAddr,
        payment: payMethod,
        date: new Date(),
      };

      const prevOrders = JSON.parse(localStorage.getItem("orders") || "[]");
      localStorage.setItem("orders", JSON.stringify([order, ...prevOrders]));

      setPlacing(false);
      clearCart();
      setStep(3);
    }, 2000);
  };

  // ── Reusable price summary ──
  const PriceSummary = ({ showCheckout = false }) => (
    <div className="bg-white rounded-2xl border border-purple-100 p-5 sticky top-20">
      <p className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">Order Summary</p>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Items ({cartItems.reduce((s, i) => s + i.quantity, 0)})</span>
          <span>₹{cartItems.reduce((s, i) => s + i.originalPrice * i.quantity, 0).toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-green-600 font-medium">
          <span>Product Discount</span>
          <span>− ₹{cartItems.reduce((s, i) => s + (i.originalPrice - i.price) * i.quantity, 0).toLocaleString()}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-green-600 font-medium">
            <span>Coupon Discount</span>
            <span>− ₹{discount.toLocaleString()}</span>
          </div>
        )}
        <div className="flex justify-between text-gray-600">
          <span>Delivery</span>
          <span className={shippingFee === 0 ? "text-green-600 font-semibold" : ""}>{shippingFee === 0 ? "FREE" : `₹${shippingFee}`}</span>
        </div>
        <div className="border-t border-purple-50 pt-3">
          <div className="flex justify-between font-bold text-gray-900 text-base">
            <span>Total</span>
            <span>₹{finalTotal.toLocaleString()}</span>
          </div>
          {(cartItems.reduce((s, i) => s + (i.originalPrice - i.price) * i.quantity, 0) + discount) > 0 && (
            <p className="text-green-600 text-xs font-semibold mt-1">
              🎉 You save ₹{(cartItems.reduce((s, i) => s + (i.originalPrice - i.price) * i.quantity, 0) + discount).toLocaleString()}
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

  // ════ EMPTY CART ════
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
          <button onClick={() => navigate("/dashboard")} className="px-8 py-3.5 bg-gradient-to-r from-violet-600 to-purple-500 text-white rounded-2xl font-semibold text-sm hover:shadow-xl hover:shadow-purple-200 hover:-translate-y-0.5 transition-all">
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
          className="flex items-center gap-2 text-white/70 hover:text-white text-sm px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all">← Back</button>
        <span className="font-serif text-base text-purple-200 tracking-wide">
          {["My Cart", "Delivery Address", "Payment", "Order Confirmed"][step]}
          {step === 0 && <span className="text-white/40 font-sans text-sm ml-2">({cartItems.length} items)</span>}
        </span>
        {step === 0 && (
          <button onClick={clearCart} className="ml-auto text-xs text-red-400 hover:text-red-300 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all">Clear All</button>
        )}
      </div>

      {/* BREADCRUMB */}
      <div className="bg-white border-b border-purple-50 px-6 py-3 flex items-center gap-2 text-xs text-gray-400">
        <span className="cursor-pointer hover:text-violet-600" onClick={() => navigate("/dashboard")}>Home</span>
        <span>›</span>
        <span className={step === 0 ? "text-gray-700 font-medium" : "cursor-pointer hover:text-violet-600"} onClick={() => step > 0 && setStep(0)}>Cart</span>
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

              {cartItems.map((item) => (
                <div key={item.cartItemId}
                  className={`bg-white rounded-2xl border border-purple-100 p-4 transition-all duration-300 ${removingId === item.cartItemId ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}>
                  <div className="flex gap-4">
                    <div className="w-28 h-28 flex-shrink-0 rounded-xl overflow-hidden bg-purple-50 cursor-pointer" onClick={() => navigate(`/product/${item.id}`)}>
                      <img src={item.images?.[0] || item.image} alt={item.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        onError={(e) => { e.target.src = "https://placehold.co/112x112/f3f4f6/9ca3af?text=L"; }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-violet-400 uppercase tracking-wider mb-0.5">{item.brand}</p>
                          <p className="font-medium text-gray-900 text-sm leading-tight cursor-pointer hover:text-violet-600 truncate" onClick={() => navigate(`/product/${item.id}`)}>{item.name}</p>
                        </div>
                        <button onClick={() => handleRemove(item.cartItemId)} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-red-50 text-gray-300 hover:text-red-400 transition-all text-sm flex-shrink-0">✕</button>
                      </div>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className="text-xs bg-purple-50 text-violet-600 font-semibold px-2.5 py-1 rounded-lg border border-purple-100">Size: {item.size}</span>
                        <span className="text-xs bg-purple-50 text-violet-600 font-semibold px-2.5 py-1 rounded-lg border border-purple-100 flex items-center gap-1.5">
                          <span className="w-3 h-3 rounded-full border border-white shadow-sm" style={{ background: item.color === "White" ? "#f9fafb" : item.color?.toLowerCase() || "#ccc" }} />{item.color}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div>
                          <span className="text-lg font-bold text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</span>
                          {item.quantity > 1 && <span className="text-xs text-gray-400 ml-1">₹{item.price.toLocaleString()} each</span>}
                          {item.originalPrice && <span className="text-xs text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full ml-2">{Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% off</span>}
                        </div>
                        <div className="flex items-center border-2 border-purple-100 rounded-xl overflow-hidden">
                          <button onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-violet-50 hover:text-violet-600 transition-colors text-lg">−</button>
                          <span className="w-8 text-center font-bold text-gray-900 text-sm">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-violet-50 hover:text-violet-600 transition-colors text-lg">+</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Coupon */}
              <div className="bg-white rounded-2xl border border-purple-100 p-5">
                <p className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">🎟 Apply Coupon</p>
                <div className="flex gap-2">
                  <input type="text" value={coupon} onChange={(e) => { setCoupon(e.target.value.toUpperCase()); setCouponMsg(""); }}
                    placeholder="Enter coupon code"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-purple-100 text-sm outline-none focus:border-violet-400 transition-colors uppercase tracking-widest font-semibold" />
                  <button onClick={applyCoupon} className="px-4 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition-colors">Apply</button>
                </div>
                {couponMsg && <p className={`text-xs mt-2 font-semibold ${couponValid ? "text-green-600" : "text-red-500"}`}>{couponMsg}</p>}
                <div className="flex gap-2 mt-3">
                  {["LYRA10", "SAVE20", "FIRST50"].map((c) => (
                    <button key={c} onClick={() => { setCoupon(c); setCouponMsg(""); }}
                      className="text-xs px-3 py-1.5 rounded-lg border border-violet-200 text-violet-600 hover:bg-violet-50 transition-colors font-semibold tracking-wider">{c}</button>
                  ))}
                </div>
              </div>

              <button onClick={() => navigate("/dashboard")} className="w-full py-3.5 rounded-2xl border-2 border-purple-100 text-sm font-semibold text-violet-600 hover:border-violet-300 hover:bg-violet-50 transition-all">
                ← Continue Shopping
              </button>
            </div>
            <div className="w-full lg:w-96 flex-shrink-0"><PriceSummary showCheckout={true} /></div>
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

              {showAddrForm && (
                <AddressForm
                  key={editingAddr ? `edit-${editingAddr.id}` : "new"}
                  initial={editingAddr || {}}
                  onSave={handleSaveAddress}
                  onCancel={() => { setShowAddrForm(false); setEditingAddr(null); }}
                />
              )}

              {addresses.length === 0 && !showAddrForm && (
                <div className="bg-white rounded-2xl border border-purple-100 p-10 text-center">
                  <p className="text-4xl mb-3">📍</p>
                  <p className="font-serif text-lg text-gray-700 mb-2">No addresses saved</p>
                  <p className="text-sm text-gray-400 mb-4">Add a delivery address to continue</p>
                  <button onClick={() => setShowAddrForm(true)} className="px-6 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition-colors">+ Add Address</button>
                </div>
              )}

              {addresses.map((addr) => (
                <div key={addr.id} onClick={() => setSelectedAddr(addr.id)}
                  className={`bg-white rounded-2xl border-2 p-5 cursor-pointer transition-all ${selectedAddr === addr.id ? "border-violet-600 shadow-md shadow-violet-100" : "border-purple-100 hover:border-violet-200"}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all ${selectedAddr === addr.id ? "border-violet-600" : "border-gray-300"}`}>
                        {selectedAddr === addr.id && <div className="w-2.5 h-2.5 rounded-full bg-violet-600" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold bg-violet-100 text-violet-700 px-2 py-0.5 rounded-lg">{addr.label}</span>
                          <span className="font-semibold text-gray-900 text-sm">{addr.fullName}</span>
                          <span className="text-xs text-gray-500">{addr.phone}</span>
                        </div>
                        <p className="text-sm text-gray-600">{addr.street}, {addr.city}, {addr.state} - {addr.pincode}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={(e) => { e.stopPropagation(); setEditingAddr(addr); setShowAddrForm(true); }} className="text-xs text-violet-600 hover:underline font-semibold px-2 py-1">Edit</button>
                      <button onClick={(e) => { e.stopPropagation(); setAddresses((p) => p.filter((a) => a.id !== addr.id)); if (selectedAddr === addr.id) setSelectedAddr(null); }} className="text-xs text-red-400 hover:underline font-semibold px-2 py-1">Delete</button>
                    </div>
                  </div>
                </div>
              ))}

              {addresses.length > 0 && !showAddrForm && (
                <button onClick={() => { if (selectedAddr) setStep(2); }} disabled={!selectedAddr}
                  className={`w-full py-4 rounded-2xl font-bold text-sm transition-all ${selectedAddr ? "bg-gradient-to-r from-violet-600 to-purple-500 text-white hover:shadow-xl hover:shadow-purple-200 hover:-translate-y-0.5" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}>
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
                { id: "upi",        icon: "📱", label: "UPI",                  sub: "Pay via UPI ID (GPay, PhonePe, Paytm)" },
                { id: "cod",        icon: "💵", label: "Cash on Delivery",      sub: "Pay when your order arrives" },
                { id: "netbanking", icon: "🏦", label: "Net Banking",           sub: "All major banks supported" },
                { id: "card",       icon: "💳", label: "Credit / Debit Card",   sub: "Visa, Mastercard, RuPay" },
                { id: "wallet",     icon: "👛", label: "Wallet",                sub: "Paytm, PhonePe, Amazon Pay" },
              ].map((pm) => (
                <div key={pm.id} onClick={() => { setPayMethod(pm.id); setUpiError(""); }}
                  className={`bg-white rounded-2xl border-2 p-5 cursor-pointer transition-all ${payMethod === pm.id ? "border-violet-600 shadow-md shadow-violet-100" : "border-purple-100 hover:border-violet-200"}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${payMethod === pm.id ? "border-violet-600" : "border-gray-300"}`}>
                      {payMethod === pm.id && <div className="w-2.5 h-2.5 rounded-full bg-violet-600" />}
                    </div>
                    <span className="text-2xl">{pm.icon}</span>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{pm.label}</p>
                      <p className="text-xs text-gray-400">{pm.sub}</p>
                    </div>
                  </div>

                  {/* UPI */}
                  {payMethod === "upi" && pm.id === "upi" && (
                    <div className="mt-4 pl-9" onClick={(e) => e.stopPropagation()}>
                      <input type="text" value={upiId} onChange={(e) => { setUpiId(e.target.value); setUpiError(""); }}
                        placeholder="yourname@upi"
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${upiError ? "border-red-400 bg-red-50" : "border-purple-100 focus:border-violet-500"}`} />
                      {upiError && <p className="text-xs text-red-500 mt-1">{upiError}</p>}
                      <div className="flex gap-2 mt-3">
                        {[{ name: "GPay", icon: "🟢" }, { name: "PhonePe", icon: "🟣" }, { name: "Paytm", icon: "🔵" }].map((app) => (
                          <button key={app.name} className="flex-1 py-2 rounded-xl border border-purple-100 text-xs font-semibold text-gray-600 hover:border-violet-300 hover:bg-violet-50 transition-all">
                            {app.icon} {app.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Net Banking */}
                  {payMethod === "netbanking" && pm.id === "netbanking" && (
                    <div className="mt-4 pl-9 grid grid-cols-3 gap-2" onClick={(e) => e.stopPropagation()}>
                      {["SBI", "HDFC", "ICICI", "Axis", "Kotak", "Others"].map((bank) => (
                        <button key={bank} className="py-2 rounded-xl border border-purple-100 text-xs font-semibold text-gray-600 hover:border-violet-300 hover:bg-violet-50 transition-all">🏦 {bank}</button>
                      ))}
                    </div>
                  )}

                  {/* Card */}
                  {payMethod === "card" && pm.id === "card" && (
                    <div className="mt-4 pl-9 space-y-3" onClick={(e) => e.stopPropagation()}>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Card Number</label>
                        <input type="text" value={cardNum}
                          onChange={(e) => setCardNum(e.target.value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim())}
                          placeholder="1234 5678 9012 3456" maxLength={19}
                          className="w-full px-4 py-2.5 rounded-xl border border-purple-100 text-sm outline-none focus:border-violet-500 tracking-widest" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Cardholder Name</label>
                        <input type="text" value={cardName} onChange={(e) => setCardName(e.target.value)} placeholder="Name on card"
                          className="w-full px-4 py-2.5 rounded-xl border border-purple-100 text-sm outline-none focus:border-violet-500" />
                      </div>
                      <div className="flex gap-3">
                        <div className="flex-1">
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Expiry</label>
                          <input type="text" value={cardExpiry}
                            onChange={(e) => { let v = e.target.value.replace(/\D/g, ""); if (v.length >= 2) v = v.slice(0, 2) + "/" + v.slice(2, 4); setCardExpiry(v); }}
                            placeholder="MM/YY" maxLength={5}
                            className="w-full px-4 py-2.5 rounded-xl border border-purple-100 text-sm outline-none focus:border-violet-500" />
                        </div>
                        <div className="flex-1">
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">CVV</label>
                          <input type="password" value={cardCvv} onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                            placeholder="•••" maxLength={3} autoComplete="off"
                            className="w-full px-4 py-2.5 rounded-xl border border-purple-100 text-sm outline-none focus:border-violet-500" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Wallet */}
                  {payMethod === "wallet" && pm.id === "wallet" && (
                    <div className="mt-4 pl-9 flex gap-2" onClick={(e) => e.stopPropagation()}>
                      {["Paytm", "PhonePe", "Amazon Pay"].map((w) => (
                        <button key={w} className="flex-1 py-2 rounded-xl border border-purple-100 text-xs font-semibold text-gray-600 hover:border-violet-300 hover:bg-violet-50 transition-all">👛 {w}</button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Address preview */}
              {selectedAddr && (() => {
                const addr = addresses.find((a) => a.id === selectedAddr);
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

              {/* Place order */}
              <button onClick={handlePlaceOrder} disabled={!payMethod || placing}
                className={`w-full py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${payMethod && !placing ? "bg-gradient-to-r from-violet-600 to-purple-500 text-white hover:shadow-xl hover:shadow-purple-200 hover:-translate-y-0.5" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}>
                {placing ? (
                  <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg> Placing Order...</>
                ) : `Place Order · ₹${finalTotal.toLocaleString()} →`}
              </button>
            </div>
            <div className="w-full lg:w-96 flex-shrink-0"><PriceSummary /></div>
          </div>
        )}

        {/* ════ STEP 3 — CONFIRMATION ════ */}
        {step === 3 && (
          <div className="max-w-lg mx-auto text-center py-12">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-5xl">✅</span>
            </div>
            <h1 className="font-serif text-3xl text-gray-900 mb-2">Order Placed!</h1>
            <p className="text-gray-500 mb-6">Thank you for shopping with Lyra ✦</p>

            <div className="bg-violet-50 rounded-2xl p-6 mb-6 text-left space-y-3">
              <div className="flex justify-between">
                <span className="font-bold text-gray-700 text-sm">Order ID</span>
                <span className="font-mono font-bold text-violet-600">{orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-gray-700 text-sm">Amount Paid</span>
                <span className="font-bold text-gray-900">₹{finalTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-gray-700 text-sm">Payment</span>
                <span className="font-semibold text-gray-600 capitalize">{payMethod === "cod" ? "Cash on Delivery" : payMethod === "upi" ? "UPI" : payMethod === "card" ? "Card" : payMethod === "netbanking" ? "Net Banking" : "Wallet"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-gray-700 text-sm">Estimated Delivery</span>
                <span className="font-semibold text-green-600">
                  {new Date(Date.now() + 5 * 86400000).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} – {new Date(Date.now() + 7 * 86400000).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                </span>
              </div>
            </div>

            {/* Order tracking */}
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
              <button onClick={() => navigate("/dashboard")}
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

