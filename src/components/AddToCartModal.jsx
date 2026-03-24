import React, { useState, useEffect } from "react";
import { useCart } from "./CartContext";

const COLOR_MAP = {
  Black: "#111", White: "#fff", Navy: "#1e3a5f", Grey: "#9ca3af",
  Blue: "#3b82f6", Red: "#ef4444", Brown: "#92400e", Beige: "#d6c5a3",
  Gold: "#f59e0b", Silver: "#c0c0c0", Pink: "#ec4899", Green: "#22c55e",
  Khaki: "#a3885a", Tan: "#c5956a", Cream: "#f5f0e8", Olive: "#65a30d",
  "Rose Gold": "#d4a0a0", Natural: "#d4c5a9", Yellow: "#fbbf24",
  Tortoise: "#8b5e3c", Floral: "#f9a8d4", "One Size": "#a78bfa",
};

const AddToCartModal = ({ product, onClose }) => {
  const { addToCart } = useCart();

  const [selectedSize,  setSelectedSize]  = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity,      setQuantity]      = useState(1);
  const [added,         setAdded]         = useState(false);
  const [errors,        setErrors]        = useState({});

  // Auto-select if only one option
  useEffect(() => {
    if (product?.sizes?.length === 1)  setSelectedSize(product.sizes[0]);
    if (product?.colors?.length === 1) setSelectedColor(product.colors[0]);
  }, [product]);

  // Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  if (!product) return null;

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  const validate = () => {
    const e = {};
    if (!selectedSize)  e.size  = "Please select a size";
    if (!selectedColor) e.color = "Please select a color";
    return e;
  };

  const handleAddToCart = () => {
    const e = validate();

    if (quantity > product.stock) {
      setErrors({ quantity: "Not enough stock available" });
      return;
    }

    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }

    addToCart(product, selectedSize, selectedColor, quantity);
    setAdded(true);
    setTimeout(() => { onClose(); }, 1500);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[101] flex items-end sm:items-center justify-center px-0 sm:px-4">
        <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-slide-up">

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-purple-50">
            <h2 className="font-serif text-lg text-gray-900">Select Options</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors text-sm"
            >
              ✕
            </button>
          </div>

          {/* Product preview */}
          <div className="flex gap-4 px-6 py-4 bg-purple-50/50 border-b border-purple-50">
            <img
              src={product.images?.[0] || product.image}
              alt={product.name}
              className="w-20 h-20 rounded-2xl object-cover border border-purple-100 flex-shrink-0"
              onError={(e) => { e.target.src = "https://placehold.co/80x80/f3f4f6/9ca3af?text=L"; }}
            />
            <div className="flex flex-col justify-center">
              <p className="text-xs font-bold text-violet-400 uppercase tracking-wider mb-1">{product.brand}</p>
              <p className="font-medium text-gray-900 text-sm leading-tight mb-2">{product.name}</p>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                <span className="text-xs text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{discount}% off</span>
              </div>
            </div>
          </div>

          <div className="px-6 py-5 space-y-5 max-h-96 overflow-y-auto">

            {/* Color Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-gray-700">
                  Color
                  {selectedColor && <span className="text-violet-600 font-bold ml-1">— {selectedColor}</span>}
                </p>
                {errors.color && <p className="text-xs text-red-500">{errors.color}</p>}
              </div>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => { setSelectedColor(c); setErrors((e) => ({ ...e, color: "" })); }}
                    title={c}
                    className={`transition-all hover:scale-110 ${
                      c === "One Size"
                        ? `px-4 py-2 rounded-xl border-2 text-sm font-medium ${selectedColor === c ? "border-violet-600 bg-violet-600 text-white" : "border-gray-200 text-gray-700"}`
                        : `w-9 h-9 rounded-full ${selectedColor === c ? "ring-2 ring-violet-600 ring-offset-2 scale-110" : "ring-1 ring-gray-200"}`
                    }`}
                    style={c !== "One Size" ? {
                      background: COLOR_MAP[c] || "#ccc",
                      border: c === "White" ? "1px solid #e5e7eb" : "none",
                    } : {}}
                  >
                    {c === "One Size" ? c : ""}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-gray-700">
                  Size
                  {selectedSize && <span className="text-violet-600 font-bold ml-1">— {selectedSize}</span>}
                </p>
                {errors.size && <p className="text-xs text-red-500">{errors.size}</p>}
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => { setSelectedSize(s); setErrors((e) => ({ ...e, size: "" })); }}
                    className={`px-4 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${
                      selectedSize === s
                        ? "border-violet-600 bg-violet-600 text-white shadow-md shadow-violet-200"
                        : "border-gray-200 text-gray-700 hover:border-violet-300 hover:text-violet-600"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-3">Quantity</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-purple-100 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-10 h-10 flex items-center justify-center text-xl text-gray-500 hover:bg-violet-50 hover:text-violet-600 transition-colors"
                  >−</button>
                  <span className="w-12 text-center font-bold text-gray-900 text-lg">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                    className="w-10 h-10 flex items-center justify-center text-xl text-gray-500 hover:bg-violet-50 hover:text-violet-600 transition-colors"
                  >+</button>
                </div>
                <span className="text-sm text-gray-400">Max 10 per order</span>
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-purple-50 bg-white">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500">Total</span>
              <span className="text-lg font-bold text-gray-900">
                ₹{(product.price * quantity).toLocaleString()}
              </span>
            </div>
            <button
              onClick={handleAddToCart}
              className={`w-full py-4 rounded-2xl text-sm font-bold tracking-wide transition-all ${
                added
                  ? "bg-green-500 text-white shadow-lg shadow-green-200"
                  : "bg-gradient-to-r from-violet-600 to-purple-500 text-white hover:shadow-xl hover:shadow-purple-200 hover:-translate-y-0.5"
              }`}
            >
              {added ? "✓ Added to Cart!" : `🛒 Add to Cart — ₹${(product.price * quantity).toLocaleString()}`}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        .animate-slide-up {
          animation: slide-up 0.35s cubic-bezier(0.22, 1, 0.36, 1);
        }
      `}</style>
    </>
  );
};

export default AddToCartModal;