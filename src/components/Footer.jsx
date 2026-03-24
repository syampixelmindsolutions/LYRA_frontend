import React, { useState } from "react";

// ── App store badge SVGs inlined for portability ──
const AppStoreBadge = () => (
  <svg viewBox="0 0 120 40" xmlns="http://www.w3.org/2000/svg" className="h-10 w-auto">
    <rect width="120" height="40" rx="6" fill="#fff" fillOpacity="0.08" stroke="#ffffff30" strokeWidth="0.8"/>
    <text x="36" y="14" fontSize="7" fill="#ffffffaa" fontFamily="sans-serif">Download on the</text>
    <text x="36" y="27" fontSize="12" fontWeight="700" fill="#fff" fontFamily="serif">App Store</text>
    <text x="12" y="26" fontSize="20" fill="#fff" fontFamily="sans-serif"></text>
  </svg>
);

const PlayStoreBadge = () => (
  <svg viewBox="0 0 135 40" xmlns="http://www.w3.org/2000/svg" className="h-10 w-auto">
    <rect width="135" height="40" rx="6" fill="#fff" fillOpacity="0.08" stroke="#ffffff30" strokeWidth="0.8"/>
    <text x="36" y="14" fontSize="7" fill="#ffffffaa" fontFamily="sans-serif">GET IT ON</text>
    <text x="36" y="27" fontSize="12" fontWeight="700" fill="#fff" fontFamily="serif">Google Play</text>
    <text x="11" y="27" fontSize="20" fill="#4fc" fontFamily="sans-serif">▶</text>
  </svg>
);

// ── Social icon mini SVGs ──
const SocialIcon = ({ type }) => {
  const icons = {
    facebook: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
      </svg>
    ),
    twitter: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
        <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
      </svg>
    ),
    instagram: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
      </svg>
    ),
    youtube: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
        <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#1e0a3c"/>
      </svg>
    ),
    pinterest: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
        <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
      </svg>
    ),
  };
  return icons[type] || null;
};

const FOOTER_LINKS = {
  "ONLINE SHOPPING": [
    "Men", "Women", "Kids", "Home & Living", "Beauty",
    "Gift Cards", "Lyra Insider",
  ],
  "USEFUL LINKS": [
    "Blog", "Careers", "Site Map", "Corporate Information",
    "Whitehat", "Cleartrip", "Lyra Global",
  ],
  "CUSTOMER POLICIES": [
    "Contact Us", "FAQ", "T&C", "Terms Of Use",
    "Track Orders", "Shipping", "Cancellation",
    "Privacy Policy", "Grievance Redressal",
  ],
};

const POPULAR_SEARCHES = [
  "Makeup", "Dresses For Girls", "T-Shirts", "Sandals", "Headphones",
  "Babydolls", "Blazers For Men", "Handbags", "Ladies Watches", "Bags",
  "Sport Shoes", "Reebok Shoes", "Puma Shoes", "Boxers", "Wallets",
  "Tops", "Earrings", "Fastrack Watches", "Kurtis", "Nike",
  "Smart Watches", "Titan Watches", "Designer Blouse", "Gowns", "Rings",
  "Cricket Shoes", "Forever 21", "Eye Makeup", "Photo Frames",
  "Punjabi Suits", "Bikini", "Lipstick", "Saree", "Watches",
  "Dresses", "Lehenga", "Nike Shoes", "Goggles", "Bras",
  "Suit", "Chinos", "Adidas Shoes", "Woodland Shoes",
  "Jewellery", "Designers Sarees",
];

const PAYMENT_ICONS = [
  { label: "Visa",       bg: "#1a1f71", text: "#fff",    short: "VISA" },
  { label: "Mastercard", bg: "#eb001b", text: "#fff",    short: "MC" },
  { label: "Rupay",      bg: "#1f6634", text: "#fff",    short: "RuPay" },
  { label: "UPI",        bg: "#5f259f", text: "#fff",    short: "UPI" },
  { label: "PayTm",      bg: "#00baf2", text: "#fff",    short: "Paytm" },
  { label: "Net Banking",bg: "#ff6b00", text: "#fff",    short: "Net" },
  { label: "COD",        bg: "#28a745", text: "#fff",    short: "COD" },
  { label: "EMI",        bg: "#343a40", text: "#fff",    short: "EMI" },
];

const LyraFooter = () => {
  const [emailInput, setEmailInput] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (emailInput.trim()) setSubscribed(true);
  };

  return (
    <footer className="bg-[#1e0a3c] text-white mt-16">

      {/* ── Newsletter banner ── */}
      <div className="border-b border-white/10 py-6 px-8">
        <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-serif text-lg text-purple-200 tracking-wide">Stay in the loop</p>
            <p className="text-white/50 text-xs mt-0.5">Get exclusive deals, new arrivals & style inspiration</p>
          </div>
          {subscribed ? (
            <p className="text-green-400 text-sm font-medium">✓ You're subscribed!</p>
          ) : (
            <form onSubmit={handleSubscribe} className="flex gap-2 w-full max-w-sm">
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 bg-white/10 text-white placeholder-white/30 rounded-xl px-4 py-2.5 text-sm outline-none focus:bg-white/20 border border-white/10 focus:border-violet-400 transition-all"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-violet-500 to-pink-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>

      {/* ── Main footer grid ── */}
      <div className="max-w-screen-xl mx-auto px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Col 1–3: Link sections */}
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-xs font-bold tracking-widest text-white/40 uppercase mb-4">
                {heading}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-white/65 hover:text-pink-300 transition-colors duration-150"
                      onClick={(e) => e.preventDefault()}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Col 4: App download */}
          <div>
            <h4 className="text-xs font-bold tracking-widest text-white/40 uppercase mb-4">
              EXPERIENCE LYRA ON MOBILE
            </h4>
            <div className="flex flex-col gap-3">
              <a href="#" onClick={(e) => e.preventDefault()} className="hover:opacity-80 transition-opacity">
                <AppStoreBadge />
              </a>
              <a href="#" onClick={(e) => e.preventDefault()} className="hover:opacity-80 transition-opacity">
                <PlayStoreBadge />
              </a>
            </div>

            {/* QR hint */}
            <div className="mt-4 w-16 h-16 bg-white rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 50 50" width="52" height="52" xmlns="http://www.w3.org/2000/svg">
                <rect x="5" y="5" width="15" height="15" rx="2" fill="#1e0a3c"/>
                <rect x="7" y="7" width="11" height="11" rx="1" fill="#fff"/>
                <rect x="9" y="9" width="7" height="7" rx="1" fill="#1e0a3c"/>
                <rect x="30" y="5" width="15" height="15" rx="2" fill="#1e0a3c"/>
                <rect x="32" y="7" width="11" height="11" rx="1" fill="#fff"/>
                <rect x="34" y="9" width="7" height="7" rx="1" fill="#1e0a3c"/>
                <rect x="5" y="30" width="15" height="15" rx="2" fill="#1e0a3c"/>
                <rect x="7" y="32" width="11" height="11" rx="1" fill="#fff"/>
                <rect x="9" y="34" width="7" height="7" rx="1" fill="#1e0a3c"/>
                <rect x="30" y="28" width="4" height="4" fill="#1e0a3c"/>
                <rect x="36" y="28" width="4" height="4" fill="#1e0a3c"/>
                <rect x="42" y="28" width="4" height="4" fill="#1e0a3c"/>
                <rect x="30" y="34" width="4" height="4" fill="#1e0a3c"/>
                <rect x="36" y="34" width="4" height="4" fill="#1e0a3c"/>
                <rect x="30" y="40" width="4" height="4" fill="#1e0a3c"/>
                <rect x="36" y="40" width="8" height="4" fill="#1e0a3c"/>
              </svg>
            </div>
            <p className="text-white/30 text-xs mt-1">Scan to download</p>
          </div>

          {/* Col 5: Keep in touch */}
          <div>
            <h4 className="text-xs font-bold tracking-widest text-white/40 uppercase mb-4">
              KEEP IN TOUCH
            </h4>
            <div className="flex flex-wrap gap-2 mb-6">
              {["facebook","twitter","instagram","youtube","pinterest"].map((s) => (
                <a
                  key={s}
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  title={s}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-violet-500 flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5 text-white/70 hover:text-white"
                >
                  <SocialIcon type={s} />
                </a>
              ))}
            </div>

            {/* Trust badges */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-green-400 text-lg mt-0.5">✓</span>
                <p className="text-xs text-white/55 leading-relaxed">
                  <span className="text-white/80 font-semibold">100% ORIGINAL</span> guarantee for all products at lyra.com
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-400 text-lg mt-0.5">↩</span>
                <p className="text-xs text-white/55 leading-relaxed">
                  <span className="text-white/80 font-semibold">Return within 14 days</span> of receiving your order
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* ── Popular searches ── */}
      <div className="border-t border-white/10 py-6 px-8">
        <div className="max-w-screen-xl mx-auto">
          <p className="text-xs font-bold tracking-widest text-white/30 uppercase mb-3">
            POPULAR SEARCHES
          </p>
          <div className="flex flex-wrap gap-x-1 gap-y-1">
            {POPULAR_SEARCHES.map((term, i) => (
              <React.Fragment key={term}>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="text-xs text-white/45 hover:text-pink-300 transition-colors"
                >
                  {term}
                </a>
                {i < POPULAR_SEARCHES.length - 1 && (
                  <span className="text-white/20 text-xs">·</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-white/10 py-5 px-8 bg-black/20">
        <div className="max-w-screen-xl mx-auto">
          {/* Top row */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              {/* Lyra logo mark */}
              <span className="font-serif text-2xl tracking-widest text-purple-300">
                LY<span className="text-pink-400">R</span>A
              </span>
              <span className="text-white/20 text-xs">|</span>
              <span className="text-white/30 text-xs">A StyleGroup Company</span>
            </div>

            <p className="text-white/25 text-xs text-center md:text-right">
              In case of any concern,{" "}
              <a href="#" onClick={(e) => e.preventDefault()} className="text-violet-400 hover:text-pink-300 underline underline-offset-2 transition-colors">
                Contact Us
              </a>
            </p>
          </div>

          {/* Bottom row */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <p className="text-white/20 text-xs">
              © 2026 www.lyra.com. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {["Privacy Policy", "Terms Of Use", "Sitemap", "Accessibility"].map((item) => (
                <a
                  key={item}
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="text-white/25 text-xs hover:text-white/60 transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>

          {/* Registered address */}
          <div className="mt-4 pt-4 border-t border-white/5">
            <p className="text-white/20 text-xs leading-relaxed">
              <span className="text-white/30 font-semibold">Registered Office Address: </span>
              Lyra Fashion Pvt. Ltd., 4th Floor, Prestige Tech Park, Outer Ring Road, Bengaluru, Karnataka – 560103, India. CIN: U52100KA2021PTC123456 | GST: 29AABCL1234A1Z5
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LyraFooter;