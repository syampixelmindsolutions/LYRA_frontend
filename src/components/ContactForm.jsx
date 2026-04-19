// // import React, { useState } from "react";

// // const ContactForm = ({ onClose }) => {
// //   const [formData, setFormData] = useState({
// //     name: "",
// //     email: "",
// //     message: "",
// //   });
// //   const [submitted, setSubmitted] = useState(false);

// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
// //     setFormData(prev => ({ ...prev, [name]: value }));
// //   };

// //   const handleSubmit = (e) => {
// //     e.preventDefault();
// //     // Here you would typically send the data to your backend
// //     console.log("Form submitted:", formData);
// //     setSubmitted(true);
// //     setTimeout(() => {
// //       setSubmitted(false);
// //       onClose();
// //     }, 2000);
// //   };

// //   return (
// //     <>
// //       {/* Backdrop */}
// //       <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]" onClick={onClose} />
      
// //       {/* Modal */}
// //       <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4">
// //         <div 
// //           className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
// //           onClick={(e) => e.stopPropagation()}
// //         >
// //           <div className="p-6 sm:p-8">
// //             <div className="flex justify-between items-center mb-6">
// //               <h3 className="lyra-serif text-xl font-semibold text-gray-900">Contact Us</h3>
// //               <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
// //                 <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
// //                 </svg>
// //               </button>
// //             </div>

// //             {submitted ? (
// //               <div className="text-center py-8">
// //                 <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
// //                   <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
// //                   </svg>
// //                 </div>
// //                 <h3 className="text-lg font-medium text-gray-900 mb-2">Thank you!</h3>
// //                 <p className="text-gray-500">We'll get back to you soon.</p>
// //               </div>
// //             ) : (
// //               <form onSubmit={handleSubmit}>
// //                 <div className="space-y-4">
// //                   <div>
// //                     <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
// //                       Name
// //                     </label>
// //                     <input
// //                       type="text"
// //                       id="name"
// //                       name="name"
// //                       required
// //                       value={formData.name}
// //                       onChange={handleChange}
// //                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-violet-500 focus:border-violet-500"
// //                     />
// //                   </div>
// //                   <div>
// //                     <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
// //                       Email
// //                     </label>
// //                     <input
// //                       type="email"
// //                       id="email"
// //                       name="email"
// //                       required
// //                       value={formData.email}
// //                       onChange={handleChange}
// //                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-violet-500 focus:border-violet-500"
// //                     />
// //                   </div>
// //                   <div>
// //                     <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
// //                       Message
// //                     </label>
// //                     <textarea
// //                       id="message"
// //                       name="message"
// //                       rows={4}
// //                       required
// //                       value={formData.message}
// //                       onChange={handleChange}
// //                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-violet-500 focus:border-violet-500"
// //                     />
// //                   </div>
// //                 </div>
// //                 <div className="mt-6">
// //                   <button
// //                     type="submit"
// //                     className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
// //                   >
// //                     Send Message
// //                   </button>
// //                 </div>
// //               </form>
// //             )}
// //           </div>
// //         </div>
// //       </div>
// //     </>
// //   );
// // };

// // export default ContactForm;


// // ContactPage.jsx
// // Route: /contact
// // Submits to POST http://localhost:6055/api/contact
// // On success, the submission appears in AdminContacts.jsx

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// const SUBJECTS = [
//   "Order Issue",
//   "Return / Exchange",
//   "Payment Problem",
//   "Product Query",
//   "Delivery Status",
//   "Account Help",
//   "Partnership / B2B",
//   "Other",
// ];

// const ContactPage = () => {
//   const navigate = useNavigate();
//   const [scrolled, setScrolled] = useState(false);
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     subject: "",
//     orderId: "",
//     message: "",
//   });
//   const [errors, setErrors]   = useState({});
//   const [status, setStatus]   = useState("idle"); // idle | loading | success | error
//   const [errMsg, setErrMsg]   = useState("");

//   // Pre-fill from sessionStorage if user is logged in
//   useEffect(() => {
//     try {
//       const u = JSON.parse(sessionStorage.getItem("user") || "{}");
//       if (u.fullName || u.email) {
//         setForm((f) => ({
//           ...f,
//           name:  u.fullName  || f.name,
//           email: u.email     || f.email,
//           phone: u.mobileNumber || f.phone,
//         }));
//       }
//     } catch {}
//   }, []);

//   useEffect(() => {
//     const onScroll = () => setScrolled(window.scrollY > 60);
//     window.addEventListener("scroll", onScroll, { passive: true });
//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);

//   const set = (field) => (e) => {
//     setForm((f) => ({ ...f, [field]: e.target.value }));
//     setErrors((err) => ({ ...err, [field]: "" }));
//   };

//   const validate = () => {
//     const e = {};
//     if (!form.name.trim())    e.name    = "Name is required";
//     if (!form.email.trim())   e.email   = "Email is required";
//     else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
//     if (!form.subject)        e.subject = "Please select a subject";
//     if (!form.message.trim()) e.message = "Message cannot be empty";
//     if (form.message.trim().length < 10) e.message = "Message too short (min 10 chars)";
//     return e;
//   };

//   const handleSubmit = async () => {
//     const e = validate();
//     if (Object.keys(e).length) { setErrors(e); return; }

//     setStatus("loading");
//     setErrMsg("");

//     try {
//       // Attach auth token if present
//       const headers = { "Content-Type": "application/json" };
//       try {
//         const u = JSON.parse(sessionStorage.getItem("user") || "{}");
//         if (u.token) headers["Authorization"] = `Bearer ${u.token}`;
//       } catch {}

//       const res = await fetch("http://localhost:6055/api/contact", {
//         method:  "POST",
//         headers,
//         body:    JSON.stringify(form),
//       });

//       if (!res.ok) {
//         const data = await res.json().catch(() => ({}));
//         throw new Error(data.message || `Server error ${res.status}`);
//       }

//       setStatus("success");
//       setForm({ name: "", email: "", phone: "", subject: "", orderId: "", message: "" });
//     } catch (err) {
//       setStatus("error");
//       setErrMsg(err.message || "Something went wrong. Please try again.");
//     }
//   };

//   // ── Input field component ──────────────────────────────────────
//   const Field = ({ label, id, required, error, children }) => (
//     <div className="lyra-field-wrap">
//       <label htmlFor={id} className="lyra-label">
//         {label}{required && <span className="lyra-required">*</span>}
//       </label>
//       {children}
//       {error && <p className="lyra-field-error">{error}</p>}
//     </div>
//   );

//   const inputCls = (field) =>
//     `lyra-input${errors[field] ? " lyra-input-err" : ""}`;

//   return (
//     <div className="min-h-screen bg-[#f9f9fb]">
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
//         *{box-sizing:border-box;}
//         body,input,select,textarea,button{font-family:'DM Sans',system-ui,sans-serif;}
//         .lyra-serif{font-family:'Cormorant Garamond',Georgia,serif!important;}

//         /* ── Navbar ── */
//         .lyra-nav{position:sticky;top:0;z-index:50;background:#1e0a3c;transition:all 0.4s;}
//         .lyra-nav.scrolled{background:rgba(12,6,24,0.97);backdrop-filter:blur(20px);box-shadow:0 8px 40px rgba(109,40,217,0.25);}
//         .shimmer-text{background:linear-gradient(90deg,#c084fc,#f472b6,#fb923c,#c084fc);background-size:300% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmer 5s linear infinite;}
//         @keyframes shimmer{0%{background-position:-300% 0}100%{background-position:300% 0}}

//         /* ── Hero banner ── */
//         .lyra-contact-hero{
//           background:linear-gradient(135deg,#0f0820 0%,#1e0a3c 45%,#2d1060 80%,#0f0820 100%);
//           position:relative;overflow:hidden;padding:72px 24px 64px;text-align:center;
//         }
//         .lyra-contact-hero::before{
//           content:'';position:absolute;inset:0;
//           background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.35'/%3E%3C/svg%3E");
//           background-size:128px;opacity:0.18;pointer-events:none;
//         }
//         .lyra-contact-hero-glow{
//           position:absolute;top:-120px;left:50%;transform:translateX(-50%);
//           width:600px;height:400px;border-radius:50%;
//           background:radial-gradient(ellipse,rgba(124,58,237,0.22) 0%,transparent 70%);
//           pointer-events:none;
//         }

//         /* ── Info cards ── */
//         .lyra-info-grid{display:grid;grid-template-columns:repeat(1,1fr);gap:16px;max-width:900px;margin:0 auto;}
//         @media(min-width:640px){.lyra-info-grid{grid-template-columns:repeat(3,1fr);}}
//         .lyra-info-card{
//           background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);
//           border-radius:16px;padding:20px;text-align:center;
//           transition:background 0.2s,border-color 0.2s;
//         }
//         .lyra-info-card:hover{background:rgba(124,58,237,0.1);border-color:rgba(124,58,237,0.3);}

//         /* ── Form card ── */
//         .lyra-form-card{
//           background:white;border-radius:24px;border:1px solid #ede9fe;
//           box-shadow:0 20px 60px -12px rgba(109,40,217,0.1);
//           padding:36px 32px;max-width:740px;margin:0 auto;
//         }
//         @media(max-width:640px){.lyra-form-card{padding:24px 18px;border-radius:16px;}}

//         /* ── Fields ── */
//         .lyra-field-wrap{display:flex;flex-direction:column;gap:6px;margin-bottom:20px;}
//         .lyra-label{font-size:12px;font-weight:600;color:#4b5563;letter-spacing:0.04em;text-transform:uppercase;}
//         .lyra-required{color:#e11d48;margin-left:3px;}
//         .lyra-input{
//           width:100%;padding:13px 16px;border-radius:12px;font-size:14px;color:#111827;
//           border:1.5px solid #e5e7eb;outline:none;background:#fafafa;
//           transition:border-color 0.2s,box-shadow 0.2s,background 0.2s;
//         }
//         .lyra-input:focus{border-color:#7c3aed;box-shadow:0 0 0 3px rgba(124,58,237,0.1);background:white;}
//         .lyra-input-err{border-color:#ef4444!important;box-shadow:0 0 0 3px rgba(239,68,68,0.08)!important;}
//         .lyra-field-error{font-size:11px;color:#ef4444;font-weight:500;margin-top:2px;}
//         .lyra-textarea{resize:vertical;min-height:130px;line-height:1.6;}
//         .lyra-select{appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 14px center;padding-right:40px;}
//         .lyra-row{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
//         @media(max-width:600px){.lyra-row{grid-template-columns:1fr;}}

//         /* ── Submit button ── */
//         .lyra-submit{
//           width:100%;padding:15px 24px;border-radius:14px;border:none;cursor:pointer;font-size:15px;font-weight:700;
//           background:linear-gradient(135deg,#7c3aed,#a855f7,#ec4899);color:white;
//           transition:opacity 0.2s,transform 0.2s,box-shadow 0.2s;letter-spacing:0.03em;
//           box-shadow:0 8px 24px -4px rgba(124,58,237,0.4);
//         }
//         .lyra-submit:hover:not(:disabled){opacity:0.92;transform:translateY(-2px);box-shadow:0 14px 32px -4px rgba(124,58,237,0.5);}
//         .lyra-submit:active:not(:disabled){transform:translateY(0);}
//         .lyra-submit:disabled{opacity:0.6;cursor:not-allowed;transform:none;}

//         /* ── Success state ── */
//         @keyframes popIn{from{opacity:0;transform:scale(0.9) translateY(16px)}to{opacity:1;transform:scale(1) translateY(0)}}
//         .lyra-success{animation:popIn 0.5s cubic-bezier(0.16,1,0.3,1) forwards;}

//         /* ── Character counter ── */
//         .lyra-char{font-size:10px;color:#9ca3af;text-align:right;margin-top:4px;}

//         /* ── Divider ── */
//         .lyra-divider{display:flex;align-items:center;gap:12px;margin:24px 0;}
//         .lyra-divider::before,.lyra-divider::after{content:'';flex:1;height:1px;background:#f1f5f9;}
//         .lyra-divider span{font-size:11px;color:#94a3b8;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;}
//       `}</style>

//       {/* ── Navbar ── */}
//       <nav className={`lyra-nav${scrolled ? " scrolled" : ""}`}>
//         <div className="bg-gradient-to-r from-[#1a0836] via-violet-800 to-[#1a0836] py-1.5 text-center border-b border-violet-800/20">
//           <span className="shimmer-text text-[10px] sm:text-xs font-semibold tracking-[0.12em]">
//             ✦ FREE DELIVERY ON ORDERS ABOVE ₹999 · LYRA MEMBERS GET 10% OFF ✦
//           </span>
//         </div>
//         <div className="max-w-screen-xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center gap-4">
//           <button
//             onClick={() => navigate(-1)}
//             className="w-9 h-9 flex items-center justify-center rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-all"
//           >
//             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//               <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
//             </svg>
//           </button>
//           <button
//             onClick={() => navigate("/dashboard")}
//             className="lyra-serif text-xl sm:text-2xl tracking-[0.35em] text-white hover:opacity-90 transition-opacity"
//           >
//             LY<span className="text-pink-400">R</span>A
//           </button>
//           <span className="text-white/20 text-sm ml-1">/ Contact Us</span>
//         </div>
//       </nav>

//       {/* ── Hero banner ── */}
//       <div className="lyra-contact-hero">
//         <div className="lyra-contact-hero-glow" />
//         <div className="relative z-10">
//           <p className="text-[10px] tracking-[0.4em] text-violet-400 uppercase mb-4 font-medium">✦ We're here for you</p>
//           <h1 className="lyra-serif text-white font-light mb-4" style={{ fontSize: "clamp(2.4rem,6vw,4.5rem)", lineHeight: 1 }}>
//             Get in <span style={{ background: "linear-gradient(135deg,#f3e8ff,#e879f9,#fbcfe8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Touch</span>
//           </h1>
//           <p className="text-white/40 text-sm sm:text-base max-w-md mx-auto leading-relaxed mb-10">
//             Have a question, concern, or just want to say hello? Our team typically responds within 24 hours.
//           </p>

//           {/* Info cards */}
//           <div className="lyra-info-grid">
//             {[
//               { icon: "📧", title: "Email Us",   sub: "support@lyra.com",    note: "24-hr response" },
//               { icon: "📞", title: "Call Us",    sub: "1800-123-5678",       note: "Mon–Sat, 9am–6pm" },
//               { icon: "💬", title: "Live Chat",  sub: "Chat with an agent",  note: "Available now" },
//             ].map((c) => (
//               <div key={c.title} className="lyra-info-card">
//                 <div className="text-3xl mb-3">{c.icon}</div>
//                 <p className="lyra-serif text-white text-lg font-light mb-1">{c.title}</p>
//                 <p className="text-violet-300 text-sm font-medium mb-1">{c.sub}</p>
//                 <p className="text-white/30 text-xs">{c.note}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* ── Form section ── */}
//       <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-10 sm:py-14">

//         {status === "success" ? (
//           // ── Success screen ──────────────────────────────────────
//           <div className="lyra-form-card text-center lyra-success">
//             <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-4xl mx-auto mb-6 shadow-lg">
//               ✓
//             </div>
//             <h2 className="lyra-serif text-3xl text-gray-900 mb-3">
//               Message <span className="text-violet-600">Received!</span>
//             </h2>
//             <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto mb-8">
//               Thank you for reaching out. Our support team will get back to you within 24 hours.
//             </p>
//             <div className="flex flex-col sm:flex-row gap-3 justify-center">
//               <button
//                 onClick={() => setStatus("idle")}
//                 className="px-6 py-3 rounded-xl bg-violet-50 text-violet-700 font-semibold text-sm hover:bg-violet-100 transition-colors"
//               >
//                 Send Another Message
//               </button>
//               <button
//                 onClick={() => navigate("/dashboard")}
//                 className="px-6 py-3 rounded-xl text-sm font-semibold"
//                 style={{ background: "linear-gradient(135deg,#7c3aed,#ec4899)", color: "white" }}
//               >
//                 Continue Shopping →
//               </button>
//             </div>
//           </div>
//         ) : (
//           // ── Contact form ────────────────────────────────────────
//           <div className="lyra-form-card">
//             <div className="mb-8">
//               <p className="text-[10px] tracking-[0.3em] text-violet-500 uppercase font-bold mb-2">Send a Message</p>
//               <h2 className="lyra-serif text-2xl sm:text-3xl text-gray-900">
//                 How can we <span className="text-violet-600">help?</span>
//               </h2>
//             </div>

//             {/* Error banner */}
//             {status === "error" && (
//               <div className="mb-6 flex items-start gap-3 bg-red-50 border border-red-200 rounded-14px p-4 rounded-xl">
//                 <span className="text-red-500 text-lg flex-shrink-0">⚠</span>
//                 <p className="text-red-700 text-sm">{errMsg}</p>
//               </div>
//             )}

//             {/* Row 1: Name + Email */}
//             <div className="lyra-row">
//               <Field label="Full Name" id="name" required error={errors.name}>
//                 <input
//                   id="name"
//                   className={inputCls("name")}
//                   placeholder="Arjun Sharma"
//                   value={form.name}
//                   onChange={set("name")}
//                 />
//               </Field>
//               <Field label="Email Address" id="email" required error={errors.email}>
//                 <input
//                   id="email"
//                   type="email"
//                   className={inputCls("email")}
//                   placeholder="you@example.com"
//                   value={form.email}
//                   onChange={set("email")}
//                 />
//               </Field>
//             </div>

//             {/* Row 2: Phone + Order ID */}
//             <div className="lyra-row">
//               <Field label="Phone Number" id="phone" error={errors.phone}>
//                 <input
//                   id="phone"
//                   type="tel"
//                   className={inputCls("phone")}
//                   placeholder="+91 98765 43210"
//                   value={form.phone}
//                   onChange={set("phone")}
//                 />
//               </Field>
//               <Field label="Order ID (optional)" id="orderId" error={errors.orderId}>
//                 <input
//                   id="orderId"
//                   className={inputCls("orderId")}
//                   placeholder="ORD-2026-XXXXX"
//                   value={form.orderId}
//                   onChange={set("orderId")}
//                 />
//               </Field>
//             </div>

//             {/* Subject */}
//             <Field label="Subject" id="subject" required error={errors.subject}>
//               <select
//                 id="subject"
//                 className={`${inputCls("subject")} lyra-select`}
//                 value={form.subject}
//                 onChange={set("subject")}
//               >
//                 <option value="">Select a topic…</option>
//                 {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
//               </select>
//             </Field>

//             {/* Message */}
//             <Field label="Your Message" id="message" required error={errors.message}>
//               <textarea
//                 id="message"
//                 className={`${inputCls("message")} lyra-textarea`}
//                 placeholder="Describe your issue or question in detail…"
//                 value={form.message}
//                 onChange={set("message")}
//               />
//               <p className="lyra-char">{form.message.length} / 1000</p>
//             </Field>

//             <div className="lyra-divider"><span>Ready to send</span></div>

//             {/* Submit */}
//             <button
//               onClick={handleSubmit}
//               disabled={status === "loading"}
//               className="lyra-submit"
//             >
//               {status === "loading" ? (
//                 <span className="flex items-center justify-center gap-2">
//                   <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
//                   </svg>
//                   Sending…
//                 </span>
//               ) : "Send Message →"}
//             </button>

//             <p className="text-center text-xs text-gray-400 mt-4">
//               By submitting, you agree to our{" "}
//               <span className="text-violet-500 cursor-pointer hover:underline">Privacy Policy</span>.
//               We never share your information.
//             </p>
//           </div>
//         )}

//         {/* FAQ nudge */}
//         <div className="text-center mt-10">
//           <p className="text-sm text-gray-500">
//             Looking for quick answers?{" "}
//             <button className="text-violet-600 font-semibold hover:underline">Browse our FAQ →</button>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ContactPage;


import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "https://lyra-backend-gilt.vercel.app/api/admin/contact/";

const SUBJECTS = [
  { value: "Order Issue",        icon: "📦", color: "#7c3aed" },
  { value: "Return / Exchange",  icon: "↩",  color: "#0891b2" },
  { value: "Payment Problem",    icon: "💳", color: "#d97706" },
  { value: "Product Query",      icon: "🛍", color: "#059669" },
  { value: "Delivery Status",    icon: "🚚", color: "#7c3aed" },
  { value: "Account Help",       icon: "👤", color: "#db2777" },
  { value: "Partnership / B2B",  icon: "🤝", color: "#0891b2" },
  { value: "Other",              icon: "💬", color: "#6b7280" },
];

// ── Floating label input ─────────────────────────────────────────
const FloatInput = ({ id, label, type = "text", value, onChange, error, required, maxLength, placeholder, prefix }) => {
  const [focused, setFocused] = useState(false);
  const filled  = value.length > 0;
  const active  = focused || filled;

  return (
    <div style={{ position: "relative", marginBottom: 0 }}>
      <label htmlFor={id} style={{
        position: "absolute", left: prefix ? 52 : 16,
        top: active ? 8 : "50%",
        transform: active ? "none" : "translateY(-50%)",
        fontSize: active ? 10 : 14,
        fontWeight: active ? 700 : 400,
        color: error ? "#ef4444" : focused ? "#7c3aed" : active ? "#9ca3af" : "#9ca3af",
        letterSpacing: active ? "0.08em" : "0",
        textTransform: active ? "uppercase" : "none",
        transition: "all 0.2s cubic-bezier(0.16,1,0.3,1)",
        pointerEvents: "none",
        zIndex: 2,
        background: active ? "transparent" : "transparent",
      }}>
        {label}{required && <span style={{ color: "#ec4899", marginLeft: 2 }}>*</span>}
      </label>

      {prefix && (
        <div style={{
          position: "absolute", left: 0, top: 0, bottom: 0, width: 48,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: focused ? "#7c3aed" : "#9ca3af", fontSize: 13, fontWeight: 700,
          borderRight: `1px solid ${focused ? "rgba(124,58,237,0.3)" : "rgba(0,0,0,0.08)"}`,
          transition: "all 0.2s", zIndex: 3,
          background: "rgba(124,58,237,0.03)",
          borderRadius: "16px 0 0 16px",
        }}>{prefix}</div>
      )}

      <input
        id={id} type={type} value={value} maxLength={maxLength}
        placeholder={focused ? (placeholder || "") : ""}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%", paddingLeft: prefix ? 56 : 16,
          paddingRight: 16,
          paddingTop: active ? 24 : 16,
          paddingBottom: active ? 8 : 16,
          border: `1.5px solid ${error ? "#ef4444" : focused ? "#7c3aed" : "rgba(0,0,0,0.1)"}`,
          borderRadius: 16, fontSize: 14, color: "#111827",
          background: focused ? "#fdfbff" : "#fafafa",
          outline: "none", transition: "all 0.2s cubic-bezier(0.16,1,0.3,1)",
          boxShadow: focused ? `0 0 0 4px ${error ? "rgba(239,68,68,0.08)" : "rgba(124,58,237,0.1)"}` : "none",
          fontFamily: "'DM Sans',system-ui,sans-serif",
        }}
      />

      {/* Active line */}
      <div style={{
        position: "absolute", bottom: 0, left: "50%", right: "50%",
        height: 2, background: "linear-gradient(90deg,#7c3aed,#ec4899)",
        borderRadius: 2, transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)",
        ...(focused ? { left: 8, right: 8 } : {}),
      }} />

      {error && (
        <p style={{ fontSize: 11, color: "#ef4444", fontWeight: 600, marginTop: 5, paddingLeft: 4, display: "flex", alignItems: "center", gap: 4 }}>
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
};

// ── Float textarea ────────────────────────────────────────────────
const FloatTextarea = ({ id, label, value, onChange, error, required, maxLength }) => {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;

  return (
    <div style={{ position: "relative" }}>
      <label htmlFor={id} style={{
        position: "absolute", left: 16, top: active ? 10 : 20,
        fontSize: active ? 10 : 14, fontWeight: active ? 700 : 400,
        color: error ? "#ef4444" : focused ? "#7c3aed" : "#9ca3af",
        letterSpacing: active ? "0.08em" : "0",
        textTransform: active ? "uppercase" : "none",
        transition: "all 0.2s cubic-bezier(0.16,1,0.3,1)",
        pointerEvents: "none", zIndex: 2,
      }}>
        {label}{required && <span style={{ color: "#ec4899", marginLeft: 2 }}>*</span>}
      </label>

      <textarea
        id={id} value={value} maxLength={maxLength}
        rows={5}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%", paddingLeft: 16, paddingRight: 16,
          paddingTop: active ? 30 : 20, paddingBottom: 16,
          border: `1.5px solid ${error ? "#ef4444" : focused ? "#7c3aed" : "rgba(0,0,0,0.1)"}`,
          borderRadius: 16, fontSize: 14, color: "#111827",
          background: focused ? "#fdfbff" : "#fafafa",
          outline: "none", resize: "vertical", minHeight: 140,
          transition: "all 0.2s cubic-bezier(0.16,1,0.3,1)",
          boxShadow: focused ? `0 0 0 4px ${error ? "rgba(239,68,68,0.08)" : "rgba(124,58,237,0.1)"}` : "none",
          fontFamily: "'DM Sans',system-ui,sans-serif",
          lineHeight: 1.6,
        }}
      />

      <div style={{
        position: "absolute", bottom: 0, left: "50%", right: "50%",
        height: 2, background: "linear-gradient(90deg,#7c3aed,#ec4899)",
        borderRadius: 2, transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)",
        ...(focused ? { left: 8, right: 8 } : {}),
      }} />

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, paddingInline: 4 }}>
        {error
          ? <p style={{ fontSize: 11, color: "#ef4444", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}><span>⚠</span>{error}</p>
          : <span />
        }
        <span style={{ fontSize: 10, color: value.length > 900 ? "#ef4444" : "#d1d5db", fontWeight: 500 }}>
          {value.length}/{maxLength || 1000}
        </span>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════
// CONTACT PAGE
// ══════════════════════════════════════════════════════════════════
const ContactPage = () => {
  const navigate  = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", subject: "", orderId: "", message: "",
  });
  const [errors,    setErrors]   = useState({});
  const [status,    setStatus]   = useState("idle");
  const [errMsg,    setErrMsg]   = useState("");
  const [hoveredInfo, setHoveredInfo] = useState(null);
  const [mousePos,    setMousePos]    = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);

  // Pre-fill from session
  useEffect(() => {
    try {
      const u = JSON.parse(sessionStorage.getItem("user") || "{}");
      if (u.fullName || u.email) {
        setForm((f) => ({
          ...f,
          name:  u.fullName     || f.name,
          email: u.email        || f.email,
          phone: u.mobileNumber || f.phone,
        }));
      }
    } catch {}
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Parallax mouse tracker for hero
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const handleMove = (e) => {
      const rect = hero.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      setMousePos({ x, y });
    };
    hero.addEventListener("mousemove", handleMove);
    return () => hero.removeEventListener("mousemove", handleMove);
  }, []);

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((err) => ({ ...err, [field]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = "Full name is required";
    if (!form.email.trim())   e.email   = "Email address is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.subject)        e.subject = "Please choose a topic";
    if (!form.message.trim()) e.message = "Message cannot be empty";
    if (form.message.trim().length < 10) e.message = "Too short — at least 10 characters";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { 
        setErrors(e); 
        return; 
    }
    
    setStatus("loading"); 
    setErrMsg("");

    try {
        const headers = {
        "Content-Type": "application/json",
        };

        // Add authorization header if user is logged in
        const user = JSON.parse(sessionStorage.getItem("user") || "{}");
        if (user.token) {
        headers["Authorization"] = `Bearer ${user.token}`;
        }

        const response = await fetch(API_URL, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
            name: form.name,
            email: form.email,
            phone: form.phone,
            subject: form.subject,
            orderId: form.orderId || null, // Send null if empty
            message: form.message,
        }),
        });

        const data = await response.json();

        if (!response.ok) {
        throw new Error(data.message || "Failed to submit contact form");
        }
        
        // Success handling
        setStatus("success");
        setForm({ 
        name: "", 
        email: "", 
        phone: "", 
        subject: "", 
        orderId: "", 
        message: "" 
        });

    } catch (err) {
        setStatus("error");
        setErrMsg(err.message || "Something went wrong. Please try again.");
        console.error("Contact form submission error:", err);
    }
    };

  const selSubj = SUBJECTS.find((s) => s.value === form.subject);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        body,input,select,textarea,button{font-family:'DM Sans',system-ui,sans-serif;}
        .lyra-serif{font-family:'Cormorant Garamond',Georgia,serif!important;}
        .cp-topbar{position:sticky;top:0;z-index:50;background:linear-gradient(135deg,#0f0820,#1e0a3c);transition:box-shadow 0.4s;}
        .cp-topbar.scrolled{box-shadow:0 8px 40px rgba(15,5,30,0.5);}
        @keyframes shimmer{0%{background-position:-300% 0}100%{background-position:300% 0}}
        .shimmer-text{background:linear-gradient(90deg,#c084fc,#f472b6,#fb923c,#c084fc);background-size:300% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmer 5s linear infinite;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes popIn{from{opacity:0;transform:scale(0.88) translateY(20px)}to{opacity:1;transform:scale(1) translateY(0)}}
        @keyframes floatOrb{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(var(--tx),var(--ty)) scale(var(--ts))}}
        @keyframes spinSlow{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes pulseRing{0%,100%{opacity:0.3;transform:scale(1)}50%{opacity:0.7;transform:scale(1.05)}}
        .cp-fade-1{animation:fadeUp 0.6s ease 0.1s both;}
        .cp-fade-2{animation:fadeUp 0.6s ease 0.25s both;}
        .cp-fade-3{animation:fadeUp 0.6s ease 0.4s both;}
        .cp-fade-4{animation:fadeUp 0.6s ease 0.55s both;}
        .cp-success{animation:popIn 0.55s cubic-bezier(0.16,1,0.3,1) both;}

        /* Subject grid */
        .subj-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;}
        @media(min-width:640px){.subj-grid{grid-template-columns:repeat(4,1fr);}}
        .subj-btn{
          position:relative;padding:14px 10px;border-radius:16px;border:1.5px solid rgba(0,0,0,0.08);
          background:#fafafa;cursor:pointer;transition:all 0.25s cubic-bezier(0.16,1,0.3,1);
          text-align:center;overflow:hidden;
        }
        .subj-btn:hover{border-color:rgba(124,58,237,0.3);background:#fdf8ff;transform:translateY(-2px);box-shadow:0 8px 20px rgba(124,58,237,0.1);}
        .subj-btn.active{border-color:transparent;transform:translateY(-2px);}
        .subj-btn::after{content:'';position:absolute;inset:0;opacity:0;background:linear-gradient(135deg,rgba(124,58,237,0.08),rgba(236,72,153,0.06));transition:opacity 0.2s;}
        .subj-btn.active::after{opacity:1;}

        /* Two col grid */
        .two-col{display:grid;grid-template-columns:1fr;gap:16px;}
        @media(min-width:600px){.two-col{grid-template-columns:1fr 1fr;}}

        /* Info cards */
        .info-grid{display:grid;grid-template-columns:1fr;gap:16px;}
        @media(min-width:768px){.info-grid{grid-template-columns:repeat(3,1fr);}}
        .info-card{
          position:relative;overflow:hidden;border-radius:20px;
          padding:24px 20px;cursor:default;
          transition:transform 0.3s cubic-bezier(0.16,1,0.3,1),box-shadow 0.3s;
        }
        .info-card:hover{transform:translateY(-4px);}

        /* Glow dots background */
        .star-field{position:absolute;inset:0;overflow:hidden;pointer-events:none;}
        .star{position:absolute;border-radius:50%;background:white;}
        @keyframes twinkle{0%,100%{opacity:var(--op);transform:scale(1)}50%{opacity:0.1;transform:scale(0.5)}}

        /* Submit button */
        .cp-submit{
          width:100%;padding:18px 24px;border:none;border-radius:18px;
          background:linear-gradient(135deg,#1e0a3c 0%,#7c3aed 50%,#a855f7 100%);
          background-size:200% 100%;background-position:0% 0%;
          color:white;font-size:15px;font-weight:700;letter-spacing:0.04em;
          cursor:pointer;transition:all 0.35s ease;position:relative;overflow:hidden;
          box-shadow:0 6px 24px rgba(124,58,237,0.4);
          font-family:'DM Sans',system-ui,sans-serif;
        }
        .cp-submit:not(:disabled):hover{
          background-position:100% 0%;
          box-shadow:0 12px 36px rgba(124,58,237,0.55);
          transform:translateY(-2px);
        }
        .cp-submit:disabled{opacity:0.65;cursor:not-allowed;transform:none;}
        .cp-submit::before{
          content:'';position:absolute;top:-50%;left:-60%;width:40%;height:200%;
          background:rgba(255,255,255,0.1);transform:skewX(-20deg);
          transition:left 0.6s ease;
        }
        .cp-submit:not(:disabled):hover::before{left:120%;}

        @keyframes spin{to{transform:rotate(360deg)}}
        .spin{width:18px;height:18px;border:2px solid rgba(255,255,255,0.35);border-top-color:white;border-radius:50%;animation:spin 0.7s linear infinite;display:inline-block;flex-shrink:0;}

        /* Char counter pulse */
        @keyframes charPulse{0%{transform:scale(1)}50%{transform:scale(1.2)}100%{transform:scale(1)}}
      `}</style>

      <div style={{ minHeight: "100vh", background: "#f9f9fb" }}>

        {/* ── TOPBAR ── */}
        <nav className={`cp-topbar${scrolled ? " scrolled" : ""}`}>
          <div style={{
            background: "linear-gradient(to right,#1a0836,#5b21b6,#1a0836)",
            padding: "6px 0", textAlign: "center",
            borderBottom: "1px solid rgba(124,58,237,0.2)",
          }}>
            <span className="shimmer-text" style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.12em" }}>
              ✦ FREE DELIVERY ON ORDERS ABOVE ₹999 · LYRA MEMBERS GET 10% OFF ✦
            </span>
          </div>
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px", height: 56, display: "flex", alignItems: "center", gap: 16 }}>
            <button onClick={() => navigate(-1)}
              style={{ width: 36, height: 36, borderRadius: 12, background: "rgba(255,255,255,0.08)", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.15)"; e.currentTarget.style.color = "white"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}>
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
            </button>

            <button onClick={() => navigate("/dashboard")} className="lyra-serif" style={{ fontSize: 22, letterSpacing: "0.35em", color: "white", background: "none", border: "none", cursor: "pointer", transition: "opacity 0.2s" }}>
              LY<span style={{ color: "#f472b6" }}>R</span>A
            </button>
            <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 13, marginLeft: 4 }}>/ Contact Us</span>
          </div>
        </nav>

        {/* ── HERO ── */}
        <div ref={heroRef} style={{
          position: "relative", overflow: "hidden", padding: "80px 20px 72px",
          background: "linear-gradient(160deg,#07021a 0%,#0f0820 30%,#1a0838 60%,#0d0520 100%)",
          textAlign: "center",
        }}>
          {/* Animated orbs */}
          {[
            { w:480, h:480, top:-120, left:-60, tx:"40px", ty:"50px", ts:"1.1", dur:"18s", del:"0s", bg:"rgba(109,40,217,0.18)" },
            { w:320, h:320, top:40, right:-60, tx:"-30px", ty:"40px", ts:"1.08", dur:"14s", del:"2s", bg:"rgba(236,72,153,0.12)" },
            { w:200, h:200, bottom:0, left:"40%", tx:"20px", ty:"-30px", ts:"0.92", dur:"11s", del:"4s", bg:"rgba(139,92,246,0.14)" },
          ].map((orb, i) => (
            <div key={i} style={{
              position: "absolute", borderRadius: "50%",
              width: orb.w, height: orb.h,
              top: orb.top, left: orb.left, right: orb.right, bottom: orb.bottom,
              background: orb.bg, filter: "blur(90px)", pointerEvents: "none",
              "--tx": orb.tx, "--ty": orb.ty, "--ts": orb.ts,
              animation: `floatOrb ${orb.dur} ${orb.del} ease-in-out infinite alternate`,
            }} />
          ))}

          {/* Grid overlay */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.03,
            backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)",
            backgroundSize: "48px 48px",
          }} />

          {/* Parallax ring */}
          <div style={{
            position: "absolute", top: "50%", left: "50%", width: 600, height: 600,
            borderRadius: "50%", border: "1px solid rgba(124,58,237,0.1)",
            transform: `translate(calc(-50% + ${mousePos.x * 15}px), calc(-50% + ${mousePos.y * 15}px))`,
            transition: "transform 0.4s ease", pointerEvents: "none",
            animation: "pulseRing 6s ease-in-out infinite",
          }} />

          <div style={{ position: "relative", zIndex: 2 }}>
            {/* Eyebrow */}
            <div className="cp-fade-1" style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 20, padding: "6px 16px", background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.25)", borderRadius: 999 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#a855f7", display: "inline-block", animation: "pulseRing 2s ease-in-out infinite" }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: "#c084fc", letterSpacing: "0.2em", textTransform: "uppercase" }}>We're here for you</span>
            </div>

            {/* Headline */}
            <h1 className="lyra-serif cp-fade-2" style={{ fontSize: "clamp(3rem,8vw,5.5rem)", fontWeight: 300, color: "white", lineHeight: 1, marginBottom: 20 }}>
              Get in{" "}
              <span style={{
                background: "linear-gradient(135deg,#f3e8ff,#e879f9,#fbcfe8,#e879f9)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                display: "inline-block",
              }}>Touch</span>
            </h1>

            <p className="cp-fade-3" style={{ color: "rgba(255,255,255,0.4)", fontSize: 15, maxWidth: 420, margin: "0 auto 48px", lineHeight: 1.8, fontWeight: 300 }}>
              Have a question or concern? Our dedicated team responds within 24 hours, every day.
            </p>

            {/* Info cards */}
            <div className="info-grid cp-fade-4" style={{ maxWidth: 860, margin: "0 auto" }}>
              {[
                { icon: "📧", label: "Email Support", value: "support@lyra.com", note: "24-hr response", grad: "linear-gradient(135deg,rgba(124,58,237,0.15),rgba(109,40,217,0.08))", border: "rgba(124,58,237,0.2)" },
                { icon: "📞", label: "Call Us", value: "1800-123-5678", note: "Mon–Sat, 9am–6pm IST", grad: "linear-gradient(135deg,rgba(236,72,153,0.12),rgba(219,39,119,0.06))", border: "rgba(236,72,153,0.2)" },
                { icon: "💬", label: "Live Chat", value: "Chat with us", note: "Available right now", grad: "linear-gradient(135deg,rgba(14,165,233,0.12),rgba(8,145,178,0.06))", border: "rgba(14,165,233,0.2)" },
              ].map((card) => (
                <div key={card.label} className="info-card" style={{ background: card.grad, border: `1px solid ${card.border}`, backdropFilter: "blur(12px)" }}>
                  <div style={{ fontSize: 28, marginBottom: 10 }}>{card.icon}</div>
                  <p className="lyra-serif" style={{ color: "white", fontSize: 18, fontWeight: 400, marginBottom: 4 }}>{card.label}</p>
                  <p style={{ color: "rgba(196,181,253,0.9)", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{card.value}</p>
                  <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>{card.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── FORM SECTION ── */}
        <div style={{ maxWidth: 780, margin: "0 auto", padding: "48px 20px 80px" }}>

          {/* ── SUCCESS STATE ── */}
          {status === "success" ? (
            <div className="cp-success" style={{
              background: "white", borderRadius: 28,
              border: "1px solid rgba(124,58,237,0.1)",
              boxShadow: "0 30px 80px -12px rgba(124,58,237,0.12)",
              padding: "60px 40px", textAlign: "center",
            }}>
              {/* Animated checkmark */}
              <div style={{ position: "relative", width: 100, height: 100, margin: "0 auto 28px" }}>
                <div style={{
                  width: 100, height: 100, borderRadius: "50%",
                  background: "linear-gradient(135deg,#10b981,#059669)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 12px 40px rgba(16,185,129,0.4)",
                }}>
                  <svg width="44" height="44" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                {/* Pulse rings */}
                {[1, 2].map((r) => (
                  <div key={r} style={{
                    position: "absolute", inset: -r * 14, borderRadius: "50%",
                    border: "1.5px solid rgba(16,185,129,0.25)",
                    animation: `pulseRing ${2 + r}s ease-in-out ${r * 0.4}s infinite`,
                  }} />
                ))}
              </div>

              <h2 className="lyra-serif" style={{ fontSize: 36, color: "#111827", marginBottom: 12, fontWeight: 400 }}>
                Message <span style={{ color: "#7c3aed" }}>Received!</span>
              </h2>
              <p style={{ color: "#6b7280", fontSize: 14, lineHeight: 1.8, maxWidth: 340, margin: "0 auto 32px" }}>
                Thank you for reaching out. Our support team will get back to you within 24 hours.
              </p>

              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                <button onClick={() => setStatus("idle")} style={{
                  padding: "12px 28px", borderRadius: 14,
                  background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)",
                  color: "#7c3aed", fontSize: 13, fontWeight: 700, cursor: "pointer",
                  transition: "all 0.2s",
                }}>Send Another Message</button>
                <button onClick={() => navigate("/dashboard")} className="cp-submit" style={{ maxWidth: 240, padding: "12px 28px" }}>
                  Continue Shopping →
                </button>
              </div>
            </div>
          ) : (

            // ── FORM ──
            <div style={{
              background: "white", borderRadius: 28,
              border: "1px solid rgba(124,58,237,0.08)",
              boxShadow: "0 30px 80px -12px rgba(124,58,237,0.1)",
              padding: "44px 40px",
              position: "relative", overflow: "hidden",
            }}>

              {/* Corner accent */}
              <div style={{
                position: "absolute", top: -60, right: -60, width: 200, height: 200,
                borderRadius: "50%", background: "radial-gradient(circle,rgba(124,58,237,0.06),transparent 70%)",
                pointerEvents: "none",
              }} />

              {/* Form header */}
              <div style={{ marginBottom: 36 }}>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#a78bfa", marginBottom: 8 }}>
                  ✦ Send a Message
                </p>
                <h2 className="lyra-serif" style={{ fontSize: 32, color: "#111827", fontWeight: 400, lineHeight: 1.1 }}>
                  How can we <span style={{ color: "#7c3aed", fontStyle: "italic" }}>help?</span>
                </h2>
                <div style={{ height: 3, width: 48, marginTop: 14, borderRadius: 2, background: "linear-gradient(90deg,#7c3aed,#ec4899)" }} />
              </div>

              {/* Error banner */}
              {status === "error" && (
                <div style={{
                  marginBottom: 24, padding: "14px 18px", borderRadius: 14,
                  background: "#fef2f2", border: "1px solid #fecaca",
                  display: "flex", alignItems: "flex-start", gap: 10,
                }}>
                  <span style={{ color: "#ef4444", fontSize: 18, flexShrink: 0 }}>⚠</span>
                  <div>
                    <p style={{ color: "#dc2626", fontSize: 13, fontWeight: 700, marginBottom: 2 }}>Submission failed</p>
                    <p style={{ color: "#ef4444", fontSize: 12 }}>{errMsg}</p>
                  </div>
                  <button onClick={() => setStatus("idle")} style={{ marginLeft: "auto", color: "#ef4444", background: "none", border: "none", cursor: "pointer", fontSize: 16, flexShrink: 0 }}>✕</button>
                </div>
              )}

              {/* Row 1: Name + Email */}
              <div className="two-col" style={{ marginBottom: 20 }}>
                <FloatInput id="name" label="Full Name" value={form.name} onChange={set("name")} error={errors.name} required />
                <FloatInput id="email" label="Email Address" type="email" value={form.email} onChange={set("email")} error={errors.email} required />
              </div>

              {/* Row 2: Phone + Order ID */}
              <div className="two-col" style={{ marginBottom: 28 }}>
                <FloatInput id="phone" label="Phone Number" type="tel" value={form.phone} onChange={(e) => { setForm((f) => ({ ...f, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })); }} placeholder="9999999999" prefix="+91" />
                <FloatInput id="orderId" label="Order ID (optional)" value={form.orderId} onChange={set("orderId")} placeholder="ORD-2026-XXXXX" />
              </div>

              {/* Subject selector */}
              <div style={{ marginBottom: 28 }}>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: errors.subject ? "#ef4444" : "#9ca3af", marginBottom: 12 }}>
                  Topic{" "}<span style={{ color: "#ec4899" }}>*</span>
                  {form.subject && <span style={{ marginLeft: 8, color: selSubj?.color, fontStyle: "normal" }}>— {form.subject}</span>}
                </p>
                <div className="subj-grid">
                  {SUBJECTS.map((s) => {
                    const isActive = form.subject === s.value;
                    return (
                      <button key={s.value} onClick={() => { setForm((f) => ({ ...f, subject: s.value })); setErrors((e) => ({ ...e, subject: "" })); }}
                        className={`subj-btn${isActive ? " active" : ""}`}
                        style={isActive ? {
                          background: `${s.color}12`,
                          border: `1.5px solid ${s.color}`,
                          boxShadow: `0 6px 20px ${s.color}20`,
                        } : {}}>
                        <div style={{ fontSize: 20, marginBottom: 6 }}>{s.icon}</div>
                        <p style={{ fontSize: 11, fontWeight: 600, color: isActive ? s.color : "#4b5563", transition: "color 0.2s", letterSpacing: "0.02em" }}>
                          {s.value}
                        </p>
                        {isActive && (
                          <div style={{ position: "absolute", top: 8, right: 8, width: 14, height: 14, borderRadius: "50%", background: s.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <svg width="8" height="8" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
                {errors.subject && (
                  <p style={{ fontSize: 11, color: "#ef4444", fontWeight: 600, marginTop: 8, display: "flex", alignItems: "center", gap: 4 }}>
                    <span>⚠</span> {errors.subject}
                  </p>
                )}
              </div>

              {/* Message */}
              <div style={{ marginBottom: 32 }}>
                <FloatTextarea id="message" label="Your Message" value={form.message} onChange={set("message")} error={errors.message} required maxLength={1000} />
              </div>

              {/* Divider */}
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
                <div style={{ flex: 1, height: 1, background: "linear-gradient(to right,transparent,rgba(124,58,237,0.15),transparent)" }} />
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#d8b4fe" }}>Ready to send</span>
                <div style={{ flex: 1, height: 1, background: "linear-gradient(to right,transparent,rgba(124,58,237,0.15),transparent)" }} />
              </div>

              {/* Submit */}
              <button className="cp-submit" onClick={handleSubmit} disabled={status === "loading"}>
                {status === "loading" ? (
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                    <span className="spin" /> Sending your message…
                  </span>
                ) : "Send Message →"}
              </button>

              <p style={{ textAlign: "center", fontSize: 11, color: "#9ca3af", marginTop: 16, lineHeight: 1.7 }}>
                By submitting, you agree to our{" "}
                <span style={{ color: "#7c3aed", cursor: "pointer" }}>Privacy Policy</span>.
                {" "}We never share your information.
              </p>
            </div>
          )}

          {/* FAQ nudge */}
          <div style={{ textAlign: "center", marginTop: 32 }}>
            <p style={{ fontSize: 13, color: "#9ca3af" }}>
              Looking for quick answers?{" "}
              <button style={{ color: "#7c3aed", fontWeight: 700, background: "none", border: "none", cursor: "pointer", fontSize: 13 }}>
                Browse our FAQ →
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;  


