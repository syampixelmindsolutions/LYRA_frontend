// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// // ── Change this to your deployed backend URL in production ──
// const API_BASE = "http://localhost:6055/api/users";

// // Replace with your actual logo:
// // import logo from '../assets/lyra-logo.jpeg';
// const logo = "https://placehold.co/80x80/ffffff/0f0a1e?text=✦";

// const InputField = ({ label, type = "text", value, onChange, placeholder, prefix }) => {
//   const [focused, setFocused] = useState(false);
//   return (
//     <div style={{ marginBottom: "18px" }}>
//       <label style={{
//         display: "block", fontSize: "0.65rem", fontWeight: 600,
//         letterSpacing: "0.15em", textTransform: "uppercase",
//         color: focused ? "#c084fc" : "#94a3b8",
//         marginBottom: "7px", transition: "color 0.2s",
//       }}>{label}</label>
//       <div style={{ display: "flex", position: "relative" }}>
//         {prefix && (
//           <span style={{
//             padding: "12px 14px", background: "#f9f5ff",
//             border: "1.5px solid", borderColor: focused ? "#c084fc" : "#e9d5ff",
//             borderRight: "none", borderRadius: "10px 0 0 10px",
//             color: "#9333ea", fontSize: "0.85rem", fontWeight: 600,
//             transition: "border-color 0.2s", userSelect: "none",
//           }}>{prefix}</span>
//         )}
//         <input
//           type={type} value={value} onChange={onChange} placeholder={placeholder}
//           onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
//           style={{
//             flex: 1, padding: "12px 16px",
//             border: "1.5px solid", borderColor: focused ? "#c084fc" : "#e9d5ff",
//             borderRadius: prefix ? "0 10px 10px 0" : "10px",
//             fontSize: "0.9rem", color: "#1e1033",
//             background: focused ? "#fdf8ff" : "#fefcff",
//             outline: "none", transition: "all 0.25s",
//             boxShadow: focused ? "0 0 0 4px rgba(192,132,252,0.12)" : "none",
//             fontFamily: "'Plus Jakarta Sans', sans-serif", width: "100%",
//           }}
//         />
//         {focused && (
//           <span style={{
//             position: "absolute", bottom: 0,
//             left: prefix ? "53px" : 0, right: 0, height: "2px",
//             background: "linear-gradient(90deg, #a855f7, #ec4899)",
//             borderRadius: "0 0 10px 10px",
//             animation: "lineGrow 0.3s ease-out forwards",
//           }} />
//         )}
//       </div>
//     </div>
//   );
// };

// /* ══════════════════════════════════════════
//    LYRA LOGIN — Backend Connected
// ══════════════════════════════════════════ */
// const Login = () => {
//   const [mobileNumber, setMobileNumber]         = useState("");
//   const [password, setPassword]                 = useState("");
//   const [otp, setOtp]                           = useState("");
//   const [userId, setUserId]                     = useState(null); // returned from /login
//   const [error, setError]                       = useState("");
//   const [isSuccess, setIsSuccess]               = useState(false);
//   const [loading, setLoading]                   = useState(false);
//   const [step, setStep]                         = useState(1); 

//   // Register fields
//   const [fullName, setFullName]                 = useState("");
//   const [email, setEmail]                       = useState("");
//   const [registerPassword, setRegisterPassword] = useState("");
//   const [confirmPassword, setConfirmPassword]   = useState("");


//   // UI / animation state
//   const [mounted, setMounted]     = useState(false);
//   const [logoPhase, setLogoPhase] = useState("intro");
//   const [stars, setStars]         = useState([]);

//   const navigate = useNavigate();

//   useEffect(() => {
//     const storedUser = sessionStorage.getItem("user");
//     if (storedUser) navigate("/dashboard");

//     const s = Array.from({ length: 60 }, (_, i) => ({
//       id: i, x: Math.random() * 100, y: Math.random() * 100,
//       size: Math.random() * 2 + 0.5, dur: Math.random() * 4 + 2,
//       delay: Math.random() * 5, opacity: Math.random() * 0.6 + 0.2,
//     }));
//     setStars(s);

//     setTimeout(() => setLogoPhase("shrink"), 2600);
//     setTimeout(() => { setLogoPhase("done"); setMounted(true); }, 3700);
//   }, [navigate]);

//   const handleMobileChange = (e) => {
//     setMobileNumber(e.target.value.replace(/\D/g, ""));
//     setError("");
//   };

//   const showMsg = (msg, success = false) => {
//     setError(msg);
//     setIsSuccess(success);
//   };

//   // ═══════════════════════════════════════════════
//   // STEP 1 — Login
//   // POST /api/users/login
//   // Body:    { mobileNumber, password }
//   // Success: { userId, message }   → go to OTP step
//   // ═══════════════════════════════════════════════
//   const handleLoginSubmit = async (e) => {
//     e.preventDefault();
//     if (mobileNumber.length !== 10) return showMsg("Enter a valid 10-digit mobile number");
//     if (!password || password.length < 6) return showMsg("Password must be at least 6 characters");

//     setLoading(true);
//     try {
//       const res  = await fetch(`${API_BASE}/login`, {
//         method:  "POST",
//         headers: { "Content-Type": "application/json" },
//         body:    JSON.stringify({ mobileNumber, password }),
//       });
//       const data = await res.json();

//       if (!res.ok) {
//         return showMsg(data.error || data.message || "Invalid credentials. Please try again.");
//       }

//       setUserId(data.userId);   // store for OTP verification
//       setStep(3);
//       showMsg("OTP sent to your registered mobile number.", true);
//     } catch {
//       showMsg("Cannot reach server. Please check your connection.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ═══════════════════════════════════════════════
//   // STEP 3 — Verify OTP
//   // POST /api/users/verify-otp
//   // Body:    { userId, otp }
//   // Success: { token, user: { _id, fullName, mobileNumber, email, profileImage } }
//   // ═══════════════════════════════════════════════
//   const handleVerifyOtp = async (e) => {
//     e.preventDefault();
//     if (!otp || otp.length !== 4) return showMsg("Enter a valid 4-digit OTP");

//     setLoading(true);
//     try {
//       const res  = await fetch(`${API_BASE}/verify-otp`, {
//         method:  "POST",
//         headers: { "Content-Type": "application/json" },
//         body:    JSON.stringify({ userId, otp }),
//       });
//       const data = await res.json();

//       if (!res.ok) {
//         return showMsg(data.error || data.message || "OTP verification failed. Try again.");
//       }

//       // Persist full session used across Dashboard, Cart, Profile etc.
//       sessionStorage.setItem("user", JSON.stringify({
//         userId:       data.user._id,
//         fullName:     data.user.fullName,
//         mobileNumber: data.user.mobileNumber,
//         email:        data.user.email,
//         token:        data.token,
//         profileImage: data.user.profileImage || null,
//       }));

//       navigate("/dashboard");
//     } catch {
//       showMsg("Cannot reach server. Please check your connection.");
//     } finally {
//       setLoading(false);
//     }
//   };


//   const handleRegisterSubmit = async (e) => {
//     e.preventDefault();

//     // Client-side guards before hitting the API
//     if (!fullName.trim())                    return showMsg("Full name is required");
//     if (mobileNumber.length !== 10)          return showMsg("Enter a valid 10-digit mobile number");
//     if (!email.includes("@"))                return showMsg("Enter a valid email address");
//     if (registerPassword.length < 6)         return showMsg("Password must be at least 6 characters");
//     if (registerPassword !== confirmPassword) return showMsg("Passwords do not match");

//     setLoading(true);
//     try {
//       const res  = await fetch(`${API_BASE}/register`, {
//         method:  "POST",
//         headers: { "Content-Type": "application/json" },
//         body:    JSON.stringify({
//           fullName,
//           email,
//           mobileNumber,
//           password:        registerPassword,
//           confirmPassword,
//         }),
//       });
//       const data = await res.json();

//       if (!res.ok) {
//         return showMsg(data.error || data.message || "Registration failed. Please try again.");
//       }

//       // Clear all register fields and return to login
//       setFullName(""); setEmail("");
//       setRegisterPassword(""); setConfirmPassword("");
//       setMobileNumber(""); setPassword("");
//       setStep(1);
//       showMsg("Account created! Please sign in.", true);
//     } catch {
//       showMsg("Cannot reach server. Please check your connection.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ═══════════════════════════════════════════════
//   // Resend OTP (optional endpoint)
//   // POST /api/users/resend-otp  →  { userId }
//   // ═══════════════════════════════════════════════
//   const handleResendOtp = async () => {
//     if (!userId) return;
//     try {
//       const res  = await fetch(`${API_BASE}/resend-otp`, {
//         method:  "POST",
//         headers: { "Content-Type": "application/json" },
//         body:    JSON.stringify({ userId }),
//       });
//       const data = await res.json();
//       showMsg(
//         res.ok ? "OTP resent successfully." : (data.message || "Failed to resend OTP."),
//         res.ok
//       );
//     } catch {
//       showMsg("Cannot reach server.");
//     }
//   };

//   const handleForgotPassword = async (e) => {
//     e.preventDefault();

//     if (mobileNumber.length !== 10) {
//         return showMsg("Enter valid mobile number");
//       }

//       setLoading(true);

//   try{
//     const res = await fetch(`${API_BASE}/forgot-password`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ mobileNumber }),
//     });

//     const data = await res.json();

//     if (!res.ok) return showMsg(data.message  || "Failed to send OTP");

//      console.log("STEP → 5"); 

//     setUserId(data.userId);
//     setStep(5);
//   } catch (err) {
//     console.log("ERROR:", err);
//     showMsg("Cannot reach server");
//   } finally {
//     setLoading(false);
//   }
// };


//   const handleVerifyResetOtp = async (e) => {
//     e.preventDefault();

//   try{
//     const res = await fetch(`${API_BASE}/verify-reset-otp`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ userId, otp }),
//     });

//     const data = await res.json();

//     if (!res.ok) return showMsg(data.message);

//     setStep(6);
//   }catch{
//     showMsg("Server error. Try again.");
//   }
//   };

//   const handleResetPassword = async (e) => {
//     e.preventDefault();

//     if (registerPassword.length < 6) {
//       return showMsg("Password must be at least 6 characters");
//     }

//     const res = await fetch(`${API_BASE}/reset-password`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         userId,
//         newPassword: registerPassword,
//         confirmPassword,
//       }),
//     });

//     const data = await res.json();

//     if (!res.ok) return showMsg(data.message);

//     showMsg("Password updated successfully", true);
//     setStep(1);
//   };


//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');

//         *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
//         body { font-family: 'Plus Jakarta Sans', sans-serif; overflow-x: hidden; }

//         .lyra-intro {
//           position: fixed; inset: 0; z-index: 300;
//           background: radial-gradient(ellipse at center, #1a0533 0%, #07020f 70%);
//           display: flex; flex-direction: column; align-items: center; justify-content: center;
//           transition: opacity 1.2s ease, transform 1.2s ease;
//         }
//         .lyra-intro.out { opacity: 0; transform: scale(1.08); pointer-events: none; }

//         .intro-star-field { position: absolute; inset: 0; overflow: hidden; }
//         .intro-star {
//           position: absolute; border-radius: 50%; background: white;
//           animation: twinkle var(--d) var(--del) ease-in-out infinite;
//         }
//         @keyframes twinkle {
//           0%,100% { opacity: var(--op); transform: scale(1); }
//           50%      { opacity: 0.1; transform: scale(0.5); }
//         }
//         .intro-logo-wrap { position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center; }
//         .intro-ring {
//           position: absolute; border-radius: 50%;
//           border: 1px solid rgba(192,132,252,0.3); animation: ringPulse 2s ease-out infinite;
//         }
//         @keyframes ringPulse { 0% { transform: scale(0.8); opacity: 0.8; } 100% { transform: scale(2); opacity: 0; } }
//         .intro-logo-img {
//           width: 100px; height: 100px; border-radius: 50%; object-fit: cover;
//           animation: logoIn 2.6s cubic-bezier(0.16,1,0.3,1) forwards;
//           border: 2px solid rgba(255,255,255,0.15);
//           box-shadow: 0 0 50px rgba(192,132,252,0.5), 0 0 100px rgba(236,72,153,0.2);
//         }
//         @keyframes logoIn {
//           0%  { transform: scale(0); opacity: 0; filter: blur(30px); }
//           55% { transform: scale(1.08); opacity: 1; filter: blur(0); }
//           78% { transform: scale(0.96); }
//           100%{ transform: scale(1); }
//         }
//         .intro-name {
//           font-family: 'Cormorant Garamond', serif; font-size: 3.8rem; font-weight: 300;
//           letter-spacing: 0.7em; text-transform: uppercase; margin-top: 20px;
//           background: linear-gradient(135deg, #e9d5ff 0%, #f0abfc 40%, #fbcfe8 70%, #e9d5ff 100%);
//           background-size: 200% 100%;
//           -webkit-background-clip: text; -webkit-text-fill-color: transparent;
//           animation: nameIn 1.2s 0.8s both, shimmerText 4s 2s linear infinite;
//         }
//         @keyframes nameIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
//         @keyframes shimmerText { 0% { background-position: 0% 0%; } 100% { background-position: 200% 0%; } }
//         .intro-tagline {
//           font-size: 0.6rem; letter-spacing: 0.55em; text-transform: uppercase;
//           color: rgba(216,180,254,0.45); margin-top: 4px; animation: nameIn 1s 1.2s both;
//         }
//         .intro-line {
//           width: 80px; height: 1px; margin: 16px auto 0;
//           background: linear-gradient(90deg, transparent, rgba(192,132,252,0.5), transparent);
//           animation: nameIn 1s 1.4s both;
//         }

//         .lyra-page { min-height: 100vh; display: flex; opacity: 0; transition: opacity 0.9s ease; }
//         .lyra-page.show { opacity: 1; }

//         .lyra-left {
//           width: 44%;
//           background: linear-gradient(160deg, #0f0720 0%, #1a0533 30%, #200840 60%, #0a0118 100%);
//           position: relative; overflow: hidden;
//           display: flex; flex-direction: column; align-items: center; justify-content: center;
//           padding: 60px 44px;
//         }
//         .star-bg { position: absolute; inset: 0; overflow: hidden; }
//         .star { position: absolute; border-radius: 50%; background: #fff; animation: twinkle var(--d) var(--del) ease-in-out infinite; }
//         .left-aurora {
//           position: absolute; inset: 0; pointer-events: none;
//           background:
//             radial-gradient(ellipse 70% 50% at 30% 25%, rgba(168,85,247,0.22) 0%, transparent 60%),
//             radial-gradient(ellipse 55% 60% at 75% 75%, rgba(236,72,153,0.14) 0%, transparent 55%),
//             radial-gradient(ellipse 40% 40% at 60% 10%, rgba(139,92,246,0.12) 0%, transparent 50%);
//           animation: auroraPulse 10s ease-in-out infinite alternate;
//         }
//         @keyframes auroraPulse { from { opacity: 0.7; } to { opacity: 1.3; } }
//         .grid-overlay {
//           position: absolute; inset: 0; pointer-events: none; opacity: 0.04;
//           background-image: linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px);
//           background-size: 44px 44px;
//         }
//         .floating-orb {
//           position: absolute; border-radius: 50%; filter: blur(70px); pointer-events: none;
//           animation: orbFloat var(--d) var(--del) ease-in-out infinite alternate;
//         }
//         @keyframes orbFloat { from { transform: translate(0,0) scale(1); } to { transform: translate(var(--x), var(--y)) scale(1.1); } }
//         .deco-circle { position: absolute; border-radius: 50%; border: 1px solid rgba(192,132,252,0.06); pointer-events: none; }
//         .left-content { position: relative; z-index: 5; text-align: center; }
//         .lyra-brand-logo {
//           width: 76px; height: 76px; border-radius: 50%; object-fit: cover;
//           border: 2px solid rgba(255,255,255,0.18);
//           box-shadow: 0 0 30px rgba(168,85,247,0.45), 0 8px 40px rgba(0,0,0,0.4);
//           margin-bottom: 20px; animation: brandPulse 5s ease-in-out infinite;
//         }
//         @keyframes brandPulse {
//           0%,100% { box-shadow: 0 0 30px rgba(168,85,247,0.45), 0 8px 40px rgba(0,0,0,0.4); }
//           50%      { box-shadow: 0 0 55px rgba(236,72,153,0.5), 0 8px 48px rgba(0,0,0,0.5); }
//         }
//         .lyra-brand-name {
//           font-family: 'Cormorant Garamond', serif; font-size: 3.2rem; font-weight: 300;
//           letter-spacing: 0.6em; text-transform: uppercase; line-height: 1;
//           background: linear-gradient(135deg, #f3e8ff, #e879f9, #fbcfe8, #f3e8ff);
//           background-size: 300% 100%;
//           -webkit-background-clip: text; -webkit-text-fill-color: transparent;
//           animation: shimmerText 6s linear infinite;
//         }
//         .lyra-brand-sub { font-size: 0.55rem; letter-spacing: 0.55em; text-transform: uppercase; color: rgba(216,180,254,0.4); margin-top: 6px; font-family: 'Plus Jakarta Sans', sans-serif; }
//         .left-sep { display: flex; align-items: center; gap: 10px; margin: 24px 0; width: 100%; }
//         .left-sep-line { flex: 1; height: 1px; background: rgba(192,132,252,0.15); }
//         .left-sep-star { color: rgba(192,132,252,0.4); font-size: 0.7rem; }
//         .lyra-features { list-style: none; text-align: left; width: 100%; }
//         .lyra-feature {
//           display: flex; align-items: flex-start; gap: 12px; margin-bottom: 16px;
//           padding: 12px 14px; background: rgba(255,255,255,0.03);
//           border: 1px solid rgba(192,132,252,0.08); border-radius: 10px;
//           transition: background 0.3s, border-color 0.3s;
//         }
//         .lyra-feature:hover { background: rgba(192,132,252,0.07); border-color: rgba(192,132,252,0.2); }
//         .lyra-feature-icon { font-size: 1rem; flex-shrink: 0; margin-top: 1px; }
//         .lyra-feature-title { font-size: 0.75rem; font-weight: 500; color: rgba(243,232,255,0.85); margin-bottom: 2px; font-family: 'Plus Jakarta Sans', sans-serif; }
//         .lyra-feature-desc { font-size: 0.62rem; color: rgba(216,180,254,0.4); line-height: 1.4; font-family: 'Plus Jakarta Sans', sans-serif; }

//         .lyra-right {
//           flex: 1; background: #fefcff;
//           display: flex; flex-direction: column; align-items: center; justify-content: center;
//           padding: 48px 56px; position: relative; overflow-y: auto;
//         }
//         .lyra-right::before {
//           content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
//           background: linear-gradient(90deg, #7c3aed, #a855f7, #ec4899, #a855f7, #7c3aed);
//           background-size: 300% 100%; animation: topBarFlow 5s linear infinite;
//         }
//         @keyframes topBarFlow { 0% { background-position: 0% 0%; } 100% { background-position: 300% 0%; } }
//         .lyra-right::after {
//           content: ''; position: absolute; inset: 0; pointer-events: none; z-index: 0;
//           background-image: radial-gradient(circle at 90% 10%, rgba(168,85,247,0.04) 0%, transparent 40%),
//                             radial-gradient(circle at 10% 90%, rgba(236,72,153,0.03) 0%, transparent 40%);
//         }

//         .lyra-form-box { width: 100%; max-width: 390px; position: relative; z-index: 1; }

//         .lyra-progress { display: flex; gap: 5px; margin-bottom: 32px; }
//         .lyra-prog-seg {
//           height: 3px; border-radius: 3px; flex: 1; background: #f3e8ff;
//           transition: all 0.5s ease; position: relative; overflow: hidden;
//         }
//         .lyra-prog-seg.done { background: linear-gradient(90deg, #a855f7, #ec4899); }
//         .lyra-prog-seg.done::after {
//           content: ''; position: absolute; inset: 0;
//           background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
//           animation: progShimmer 2s infinite;
//         }
//         @keyframes progShimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }

//         .lyra-eyebrow {
//           font-size: 0.6rem; font-weight: 700; letter-spacing: 0.25em;
//           text-transform: uppercase; color: #a855f7; margin-bottom: 6px;
//           display: flex; align-items: center; gap: 8px;
//         }
//         .lyra-eyebrow::before { content: '✦'; font-size: 0.55rem; color: #ec4899; }
//         .lyra-form-title { font-family: 'Cormorant Garamond', serif; font-size: 2.2rem; font-weight: 400; color: #12002a; line-height: 1.15; margin-bottom: 6px; }
//         .lyra-form-sub { font-size: 0.78rem; color: #94a3b8; line-height: 1.6; margin-bottom: 28px; }

//         .lyra-social { display: flex; gap: 10px; margin-bottom: 22px; }
//         .lyra-social-btn {
//           flex: 1; padding: 11px 14px; border: 1.5px solid #ede9fe; border-radius: 10px;
//           background: white; cursor: pointer; font-size: 0.72rem; font-weight: 500; color: #3b0764;
//           display: flex; align-items: center; justify-content: center; gap: 8px;
//           transition: all 0.25s; font-family: 'Plus Jakarta Sans', sans-serif;
//         }
//         .lyra-social-btn:hover { border-color: #c084fc; background: #fdf4ff; transform: translateY(-2px); box-shadow: 0 4px 14px rgba(168,85,247,0.12); }

//         .lyra-divider { display: flex; align-items: center; gap: 12px; margin-bottom: 22px; }
//         .lyra-div-line { flex: 1; height: 1px; background: #f3e8ff; }
//         .lyra-div-text { font-size: 0.66rem; color: #d8b4fe; white-space: nowrap; font-style: italic; }

//         .lyra-alert {
//           padding: 12px 16px; border-radius: 10px; font-size: 0.73rem;
//           margin-bottom: 18px; display: flex; align-items: center; gap: 10px;
//           font-family: 'Plus Jakarta Sans', sans-serif;
//         }
//         .lyra-alert.success { background: linear-gradient(135deg, #fdf4ff, #fce7f3); border: 1px solid #e879f9; color: #86198f; }
//         .lyra-alert.error   { background: #fef2f2; border: 1px solid #fca5a5; color: #dc2626; }

//         .lyra-submit {
//           width: 100%; padding: 14px; border: none; border-radius: 12px;
//           background: linear-gradient(135deg, #7c3aed 0%, #a855f7 40%, #ec4899 100%);
//           background-size: 200% 100%; background-position: 0% 0%;
//           color: white; font-size: 0.88rem; font-weight: 600; letter-spacing: 0.06em;
//           cursor: pointer; transition: all 0.35s ease;
//           font-family: 'Plus Jakarta Sans', sans-serif;
//           box-shadow: 0 4px 20px rgba(168,85,247,0.35);
//           position: relative; overflow: hidden;
//           display: flex; align-items: center; justify-content: center; gap: 8px;
//         }
//         .lyra-submit:disabled { opacity: 0.7; cursor: not-allowed; transform: none !important; }
//         .lyra-submit::after {
//           content: ''; position: absolute; top: -50%; left: -60%; width: 40%; height: 200%;
//           background: rgba(255,255,255,0.15); transform: skewX(-20deg); transition: left 0.5s ease;
//         }
//         .lyra-submit:not(:disabled):hover { background-position: 100% 0%; box-shadow: 0 6px 28px rgba(168,85,247,0.5); transform: translateY(-2px); }
//         .lyra-submit:not(:disabled):hover::after { left: 120%; }
//         .lyra-submit:active:not(:disabled) { transform: translateY(0); }

//         .spin {
//           width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.35);
//           border-top-color: white; border-radius: 50%;
//           animation: spin 0.7s linear infinite; flex-shrink: 0;
//         }
//         @keyframes spin { to { transform: rotate(360deg); } }

//         .lyra-forgot { text-align: right; margin-top: -10px; margin-bottom: 20px; }
//         .lyra-link { font-size: 0.72rem; color: #c084fc; cursor: pointer; transition: color 0.2s; text-decoration: none; }
//         .lyra-link:hover { color: #a855f7; }

//         .lyra-switch { text-align: center; margin-top: 22px; font-size: 0.78rem; color: #94a3b8; }
//         .lyra-switch-link { color: #9333ea; font-weight: 600; cursor: pointer; margin-left: 5px; transition: color 0.2s; border-bottom: 1px solid transparent; }
//         .lyra-switch-link:hover { color: #7c3aed; border-color: #c084fc; }

//         .form-slide { animation: formSlide 0.45s cubic-bezier(0.22,1,0.36,1) both; }
//         @keyframes formSlide { from { opacity: 0; transform: translateX(22px); } to { opacity: 1; transform: translateX(0); } }

//         @keyframes lineGrow { from { transform: scaleX(0); transform-origin: left; } to { transform: scaleX(1); transform-origin: left; } }

//         .lyra-otp {
//           width: 100%; padding: 20px; border: 1.5px solid #ede9fe; border-radius: 12px;
//           text-align: center; font-size: 2.4rem; letter-spacing: 0.8em;
//           font-family: 'Cormorant Garamond', serif; color: #4c1d95;
//           background: #fdf8ff; outline: none; transition: all 0.25s;
//         }
//         .lyra-otp:focus { border-color: #c084fc; box-shadow: 0 0 0 4px rgba(192,132,252,0.12); background: #fdf4ff; }

//         @media (max-width: 768px) { .lyra-left { display: none; } .lyra-right { padding: 40px 24px; } }
//         ::-webkit-scrollbar { width: 4px; }
//         ::-webkit-scrollbar-track { background: #fefcff; }
//         ::-webkit-scrollbar-thumb { background: linear-gradient(#a855f7, #ec4899); border-radius: 4px; }
//       `}</style>

//       {/* ── INTRO ── */}
//       {logoPhase !== "done" && (
//         <div className={`lyra-intro ${logoPhase === "shrink" ? "out" : ""}`}>
//           <div className="intro-star-field">
//             {stars.slice(0, 40).map((s) => (
//               <div key={s.id} className="intro-star" style={{
//                 left: `${s.x}%`, top: `${s.y}%`,
//                 width: `${s.size}px`, height: `${s.size}px`,
//                 "--d": `${s.dur}s`, "--del": `${s.delay}s`, "--op": s.opacity,
//               }} />
//             ))}
//           </div>
//           <div className="intro-logo-wrap">
//             <div className="intro-ring" style={{ width: "120px", height: "120px" }} />
//             <div className="intro-ring" style={{ width: "120px", height: "120px", animationDelay: "0.5s" }} />
//             <img src={logo} alt="Lyra" className="intro-logo-img" />
//           </div>
//           <div className="intro-name">Lyra</div>
//           <div className="intro-tagline">Celestial Fashion</div>
//           <div className="intro-line" />
//         </div>
//       )}

//       {/* ── MAIN PAGE ── */}
//       <div className={`lyra-page ${mounted ? "show" : ""}`}>

//         {/* LEFT PANEL */}
//         <div className="lyra-left">
//           <div className="star-bg">
//             {stars.map((s) => (
//               <div key={s.id} className="star" style={{
//                 left: `${s.x}%`, top: `${s.y}%`,
//                 width: `${s.size}px`, height: `${s.size}px`,
//                 "--d": `${s.dur}s`, "--del": `${s.delay}s`, "--op": s.opacity,
//               }} />
//             ))}
//           </div>
//           <div className="left-aurora" />
//           <div className="grid-overlay" />
//           <div className="floating-orb" style={{ width:"280px", height:"280px", background:"rgba(139,92,246,0.25)", top:"-100px", left:"-80px", "--d":"14s","--del":"0s","--x":"40px","--y":"60px" }} />
//           <div className="floating-orb" style={{ width:"200px", height:"200px", background:"rgba(236,72,153,0.18)", bottom:"-60px", right:"-40px", "--d":"11s","--del":"1.5s","--x":"-35px","--y":"-45px" }} />
//           <div className="deco-circle" style={{ width:"600px", height:"600px", top:"-200px", left:"-200px" }} />
//           <div className="deco-circle" style={{ width:"350px", height:"350px", bottom:"-100px", right:"-100px" }} />

//           <div className="left-content">
//             <img src={logo} alt="Lyra" className="lyra-brand-logo" />
//             <div className="lyra-brand-name">Lyra</div>
//             <div className="lyra-brand-sub">Celestial Fashion</div>
//             <div className="left-sep">
//               <div className="left-sep-line" />
//               <span className="left-sep-star">✦</span>
//               <div className="left-sep-line" />
//             </div>
//             <ul className="lyra-features">
//               {[
//                 { icon: "✦", title: "Exclusive Collections", desc: "Curated celestial-inspired designs" },
//                 { icon: "🚀", title: "Express Delivery",     desc: "Free shipping on orders above ₹999" },
//                 { icon: "↩", title: "Easy Returns",          desc: "Hassle-free 30-day return policy" },
//                 { icon: "🔒", title: "Secure & Private",     desc: "End-to-end encrypted transactions" },
//               ].map((f) => (
//                 <li key={f.title} className="lyra-feature">
//                   <span className="lyra-feature-icon">{f.icon}</span>
//                   <div>
//                     <div className="lyra-feature-title">{f.title}</div>
//                     <div className="lyra-feature-desc">{f.desc}</div>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>

//         {/* RIGHT PANEL */}
//         <div className="lyra-right">
//           <div className="lyra-form-box">

//             {/* Progress: seg1 = login/otp, seg2 = register, seg3 = otp done */}
//             <div className="lyra-progress">
//               <div className={`lyra-prog-seg ${step === 1 || step === 3 ? "done" : ""}`} />
//               <div className={`lyra-prog-seg ${step === 2 ? "done" : ""}`} />
//               <div className={`lyra-prog-seg ${step === 3 ? "done" : ""}`} />
//             </div>

//             {/* ════ STEP 1 — LOGIN ════ */}
//             {step === 1 && (
//               <div className="form-slide" key="login">
//                 <div className="lyra-eyebrow">Welcome back</div>
//                 <div className="lyra-form-title">Sign in to Lyra</div>
//                 <div className="lyra-form-sub">Discover your celestial wardrobe ✦</div>

//                 <div className="lyra-social">
//                   <button type="button" className="lyra-social-btn">
//                     <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
//                     Google
//                   </button>
//                   <button type="button" className="lyra-social-btn">
//                     <svg width="16" height="16" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
//                     Facebook
//                   </button>
//                 </div>

//                 <div className="lyra-divider">
//                   <div className="lyra-div-line" />
//                   <span className="lyra-div-text">or continue with mobile</span>
//                   <div className="lyra-div-line" />
//                 </div>

//                 <form onSubmit={handleLoginSubmit}>
//                   <InputField label="Mobile Number" type="tel" value={mobileNumber}
//                     onChange={handleMobileChange} placeholder="9999999999" prefix="+91" />
//                   <InputField label="Password" type="password" value={password}
//                     onChange={(e) => { setPassword(e.target.value); setError(""); }}
//                     placeholder="Enter your password" />
//                   <div className="lyra-forgot">
//                     <span className="lyra-link" onClick ={() => setStep(4)}>Forgot password?</span>
//                   </div>
//                   {error && (
//                     <div className={`lyra-alert ${isSuccess ? "success" : "error"}`}>
//                       {isSuccess ? "✦" : "!"} {error}
//                     </div>
//                   )}
//                   <button type="submit" className="lyra-submit" disabled={loading}>
//                     {loading ? <><span className="spin" /> Signing in…</> : "Sign In to Lyra →"}
//                   </button>
//                   <div className="lyra-switch">
//                     New to Lyra?
//                     <span className="lyra-switch-link" onClick={() => { setStep(2); setError(""); }}>
//                       Create account
//                     </span>
//                   </div>
//                 </form>
//               </div>
//             )}

//             {/* ════ STEP 4 — OTP ════ */}
//             {step === 4 && (
//               <div className="form-slide">
//                 <div className="lyra-form-title">Reset Password</div>

//                 <form onSubmit={handleForgotPassword}>
//                   <InputField
//                     label="Mobile Number"
//                     value={mobileNumber}
//                     onChange={handleMobileChange}
//                     placeholder="9999999999"
//                     prefix="+91"
//                   />

//                   <button className="lyra-submit">Send OTP</button>
//                 </form>
//               </div>
//             )}

//             {/* ════ STEP 5 — OTP ════ */}

//             {step === 5 && (
//               <div className="form-slide">
//                 <div className="lyra-form-title">Enter OTP</div>

//                 <form onSubmit={handleVerifyResetOtp}>
//                   <input
//                     type="text"
//                     className="lyra-otp"
//                     value={otp}
//                     maxLength="4"
//                     placeholder="· · · ·"
//                     onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
//                   />

//                   <button className="lyra-submit">Verify OTP</button>
//                 </form>
//               </div>
//             )}

//             {/* ════ STEP 6 — OTP ════ */}

//             {step === 6 && (
//               <div className="form-slide">
//                 <div className="lyra-form-title">Set New Password</div>

//                 <form onSubmit={handleResetPassword}>
//                   <InputField
//                     label="New Password"
//                     type="password"
//                     value={registerPassword}
//                     onChange={(e) => setRegisterPassword(e.target.value)}
//                   />

//                   <InputField
//                     label="Confirm Password"
//                     type="password"
//                     value={confirmPassword}
//                     onChange={(e) => setConfirmPassword(e.target.value)}
//                   />

//                   <button className="lyra-submit">Update Password</button>
//                 </form>
//               </div>
//             )}

//             {/* ════ STEP 3 — OTP ════ */}
//             {step === 3 && (
//               <div className="form-slide" key="otp">
//                 <div className="lyra-eyebrow">Verification</div>
//                 <div className="lyra-form-title">One last step</div>
//                 <div className="lyra-form-sub">
//                   We sent a 4-digit OTP to <strong style={{ color: "#7c3aed" }}>+91 {mobileNumber}</strong>
//                 </div>
//                 <form onSubmit={handleVerifyOtp}>
//                   <div style={{ marginBottom: "24px" }}>
//                     <label style={{
//                       display: "block", fontSize: "0.65rem", fontWeight: 600,
//                       letterSpacing: "0.15em", textTransform: "uppercase",
//                       color: "#94a3b8", marginBottom: "12px",
//                     }}>
//                       Enter OTP
//                     </label>
//                     <input
//                       type="text" className="lyra-otp" value={otp} maxLength="4"
//                       placeholder="· · · ·"
//                       onChange={(e) => { setOtp(e.target.value.replace(/\D/g, "")); setError(""); }}
//                     />
//                   </div>
//                   {error && (
//                     <div className={`lyra-alert ${isSuccess ? "success" : "error"}`}>
//                       {isSuccess ? "✦" : "!"} {error}
//                     </div>
//                   )}
//                   <button type="submit" className="lyra-submit" disabled={loading}>
//                     {loading ? <><span className="spin" /> Verifying…</> : "Verify & Enter Lyra →"}
//                   </button>
//                   <div className="lyra-switch">
//                     Didn't receive it?
//                     <span className="lyra-switch-link" onClick={handleResendOtp}>Resend OTP</span>
//                   </div>
//                   <div style={{ textAlign: "center", marginTop: "8px" }}>
//                     <span className="lyra-link" onClick={() => { setStep(1); setError(""); setOtp(""); }}>
//                       ← Back to login
//                     </span>
//                   </div>
//                 </form>
//               </div>
//             )}

//             {/* ════ STEP 2 — REGISTER ════ */}
//             {step === 2 && (
//               <div className="form-slide" key="register">
//                 <div className="lyra-eyebrow">Join the cosmos</div>
//                 <div className="lyra-form-title">Create your account</div>
//                 <div className="lyra-form-sub">Become part of the Lyra universe ✦</div>
//                 <form onSubmit={handleRegisterSubmit}>
//                   <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
//                     <InputField label="Full Name" value={fullName}
//                       onChange={(e) => { setFullName(e.target.value); setError(""); }}
//                       placeholder="Your Name" />
//                     <InputField label="Email" type="email" value={email}
//                       onChange={(e) => { setEmail(e.target.value); setError(""); }}
//                       placeholder="you@email.com" />
//                   </div>
//                   <InputField label="Mobile Number" type="tel" value={mobileNumber}
//                     onChange={handleMobileChange} placeholder="9999999999" prefix="+91" />
//                   <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
//                     <InputField label="Password" type="password" value={registerPassword}
//                       onChange={(e) => { setRegisterPassword(e.target.value); setError(""); }}
//                       placeholder="Min 6 chars" />
//                     <InputField label="Confirm" type="password" value={confirmPassword}
//                       onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }}
//                       placeholder="Repeat" />
//                   </div>
//                   {error && (
//                     <div className={`lyra-alert ${isSuccess ? "success" : "error"}`}>
//                       {isSuccess ? "✦" : "!"} {error}
//                     </div>
//                   )}
//                   <button type="submit" className="lyra-submit" disabled={loading}>
//                     {loading ? <><span className="spin" /> Creating account…</> : "Join Lyra →"}
//                   </button>
//                   <div className="lyra-switch">
//                     Already a member?
//                     <span className="lyra-switch-link" onClick={() => { setStep(1); setError(""); }}>
//                       Sign in
//                     </span>
//                   </div>
//                 </form>
//               </div>
//             )}

//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Login;


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ── Backend base URL ──────────────────────────────────────────────
const API_BASE = "http://localhost:6055/api/users";

// Logo — swap with your real logo import if needed
const logo = "https://placehold.co/80x80/ffffff/0f0a1e?text=✦";

// ── InputField defined OUTSIDE Login ─────────────────────────────
// CRITICAL: must be outside to avoid focus-loss on every keystroke
// (if defined inside Login, React re-creates the component on every render)
const InputField = ({ label, type = "text", value, onChange, placeholder, prefix }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: "18px" }}>
      <label style={{
        display: "block", fontSize: "0.65rem", fontWeight: 600,
        letterSpacing: "0.15em", textTransform: "uppercase",
        color: focused ? "#c084fc" : "#94a3b8",
        marginBottom: "7px", transition: "color 0.2s",
      }}>{label}</label>
      <div style={{ display: "flex", position: "relative" }}>
        {prefix && (
          <span style={{
            padding: "12px 14px", background: "#f9f5ff",
            border: "1.5px solid", borderColor: focused ? "#c084fc" : "#e9d5ff",
            borderRight: "none", borderRadius: "10px 0 0 10px",
            color: "#9333ea", fontSize: "0.85rem", fontWeight: 600,
            transition: "border-color 0.2s", userSelect: "none",
          }}>{prefix}</span>
        )}
        <input
          type={type} value={value} onChange={onChange} placeholder={placeholder}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{
            flex: 1, padding: "12px 16px",
            border: "1.5px solid", borderColor: focused ? "#c084fc" : "#e9d5ff",
            borderRadius: prefix ? "0 10px 10px 0" : "10px",
            fontSize: "0.9rem", color: "#1e1033",
            background: focused ? "#fdf8ff" : "#fefcff",
            outline: "none", transition: "all 0.25s",
            boxShadow: focused ? "0 0 0 4px rgba(192,132,252,0.12)" : "none",
            fontFamily: "'Plus Jakarta Sans', sans-serif", width: "100%",
          }}
        />
        {focused && (
          <span style={{
            position: "absolute", bottom: 0,
            left: prefix ? "53px" : 0, right: 0, height: "2px",
            background: "linear-gradient(90deg, #a855f7, #ec4899)",
            borderRadius: "0 0 10px 10px",
            animation: "lineGrow 0.3s ease-out forwards",
          }} />
        )}
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════
// LOGIN — fixes applied vs submitted version (document 10):
//   ✓ sessionStorage (not localStorage) — matches Dashboard/Profile/Cart
//   ✓ navigate("/") for unauthenticated redirect — matches App.jsx routing
//   ✓ No undefined variables (isReady, initialLoad, showContent all removed)
//   ✓ Single useEffect — no duplicate scroll/data-fetch hooks
//   ✓ Intro animation uses only mounted/logoPhase (no extra state)
//   ✓ All API paths match backend routes exactly
// ══════════════════════════════════════════════════════════════════
const Login = () => {
  const navigate = useNavigate();

  // ── Step: 1=login, 2=register, 3=verify-otp, 4=forgot, 5=reset-otp, 6=new-password
  const [step, setStep] = useState(1);

  // ── Shared fields
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp,          setOtp]          = useState("");
  const [userId,       setUserId]       = useState(null);

  // ── Login fields
  const [password, setPassword] = useState("");

  // ── Register fields
  const [fullName,          setFullName]          = useState("");
  const [email,             setEmail]             = useState("");
  const [registerPassword,  setRegisterPassword]  = useState("");
  const [confirmPassword,   setConfirmPassword]   = useState("");

  // ── UI state
  const [error,     setError]     = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading,   setLoading]   = useState(false);

  // ── Intro animation (purely cosmetic — no data-loading dependency)
  const [logoPhase, setLogoPhase] = useState("intro"); // "intro" → "shrink" → "done"
  const [mounted,   setMounted]   = useState(false);
  const [stars,     setStars]     = useState([]);

  useEffect(() => {
    // If already logged in, skip to dashboard immediately
    if (sessionStorage.getItem("user")) {
      navigate("/dashboard");
      return;
    }


    // Generate star field for background
    setStars(Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x:       Math.random() * 100,
      y:       Math.random() * 100,
      size:    Math.random() * 2 + 0.5,
      dur:     Math.random() * 4 + 2,
      delay:   Math.random() * 5,
      opacity: Math.random() * 0.6 + 0.2,
    })));

    // Intro animation timeline
    const t1 = setTimeout(() => setLogoPhase("shrink"), 2600);
    const t2 = setTimeout(() => { setLogoPhase("done"); setMounted(true); }, 3700);

    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [navigate]);

  // ── Helpers ──────────────────────────────────────────────────────
  const showMsg  = (msg, success = false) => { setError(msg); setIsSuccess(success); };
  const clearMsg = () => { setError(""); setIsSuccess(false); };

  const handleMobileChange = (e) => {
    setMobileNumber(e.target.value.replace(/\D/g, "").slice(0, 10));
    clearMsg();
  };

  const apiPost = async (path, body) => {
    const res  = await fetch(`${API_BASE}${path}`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(body),
    });
    const data = await res.json();
    return { ok: res.ok, data };
  };

  // ── STEP 1: Login ─────────────────────────────────────────────────
  // POST /api/users/login  { mobileNumber, password }
  // → { userId, message }  then go to OTP step
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (mobileNumber.length !== 10) return showMsg("Enter a valid 10-digit mobile number");
    if (!password || password.length < 6) return showMsg("Password must be at least 6 characters");

    setLoading(true);
    try {
      const { ok, data } = await apiPost("/login", { mobileNumber, password });
      if (!ok) return showMsg(data.error || data.message || "Invalid credentials. Please try again.");
      setUserId(data.userId);
      setStep(3);
      showMsg("OTP sent to your registered mobile number.", true);
    } catch {
      showMsg("Cannot reach server. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  // ── STEP 3: Verify OTP ────────────────────────────────────────────
  // POST /api/users/verify-otp  { userId, otp }
  // → { token, user: { _id, fullName, mobileNumber, email, profileImage } }
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 4) return showMsg("Enter a valid 4-digit OTP");

    setLoading(true);
    try {
      const { ok, data } = await apiPost("/verify-otp", { userId, otp });
      if (!ok) return showMsg(data.error || data.message || "OTP verification failed.");

      // Store session — same shape read by Dashboard, Cart, Profile, ProfilePage
      sessionStorage.setItem("user", JSON.stringify({
        userId:       data.user._id,
        fullName:     data.user.fullName,
        mobileNumber: data.user.mobileNumber,
        email:        data.user.email,
        token:        data.token,
        profileImage: data.user.profileImage || null,
      }));
      navigate("/dashboard");
    } catch {
      showMsg("Cannot reach server. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  // ── STEP 2: Register ──────────────────────────────────────────────
  // POST /api/users/register  { fullName, email, mobileNumber, password, confirmPassword }
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!fullName.trim())                    return showMsg("Full name is required");
    if (mobileNumber.length !== 10)          return showMsg("Enter a valid 10-digit mobile number");
    if (!email.includes("@"))                return showMsg("Enter a valid email address");
    if (registerPassword.length < 6)         return showMsg("Password must be at least 6 characters");
    if (registerPassword !== confirmPassword) return showMsg("Passwords do not match");

    setLoading(true);
    try {
      const { ok, data } = await apiPost("/register", { fullName, email, mobileNumber, password: registerPassword, confirmPassword });
      if (!ok) return showMsg(data.error || data.message || "Registration failed. Please try again.");
      // Reset all fields, return to login
      setFullName(""); setEmail(""); setRegisterPassword(""); setConfirmPassword("");
      setMobileNumber(""); setPassword(""); setStep(1);
      showMsg("Account created! Please sign in.", true);
    } catch {
      showMsg("Cannot reach server. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  // ── Resend OTP ────────────────────────────────────────────────────
  // POST /api/users/resend-otp  { userId }
  const handleResendOtp = async () => {
    if (!userId) return;
    try {
      const { ok, data } = await apiPost("/resend-otp", { userId });
      showMsg(ok ? "OTP resent successfully." : (data.message || "Failed to resend OTP."), ok);
    } catch {
      showMsg("Cannot reach server.");
    }
  };

  // ── STEP 4: Forgot password — request OTP ─────────────────────────
  // POST /api/users/forgot-password  { mobileNumber }
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (mobileNumber.length !== 10) return showMsg("Enter a valid 10-digit mobile number");
    setLoading(true);
    try {
      const { ok, data } = await apiPost("/forgot-password", { mobileNumber });
      if (!ok) return showMsg(data.message || "Failed to send OTP");
      setUserId(data.userId);
      setStep(5);
    } catch {
      showMsg("Cannot reach server.");
    } finally {
      setLoading(false);
    }
  };

  // ── STEP 5: Verify reset OTP ──────────────────────────────────────
  // POST /api/users/verify-reset-otp  { userId, otp }
  const handleVerifyResetOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { ok, data } = await apiPost("/verify-reset-otp", { userId, otp });
      if (!ok) return showMsg(data.message || "Invalid OTP");
      setStep(6);
    } catch {
      showMsg("Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── STEP 6: Reset password ────────────────────────────────────────
  // POST /api/users/reset-password  { userId, newPassword, confirmPassword }
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (registerPassword.length < 6) return showMsg("Password must be at least 6 characters");
    if (registerPassword !== confirmPassword) return showMsg("Passwords do not match");
    setLoading(true);
    try {
      const { ok, data } = await apiPost("/reset-password", { userId, newPassword: registerPassword, confirmPassword });
      if (!ok) return showMsg(data.message || "Failed to reset password");
      showMsg("Password updated! Please sign in.", true);
      setRegisterPassword(""); setConfirmPassword(""); setOtp("");
      setStep(1);
    } catch {
      showMsg("Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Progress indicator steps ──────────────────────────────────────
  const progressDone = { 1: [true, false, false], 2: [false, true, false], 3: [true, false, true], 4: [true, false, false], 5: [true, false, false], 6: [true, false, false] };
  const prog = progressDone[step] || [false, false, false];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Plus Jakarta Sans', sans-serif; overflow-x: hidden; }

        /* ── Intro overlay ── */
        .lyra-intro {
          position: fixed; inset: 0; z-index: 300;
          background: radial-gradient(ellipse at center, #1a0533 0%, #07020f 70%);
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          transition: opacity 1.2s ease, transform 1.2s ease;
        }
        .lyra-intro.out { opacity: 0; transform: scale(1.08); pointer-events: none; }
        .intro-star-field { position: absolute; inset: 0; overflow: hidden; }
        .intro-star {
          position: absolute; border-radius: 50%; background: white;
          animation: twinkle var(--d) var(--del) ease-in-out infinite;
        }
        @keyframes twinkle { 0%,100% { opacity: var(--op); transform: scale(1); } 50% { opacity: 0.1; transform: scale(0.5); } }
        .intro-logo-wrap { position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center; }
        .intro-ring {
          position: absolute; border-radius: 50%;
          border: 1px solid rgba(192,132,252,0.3); animation: ringPulse 2s ease-out infinite;
        }
        @keyframes ringPulse { 0% { transform: scale(0.8); opacity: 0.8; } 100% { transform: scale(2); opacity: 0; } }
        .intro-logo-img {
          width: 100px; height: 100px; border-radius: 50%; object-fit: cover;
          animation: logoIn 2.6s cubic-bezier(0.16,1,0.3,1) forwards;
          border: 2px solid rgba(255,255,255,0.15);
          box-shadow: 0 0 50px rgba(192,132,252,0.5), 0 0 100px rgba(236,72,153,0.2);
        }
        @keyframes logoIn {
          0%  { transform: scale(0); opacity: 0; filter: blur(30px); }
          55% { transform: scale(1.08); opacity: 1; filter: blur(0); }
          78% { transform: scale(0.96); }
          100%{ transform: scale(1); }
        }
        .intro-name {
          font-family: 'Cormorant Garamond', serif; font-size: 3.8rem; font-weight: 300;
          letter-spacing: 0.7em; text-transform: uppercase; margin-top: 20px;
          background: linear-gradient(135deg, #e9d5ff 0%, #f0abfc 40%, #fbcfe8 70%, #e9d5ff 100%);
          background-size: 200% 100%;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          animation: nameIn 1.2s 0.8s both, shimmerText 4s 2s linear infinite;
        }
        @keyframes nameIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shimmerText { 0% { background-position: 0% 0%; } 100% { background-position: 200% 0%; } }
        .intro-tagline { font-size: 0.6rem; letter-spacing: 0.55em; text-transform: uppercase; color: rgba(216,180,254,0.45); margin-top: 4px; animation: nameIn 1s 1.2s both; }
        .intro-line { width: 80px; height: 1px; margin: 16px auto 0; background: linear-gradient(90deg, transparent, rgba(192,132,252,0.5), transparent); animation: nameIn 1s 1.4s both; }

        /* ── Main page ── */
        .lyra-page { min-height: 100vh; display: flex; opacity: 0; transition: opacity 0.9s ease; }
        .lyra-page.show { opacity: 1; }

        /* ── Left panel ── */
        .lyra-left {
          width: 44%;
          background: linear-gradient(160deg, #0f0720 0%, #1a0533 30%, #200840 60%, #0a0118 100%);
          position: relative; overflow: hidden;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          padding: 60px 44px;
        }
        .star-bg { position: absolute; inset: 0; overflow: hidden; }
        .star { position: absolute; border-radius: 50%; background: #fff; animation: twinkle var(--d) var(--del) ease-in-out infinite; }
        .left-aurora {
          position: absolute; inset: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 70% 50% at 30% 25%, rgba(168,85,247,0.22) 0%, transparent 60%),
            radial-gradient(ellipse 55% 60% at 75% 75%, rgba(236,72,153,0.14) 0%, transparent 55%),
            radial-gradient(ellipse 40% 40% at 60% 10%, rgba(139,92,246,0.12) 0%, transparent 50%);
          animation: auroraPulse 10s ease-in-out infinite alternate;
        }
        @keyframes auroraPulse { from { opacity: 0.7; } to { opacity: 1.3; } }
        .grid-overlay {
          position: absolute; inset: 0; pointer-events: none; opacity: 0.04;
          background-image: linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px);
          background-size: 44px 44px;
        }
        .floating-orb {
          position: absolute; border-radius: 50%; filter: blur(70px); pointer-events: none;
          animation: orbFloat var(--d) var(--del) ease-in-out infinite alternate;
        }
        @keyframes orbFloat { from { transform: translate(0,0) scale(1); } to { transform: translate(var(--x), var(--y)) scale(1.1); } }
        .deco-circle { position: absolute; border-radius: 50%; border: 1px solid rgba(192,132,252,0.06); pointer-events: none; }
        .left-content { position: relative; z-index: 5; text-align: center; }
        .lyra-brand-logo {
          width: 76px; height: 76px; border-radius: 50%; object-fit: cover;
          border: 2px solid rgba(255,255,255,0.18);
          box-shadow: 0 0 30px rgba(168,85,247,0.45), 0 8px 40px rgba(0,0,0,0.4);
          margin-bottom: 20px; animation: brandPulse 5s ease-in-out infinite;
        }
        @keyframes brandPulse {
          0%,100% { box-shadow: 0 0 30px rgba(168,85,247,0.45), 0 8px 40px rgba(0,0,0,0.4); }
          50%      { box-shadow: 0 0 55px rgba(236,72,153,0.5),  0 8px 48px rgba(0,0,0,0.5); }
        }
        .lyra-brand-name {
          font-family: 'Cormorant Garamond', serif; font-size: 3.2rem; font-weight: 300;
          letter-spacing: 0.6em; text-transform: uppercase; line-height: 1;
          background: linear-gradient(135deg, #f3e8ff, #e879f9, #fbcfe8, #f3e8ff);
          background-size: 300% 100%;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          animation: shimmerText 6s linear infinite;
        }
        .lyra-brand-sub { font-size: 0.55rem; letter-spacing: 0.55em; text-transform: uppercase; color: rgba(216,180,254,0.4); margin-top: 6px; font-family: 'Plus Jakarta Sans', sans-serif; }
        .left-sep { display: flex; align-items: center; gap: 10px; margin: 24px 0; width: 100%; }
        .left-sep-line { flex: 1; height: 1px; background: rgba(192,132,252,0.15); }
        .left-sep-star { color: rgba(192,132,252,0.4); font-size: 0.7rem; }
        .lyra-features { list-style: none; text-align: left; width: 100%; }
        .lyra-feature {
          display: flex; align-items: flex-start; gap: 12px; margin-bottom: 16px;
          padding: 12px 14px; background: rgba(255,255,255,0.03);
          border: 1px solid rgba(192,132,252,0.08); border-radius: 10px;
          transition: background 0.3s, border-color 0.3s;
        }
        .lyra-feature:hover { background: rgba(192,132,252,0.07); border-color: rgba(192,132,252,0.2); }
        .lyra-feature-icon { font-size: 1rem; flex-shrink: 0; margin-top: 1px; }
        .lyra-feature-title { font-size: 0.75rem; font-weight: 500; color: rgba(243,232,255,0.85); margin-bottom: 2px; font-family: 'Plus Jakarta Sans', sans-serif; }
        .lyra-feature-desc  { font-size: 0.62rem; color: rgba(216,180,254,0.4); line-height: 1.4; font-family: 'Plus Jakarta Sans', sans-serif; }

        /* ── Right panel ── */
        .lyra-right {
          flex: 1; background: #fefcff;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          padding: 48px 56px; position: relative; overflow-y: auto;
        }
        .lyra-right::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(90deg, #7c3aed, #a855f7, #ec4899, #a855f7, #7c3aed);
          background-size: 300% 100%; animation: topBarFlow 5s linear infinite;
        }
        @keyframes topBarFlow { 0% { background-position: 0% 0%; } 100% { background-position: 300% 0%; } }
        .lyra-right::after {
          content: ''; position: absolute; inset: 0; pointer-events: none; z-index: 0;
          background-image:
            radial-gradient(circle at 90% 10%, rgba(168,85,247,0.04) 0%, transparent 40%),
            radial-gradient(circle at 10% 90%, rgba(236,72,153,0.03) 0%, transparent 40%);
        }
        .lyra-form-box { width: 100%; max-width: 390px; position: relative; z-index: 1; }

        /* Progress bar */
        .lyra-progress { display: flex; gap: 5px; margin-bottom: 32px; }
        .lyra-prog-seg {
          height: 3px; border-radius: 3px; flex: 1; background: #f3e8ff;
          transition: all 0.5s ease; position: relative; overflow: hidden;
        }
        .lyra-prog-seg.done { background: linear-gradient(90deg, #a855f7, #ec4899); }
        .lyra-prog-seg.done::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          animation: progShimmer 2s infinite;
        }
        @keyframes progShimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }

        .lyra-eyebrow {
          font-size: 0.6rem; font-weight: 700; letter-spacing: 0.25em; text-transform: uppercase;
          color: #a855f7; margin-bottom: 6px; display: flex; align-items: center; gap: 8px;
        }
        .lyra-eyebrow::before { content: '✦'; font-size: 0.55rem; color: #ec4899; }
        .lyra-form-title { font-family: 'Cormorant Garamond', serif; font-size: 2.2rem; font-weight: 400; color: #12002a; line-height: 1.15; margin-bottom: 6px; }
        .lyra-form-sub   { font-size: 0.78rem; color: #94a3b8; line-height: 1.6; margin-bottom: 28px; }

        .lyra-social { display: flex; gap: 10px; margin-bottom: 22px; }
        .lyra-social-btn {
          flex: 1; padding: 11px 14px; border: 1.5px solid #ede9fe; border-radius: 10px;
          background: white; cursor: pointer; font-size: 0.72rem; font-weight: 500; color: #3b0764;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: all 0.25s; font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .lyra-social-btn:hover { border-color: #c084fc; background: #fdf4ff; transform: translateY(-2px); box-shadow: 0 4px 14px rgba(168,85,247,0.12); }

        .lyra-divider { display: flex; align-items: center; gap: 12px; margin-bottom: 22px; }
        .lyra-div-line { flex: 1; height: 1px; background: #f3e8ff; }
        .lyra-div-text { font-size: 0.66rem; color: #d8b4fe; white-space: nowrap; font-style: italic; }

        .lyra-alert {
          padding: 12px 16px; border-radius: 10px; font-size: 0.73rem;
          margin-bottom: 18px; display: flex; align-items: center; gap: 10px;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .lyra-alert.success { background: linear-gradient(135deg, #fdf4ff, #fce7f3); border: 1px solid #e879f9; color: #86198f; }
        .lyra-alert.error   { background: #fef2f2; border: 1px solid #fca5a5; color: #dc2626; }

        .lyra-submit {
          width: 100%; padding: 14px; border: none; border-radius: 12px;
          background: linear-gradient(135deg, #7c3aed 0%, #a855f7 40%, #ec4899 100%);
          background-size: 200% 100%; background-position: 0% 0%;
          color: white; font-size: 0.88rem; font-weight: 600; letter-spacing: 0.06em;
          cursor: pointer; transition: all 0.35s ease;
          font-family: 'Plus Jakarta Sans', sans-serif;
          box-shadow: 0 4px 20px rgba(168,85,247,0.35);
          position: relative; overflow: hidden;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .lyra-submit:disabled { opacity: 0.7; cursor: not-allowed; transform: none !important; }
        .lyra-submit::after {
          content: ''; position: absolute; top: -50%; left: -60%; width: 40%; height: 200%;
          background: rgba(255,255,255,0.15); transform: skewX(-20deg); transition: left 0.5s ease;
        }
        .lyra-submit:not(:disabled):hover { background-position: 100% 0%; box-shadow: 0 6px 28px rgba(168,85,247,0.5); transform: translateY(-2px); }
        .lyra-submit:not(:disabled):hover::after { left: 120%; }
        .spin { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.35); border-top-color: white; border-radius: 50%; animation: spin 0.7s linear infinite; flex-shrink: 0; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .lyra-forgot { text-align: right; margin-top: -10px; margin-bottom: 20px; }
        .lyra-link { font-size: 0.72rem; color: #c084fc; cursor: pointer; transition: color 0.2s; }
        .lyra-link:hover { color: #a855f7; }
        .lyra-switch { text-align: center; margin-top: 22px; font-size: 0.78rem; color: #94a3b8; }
        .lyra-switch-link { color: #9333ea; font-weight: 600; cursor: pointer; margin-left: 5px; transition: color 0.2s; border-bottom: 1px solid transparent; }
        .lyra-switch-link:hover { color: #7c3aed; border-color: #c084fc; }

        .form-slide { animation: formSlide 0.45s cubic-bezier(0.22,1,0.36,1) both; }
        @keyframes formSlide { from { opacity: 0; transform: translateX(22px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes lineGrow  { from { transform: scaleX(0); transform-origin: left; } to { transform: scaleX(1); transform-origin: left; } }

        .lyra-otp {
          width: 100%; padding: 20px; border: 1.5px solid #ede9fe; border-radius: 12px;
          text-align: center; font-size: 2.4rem; letter-spacing: 0.8em;
          font-family: 'Cormorant Garamond', serif; color: #4c1d95;
          background: #fdf8ff; outline: none; transition: all 0.25s;
          margin-bottom: 24px;
        }
        .lyra-otp:focus { border-color: #c084fc; box-shadow: 0 0 0 4px rgba(192,132,252,0.12); background: #fdf4ff; }

        @media (max-width: 768px) { .lyra-left { display: none; } .lyra-right { padding: 40px 24px; } }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #fefcff; }
        ::-webkit-scrollbar-thumb { background: linear-gradient(#a855f7, #ec4899); border-radius: 4px; }
      `}</style>

      {/* ── INTRO SPLASH (cosmetic only, no data dependency) ── */}
      {logoPhase !== "done" && (
        <div className={`lyra-intro ${logoPhase === "shrink" ? "out" : ""}`}>
          <div className="intro-star-field">
            {stars.slice(0, 40).map((s) => (
              <div key={s.id} className="intro-star" style={{
                left: `${s.x}%`, top: `${s.y}%`,
                width: `${s.size}px`, height: `${s.size}px`,
                "--d": `${s.dur}s`, "--del": `${s.delay}s`, "--op": s.opacity,
              }} />
            ))}
          </div>
          <div className="intro-logo-wrap">
            <div className="intro-ring" style={{ width: "120px", height: "120px" }} />
            <div className="intro-ring" style={{ width: "120px", height: "120px", animationDelay: "0.5s" }} />
            <img src={logo} alt="Lyra" className="intro-logo-img" />
          </div>
          <div className="intro-name">Lyra</div>
          <div className="intro-tagline">Celestial Fashion</div>
          <div className="intro-line" />
        </div>
      )}

      {/* ── MAIN PAGE ── */}
      <div className={`lyra-page ${mounted ? "show" : ""}`}>

        {/* LEFT DECORATIVE PANEL */}
        <div className="lyra-left">
          <div className="star-bg">
            {stars.map((s) => (
              <div key={s.id} className="star" style={{
                left: `${s.x}%`, top: `${s.y}%`,
                width: `${s.size}px`, height: `${s.size}px`,
                "--d": `${s.dur}s`, "--del": `${s.delay}s`, "--op": s.opacity,
              }} />
            ))}
          </div>
          <div className="left-aurora" />
          <div className="grid-overlay" />
          <div className="floating-orb" style={{ width:"280px", height:"280px", background:"rgba(139,92,246,0.25)", top:"-100px", left:"-80px", "--d":"14s","--del":"0s","--x":"40px","--y":"60px" }} />
          <div className="floating-orb" style={{ width:"200px", height:"200px", background:"rgba(236,72,153,0.18)", bottom:"-60px", right:"-40px", "--d":"11s","--del":"1.5s","--x":"-35px","--y":"-45px" }} />
          <div className="deco-circle" style={{ width:"600px", height:"600px", top:"-200px", left:"-200px" }} />
          <div className="deco-circle" style={{ width:"350px", height:"350px", bottom:"-100px", right:"-100px" }} />
          <div className="left-content">
            <img src={logo} alt="Lyra" className="lyra-brand-logo" />
            <div className="lyra-brand-name">Lyra</div>
            <div className="lyra-brand-sub">Celestial Fashion</div>
            <div className="left-sep">
              <div className="left-sep-line" /><span className="left-sep-star">✦</span><div className="left-sep-line" />
            </div>
            <ul className="lyra-features">
              {[
                { icon: "✦", title: "Exclusive Collections", desc: "Curated celestial-inspired designs"         },
                { icon: "🚀", title: "Express Delivery",     desc: "Free shipping on orders above ₹999"        },
                { icon: "↩", title: "Easy Returns",          desc: "Hassle-free 30-day return policy"          },
                { icon: "🔒", title: "Secure & Private",     desc: "End-to-end encrypted transactions"         },
              ].map((f) => (
                <li key={f.title} className="lyra-feature">
                  <span className="lyra-feature-icon">{f.icon}</span>
                  <div>
                    <div className="lyra-feature-title">{f.title}</div>
                    <div className="lyra-feature-desc">{f.desc}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* RIGHT FORM PANEL */}
        <div className="lyra-right">
          <div className="lyra-form-box">

            {/* Progress segments */}
            <div className="lyra-progress">
              {prog.map((done, i) => (
                <div key={i} className={`lyra-prog-seg ${done ? "done" : ""}`} />
              ))}
            </div>

            {/* ════ STEP 1 — LOGIN ════ */}
            {step === 1 && (
              <div className="form-slide" key="login">
                <div className="lyra-eyebrow">Welcome back</div>
                <div className="lyra-form-title">Sign in to Lyra</div>
                <div className="lyra-form-sub">Discover your celestial wardrobe ✦</div>
                <div className="lyra-social">
                  <button type="button" className="lyra-social-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                    Google
                  </button>
                  <button type="button" className="lyra-social-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    Facebook
                  </button>
                </div>
                <div className="lyra-divider">
                  <div className="lyra-div-line" />
                  <span className="lyra-div-text">or continue with mobile</span>
                  <div className="lyra-div-line" />
                </div>
                <form onSubmit={handleLoginSubmit}>
                  <InputField label="Mobile Number" type="tel" value={mobileNumber}
                    onChange={handleMobileChange} placeholder="9999999999" prefix="+91" />
                  <InputField label="Password" type="password" value={password}
                    onChange={(e) => { setPassword(e.target.value); clearMsg(); }}
                    placeholder="Enter your password" />
                  <div className="lyra-forgot">
                    <span className="lyra-link" onClick={() => { setStep(4); clearMsg(); }}>Forgot password?</span>
                  </div>
                  {error && <div className={`lyra-alert ${isSuccess ? "success" : "error"}`}>{isSuccess ? "✦" : "!"} {error}</div>}
                  <button type="submit" className="lyra-submit" disabled={loading}>
                    {loading ? <><span className="spin" /> Signing in…</> : "Sign In to Lyra →"}
                  </button>
                  <div className="lyra-switch">
                    New to Lyra?
                    <span className="lyra-switch-link" onClick={() => { setStep(2); clearMsg(); }}>Create account</span>
                  </div>
                </form>
              </div>
            )}

            {/* ════ STEP 2 — REGISTER ════ */}
            {step === 2 && (
              <div className="form-slide" key="register">
                <div className="lyra-eyebrow">Join the cosmos</div>
                <div className="lyra-form-title">Create your account</div>
                <div className="lyra-form-sub">Become part of the Lyra universe ✦</div>
                <form onSubmit={handleRegisterSubmit}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <InputField label="Full Name" value={fullName}
                      onChange={(e) => { setFullName(e.target.value); clearMsg(); }} placeholder="Your Name" />
                    <InputField label="Email" type="email" value={email}
                      onChange={(e) => { setEmail(e.target.value); clearMsg(); }} placeholder="you@email.com" />
                  </div>
                  <InputField label="Mobile Number" type="tel" value={mobileNumber}
                    onChange={handleMobileChange} placeholder="9999999999" prefix="+91" />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <InputField label="Password" type="password" value={registerPassword}
                      onChange={(e) => { setRegisterPassword(e.target.value); clearMsg(); }} placeholder="Min 6 chars" />
                    <InputField label="Confirm" type="password" value={confirmPassword}
                      onChange={(e) => { setConfirmPassword(e.target.value); clearMsg(); }} placeholder="Repeat" />
                  </div>
                  {error && <div className={`lyra-alert ${isSuccess ? "success" : "error"}`}>{isSuccess ? "✦" : "!"} {error}</div>}
                  <button type="submit" className="lyra-submit" disabled={loading}>
                    {loading ? <><span className="spin" /> Creating account…</> : "Join Lyra →"}
                  </button>
                  <div className="lyra-switch">
                    Already a member?
                    <span className="lyra-switch-link" onClick={() => { setStep(1); clearMsg(); }}>Sign in</span>
                  </div>
                </form>
              </div>
            )}

            {/* ════ STEP 3 — VERIFY LOGIN OTP ════ */}
            {step === 3 && (
              <div className="form-slide" key="otp">
                <div className="lyra-eyebrow">Verification</div>
                <div className="lyra-form-title">One last step</div>
                <div className="lyra-form-sub">
                  We sent a 4-digit OTP to <strong style={{ color: "#7c3aed" }}>+91 {mobileNumber}</strong>
                </div>
                <form onSubmit={handleVerifyOtp}>
                  <label style={{ display: "block", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "#94a3b8", marginBottom: "12px" }}>
                    Enter OTP
                  </label>
                  <input type="text" className="lyra-otp" value={otp} maxLength="4"
                    placeholder="· · · ·"
                    onChange={(e) => { setOtp(e.target.value.replace(/\D/g, "")); clearMsg(); }} />
                  {error && <div className={`lyra-alert ${isSuccess ? "success" : "error"}`}>{isSuccess ? "✦" : "!"} {error}</div>}
                  <button type="submit" className="lyra-submit" disabled={loading}>
                    {loading ? <><span className="spin" /> Verifying…</> : "Verify & Enter Lyra →"}
                  </button>
                  <div className="lyra-switch">
                    Didn't receive it?
                    <span className="lyra-switch-link" onClick={handleResendOtp}>Resend OTP</span>
                  </div>
                  <div style={{ textAlign: "center", marginTop: "8px" }}>
                    <span className="lyra-link" onClick={() => { setStep(1); clearMsg(); setOtp(""); }}>← Back to login</span>
                  </div>
                </form>
              </div>
            )}

            {/* ════ STEP 4 — FORGOT PASSWORD: enter mobile ════ */}
            {step === 4 && (
              <div className="form-slide" key="forgot">
                <div className="lyra-eyebrow">Reset password</div>
                <div className="lyra-form-title">Forgot Password</div>
                <div className="lyra-form-sub">Enter your mobile number to receive an OTP ✦</div>
                <form onSubmit={handleForgotPassword}>
                  <InputField label="Mobile Number" value={mobileNumber}
                    onChange={handleMobileChange} placeholder="9999999999" prefix="+91" />
                  {error && <div className={`lyra-alert ${isSuccess ? "success" : "error"}`}>{isSuccess ? "✦" : "!"} {error}</div>}
                  <button type="submit" className="lyra-submit" disabled={loading}>
                    {loading ? <><span className="spin" /> Sending…</> : "Send OTP →"}
                  </button>
                  <div className="lyra-switch">
                    <span className="lyra-link" onClick={() => { setStep(1); clearMsg(); }}>← Back to login</span>
                  </div>
                </form>
              </div>
            )}

            {/* ════ STEP 5 — VERIFY RESET OTP ════ */}
            {step === 5 && (
              <div className="form-slide" key="reset-otp">
                <div className="lyra-eyebrow">Verification</div>
                <div className="lyra-form-title">Enter OTP</div>
                <div className="lyra-form-sub">
                  We sent an OTP to <strong style={{ color: "#7c3aed" }}>+91 {mobileNumber}</strong>
                </div>
                <form onSubmit={handleVerifyResetOtp}>
                  <input type="text" className="lyra-otp" value={otp} maxLength="4"
                    placeholder="· · · ·"
                    onChange={(e) => { setOtp(e.target.value.replace(/\D/g, "")); clearMsg(); }} />
                  {error && <div className={`lyra-alert ${isSuccess ? "success" : "error"}`}>{isSuccess ? "✦" : "!"} {error}</div>}
                  <button type="submit" className="lyra-submit" disabled={loading}>
                    {loading ? <><span className="spin" /> Verifying…</> : "Verify OTP →"}
                  </button>
                </form>
              </div>
            )}

            {/* ════ STEP 6 — SET NEW PASSWORD ════ */}
            {step === 6 && (
              <div className="form-slide" key="new-pass">
                <div className="lyra-eyebrow">Almost done</div>
                <div className="lyra-form-title">Set New Password</div>
                <div className="lyra-form-sub">Choose a strong password for your account ✦</div>
                <form onSubmit={handleResetPassword}>
                  <InputField label="New Password" type="password" value={registerPassword}
                    onChange={(e) => { setRegisterPassword(e.target.value); clearMsg(); }}
                    placeholder="Min 6 characters" />
                  <InputField label="Confirm Password" type="password" value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); clearMsg(); }}
                    placeholder="Repeat password" />
                  {error && <div className={`lyra-alert ${isSuccess ? "success" : "error"}`}>{isSuccess ? "✦" : "!"} {error}</div>}
                  <button type="submit" className="lyra-submit" disabled={loading}>
                    {loading ? <><span className="spin" /> Updating…</> : "Update Password →"}
                  </button>
                </form>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
};

export default Login;