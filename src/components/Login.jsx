import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ── Change this to your deployed backend URL in production ──
const API_BASE = "http://localhost:6055/api/users";

// Replace with your actual logo:
// import logo from '../assets/lyra-logo.jpeg';
const logo = "https://placehold.co/80x80/ffffff/0f0a1e?text=✦";

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

/* ══════════════════════════════════════════
   LYRA LOGIN — Backend Connected
══════════════════════════════════════════ */
const Login = () => {
  const [mobileNumber, setMobileNumber]         = useState("");
  const [password, setPassword]                 = useState("");
  const [otp, setOtp]                           = useState("");
  const [userId, setUserId]                     = useState(null); // returned from /login
  const [error, setError]                       = useState("");
  const [isSuccess, setIsSuccess]               = useState(false);
  const [loading, setLoading]                   = useState(false);
  const [step, setStep]                         = useState(1); 

  // Register fields
  const [fullName, setFullName]                 = useState("");
  const [email, setEmail]                       = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword]   = useState("");


  // UI / animation state
  const [mounted, setMounted]     = useState(false);
  const [logoPhase, setLogoPhase] = useState("intro");
  const [stars, setStars]         = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) navigate("/dashboard");

    const s = Array.from({ length: 60 }, (_, i) => ({
      id: i, x: Math.random() * 100, y: Math.random() * 100,
      size: Math.random() * 2 + 0.5, dur: Math.random() * 4 + 2,
      delay: Math.random() * 5, opacity: Math.random() * 0.6 + 0.2,
    }));
    setStars(s);

    setTimeout(() => setLogoPhase("shrink"), 2600);
    setTimeout(() => { setLogoPhase("done"); setMounted(true); }, 3700);
  }, [navigate]);

  const handleMobileChange = (e) => {
    setMobileNumber(e.target.value.replace(/\D/g, ""));
    setError("");
  };

  const showMsg = (msg, success = false) => {
    setError(msg);
    setIsSuccess(success);
  };

  // ═══════════════════════════════════════════════
  // STEP 1 — Login
  // POST /api/users/login
  // Body:    { mobileNumber, password }
  // Success: { userId, message }   → go to OTP step
  // ═══════════════════════════════════════════════
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (mobileNumber.length !== 10) return showMsg("Enter a valid 10-digit mobile number");
    if (!password || password.length < 6) return showMsg("Password must be at least 6 characters");

    setLoading(true);
    try {
      const res  = await fetch(`${API_BASE}/login`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ mobileNumber, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        return showMsg(data.error || data.message || "Invalid credentials. Please try again.");
      }

      setUserId(data.userId);   // store for OTP verification
      setStep(3);
      showMsg("OTP sent to your registered mobile number.", true);
    } catch {
      showMsg("Cannot reach server. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  // ═══════════════════════════════════════════════
  // STEP 3 — Verify OTP
  // POST /api/users/verify-otp
  // Body:    { userId, otp }
  // Success: { token, user: { _id, fullName, mobileNumber, email, profileImage } }
  // ═══════════════════════════════════════════════
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 4) return showMsg("Enter a valid 4-digit OTP");

    setLoading(true);
    try {
      const res  = await fetch(`${API_BASE}/verify-otp`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ userId, otp }),
      });
      const data = await res.json();

      if (!res.ok) {
        return showMsg(data.error || data.message || "OTP verification failed. Try again.");
      }

      // Persist full session used across Dashboard, Cart, Profile etc.
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


  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    // Client-side guards before hitting the API
    if (!fullName.trim())                    return showMsg("Full name is required");
    if (mobileNumber.length !== 10)          return showMsg("Enter a valid 10-digit mobile number");
    if (!email.includes("@"))                return showMsg("Enter a valid email address");
    if (registerPassword.length < 6)         return showMsg("Password must be at least 6 characters");
    if (registerPassword !== confirmPassword) return showMsg("Passwords do not match");

    setLoading(true);
    try {
      const res  = await fetch(`${API_BASE}/register`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          fullName,
          email,
          mobileNumber,
          password:        registerPassword,
          confirmPassword,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        return showMsg(data.error || data.message || "Registration failed. Please try again.");
      }

      // Clear all register fields and return to login
      setFullName(""); setEmail("");
      setRegisterPassword(""); setConfirmPassword("");
      setMobileNumber(""); setPassword("");
      setStep(1);
      showMsg("Account created! Please sign in.", true);
    } catch {
      showMsg("Cannot reach server. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  // ═══════════════════════════════════════════════
  // Resend OTP (optional endpoint)
  // POST /api/users/resend-otp  →  { userId }
  // ═══════════════════════════════════════════════
  const handleResendOtp = async () => {
    if (!userId) return;
    try {
      const res  = await fetch(`${API_BASE}/resend-otp`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ userId }),
      });
      const data = await res.json();
      showMsg(
        res.ok ? "OTP resent successfully." : (data.message || "Failed to resend OTP."),
        res.ok
      );
    } catch {
      showMsg("Cannot reach server.");
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (mobileNumber.length !== 10) {
        return showMsg("Enter valid mobile number");
      }

      setLoading(true);

  try{
    const res = await fetch(`${API_BASE}/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobileNumber }),
    });

    const data = await res.json();

    if (!res.ok) return showMsg(data.message  || "Failed to send OTP");

     console.log("STEP → 5"); 

    setUserId(data.userId);
    setStep(5);
  } catch (err) {
    console.log("ERROR:", err);
    showMsg("Cannot reach server");
  } finally {
    setLoading(false);
  }
};


  const handleVerifyResetOtp = async (e) => {
    e.preventDefault();

  try{
    const res = await fetch(`${API_BASE}/verify-reset-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, otp }),
    });

    const data = await res.json();

    if (!res.ok) return showMsg(data.message);

    setStep(6);
  }catch{
    showMsg("Server error. Try again.");
  }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (registerPassword.length < 6) {
      return showMsg("Password must be at least 6 characters");
    }

    const res = await fetch(`${API_BASE}/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        newPassword: registerPassword,
        confirmPassword,
      }),
    });

    const data = await res.json();

    if (!res.ok) return showMsg(data.message);

    showMsg("Password updated successfully", true);
    setStep(1);
  };


  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Plus Jakarta Sans', sans-serif; overflow-x: hidden; }

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
        @keyframes twinkle {
          0%,100% { opacity: var(--op); transform: scale(1); }
          50%      { opacity: 0.1; transform: scale(0.5); }
        }
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
        .intro-tagline {
          font-size: 0.6rem; letter-spacing: 0.55em; text-transform: uppercase;
          color: rgba(216,180,254,0.45); margin-top: 4px; animation: nameIn 1s 1.2s both;
        }
        .intro-line {
          width: 80px; height: 1px; margin: 16px auto 0;
          background: linear-gradient(90deg, transparent, rgba(192,132,252,0.5), transparent);
          animation: nameIn 1s 1.4s both;
        }

        .lyra-page { min-height: 100vh; display: flex; opacity: 0; transition: opacity 0.9s ease; }
        .lyra-page.show { opacity: 1; }

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
          50%      { box-shadow: 0 0 55px rgba(236,72,153,0.5), 0 8px 48px rgba(0,0,0,0.5); }
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
        .lyra-feature-desc { font-size: 0.62rem; color: rgba(216,180,254,0.4); line-height: 1.4; font-family: 'Plus Jakarta Sans', sans-serif; }

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
          background-image: radial-gradient(circle at 90% 10%, rgba(168,85,247,0.04) 0%, transparent 40%),
                            radial-gradient(circle at 10% 90%, rgba(236,72,153,0.03) 0%, transparent 40%);
        }

        .lyra-form-box { width: 100%; max-width: 390px; position: relative; z-index: 1; }

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
          font-size: 0.6rem; font-weight: 700; letter-spacing: 0.25em;
          text-transform: uppercase; color: #a855f7; margin-bottom: 6px;
          display: flex; align-items: center; gap: 8px;
        }
        .lyra-eyebrow::before { content: '✦'; font-size: 0.55rem; color: #ec4899; }
        .lyra-form-title { font-family: 'Cormorant Garamond', serif; font-size: 2.2rem; font-weight: 400; color: #12002a; line-height: 1.15; margin-bottom: 6px; }
        .lyra-form-sub { font-size: 0.78rem; color: #94a3b8; line-height: 1.6; margin-bottom: 28px; }

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
        .lyra-submit:active:not(:disabled) { transform: translateY(0); }

        .spin {
          width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.35);
          border-top-color: white; border-radius: 50%;
          animation: spin 0.7s linear infinite; flex-shrink: 0;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .lyra-forgot { text-align: right; margin-top: -10px; margin-bottom: 20px; }
        .lyra-link { font-size: 0.72rem; color: #c084fc; cursor: pointer; transition: color 0.2s; text-decoration: none; }
        .lyra-link:hover { color: #a855f7; }

        .lyra-switch { text-align: center; margin-top: 22px; font-size: 0.78rem; color: #94a3b8; }
        .lyra-switch-link { color: #9333ea; font-weight: 600; cursor: pointer; margin-left: 5px; transition: color 0.2s; border-bottom: 1px solid transparent; }
        .lyra-switch-link:hover { color: #7c3aed; border-color: #c084fc; }

        .form-slide { animation: formSlide 0.45s cubic-bezier(0.22,1,0.36,1) both; }
        @keyframes formSlide { from { opacity: 0; transform: translateX(22px); } to { opacity: 1; transform: translateX(0); } }

        @keyframes lineGrow { from { transform: scaleX(0); transform-origin: left; } to { transform: scaleX(1); transform-origin: left; } }

        .lyra-otp {
          width: 100%; padding: 20px; border: 1.5px solid #ede9fe; border-radius: 12px;
          text-align: center; font-size: 2.4rem; letter-spacing: 0.8em;
          font-family: 'Cormorant Garamond', serif; color: #4c1d95;
          background: #fdf8ff; outline: none; transition: all 0.25s;
        }
        .lyra-otp:focus { border-color: #c084fc; box-shadow: 0 0 0 4px rgba(192,132,252,0.12); background: #fdf4ff; }

        @media (max-width: 768px) { .lyra-left { display: none; } .lyra-right { padding: 40px 24px; } }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #fefcff; }
        ::-webkit-scrollbar-thumb { background: linear-gradient(#a855f7, #ec4899); border-radius: 4px; }
      `}</style>

      {/* ── INTRO ── */}
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

        {/* LEFT PANEL */}
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
              <div className="left-sep-line" />
              <span className="left-sep-star">✦</span>
              <div className="left-sep-line" />
            </div>
            <ul className="lyra-features">
              {[
                { icon: "✦", title: "Exclusive Collections", desc: "Curated celestial-inspired designs" },
                { icon: "🚀", title: "Express Delivery",     desc: "Free shipping on orders above ₹999" },
                { icon: "↩", title: "Easy Returns",          desc: "Hassle-free 30-day return policy" },
                { icon: "🔒", title: "Secure & Private",     desc: "End-to-end encrypted transactions" },
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

        {/* RIGHT PANEL */}
        <div className="lyra-right">
          <div className="lyra-form-box">

            {/* Progress: seg1 = login/otp, seg2 = register, seg3 = otp done */}
            <div className="lyra-progress">
              <div className={`lyra-prog-seg ${step === 1 || step === 3 ? "done" : ""}`} />
              <div className={`lyra-prog-seg ${step === 2 ? "done" : ""}`} />
              <div className={`lyra-prog-seg ${step === 3 ? "done" : ""}`} />
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
                    onChange={(e) => { setPassword(e.target.value); setError(""); }}
                    placeholder="Enter your password" />
                  <div className="lyra-forgot">
                    <span className="lyra-link" onClick ={() => setStep(4)}>Forgot password?</span>
                  </div>
                  {error && (
                    <div className={`lyra-alert ${isSuccess ? "success" : "error"}`}>
                      {isSuccess ? "✦" : "!"} {error}
                    </div>
                  )}
                  <button type="submit" className="lyra-submit" disabled={loading}>
                    {loading ? <><span className="spin" /> Signing in…</> : "Sign In to Lyra →"}
                  </button>
                  <div className="lyra-switch">
                    New to Lyra?
                    <span className="lyra-switch-link" onClick={() => { setStep(2); setError(""); }}>
                      Create account
                    </span>
                  </div>
                </form>
              </div>
            )}

            {/* ════ STEP 4 — OTP ════ */}
            {step === 4 && (
              <div className="form-slide">
                <div className="lyra-form-title">Reset Password</div>

                <form onSubmit={handleForgotPassword}>
                  <InputField
                    label="Mobile Number"
                    value={mobileNumber}
                    onChange={handleMobileChange}
                    placeholder="9999999999"
                    prefix="+91"
                  />

                  <button className="lyra-submit">Send OTP</button>
                </form>
              </div>
            )}

            {/* ════ STEP 5 — OTP ════ */}

            {step === 5 && (
              <div className="form-slide">
                <div className="lyra-form-title">Enter OTP</div>

                <form onSubmit={handleVerifyResetOtp}>
                  <input
                    type="text"
                    className="lyra-otp"
                    value={otp}
                    maxLength="4"
                    placeholder="· · · ·"
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  />

                  <button className="lyra-submit">Verify OTP</button>
                </form>
              </div>
            )}

            {/* ════ STEP 6 — OTP ════ */}

            {step === 6 && (
              <div className="form-slide">
                <div className="lyra-form-title">Set New Password</div>

                <form onSubmit={handleResetPassword}>
                  <InputField
                    label="New Password"
                    type="password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                  />

                  <InputField
                    label="Confirm Password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />

                  <button className="lyra-submit">Update Password</button>
                </form>
              </div>
            )}

            {/* ════ STEP 3 — OTP ════ */}
            {step === 3 && (
              <div className="form-slide" key="otp">
                <div className="lyra-eyebrow">Verification</div>
                <div className="lyra-form-title">One last step</div>
                <div className="lyra-form-sub">
                  We sent a 4-digit OTP to <strong style={{ color: "#7c3aed" }}>+91 {mobileNumber}</strong>
                </div>
                <form onSubmit={handleVerifyOtp}>
                  <div style={{ marginBottom: "24px" }}>
                    <label style={{
                      display: "block", fontSize: "0.65rem", fontWeight: 600,
                      letterSpacing: "0.15em", textTransform: "uppercase",
                      color: "#94a3b8", marginBottom: "12px",
                    }}>
                      Enter OTP
                    </label>
                    <input
                      type="text" className="lyra-otp" value={otp} maxLength="4"
                      placeholder="· · · ·"
                      onChange={(e) => { setOtp(e.target.value.replace(/\D/g, "")); setError(""); }}
                    />
                  </div>
                  {error && (
                    <div className={`lyra-alert ${isSuccess ? "success" : "error"}`}>
                      {isSuccess ? "✦" : "!"} {error}
                    </div>
                  )}
                  <button type="submit" className="lyra-submit" disabled={loading}>
                    {loading ? <><span className="spin" /> Verifying…</> : "Verify & Enter Lyra →"}
                  </button>
                  <div className="lyra-switch">
                    Didn't receive it?
                    <span className="lyra-switch-link" onClick={handleResendOtp}>Resend OTP</span>
                  </div>
                  <div style={{ textAlign: "center", marginTop: "8px" }}>
                    <span className="lyra-link" onClick={() => { setStep(1); setError(""); setOtp(""); }}>
                      ← Back to login
                    </span>
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
                      onChange={(e) => { setFullName(e.target.value); setError(""); }}
                      placeholder="Your Name" />
                    <InputField label="Email" type="email" value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(""); }}
                      placeholder="you@email.com" />
                  </div>
                  <InputField label="Mobile Number" type="tel" value={mobileNumber}
                    onChange={handleMobileChange} placeholder="9999999999" prefix="+91" />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <InputField label="Password" type="password" value={registerPassword}
                      onChange={(e) => { setRegisterPassword(e.target.value); setError(""); }}
                      placeholder="Min 6 chars" />
                    <InputField label="Confirm" type="password" value={confirmPassword}
                      onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }}
                      placeholder="Repeat" />
                  </div>
                  {error && (
                    <div className={`lyra-alert ${isSuccess ? "success" : "error"}`}>
                      {isSuccess ? "✦" : "!"} {error}
                    </div>
                  )}
                  <button type="submit" className="lyra-submit" disabled={loading}>
                    {loading ? <><span className="spin" /> Creating account…</> : "Join Lyra →"}
                  </button>
                  <div className="lyra-switch">
                    Already a member?
                    <span className="lyra-switch-link" onClick={() => { setStep(1); setError(""); }}>
                      Sign in
                    </span>
                  </div>
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



// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// // Replace with your actual logo:
// // import logo from './asset/luna-logo.jpeg';
// const logo = "https://placehold.co/80x80/ffffff/1a0533?text=L";

// /* ══════════════════════════════════════════
//    InputField OUTSIDE Login — fixes re-render
//    focus loss bug
// ══════════════════════════════════════════ */
// const InputField = ({ label, type = "text", value, onChange, placeholder, prefix }) => {
//   const [focused, setFocused] = useState(false);

//   return (
//     <div style={{ marginBottom: "18px" }}>
//       <label style={{
//         display: "block", fontSize: "0.68rem", fontWeight: 600,
//         letterSpacing: "0.12em", textTransform: "uppercase",
//         color: focused ? "#8b5cf6" : "#94a3b8",
//         marginBottom: "7px", transition: "color 0.2s",
//       }}>{label}</label>

//       <div style={{ display: "flex", position: "relative" }}>
//         {prefix && (
//           <span style={{
//             padding: "12px 14px",
//             background: "#f8f5ff",
//             border: "1.5px solid",
//             borderColor: focused ? "#8b5cf6" : "#e2d9f3",
//             borderRight: "none",
//             borderRadius: "10px 0 0 10px",
//             color: "#7c3aed", fontSize: "0.85rem", fontWeight: 500,
//             transition: "border-color 0.2s",
//             userSelect: "none",
//           }}>{prefix}</span>
//         )}

//         <input
//           type={type}
//           value={value}
//           onChange={onChange}
//           placeholder={placeholder}
//           onFocus={() => setFocused(true)}
//           onBlur={() => setFocused(false)}
//           style={{
//             flex: 1,
//             padding: "12px 16px",
//             border: "1.5px solid",
//             borderColor: focused ? "#8b5cf6" : "#e2d9f3",
//             borderRadius: prefix ? "0 10px 10px 0" : "10px",
//             fontSize: "0.9rem",
//             color: "#1e1033",
//             background: focused ? "#faf7ff" : "#fcfaff",
//             outline: "none",
//             transition: "all 0.2s",
//             boxShadow: focused ? "0 0 0 3px rgba(139,92,246,0.1)" : "none",
//             fontFamily: "'Plus Jakarta Sans', sans-serif",
//             width: "100%",
//           }}
//         />

//         {/* Animated bottom line on focus */}
//         {focused && (
//           <span style={{
//             position: "absolute", bottom: 0,
//             left: prefix ? "52px" : 0, right: 0,
//             height: "2px",
//             background: "linear-gradient(90deg, #8b5cf6, #d946ef)",
//             borderRadius: "0 0 10px 10px",
//             animation: "lineGrow 0.3s ease-out",
//           }} />
//         )}
//       </div>
//     </div>
//   );
// };

// /* ══════════════════════════════════════════
//    LOGIN COMPONENT
// ══════════════════════════════════════════ */
// const Login = () => {
//   const [mobileNumber, setMobileNumber] = useState("");
//   const [password, setPassword] = useState("");
//   const [otp, setOtp] = useState("");
//   const [error, setError] = useState("");
//   const [step, setStep] = useState(1);
//   const [fullName, setFullName] = useState("");
//   const [email, setEmail] = useState("");
//   const [registerPassword, setRegisterPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [isSuccess, setIsSuccess] = useState(false);
//   const [mounted, setMounted] = useState(false);
//   const [logoPhase, setLogoPhase] = useState("intro");

//   const navigate = useNavigate();

//   useEffect(() => {
//     const storedUser = sessionStorage.getItem("user");
//     if (storedUser) navigate("/dashboard");
//     setTimeout(() => setLogoPhase("shrink"), 2400);
//     setTimeout(() => { setLogoPhase("done"); setMounted(true); }, 3500);
//   }, [navigate]);

//   const handleMobileChange = (e) => {
//     setMobileNumber(e.target.value.replace(/\D/g, ""));
//     setError("");
//   };

//   const handleLoginSubmit = (e) => {
//     e.preventDefault();
//     if (mobileNumber.length !== 10) return setError("Enter a valid 10-digit mobile number");
//     if (!password || password.length < 6) return setError("Password must be at least 6 characters");
//     setStep(3); setError("OTP sent! Use any 4 digits to continue."); setIsSuccess(true);
//   };

//   const handleVerifyOtp = (e) => {
//     e.preventDefault();
//     if (!otp || otp.length !== 4) return setError("Enter valid 4-digit OTP");
//     sessionStorage.setItem("user", JSON.stringify({
//       userId: "mock-001", fullName: fullName || "Luna User",
//       mobileNumber, email: email || "user@luna.com", token: "mock-token",
//     }));
//     navigate("/dashboard");
//   };

//   const handleRegisterSubmit = (e) => {
//     e.preventDefault();
//     if (!fullName.trim()) return setError("Full name is required");
//     if (mobileNumber.length !== 10) return setError("Enter a valid mobile number");
//     if (!email.includes("@")) return setError("Enter a valid email");
//     if (registerPassword.length < 6) return setError("Password must be at least 6 characters");
//     if (registerPassword !== confirmPassword) return setError("Passwords do not match");
//     setStep(1); setError("Account created! Please sign in."); setIsSuccess(true);
//     setFullName(""); setEmail(""); setRegisterPassword(""); setConfirmPassword("");
//   };

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');

//         * { box-sizing: border-box; margin: 0; padding: 0; }
//         body { font-family: 'Plus Jakarta Sans', sans-serif; }

//         .intro-overlay {
//           position: fixed; inset: 0; z-index: 200;
//           background: linear-gradient(135deg, #1a0533 0%, #0f0020 100%);
//           display: flex; flex-direction: column; align-items: center; justify-content: center;
//           transition: opacity 1s ease, transform 1s ease;
//         }
//         .intro-overlay.out { opacity: 0; transform: scale(1.05); pointer-events: none; }

//         .intro-logo {
//           width: 110px; height: 110px; border-radius: 50%; object-fit: cover;
//           animation: logoBurst 2.4s cubic-bezier(0.16,1,0.3,1) forwards;
//           border: 2px solid rgba(255,255,255,0.2);
//           box-shadow: 0 0 60px rgba(139,92,246,0.5), 0 0 120px rgba(217,70,239,0.2);
//         }
//         @keyframes logoBurst {
//           0%   { transform: scale(0); opacity: 0; filter: blur(30px); }
//           50%  { transform: scale(1.1); opacity: 1; filter: blur(0); }
//           75%  { transform: scale(0.95); }
//           100% { transform: scale(1); }
//         }
//         .intro-brand {
//           font-family: 'Playfair Display', serif;
//           font-size: 3.2rem; font-weight: 400;
//           background: linear-gradient(135deg, #e9d5ff, #f0abfc, #e9d5ff);
//           -webkit-background-clip: text; -webkit-text-fill-color: transparent;
//           letter-spacing: 0.5em; text-transform: uppercase;
//           animation: fadeRise 1s 0.8s both; margin-top: 20px;
//         }
//         .intro-sub {
//           font-size: 0.62rem; letter-spacing: 0.5em;
//           color: rgba(216,180,254,0.5); text-transform: uppercase;
//           animation: fadeRise 1s 1.2s both; margin-top: 6px;
//         }
//         @keyframes fadeRise {
//           from { opacity: 0; transform: translateY(16px); }
//           to   { opacity: 1; transform: translateY(0); }
//         }

//         .page-wrap {
//           min-height: 100vh; display: flex; align-items: stretch;
//           opacity: 0; transition: opacity 0.8s ease;
//         }
//         .page-wrap.show { opacity: 1; }

//         .left-panel {
//           width: 45%;
//           background: linear-gradient(155deg, #1a0533 0%, #2d0a5e 35%, #1a0040 65%, #0d001a 100%);
//           position: relative; overflow: hidden;
//           display: flex; flex-direction: column;
//           align-items: center; justify-content: center;
//           padding: 60px 50px;
//         }
//         .mesh {
//           position: absolute; inset: 0; pointer-events: none;
//           background:
//             radial-gradient(ellipse 60% 50% at 20% 30%, rgba(139,92,246,0.2) 0%, transparent 60%),
//             radial-gradient(ellipse 50% 60% at 80% 70%, rgba(217,70,239,0.15) 0%, transparent 55%);
//           animation: meshPulse 8s ease-in-out infinite alternate;
//         }
//         @keyframes meshPulse {
//           from { opacity: 0.8; } to { opacity: 1.2; }
//         }
//         .grid-lines {
//           position: absolute; inset: 0; pointer-events: none; opacity: 0.05;
//           background-image:
//             linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
//             linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px);
//           background-size: 48px 48px;
//         }
//         .orb {
//           position: absolute; border-radius: 50%;
//           filter: blur(60px); pointer-events: none; opacity: 0.35;
//           animation: orbDrift var(--d) var(--delay) ease-in-out infinite alternate;
//         }
//         @keyframes orbDrift {
//           from { transform: translate(0,0); }
//           to   { transform: translate(var(--x), var(--y)); }
//         }
//         .deco-ring {
//           position: absolute; border-radius: 50%;
//           border: 1px solid rgba(167,139,250,0.07); pointer-events: none;
//         }
//         .brand-logo {
//           width: 80px; height: 80px; border-radius: 50%; object-fit: cover;
//           border: 2px solid rgba(255,255,255,0.25);
//           box-shadow: 0 0 30px rgba(139,92,246,0.4), 0 8px 32px rgba(0,0,0,0.3);
//           margin-bottom: 24px; position: relative; z-index: 2;
//           animation: logoPulse 4s ease-in-out infinite;
//         }
//         @keyframes logoPulse {
//           0%,100% { box-shadow: 0 0 30px rgba(139,92,246,0.4), 0 8px 32px rgba(0,0,0,0.3); }
//           50%      { box-shadow: 0 0 50px rgba(217,70,239,0.5), 0 8px 40px rgba(0,0,0,0.4); }
//         }
//         .left-content { position: relative; z-index: 2; text-align: center; }
//         .brand-name {
//           font-family: 'Playfair Display', serif;
//           font-size: 3rem; font-weight: 400; letter-spacing: 0.45em;
//           background: linear-gradient(135deg, #f3e8ff, #e879f9, #ddd6fe);
//           -webkit-background-clip: text; -webkit-text-fill-color: transparent;
//           text-transform: uppercase; line-height: 1;
//         }
//         .brand-tagline {
//           font-size: 0.6rem; letter-spacing: 0.5em;
//           color: rgba(216,180,254,0.5); text-transform: uppercase; margin-top: 6px;
//         }
//         .left-divider {
//           width: 60px; height: 1px;
//           background: linear-gradient(90deg, transparent, rgba(216,180,254,0.4), transparent);
//           margin: 28px auto;
//         }
//         .feature-list { list-style: none; text-align: left; }
//         .feature-item {
//           display: flex; align-items: center; gap: 12px;
//           margin-bottom: 14px; color: rgba(216,180,254,0.7);
//           font-size: 0.8rem; letter-spacing: 0.03em;
//         }
//         .feature-dot {
//           width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0;
//           background: linear-gradient(135deg, #a78bfa, #e879f9);
//           box-shadow: 0 0 8px rgba(167,139,250,0.6);
//         }

//         .right-panel {
//           flex: 1; background: #fdfbff;
//           display: flex; flex-direction: column;
//           align-items: center; justify-content: center;
//           padding: 48px 56px; position: relative; overflow-y: auto;
//         }
//         .right-panel::before {
//           content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
//           background: linear-gradient(90deg, #7c3aed, #d946ef, #7c3aed);
//           background-size: 200% 100%;
//           animation: gradientShift 4s linear infinite;
//         }
//         @keyframes gradientShift {
//           0%   { background-position: 0% 0%; }
//           100% { background-position: 200% 0%; }
//         }

//         .form-box { width: 100%; max-width: 380px; }
//         .form-eyebrow {
//           font-size: 0.62rem; letter-spacing: 0.25em; text-transform: uppercase;
//           color: #a78bfa; font-weight: 600; margin-bottom: 8px;
//         }
//         .form-title {
//           font-family: 'Playfair Display', serif;
//           font-size: 2.1rem; font-weight: 500; color: #1e1033; line-height: 1.2;
//         }
//         .form-subtitle {
//           font-size: 0.8rem; color: #94a3b8; margin-top: 6px;
//           line-height: 1.5; margin-bottom: 28px;
//         }

//         .social-row { display: flex; gap: 10px; margin-bottom: 20px; }
//         .social-btn {
//           flex: 1; padding: 10px; border: 1.5px solid #e2d9f3;
//           border-radius: 10px; background: white; cursor: pointer;
//           font-size: 0.72rem; font-weight: 500; color: #4a3566;
//           display: flex; align-items: center; justify-content: center; gap: 8px;
//           transition: all 0.2s; font-family: 'Plus Jakarta Sans', sans-serif;
//         }
//         .social-btn:hover { border-color: #a78bfa; background: #faf7ff; transform: translateY(-1px); }

//         .divider-row {
//           display: flex; align-items: center; gap: 12px; margin-bottom: 20px;
//         }
//         .divider-line { flex: 1; height: 1px; background: #f0e8ff; }
//         .divider-text { font-size: 0.68rem; color: #c4b5fd; white-space: nowrap; }

//         .submit-btn {
//           width: 100%; padding: 14px; border: none; border-radius: 12px;
//           background: linear-gradient(135deg, #7c3aed, #a855f7, #d946ef);
//           background-size: 200% 100%; background-position: 0% 0%;
//           color: white; font-size: 0.88rem; font-weight: 600;
//           letter-spacing: 0.05em; cursor: pointer;
//           transition: all 0.3s ease; font-family: 'Plus Jakarta Sans', sans-serif;
//           box-shadow: 0 4px 20px rgba(124,58,237,0.35);
//         }
//         .submit-btn:hover {
//           background-position: 100% 0%;
//           box-shadow: 0 6px 28px rgba(124,58,237,0.5);
//           transform: translateY(-1px);
//         }
//         .submit-btn:active { transform: translateY(0); }

//         .form-enter { animation: slideIn 0.4s cubic-bezier(0.22,1,0.36,1) both; }
//         @keyframes slideIn {
//           from { opacity: 0; transform: translateX(20px); }
//           to   { opacity: 1; transform: translateX(0); }
//         }

//         @keyframes lineGrow {
//           from { transform: scaleX(0); transform-origin: left; }
//           to   { transform: scaleX(1); transform-origin: left; }
//         }

//         .alert {
//           padding: 10px 14px; border-radius: 10px;
//           font-size: 0.72rem; margin-bottom: 16px;
//           display: flex; align-items: center; gap: 8px;
//         }
//         .alert-success { background: #f5f0ff; border: 1px solid #c4b5fd; color: #6d28d9; }
//         .alert-error   { background: #fef2f2; border: 1px solid #fca5a5; color: #dc2626; }

//         .step-tabs { display: flex; gap: 6px; margin-bottom: 28px; }
//         .step-tab {
//           flex: 1; height: 3px; border-radius: 3px;
//           background: #f0e8ff; transition: background 0.4s;
//         }
//         .step-tab.active {
//           background: linear-gradient(90deg, #7c3aed, #d946ef);
//         }

//         @media (max-width: 768px) {
//           .left-panel { display: none; }
//           .right-panel { padding: 40px 28px; }
//         }
//         ::-webkit-scrollbar { width: 4px; }
//         ::-webkit-scrollbar-track { background: #fdfbff; }
//         ::-webkit-scrollbar-thumb { background: #c4b5fd; border-radius: 4px; }
//       `}</style>

//       {/* ── INTRO ── */}
//       {logoPhase !== "done" && (
//         <div className={`intro-overlay ${logoPhase === "shrink" ? "out" : ""}`}>
//           <img src={logo} alt="Luna" className="intro-logo" />
//           <div className="intro-brand">Luna</div>
//           <div className="intro-sub">Premium Collection</div>
//         </div>
//       )}

//       {/* ── MAIN PAGE ── */}
//       <div className={`page-wrap ${mounted ? "show" : ""}`}>

//         {/* LEFT PANEL */}
//         <div className="left-panel">
//           <div className="mesh" />
//           <div className="grid-lines" />
//           <div className="orb" style={{ width:"260px", height:"260px", background:"rgba(124,58,237,0.3)", top:"-80px", left:"-60px", "--d":"12s","--delay":"0s","--x":"30px","--y":"50px" }} />
//           <div className="orb" style={{ width:"200px", height:"200px", background:"rgba(217,70,239,0.2)", bottom:"-50px", right:"-30px", "--d":"10s","--delay":"1s","--x":"-40px","--y":"-30px" }} />
//           <div className="deco-ring" style={{ width:"500px", height:"500px", top:"-150px", left:"-150px" }} />
//           <div className="deco-ring" style={{ width:"300px", height:"300px", bottom:"-80px", right:"-80px" }} />

//           <div className="left-content">
//             <img src={logo} alt="Luna" className="brand-logo" />
//             <div className="brand-name">Luna</div>
//             <div className="brand-tagline">Premium Collection</div>
//             <div className="left-divider" />
//             <ul className="feature-list">
//               {["Exclusive designer collections","Free shipping on ₹999+ orders","Easy 30-day returns","Secure payments & privacy"].map((f) => (
//                 <li key={f} className="feature-item">
//                   <span className="feature-dot" />
//                   {f}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>

//         {/* RIGHT PANEL */}
//         <div className="right-panel">
//           <div className="form-box">

//             <div className="step-tabs">
//               <div className={`step-tab ${step === 1 || step === 3 ? "active" : ""}`} />
//               <div className={`step-tab ${step === 2 ? "active" : ""}`} />
//               <div className={`step-tab ${step === 3 ? "active" : ""}`} />
//             </div>

//             {/* ── LOGIN ── */}
//             {step === 1 && (
//               <div className="form-enter" key="login">
//                 <div className="form-eyebrow">Welcome back</div>
//                 <div className="form-title">Sign in to Luna</div>
//                 <div className="form-subtitle">Access your exclusive collection & orders</div>

//                 <div className="social-row">
//                   <button type="button" className="social-btn">
//                     <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
//                     Google
//                   </button>
//                   <button type="button" className="social-btn">
//                     <svg width="16" height="16" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
//                     Facebook
//                   </button>
//                 </div>

//                 <div className="divider-row">
//                   <div className="divider-line" />
//                   <span className="divider-text">or sign in with mobile</span>
//                   <div className="divider-line" />
//                 </div>

//                 <form onSubmit={handleLoginSubmit}>
//                   <InputField label="Mobile Number" type="tel" value={mobileNumber}
//                     onChange={handleMobileChange} placeholder="9999999999" prefix="+91" />
//                   <InputField label="Password" type="password" value={password}
//                     onChange={(e) => { setPassword(e.target.value); setError(""); }}
//                     placeholder="Enter your password" />

//                   <div style={{ textAlign:"right", marginTop:"-10px", marginBottom:"20px" }}>
//                     <span style={{ fontSize:"0.72rem", color:"#a78bfa", cursor:"pointer" }}>Forgot password?</span>
//                   </div>

//                   {error && (
//                     <div className={`alert ${isSuccess ? "alert-success" : "alert-error"}`}>
//                       {isSuccess ? "✓" : "!"} {error}
//                     </div>
//                   )}
//                   <button type="submit" className="submit-btn">Sign In →</button>
//                   <div style={{ textAlign:"center", marginTop:"20px", fontSize:"0.78rem", color:"#94a3b8" }}>
//                     New to Luna?{" "}
//                     <span style={{ color:"#7c3aed", fontWeight:600, cursor:"pointer" }}
//                       onClick={() => { setStep(2); setError(""); }}>Create account</span>
//                   </div>
//                   <div style={{ textAlign:"center", marginTop:"10px", fontSize:"0.58rem", color:"#d8b4fe", letterSpacing:"0.1em", textTransform:"uppercase" }}>
//                     Demo — any 10-digit number & 6+ char password
//                   </div>
//                 </form>
//               </div>
//             )}

//             {/* ── OTP ── */}
//             {step === 3 && (
//               <div className="form-enter" key="otp">
//                 <div className="form-eyebrow">Verification</div>
//                 <div className="form-title">Check your phone</div>
//                 <div className="form-subtitle">We sent a 4-digit code to +91 {mobileNumber}</div>

//                 <form onSubmit={handleVerifyOtp}>
//                   <div style={{ marginBottom:"24px" }}>
//                     <label style={{ display:"block", fontSize:"0.68rem", fontWeight:600, letterSpacing:"0.12em", textTransform:"uppercase", color:"#94a3b8", marginBottom:"12px" }}>
//                       OTP Code
//                     </label>
//                     <input type="text" value={otp} maxLength="4"
//                       onChange={(e) => { setOtp(e.target.value); setError(""); }}
//                       placeholder="· · · ·"
//                       style={{
//                         width:"100%", padding:"18px", border:"1.5px solid #e2d9f3",
//                         borderRadius:"12px", textAlign:"center",
//                         fontSize:"2.2rem", letterSpacing:"0.8em",
//                         fontFamily:"'Playfair Display', serif",
//                         color:"#4c1d95", background:"#faf7ff", outline:"none",
//                       }}
//                       onFocus={(e) => { e.target.style.borderColor="#8b5cf6"; e.target.style.boxShadow="0 0 0 3px rgba(139,92,246,0.1)"; }}
//                       onBlur={(e) => { e.target.style.borderColor="#e2d9f3"; e.target.style.boxShadow="none"; }}
//                     />
//                   </div>
//                   {error && (
//                     <div className={`alert ${isSuccess ? "alert-success" : "alert-error"}`}>
//                       {isSuccess ? "✓" : "!"} {error}
//                     </div>
//                   )}
//                   <button type="submit" className="submit-btn">Verify & Continue →</button>
//                   <div style={{ textAlign:"center", marginTop:"16px", fontSize:"0.75rem", color:"#94a3b8" }}>
//                     Didn't get it?{" "}
//                     <span style={{ color:"#7c3aed", fontWeight:600, cursor:"pointer" }}>Resend OTP</span>
//                   </div>
//                   <div style={{ textAlign:"center", marginTop:"8px" }}>
//                     <span style={{ fontSize:"0.72rem", color:"#a78bfa", cursor:"pointer" }}
//                       onClick={() => { setStep(1); setError(""); }}>← Back to login</span>
//                   </div>
//                   <div style={{ textAlign:"center", marginTop:"10px", fontSize:"0.58rem", color:"#d8b4fe", letterSpacing:"0.1em", textTransform:"uppercase" }}>
//                     Demo — use any 4 digits
//                   </div>
//                 </form>
//               </div>
//             )}

//             {/* ── REGISTER ── */}
//             {step === 2 && (
//               <div className="form-enter" key="register">
//                 <div className="form-eyebrow">Get started</div>
//                 <div className="form-title">Create your account</div>
//                 <div className="form-subtitle">Join Luna and discover premium fashion</div>

//                 <form onSubmit={handleRegisterSubmit}>
//                   <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px" }}>
//                     <InputField label="Full Name" value={fullName}
//                       onChange={(e) => { setFullName(e.target.value); setError(""); }}
//                       placeholder="Your Name" />
//                     <InputField label="Email" type="email" value={email}
//                       onChange={(e) => { setEmail(e.target.value); setError(""); }}
//                       placeholder="you@email.com" />
//                   </div>

//                   <InputField label="Mobile Number" type="tel" value={mobileNumber}
//                     onChange={handleMobileChange} placeholder="9999999999" prefix="+91" />

//                   <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px" }}>
//                     <InputField label="Password" type="password" value={registerPassword}
//                       onChange={(e) => { setRegisterPassword(e.target.value); setError(""); }}
//                       placeholder="Min 6 chars" />
//                     <InputField label="Confirm" type="password" value={confirmPassword}
//                       onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }}
//                       placeholder="Repeat" />
//                   </div>

//                   {error && (
//                     <div className={`alert ${isSuccess ? "alert-success" : "alert-error"}`}>
//                       {isSuccess ? "✓" : "!"} {error}
//                     </div>
//                   )}
//                   <button type="submit" className="submit-btn">Create Account →</button>
//                   <div style={{ textAlign:"center", marginTop:"20px", fontSize:"0.78rem", color:"#94a3b8" }}>
//                     Already a member?{" "}
//                     <span style={{ color:"#7c3aed", fontWeight:600, cursor:"pointer" }}
//                       onClick={() => { setStep(1); setError(""); }}>Sign in</span>
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




// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// // Replace with your actual logo:
// // import logo from './asset/luna-logo.jpeg';
// const logo = "https://placehold.co/120x120/f5f0ff/7c3aed?text=L";

// const Login = () => {
//   const [mobileNumber, setMobileNumber] = useState("");
//   const [password, setPassword] = useState("");
//   const [otp, setOtp] = useState("");
//   const [error, setError] = useState("");
//   const [step, setStep] = useState(1);
//   const [fullName, setFullName] = useState("");
//   const [email, setEmail] = useState("");
//   const [registerPassword, setRegisterPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [isSuccess, setIsSuccess] = useState(false);
//   const [mounted, setMounted] = useState(false);
//   const [logoPhase, setLogoPhase] = useState("intro");
//   const [particles, setParticles] = useState([]);

//   const navigate = useNavigate();

//   useEffect(() => {
//     const storedUser = sessionStorage.getItem("user");
//     if (storedUser) navigate("/dashboard");

//     const pts = Array.from({ length: 16 }, (_, i) => ({
//       id: i,
//       x: Math.random() * 100,
//       y: Math.random() * 100,
//       size: Math.random() * 5 + 2,
//       dur: Math.random() * 10 + 8,
//       delay: Math.random() * 6,
//     }));
//     setParticles(pts);

//     setTimeout(() => setLogoPhase("shrink"), 2200);
//     setTimeout(() => { setLogoPhase("done"); setMounted(true); }, 3400);
//   }, [navigate]);

//   const handleMobileChange = (e) => {
//     setMobileNumber(e.target.value.replace(/\D/g, ""));
//     setError("");
//   };

//   const handleLoginSubmit = (e) => {
//     e.preventDefault();
//     if (mobileNumber.length !== 10) return setError("Enter a valid 10-digit mobile number");
//     if (!password || password.length < 6) return setError("Password must be at least 6 characters");
//     setStep(3);
//     setError("OTP sent! Use any 4 digits to continue.");
//     setIsSuccess(true);
//   };

//   const handleVerifyOtp = (e) => {
//     e.preventDefault();
//     if (!otp || otp.length !== 4) return setError("Enter valid 4-digit OTP");
//     sessionStorage.setItem("user", JSON.stringify({
//       userId: "mock-001",
//       fullName: fullName || "Luna User",
//       mobileNumber,
//       email: email || "user@luna.com",
//       token: "mock-token",
//     }));
//     navigate("/dashboard");
//   };

//   const handleRegisterSubmit = (e) => {
//     e.preventDefault();
//     if (!fullName.trim()) return setError("Full name is required");
//     if (mobileNumber.length !== 10) return setError("Enter a valid mobile number");
//     if (!email.includes("@")) return setError("Enter a valid email");
//     if (registerPassword.length < 6) return setError("Password must be at least 6 characters");
//     if (registerPassword !== confirmPassword) return setError("Passwords do not match");
//     setStep(1);
//     setError("Registration successful! Please login.");
//     setIsSuccess(true);
//     setFullName(""); setEmail(""); setRegisterPassword(""); setConfirmPassword("");
//   };

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

//         .font-cormorant { font-family: 'Cormorant Garamond', serif; }
//         .font-dm { font-family: 'DM Sans', sans-serif; }

//         /* ── Page background ── */
//         .cream-bg {
//           background: #faf7f2;
//           background-image:
//             radial-gradient(ellipse 70% 60% at 15% 10%, rgba(167,139,250,0.12) 0%, transparent 55%),
//             radial-gradient(ellipse 50% 50% at 85% 90%, rgba(196,181,253,0.15) 0%, transparent 50%),
//             radial-gradient(ellipse 40% 40% at 50% 50%, rgba(245,240,255,0.6) 0%, transparent 70%);
//         }

//         /* ── Floating petal particles ── */
//         .petal {
//           position: fixed;
//           border-radius: 50% 0 50% 0;
//           opacity: 0;
//           pointer-events: none;
//           z-index: 0;
//           background: linear-gradient(135deg, rgba(167,139,250,0.35), rgba(196,181,253,0.2));
//           animation: petalFloat var(--dur) var(--delay) infinite ease-in-out;
//         }
//         @keyframes petalFloat {
//           0%   { opacity: 0; transform: translateY(0) rotate(0deg) scale(0.8); }
//           15%  { opacity: 0.6; }
//           85%  { opacity: 0.2; }
//           100% { opacity: 0; transform: translateY(-120px) rotate(180deg) scale(0.4); }
//         }

//         /* ── Intro overlay ── */
//         .intro-fade { transition: opacity 1s ease; }
//         .intro-fade.hiding { opacity: 0; pointer-events: none; }

//         .intro-logo-anim { animation: introBurst 2.2s ease-out forwards; }
//         @keyframes introBurst {
//           0%   { transform: scale(0.15); opacity: 0; filter: blur(20px); }
//           45%  { transform: scale(1.06); opacity: 1; filter: blur(0); }
//           72%  { transform: scale(0.97); }
//           100% { transform: scale(1); opacity: 1; }
//         }

//         .fade-up-1 { animation: creamFadeUp 1.1s 0.5s ease-out both; }
//         .fade-up-2 { animation: creamFadeUp 1.1s 0.9s ease-out both; }
//         @keyframes creamFadeUp {
//           from { opacity: 0; transform: translateY(20px); }
//           to   { opacity: 1; transform: translateY(0); }
//         }

//         /* ── Card entrance ── */
//         .card-enter {
//           opacity: 0;
//           transform: translateY(28px);
//           transition: opacity 1s ease, transform 1s cubic-bezier(0.22, 1, 0.36, 1);
//         }
//         .card-enter.visible { opacity: 1; transform: translateY(0); }

//         /* ── Split layout card ── */
//         .luxury-card {
//           background: #ffffff;
//           border-radius: 24px;
//           box-shadow:
//             0 2px 4px rgba(124,58,237,0.04),
//             0 8px 24px rgba(124,58,237,0.08),
//             0 32px 64px rgba(100,50,200,0.06),
//             0 0 0 1px rgba(167,139,250,0.12);
//         }

//         /* ── Left decorative panel ── */
//         .panel-left {
//           background: linear-gradient(160deg, #7c3aed 0%, #6d28d9 40%, #4c1d95 100%);
//           border-radius: 20px 0 0 20px;
//           position: relative;
//           overflow: hidden;
//         }
//         .panel-left::before {
//           content: '';
//           position: absolute; inset: 0;
//           background:
//             radial-gradient(ellipse 80% 60% at 30% 20%, rgba(255,255,255,0.1) 0%, transparent 50%),
//             radial-gradient(ellipse 60% 80% at 70% 80%, rgba(196,181,253,0.15) 0%, transparent 50%);
//         }
//         .panel-pattern {
//           position: absolute; inset: 0;
//           background-image: repeating-linear-gradient(
//             45deg,
//             transparent,
//             transparent 30px,
//             rgba(255,255,255,0.02) 30px,
//             rgba(255,255,255,0.02) 31px
//           );
//         }

//         /* ── Decorative circle in panel ── */
//         .deco-circle {
//           border: 1px solid rgba(255,255,255,0.15);
//           border-radius: 50%;
//           position: absolute;
//         }

//         /* ── Form section ── */
//         .form-section { background: #ffffff; border-radius: 0 20px 20px 0; }

//         /* ── Input ── */
//         .luna-input {
//           background: #faf8ff !important;
//           border: 1.5px solid #e9e0ff !important;
//           color: #1e1b4b !important;
//           border-radius: 10px !important;
//           transition: all 0.25s ease;
//           font-family: 'DM Sans', sans-serif;
//         }
//         .luna-input::placeholder { color: #c4b5fd !important; }
//         .luna-input:focus {
//           outline: none !important;
//           border-color: #7c3aed !important;
//           background: #f5f0ff !important;
//           box-shadow: 0 0 0 4px rgba(124,58,237,0.08) !important;
//         }

//         /* ── Phone prefix ── */
//         .phone-prefix {
//           background: #f5f0ff;
//           border: 1.5px solid #e9e0ff;
//           border-right: none;
//           color: #7c3aed;
//           border-radius: 10px 0 0 10px;
//           font-family: 'DM Sans', sans-serif;
//           font-size: 0.875rem;
//           padding: 12px 14px;
//         }
//         .phone-input { border-radius: 0 10px 10px 0 !important; }

//         /* ── Button ── */
//         .luna-btn {
//           background: linear-gradient(135deg, #7c3aed, #6d28d9);
//           color: #ffffff;
//           border: none;
//           border-radius: 10px;
//           font-family: 'DM Sans', sans-serif;
//           font-weight: 500;
//           letter-spacing: 0.05em;
//           cursor: pointer;
//           transition: all 0.3s ease;
//           box-shadow: 0 4px 14px rgba(124,58,237,0.3);
//           position: relative;
//           overflow: hidden;
//         }
//         .luna-btn::after {
//           content: '';
//           position: absolute; inset: 0;
//           background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
//           opacity: 0; transition: opacity 0.3s;
//         }
//         .luna-btn:hover {
//           transform: translateY(-1px);
//           box-shadow: 0 6px 20px rgba(124,58,237,0.4);
//         }
//         .luna-btn:hover::after { opacity: 1; }
//         .luna-btn:active { transform: translateY(0); }

//         /* ── Form entrance ── */
//         .form-enter { animation: formSlide 0.45s cubic-bezier(0.22,1,0.36,1) both; }
//         @keyframes formSlide {
//           from { opacity: 0; transform: translateX(16px); }
//           to   { opacity: 1; transform: translateX(0); }
//         }

//         /* ── Scrollbar ── */
//         ::-webkit-scrollbar { width: 4px; }
//         ::-webkit-scrollbar-track { background: #faf7f2; }
//         ::-webkit-scrollbar-thumb { background: #c4b5fd; border-radius: 2px; }

//         /* ── Step progress bar ── */
//         .progress-bar {
//           height: 2px;
//           background: linear-gradient(90deg, #7c3aed, #a78bfa);
//           border-radius: 2px;
//           transition: width 0.5s ease;
//         }

//         /* ── Responsive ── */
//         @media (max-width: 640px) {
//           .panel-left { display: none; }
//           .form-section { border-radius: 20px !important; }
//           .luxury-card { border-radius: 20px; }
//         }
//       `}</style>

//       {/* ── ROOT ── */}
//       <div className="cream-bg font-dm min-h-screen flex items-center justify-center p-4 relative overflow-hidden">

//         {/* Petal particles */}
//         {particles.map((p) => (
//           <div key={p.id} className="petal" style={{
//             left: `${p.x}%`, top: `${p.y}%`,
//             width: `${p.size * 2}px`, height: `${p.size * 2}px`,
//             "--dur": `${p.dur}s`, "--delay": `${p.delay}s`,
//           }} />
//         ))}

//         {/* ── INTRO OVERLAY ── */}
//         {logoPhase !== "done" && (
//           <div className={`intro-fade fixed inset-0 flex flex-col items-center justify-center z-[100] bg-[#faf7f2] ${logoPhase === "shrink" ? "hiding" : ""}`}>
//             <div className="relative">
//               <div className="absolute inset-0 rounded-full blur-2xl scale-150"
//                 style={{ background: "radial-gradient(circle, rgba(167,139,250,0.4), transparent)" }} />
//               <img src={logo} alt="Luna"
//                 className="intro-logo-anim relative w-28 h-28 rounded-full object-cover"
//                 style={{ boxShadow: "0 0 0 3px rgba(124,58,237,0.2), 0 8px 32px rgba(124,58,237,0.25)" }} />
//             </div>
//             <div className="fade-up-1 font-cormorant text-5xl font-light tracking-[0.5em] text-violet-700 uppercase mt-6">
//               Luna
//             </div>
//             <div className="fade-up-2 text-[0.6rem] tracking-[0.4em] text-violet-400 uppercase mt-1">
//               Premium Collection
//             </div>
//           </div>
//         )}

//         {/* ── MAIN CARD ── */}
//         <div className={`card-enter relative z-10 w-full max-w-[820px] ${mounted ? "visible" : ""}`}>
//           <div className="luxury-card flex overflow-hidden" style={{ minHeight: "540px" }}>

//             {/* ── LEFT DECORATIVE PANEL ── */}
//             <div className="panel-left w-[280px] flex-shrink-0 flex flex-col items-center justify-center p-10 relative">
//               <div className="panel-pattern" />

//               {/* Decorative circles */}
//               <div className="deco-circle w-64 h-64 -top-16 -left-16 opacity-20" />
//               <div className="deco-circle w-48 h-48 -bottom-12 -right-12 opacity-15" />
//               <div className="deco-circle w-24 h-24 top-1/2 right-8 opacity-10" />

//               {/* Logo */}
//               <div className="relative z-10 flex flex-col items-center">
//                 <div className="relative mb-5">
//                   <div className="absolute inset-0 rounded-full blur-xl scale-150"
//                     style={{ background: "rgba(255,255,255,0.2)" }} />
//                   <img src={logo} alt="Luna"
//                     className="relative w-20 h-20 rounded-full object-cover"
//                     style={{ boxShadow: "0 0 0 2px rgba(255,255,255,0.3), 0 8px 24px rgba(0,0,0,0.2)" }} />
//                 </div>

//                 <div className="font-cormorant text-4xl font-light tracking-[0.5em] text-white uppercase">
//                   Luna
//                 </div>
//                 <div className="text-[0.58rem] tracking-[0.35em] text-purple-200/70 uppercase mt-1">
//                   Premium Collection
//                 </div>

//                 {/* Divider */}
//                 <div className="flex items-center gap-2 mt-6 mb-6 w-full">
//                   <div className="flex-1 h-px bg-white/15" />
//                   <div className="w-1 h-1 rounded-full bg-white/30" />
//                   <div className="flex-1 h-px bg-white/15" />
//                 </div>

//                 {/* Taglines */}
//                 <div className="text-center space-y-2">
//                   {["Exclusive Styles", "Premium Quality", "Curated for You"].map((t) => (
//                     <div key={t} className="flex items-center gap-2">
//                       <div className="w-1 h-1 rounded-full bg-purple-300/50" />
//                       <span className="text-[0.62rem] tracking-widest text-purple-100/60 uppercase">{t}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* ── RIGHT FORM PANEL ── */}
//             <div className="form-section flex-1 flex flex-col justify-center px-10 py-10">

//               {/* Progress bar */}
//               <div className="w-full bg-violet-50 rounded-full h-0.5 mb-8">
//                 <div className="progress-bar" style={{ width: step === 1 ? "33%" : step === 2 ? "66%" : "100%" }} />
//               </div>

//               {/* ════ LOGIN ════ */}
//               {step === 1 && (
//                 <div className="form-enter" key="login">
//                   <div className="mb-7">
//                     <div className="font-cormorant text-3xl font-light text-violet-900 mb-1">
//                       Welcome back
//                     </div>
//                     <div className="text-[0.72rem] text-violet-400 tracking-wide">
//                       Sign in to your Luna account
//                     </div>
//                   </div>

//                   <form onSubmit={handleLoginSubmit}>
//                     <div className="mb-4">
//                       <label className="block text-[0.62rem] font-medium tracking-widest uppercase text-violet-500 mb-2">
//                         Mobile Number
//                       </label>
//                       <div className="flex">
//                         <span className="phone-prefix">+91</span>
//                         <input type="tel"
//                           className="luna-input phone-input flex-1 px-4 py-3 text-sm"
//                           value={mobileNumber} onChange={handleMobileChange}
//                           maxLength="10" placeholder="9999999999" />
//                       </div>
//                     </div>

//                     <div className="mb-5">
//                       <label className="block text-[0.62rem] font-medium tracking-widest uppercase text-violet-500 mb-2">
//                         Password
//                       </label>
//                       <input type="password"
//                         className="luna-input w-full px-4 py-3 text-sm"
//                         value={password}
//                         onChange={(e) => { setPassword(e.target.value); setError(""); }}
//                         placeholder="Enter your password" />
//                     </div>

//                     {error && (
//                       <div className={`text-[0.7rem] px-4 py-3 rounded-xl border mb-5 ${
//                         isSuccess
//                           ? "bg-violet-50 border-violet-200 text-violet-600"
//                           : "bg-red-50 border-red-200 text-red-500"
//                       }`}>
//                         {error}
//                       </div>
//                     )}

//                     <button type="submit" className="luna-btn w-full py-3.5 text-sm mb-4">
//                       Continue →
//                     </button>

//                     <div className="text-center text-[0.72rem] text-gray-400">
//                       Don't have an account?{" "}
//                       <span className="text-violet-600 font-medium cursor-pointer hover:text-violet-800 transition-colors"
//                         onClick={() => { setStep(2); setError(""); }}>
//                         Create one
//                       </span>
//                     </div>
//                     <div className="text-center text-[0.58rem] text-violet-200 mt-3 tracking-widest uppercase">
//                       Demo — any 10-digit number & 6+ char password
//                     </div>
//                   </form>
//                 </div>
//               )}

//               {/* ════ OTP ════ */}
//               {step === 3 && (
//                 <div className="form-enter" key="otp">
//                   <div className="mb-7">
//                     <div className="font-cormorant text-3xl font-light text-violet-900 mb-1">
//                       Verify it's you
//                     </div>
//                     <div className="text-[0.72rem] text-violet-400 tracking-wide">
//                       Enter the 4-digit code sent to your mobile
//                     </div>
//                   </div>

//                   <form onSubmit={handleVerifyOtp}>
//                     <div className="mb-6">
//                       <label className="block text-[0.62rem] font-medium tracking-widest uppercase text-violet-500 mb-3">
//                         OTP Code
//                       </label>
//                       <input type="text"
//                         className="luna-input w-full px-4 py-4 text-center font-cormorant"
//                         style={{ fontSize: "2rem", letterSpacing: "0.8em" }}
//                         placeholder="· · · ·" maxLength="4"
//                         value={otp} onChange={(e) => { setOtp(e.target.value); setError(""); }} />
//                     </div>

//                     {error && (
//                       <div className={`text-[0.7rem] px-4 py-3 rounded-xl border mb-5 ${
//                         isSuccess
//                           ? "bg-violet-50 border-violet-200 text-violet-600"
//                           : "bg-red-50 border-red-200 text-red-500"
//                       }`}>
//                         {error}
//                       </div>
//                     )}

//                     <button type="submit" className="luna-btn w-full py-3.5 text-sm mb-4">
//                       Verify & Enter →
//                     </button>

//                     <div className="text-center text-[0.72rem] text-gray-400">
//                       <span className="text-violet-600 cursor-pointer hover:text-violet-800 transition-colors"
//                         onClick={() => { setStep(1); setError(""); }}>
//                         ← Back to login
//                       </span>
//                     </div>
//                     <div className="text-center text-[0.58rem] text-violet-200 mt-3 tracking-widest uppercase">
//                       Demo — use any 4 digits
//                     </div>
//                   </form>
//                 </div>
//               )}

//               {/* ════ REGISTER ════ */}
//               {step === 2 && (
//                 <div className="form-enter" key="register">
//                   <div className="mb-6">
//                     <div className="font-cormorant text-3xl font-light text-violet-900 mb-1">
//                       Join Luna
//                     </div>
//                     <div className="text-[0.72rem] text-violet-400 tracking-wide">
//                       Create your premium account
//                     </div>
//                   </div>

//                   <form onSubmit={handleRegisterSubmit}>
//                     <div className="grid grid-cols-2 gap-3 mb-3">
//                       <div>
//                         <label className="block text-[0.6rem] font-medium tracking-widest uppercase text-violet-500 mb-1.5">Full Name</label>
//                         <input className="luna-input w-full px-3.5 py-2.5 text-sm"
//                           placeholder="Your Name" value={fullName}
//                           onChange={(e) => { setFullName(e.target.value); setError(""); }} />
//                       </div>
//                       <div>
//                         <label className="block text-[0.6rem] font-medium tracking-widest uppercase text-violet-500 mb-1.5">Email</label>
//                         <input type="email" className="luna-input w-full px-3.5 py-2.5 text-sm"
//                           placeholder="you@email.com" value={email}
//                           onChange={(e) => { setEmail(e.target.value); setError(""); }} />
//                       </div>
//                     </div>

//                     <div className="mb-3">
//                       <label className="block text-[0.6rem] font-medium tracking-widest uppercase text-violet-500 mb-1.5">Mobile Number</label>
//                       <div className="flex">
//                         <span className="phone-prefix text-sm py-2.5">+91</span>
//                         <input type="tel" className="luna-input phone-input flex-1 px-3.5 py-2.5 text-sm"
//                           placeholder="9999999999" value={mobileNumber}
//                           onChange={handleMobileChange} maxLength="10" />
//                       </div>
//                     </div>

//                     <div className="grid grid-cols-2 gap-3 mb-5">
//                       <div>
//                         <label className="block text-[0.6rem] font-medium tracking-widest uppercase text-violet-500 mb-1.5">Password</label>
//                         <input type="password" className="luna-input w-full px-3.5 py-2.5 text-sm"
//                           placeholder="••••••••" value={registerPassword}
//                           onChange={(e) => { setRegisterPassword(e.target.value); setError(""); }} />
//                       </div>
//                       <div>
//                         <label className="block text-[0.6rem] font-medium tracking-widest uppercase text-violet-500 mb-1.5">Confirm</label>
//                         <input type="password" className="luna-input w-full px-3.5 py-2.5 text-sm"
//                           placeholder="••••••••" value={confirmPassword}
//                           onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }} />
//                       </div>
//                     </div>

//                     {error && (
//                       <div className={`text-[0.7rem] px-4 py-3 rounded-xl border mb-4 ${
//                         isSuccess
//                           ? "bg-violet-50 border-violet-200 text-violet-600"
//                           : "bg-red-50 border-red-200 text-red-500"
//                       }`}>
//                         {error}
//                       </div>
//                     )}

//                     <button type="submit" className="luna-btn w-full py-3.5 text-sm mb-4">
//                       Create Account →
//                     </button>

//                     <div className="text-center text-[0.72rem] text-gray-400">
//                       Already a member?{" "}
//                       <span className="text-violet-600 font-medium cursor-pointer hover:text-violet-800 transition-colors"
//                         onClick={() => { setStep(1); setError(""); }}>
//                         Sign in
//                       </span>
//                     </div>
//                   </form>
//                 </div>
//               )}

//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Login;




// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// // Replace with your actual logo:
// // import logo from './asset/luna-logo.jpeg';
// const logo = "https://placehold.co/120x120/0a1a0f/10b981?text=L";

// const Login = () => {
//   const [mobileNumber, setMobileNumber] = useState("");
//   const [password, setPassword] = useState("");
//   const [otp, setOtp] = useState("");
//   const [error, setError] = useState("");
//   const [step, setStep] = useState(1);
//   const [fullName, setFullName] = useState("");
//   const [email, setEmail] = useState("");
//   const [registerPassword, setRegisterPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [isSuccess, setIsSuccess] = useState(false);
//   const [mounted, setMounted] = useState(false);
//   const [logoPhase, setLogoPhase] = useState("intro");
//   const [particles, setParticles] = useState([]);

//   const navigate = useNavigate();

//   useEffect(() => {
//     const storedUser = sessionStorage.getItem("user");
//     if (storedUser) navigate("/dashboard");

//     const pts = Array.from({ length: 18 }, (_, i) => ({
//       id: i,
//       x: Math.random() * 100,
//       y: Math.random() * 100,
//       size: Math.random() * 3 + 1,
//       dur: Math.random() * 8 + 6,
//       delay: Math.random() * 4,
//     }));
//     setParticles(pts);

//     setTimeout(() => setLogoPhase("shrink"), 2200);
//     setTimeout(() => { setLogoPhase("done"); setMounted(true); }, 3400);
//   }, [navigate]);

//   const handleMobileChange = (e) => {
//     setMobileNumber(e.target.value.replace(/\D/g, ""));
//     setError("");
//   };

//   const handleLoginSubmit = (e) => {
//     e.preventDefault();
//     if (mobileNumber.length !== 10) return setError("Enter a valid 10-digit mobile number");
//     if (!password || password.length < 6) return setError("Password must be at least 6 characters");
//     setStep(3);
//     setError("OTP sent! Use any 4 digits to continue.");
//     setIsSuccess(true);
//   };

//   const handleVerifyOtp = (e) => {
//     e.preventDefault();
//     if (!otp || otp.length !== 4) return setError("Enter valid 4-digit OTP");
//     sessionStorage.setItem("user", JSON.stringify({
//       userId: "mock-001",
//       fullName: fullName || "Luna User",
//       mobileNumber,
//       email: email || "user@luna.com",
//       token: "mock-token",
//     }));
//     navigate("/dashboard");
//   };

//   const handleRegisterSubmit = (e) => {
//     e.preventDefault();
//     if (!fullName.trim()) return setError("Full name is required");
//     if (mobileNumber.length !== 10) return setError("Enter a valid mobile number");
//     if (!email.includes("@")) return setError("Enter a valid email");
//     if (registerPassword.length < 6) return setError("Password must be at least 6 characters");
//     if (registerPassword !== confirmPassword) return setError("Passwords do not match");
//     setStep(1);
//     setError("Registration successful! Please login.");
//     setIsSuccess(true);
//     setFullName(""); setEmail(""); setRegisterPassword(""); setConfirmPassword("");
//   };

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Montserrat:wght@300;400;500&display=swap');

//         .font-cormorant { font-family: 'Cormorant Garamond', serif; }
//         .font-montserrat { font-family: 'Montserrat', sans-serif; }

//         /* Noise texture */
//         .noise-bg::before {
//           content: '';
//           position: fixed; inset: 0;
//           background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
//           pointer-events: none; z-index: 0; opacity: 0.5;
//         }

//         /* Particles */
//         .particle-dot {
//           position: fixed; border-radius: 50%;
//           background: #10b981; opacity: 0;
//           pointer-events: none; z-index: 0;
//           animation: floatUp var(--dur) var(--delay) infinite ease-in-out;
//         }
//         @keyframes floatUp {
//           0%   { opacity: 0; transform: translateY(0) scale(1); }
//           20%  { opacity: 0.35; }
//           80%  { opacity: 0.1; }
//           100% { opacity: 0; transform: translateY(-80px) scale(0.4); }
//         }

//         /* Intro logo */
//         .intro-logo-anim {
//           animation: introPulse 2.2s ease-out forwards;
//         }
//         @keyframes introPulse {
//           0%   { transform: scale(0.2); opacity: 0; filter: blur(20px); }
//           40%  { transform: scale(1.08); opacity: 1; filter: blur(0); }
//           70%  { transform: scale(0.97); }
//           100% { transform: scale(1); opacity: 1; }
//         }

//         .fade-slide-up { animation: fadeSlideUp 1.2s ease-out both; }
//         .fade-slide-up-delay { animation: fadeSlideUp 1.2s 0.4s ease-out both; }
//         @keyframes fadeSlideUp {
//           from { opacity: 0; transform: translateY(16px); }
//           to   { opacity: 1; transform: translateY(0); }
//         }

//         /* Card shimmer top line */
//         .shimmer-line::before {
//           content: '';
//           position: absolute; top: 0; left: 0; right: 0; height: 1px;
//           background: linear-gradient(90deg, transparent, #10b981, transparent);
//           animation: shimmerMove 3s infinite;
//         }
//         @keyframes shimmerMove {
//           0%   { transform: translateX(-100%); opacity: 0.7; }
//           100% { transform: translateX(100%); opacity: 0.7; }
//         }

//         /* Card entrance */
//         .card-enter {
//           opacity: 0; transform: translateY(30px);
//           transition: opacity 0.9s ease, transform 0.9s ease;
//         }
//         .card-enter.visible { opacity: 1; transform: translateY(0); }

//         /* Form step entrance */
//         .form-enter { animation: formIn 0.5s ease-out both; }
//         @keyframes formIn {
//           from { opacity: 0; transform: translateY(12px); }
//           to   { opacity: 1; transform: translateY(0); }
//         }

//         /* Input focus ring override */
//         .luna-input:focus {
//           outline: none;
//           border-color: #10b981 !important;
//           background: rgba(16,185,129,0.05) !important;
//           box-shadow: 0 0 0 3px rgba(16,185,129,0.1) !important;
//         }

//         /* Button hover fill */
//         .luna-btn {
//           position: relative; overflow: hidden;
//           transition: color 0.4s ease;
//         }
//         .luna-btn::before {
//           content: '';
//           position: absolute; inset: 0;
//           background: #10b981;
//           transform: translateX(-100%);
//           transition: transform 0.4s cubic-bezier(0.4,0,0.2,1);
//           z-index: 0;
//         }
//         .luna-btn:hover { color: #030a05 !important; }
//         .luna-btn:hover::before { transform: translateX(0); }
//         .luna-btn span { position: relative; z-index: 1; }

//         /* Intro overlay fade */
//         .intro-fade { transition: opacity 0.8s ease; }
//         .intro-fade.hiding { opacity: 0; pointer-events: none; }

//         /* Scrollbar */
//         ::-webkit-scrollbar { width: 4px; }
//         ::-webkit-scrollbar-track { background: #030a05; }
//         ::-webkit-scrollbar-thumb { background: #10b981; border-radius: 2px; }
//       `}</style>

//       {/* ROOT */}
//       <div className="noise-bg font-montserrat min-h-screen bg-[#030a05] flex items-center justify-center overflow-hidden relative">

//         {/* Radial glow */}
//         <div className="fixed inset-0 pointer-events-none z-0"
//           style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(16,185,129,0.07) 0%, transparent 70%)" }} />

//         {/* Particles */}
//         {particles.map((p) => (
//           <div key={p.id} className="particle-dot" style={{
//             left: `${p.x}%`, top: `${p.y}%`,
//             width: `${p.size}px`, height: `${p.size}px`,
//             "--dur": `${p.dur}s`, "--delay": `${p.delay}s`,
//           }} />
//         ))}

//         {/* Corner accents */}
//         <div className="fixed top-6 left-6 w-16 h-16 border-t border-l border-emerald-500 opacity-20 pointer-events-none z-10" />
//         <div className="fixed top-6 right-6 w-16 h-16 border-t border-r border-emerald-500 opacity-20 pointer-events-none z-10" />
//         <div className="fixed bottom-6 left-6 w-16 h-16 border-b border-l border-emerald-500 opacity-20 pointer-events-none z-10" />
//         <div className="fixed bottom-6 right-6 w-16 h-16 border-b border-r border-emerald-500 opacity-20 pointer-events-none z-10" />

//         {/* ── INTRO OVERLAY ── */}
//         {logoPhase !== "done" && (
//           <div className={`intro-fade fixed inset-0 flex flex-col items-center justify-center z-[100] bg-[#030a05] ${logoPhase === "shrink" ? "hiding" : ""}`}>
//             <img src={logo} alt="Luna" className="intro-logo-anim w-32 h-32 rounded-full object-cover border-2 border-emerald-500"
//               style={{ boxShadow: "0 0 40px rgba(16,185,129,0.35), 0 0 80px rgba(16,185,129,0.12)" }} />
//             <div className="fade-slide-up font-cormorant text-5xl font-light tracking-[0.5em] text-emerald-400 uppercase mt-5">
//               Luna
//             </div>
//             <div className="fade-slide-up-delay text-[0.62rem] tracking-[0.35em] text-emerald-700 uppercase mt-1">
//               Premium Collection
//             </div>
//           </div>
//         )}

//         {/* ── MAIN CARD ── */}
//         <div className={`card-enter relative z-10 w-[420px] max-w-[calc(100vw-32px)] ${mounted ? "visible" : ""}`}>
//           <div className="shimmer-line relative bg-gradient-to-br from-[#0c1f12] via-[#0a1a0f] to-[#0d1f13] border border-emerald-900/40 rounded-sm px-10 py-12">

//             {/* Logo block */}
//             <div className="flex flex-col items-center mb-8">
//               <img src={logo} alt="Luna" className="w-[72px] h-[72px] rounded-full object-cover border border-emerald-500/60"
//                 style={{ boxShadow: "0 0 20px rgba(16,185,129,0.18)" }} />
//               <div className="font-cormorant text-2xl font-normal tracking-[0.45em] text-emerald-400 uppercase mt-2">Luna</div>
//               <div className="text-[0.58rem] tracking-[0.3em] text-emerald-800 uppercase mt-0.5">Premium Collection</div>
//             </div>

//             {/* Divider */}
//             <div className="flex items-center gap-3 mb-7">
//               <div className="flex-1 h-px bg-emerald-900/50" />
//               <div className="w-[5px] h-[5px] bg-emerald-500 rotate-45 opacity-60" />
//               <div className="flex-1 h-px bg-emerald-900/50" />
//             </div>

//             {/* ── LOGIN ── */}
//             {step === 1 && (
//               <form onSubmit={handleLoginSubmit} className="form-enter" key="login">
//                 <div className="font-cormorant text-xl font-light tracking-[0.15em] text-emerald-100 uppercase text-center mb-7">
//                   Sign In
//                 </div>

//                 <div className="mb-4">
//                   <label className="block text-[0.58rem] tracking-[0.22em] uppercase text-emerald-700 mb-1.5">Mobile Number</label>
//                   <div className="flex">
//                     <span className="px-3 py-3 bg-emerald-950/60 border border-emerald-900/50 border-r-0 text-emerald-400 text-sm rounded-l-sm">+91</span>
//                     <input type="tel" className="luna-input flex-1 bg-white/[0.03] border border-emerald-900/50 rounded-r-sm px-3 py-3 text-emerald-100 text-sm placeholder-emerald-900 font-montserrat"
//                       value={mobileNumber} onChange={handleMobileChange} maxLength="10" placeholder="9999999999" />
//                   </div>
//                 </div>

//                 <div className="mb-4">
//                   <label className="block text-[0.58rem] tracking-[0.22em] uppercase text-emerald-700 mb-1.5">Password</label>
//                   <input type="password" className="luna-input w-full bg-white/[0.03] border border-emerald-900/50 rounded-sm px-3 py-3 text-emerald-100 text-sm placeholder-emerald-900 font-montserrat"
//                     value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }} placeholder="••••••••" />
//                 </div>

//                 {error && (
//                   <div className={`text-[0.7rem] tracking-wide px-3 py-2.5 rounded-sm border-l-2 mb-4 ${isSuccess ? "bg-emerald-950/60 border-emerald-500 text-emerald-300" : "bg-red-950/40 border-red-500 text-red-300"}`}>
//                     {error}
//                   </div>
//                 )}

//                 <button type="submit" className="luna-btn w-full border border-emerald-500 text-emerald-400 py-3.5 text-[0.68rem] tracking-[0.3em] uppercase font-montserrat cursor-pointer bg-transparent mt-1">
//                   <span>Continue</span>
//                 </button>

//                 <div className="mt-5 text-center text-[0.66rem] text-emerald-800 tracking-wide">
//                   New to Luna?
//                   <span className="text-emerald-500 cursor-pointer ml-1 border-b border-transparent hover:border-emerald-500 transition-all"
//                     onClick={() => { setStep(2); setError(""); }}>Create Account</span>
//                 </div>
//                 <div className="mt-3 text-center text-[0.55rem] tracking-widest text-emerald-900 uppercase">
//                   Demo — any 10-digit number & 6+ char password
//                 </div>
//               </form>
//             )}

//             {/* ── OTP ── */}
//             {step === 3 && (
//               <form onSubmit={handleVerifyOtp} className="form-enter" key="otp">
//                 <div className="font-cormorant text-xl font-light tracking-[0.15em] text-emerald-100 uppercase text-center mb-7">
//                   Verify OTP
//                 </div>

//                 <div className="mb-4">
//                   <label className="block text-[0.58rem] tracking-[0.22em] uppercase text-emerald-700 mb-1.5">Enter 4-digit code</label>
//                   <input type="text" className="luna-input w-full bg-white/[0.03] border border-emerald-900/50 rounded-sm px-3 py-3 text-emerald-300 text-center text-2xl tracking-[0.6em] font-cormorant placeholder-emerald-900"
//                     placeholder="• • • •" maxLength="4" value={otp}
//                     onChange={(e) => { setOtp(e.target.value); setError(""); }} />
//                 </div>

//                 {error && (
//                   <div className={`text-[0.7rem] tracking-wide px-3 py-2.5 rounded-sm border-l-2 mb-4 ${isSuccess ? "bg-emerald-950/60 border-emerald-500 text-emerald-300" : "bg-red-950/40 border-red-500 text-red-300"}`}>
//                     {error}
//                   </div>
//                 )}

//                 <button type="submit" className="luna-btn w-full border border-emerald-500 text-emerald-400 py-3.5 text-[0.68rem] tracking-[0.3em] uppercase font-montserrat cursor-pointer bg-transparent mt-1">
//                   <span>Verify &amp; Enter</span>
//                 </button>

//                 <div className="mt-5 text-center text-[0.66rem] text-emerald-800 tracking-wide">
//                   <span className="text-emerald-500 cursor-pointer border-b border-transparent hover:border-emerald-500 transition-all"
//                     onClick={() => { setStep(1); setError(""); }}>← Back to Login</span>
//                 </div>
//                 <div className="mt-3 text-center text-[0.55rem] tracking-widest text-emerald-900 uppercase">
//                   Demo — use any 4 digits
//                 </div>
//               </form>
//             )}

//             {/* ── REGISTER ── */}
//             {step === 2 && (
//               <form onSubmit={handleRegisterSubmit} className="form-enter" key="register">
//                 <div className="font-cormorant text-xl font-light tracking-[0.15em] text-emerald-100 uppercase text-center mb-7">
//                   Create Account
//                 </div>

//                 {[
//                   { label: "Full Name", type: "text", val: fullName, set: setFullName, ph: "Your Name" },
//                   { label: "Email Address", type: "email", val: email, set: setEmail, ph: "you@email.com" },
//                 ].map(({ label, type, val, set, ph }) => (
//                   <div className="mb-3" key={label}>
//                     <label className="block text-[0.58rem] tracking-[0.22em] uppercase text-emerald-700 mb-1.5">{label}</label>
//                     <input type={type} className="luna-input w-full bg-white/[0.03] border border-emerald-900/50 rounded-sm px-3 py-3 text-emerald-100 text-sm placeholder-emerald-900 font-montserrat"
//                       placeholder={ph} value={val} onChange={(e) => { set(e.target.value); setError(""); }} />
//                   </div>
//                 ))}

//                 <div className="mb-3">
//                   <label className="block text-[0.58rem] tracking-[0.22em] uppercase text-emerald-700 mb-1.5">Mobile Number</label>
//                   <div className="flex">
//                     <span className="px-3 py-3 bg-emerald-950/60 border border-emerald-900/50 border-r-0 text-emerald-400 text-sm rounded-l-sm">+91</span>
//                     <input type="tel" className="luna-input flex-1 bg-white/[0.03] border border-emerald-900/50 rounded-r-sm px-3 py-3 text-emerald-100 text-sm placeholder-emerald-900 font-montserrat"
//                       placeholder="9999999999" value={mobileNumber} onChange={handleMobileChange} maxLength="10" />
//                   </div>
//                 </div>

//                 {[
//                   { label: "Password", val: registerPassword, set: setRegisterPassword },
//                   { label: "Confirm Password", val: confirmPassword, set: setConfirmPassword },
//                 ].map(({ label, val, set }) => (
//                   <div className="mb-3" key={label}>
//                     <label className="block text-[0.58rem] tracking-[0.22em] uppercase text-emerald-700 mb-1.5">{label}</label>
//                     <input type="password" className="luna-input w-full bg-white/[0.03] border border-emerald-900/50 rounded-sm px-3 py-3 text-emerald-100 text-sm placeholder-emerald-900 font-montserrat"
//                       placeholder="••••••••" value={val} onChange={(e) => { set(e.target.value); setError(""); }} />
//                   </div>
//                 ))}

//                 {error && (
//                   <div className={`text-[0.7rem] tracking-wide px-3 py-2.5 rounded-sm border-l-2 mb-4 ${isSuccess ? "bg-emerald-950/60 border-emerald-500 text-emerald-300" : "bg-red-950/40 border-red-500 text-red-300"}`}>
//                     {error}
//                   </div>
//                 )}

//                 <button type="submit" className="luna-btn w-full border border-emerald-500 text-emerald-400 py-3.5 text-[0.68rem] tracking-[0.3em] uppercase font-montserrat cursor-pointer bg-transparent mt-1">
//                   <span>Create Account</span>
//                 </button>

//                 <div className="mt-5 text-center text-[0.66rem] text-emerald-800 tracking-wide">
//                   Already a member?
//                   <span className="text-emerald-500 cursor-pointer ml-1 border-b border-transparent hover:border-emerald-500 transition-all"
//                     onClick={() => { setStep(1); setError(""); }}>Sign In</span>
//                 </div>
//               </form>
//             )}

//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Login;



// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// // Replace this with your actual logo import:
// // import logo from './asset/luna-logo.jpeg';
// const logo = "https://placehold.co/120x120/gold/black?text=LUNA";

// const Login = () => {
//   const [mobileNumber, setMobileNumber] = useState("");
//   const [password, setPassword] = useState("");
//   const [otp, setOtp] = useState("");
//   const [userId, setUserId] = useState(null);
//   const [error, setError] = useState("");
//   const [step, setStep] = useState(1);
//   const [fullName, setFullName] = useState("");
//   const [email, setEmail] = useState("");
//   const [registerPassword, setRegisterPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [isSuccess, setIsSuccess] = useState(false);
//   const [mounted, setMounted] = useState(false);
//   const [logoPhase, setLogoPhase] = useState("intro"); // intro | shrink | done
//   const [particles, setParticles] = useState([]);

//   const navigate = useNavigate();

//   useEffect(() => {
//     const storedUser = sessionStorage.getItem("user");
//     if (storedUser) navigate("/dashboard");

//     // Generate floating particles
//     const pts = Array.from({ length: 18 }, (_, i) => ({
//       id: i,
//       x: Math.random() * 100,
//       y: Math.random() * 100,
//       size: Math.random() * 3 + 1,
//       dur: Math.random() * 8 + 6,
//       delay: Math.random() * 4,
//     }));
//     setParticles(pts);

//     // Logo intro sequence
//     setTimeout(() => setLogoPhase("shrink"), 2200);
//     setTimeout(() => {
//       setLogoPhase("done");
//       setMounted(true);
//     }, 3400);
//   }, [navigate]);

//   const handleMobileChange = (e) => {
//     setMobileNumber(e.target.value.replace(/\D/g, ""));
//     setError("");
//   };

//   const handleLoginSubmit = async (e) => {
//     e.preventDefault();
//     if (mobileNumber.length !== 10) return setError("Enter a valid 10-digit mobile number");
//     if (!password || password.length < 6) return setError("Password must be at least 6 characters");
//     try {
//       const response = await fetch("http://localhost:6055/api/users/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ mobileNumber, password }),
//       });
//       const data = await response.json();
//       if (!response.ok) throw new Error(data.error || "Login failed");
//       setUserId(data.userId);
//       setStep(3);
//       setError("OTP sent to your mobile");
//       setIsSuccess(true);
//     } catch (err) {
//       setError(err.message);
//       setIsSuccess(false);
//     }
//   };

//   const handleVerifyOtp = async (e) => {
//     e.preventDefault();
//     if (!otp || otp.length !== 4) return setError("Enter valid 4-digit OTP");
//     try {
//       const response = await fetch("http://localhost:6055/api/users/verify-otp", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ userId, otp }),
//       });
//       const data = await response.json();
//       if (!response.ok) throw new Error(data.error || "OTP verification failed");
//       sessionStorage.setItem("user", JSON.stringify({
//         userId: data.user._id,
//         fullName: data.user.fullName,
//         mobileNumber: data.user.mobileNumber,
//         email: data.user.email,
//         token: data.token,
//         profileImage: data.user.profileImage,
//       }));
//       navigate("/dashboard");
//     } catch (err) {
//       setError(err.message);
//       setIsSuccess(false);
//     }
//   };

//   const handleRegisterSubmit = async (e) => {
//     e.preventDefault();
//     if (!fullName.trim()) return setError("Full name is required");
//     if (mobileNumber.length !== 10) return setError("Enter a valid mobile number");
//     if (!email.includes("@")) return setError("Enter a valid email");
//     if (registerPassword.length < 6) return setError("Password must be at least 6 characters");
//     if (registerPassword !== confirmPassword) return setError("Passwords do not match");
//     try {
//       const response = await fetch("http://localhost:6055/api/users/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ fullName, email, mobileNumber, password: registerPassword, confirmPassword }),
//       });
//       const data = await response.json();
//       if (!response.ok) throw new Error(data.error || "Registration failed");
//       setStep(1);
//       setError("Registration successful. Please login.");
//       setIsSuccess(true);
//     } catch (err) {
//       setError(err.message);
//       setIsSuccess(false);
//     }
//   };

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Montserrat:wght@300;400;500&display=swap');

//         *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

//         :root {
//           --gold: #c9a84c;
//           --gold-light: #e8c97a;
//           --gold-dim: rgba(201,168,76,0.15);
//           --dark: #0a0a0a;
//           --dark2: #111111;
//           --dark3: #1a1a1a;
//           --text: #f0ead6;
//           --text-dim: rgba(240,234,214,0.5);
//         }

//         .luna-root {
//           font-family: 'Montserrat', sans-serif;
//           min-height: 100vh;
//           background: var(--dark);
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           overflow: hidden;
//           position: relative;
//         }

//         /* ── Noise texture overlay ── */
//         .luna-root::before {
//           content: '';
//           position: fixed;
//           inset: 0;
//           background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
//           pointer-events: none;
//           z-index: 0;
//           opacity: 0.6;
//         }

//         /* ── Radial glow ── */
//         .bg-glow {
//           position: fixed;
//           inset: 0;
//           background: radial-gradient(ellipse 60% 50% at 50% 50%, rgba(201,168,76,0.07) 0%, transparent 70%);
//           pointer-events: none;
//           z-index: 0;
//         }

//         /* ── Particles ── */
//         .particle {
//           position: fixed;
//           border-radius: 50%;
//           background: var(--gold);
//           opacity: 0;
//           pointer-events: none;
//           z-index: 0;
//           animation: floatParticle var(--dur) var(--delay) infinite ease-in-out;
//         }

//         @keyframes floatParticle {
//           0%   { opacity: 0; transform: translateY(0) scale(1); }
//           20%  { opacity: 0.4; }
//           80%  { opacity: 0.15; }
//           100% { opacity: 0; transform: translateY(-80px) scale(0.5); }
//         }

//         /* ── Corner decorations ── */
//         .corner {
//           position: fixed;
//           width: 80px;
//           height: 80px;
//           pointer-events: none;
//           z-index: 1;
//           opacity: 0.3;
//         }
//         .corner-tl { top: 24px; left: 24px; border-top: 1px solid var(--gold); border-left: 1px solid var(--gold); }
//         .corner-tr { top: 24px; right: 24px; border-top: 1px solid var(--gold); border-right: 1px solid var(--gold); }
//         .corner-bl { bottom: 24px; left: 24px; border-bottom: 1px solid var(--gold); border-left: 1px solid var(--gold); }
//         .corner-br { bottom: 24px; right: 24px; border-bottom: 1px solid var(--gold); border-right: 1px solid var(--gold); }

//         /* ── Intro logo ── */
//         .intro-overlay {
//           position: fixed;
//           inset: 0;
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           justify-content: center;
//           z-index: 100;
//           background: var(--dark);
//           transition: opacity 0.8s ease;
//         }
//         .intro-overlay.hiding { opacity: 0; pointer-events: none; }

//         .intro-logo {
//           width: 130px;
//           height: 130px;
//           border-radius: 50%;
//           object-fit: cover;
//           animation: introPulse 2.2s ease-out forwards;
//           border: 2px solid var(--gold);
//           box-shadow: 0 0 40px rgba(201,168,76,0.3), 0 0 80px rgba(201,168,76,0.1);
//         }

//         @keyframes introPulse {
//           0%   { transform: scale(0.2); opacity: 0; filter: blur(20px); }
//           40%  { transform: scale(1.08); opacity: 1; filter: blur(0); }
//           70%  { transform: scale(0.97); }
//           100% { transform: scale(1); opacity: 1; }
//         }

//         .intro-title {
//           margin-top: 20px;
//           font-family: 'Cormorant Garamond', serif;
//           font-size: 2.8rem;
//           font-weight: 300;
//           letter-spacing: 0.5em;
//           color: var(--gold);
//           animation: fadeSlideUp 1.2s 0.6s ease-out both;
//           text-transform: uppercase;
//         }

//         .intro-tagline {
//           margin-top: 6px;
//           font-size: 0.65rem;
//           letter-spacing: 0.35em;
//           color: var(--text-dim);
//           text-transform: uppercase;
//           animation: fadeSlideUp 1.2s 1s ease-out both;
//         }

//         @keyframes fadeSlideUp {
//           from { opacity: 0; transform: translateY(16px); }
//           to   { opacity: 1; transform: translateY(0); }
//         }

//         /* ── Main card ── */
//         .card-wrap {
//           position: relative;
//           z-index: 10;
//           width: 420px;
//           max-width: calc(100vw - 32px);
//           opacity: 0;
//           transform: translateY(30px);
//           transition: opacity 0.9s ease, transform 0.9s ease;
//         }
//         .card-wrap.visible { opacity: 1; transform: translateY(0); }

//         .card {
//           background: linear-gradient(145deg, #161616 0%, #111 50%, #141410 100%);
//           border: 1px solid rgba(201,168,76,0.2);
//           border-radius: 2px;
//           padding: 48px 44px;
//           position: relative;
//           overflow: hidden;
//         }

//         /* Gold shimmer line at top */
//         .card::before {
//           content: '';
//           position: absolute;
//           top: 0; left: 0; right: 0;
//           height: 1px;
//           background: linear-gradient(90deg, transparent, var(--gold), transparent);
//           animation: shimmerLine 3s infinite;
//         }

//         @keyframes shimmerLine {
//           0%   { transform: translateX(-100%); opacity: 0.6; }
//           100% { transform: translateX(100%); opacity: 0.6; }
//         }

//         /* ── Logo inside card ── */
//         .card-logo-wrap {
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           margin-bottom: 32px;
//         }

//         .card-logo {
//           width: 72px;
//           height: 72px;
//           border-radius: 50%;
//           object-fit: cover;
//           border: 1.5px solid var(--gold);
//           box-shadow: 0 0 20px rgba(201,168,76,0.2);
//         }

//         .card-brand {
//           margin-top: 10px;
//           font-family: 'Cormorant Garamond', serif;
//           font-size: 1.6rem;
//           font-weight: 400;
//           letter-spacing: 0.45em;
//           color: var(--gold);
//           text-transform: uppercase;
//         }

//         .card-tagline {
//           font-size: 0.6rem;
//           letter-spacing: 0.3em;
//           color: var(--text-dim);
//           text-transform: uppercase;
//           margin-top: 2px;
//         }

//         /* ── Step title ── */
//         .step-title {
//           font-family: 'Cormorant Garamond', serif;
//           font-size: 1.35rem;
//           font-weight: 300;
//           color: var(--text);
//           letter-spacing: 0.15em;
//           text-transform: uppercase;
//           margin-bottom: 28px;
//           text-align: center;
//         }

//         /* ── Divider ── */
//         .divider {
//           display: flex;
//           align-items: center;
//           gap: 12px;
//           margin-bottom: 28px;
//         }
//         .divider-line { flex: 1; height: 1px; background: rgba(201,168,76,0.2); }
//         .divider-diamond {
//           width: 5px; height: 5px;
//           background: var(--gold);
//           transform: rotate(45deg);
//           opacity: 0.6;
//         }

//         /* ── Field ── */
//         .field { margin-bottom: 18px; }

//         .field-label {
//           display: block;
//           font-size: 0.6rem;
//           letter-spacing: 0.22em;
//           text-transform: uppercase;
//           color: var(--text-dim);
//           margin-bottom: 7px;
//         }

//         .field-input {
//           width: 100%;
//           background: rgba(255,255,255,0.03);
//           border: 1px solid rgba(201,168,76,0.2);
//           border-radius: 1px;
//           padding: 12px 14px;
//           color: var(--text);
//           font-family: 'Montserrat', sans-serif;
//           font-size: 0.82rem;
//           letter-spacing: 0.05em;
//           outline: none;
//           transition: border-color 0.3s, background 0.3s, box-shadow 0.3s;
//         }

//         .field-input:focus {
//           border-color: var(--gold);
//           background: rgba(201,168,76,0.05);
//           box-shadow: 0 0 0 3px rgba(201,168,76,0.07);
//         }

//         .field-input::placeholder { color: rgba(240,234,214,0.2); }

//         /* Phone group */
//         .phone-group { display: flex; gap: 0; }
//         .phone-prefix {
//           padding: 12px 14px;
//           background: rgba(201,168,76,0.08);
//           border: 1px solid rgba(201,168,76,0.2);
//           border-right: none;
//           color: var(--gold);
//           font-size: 0.8rem;
//           letter-spacing: 0.05em;
//           white-space: nowrap;
//           border-radius: 1px 0 0 1px;
//         }
//         .phone-group .field-input { border-radius: 0 1px 1px 0; }

//         /* OTP */
//         .otp-input {
//           text-align: center;
//           font-size: 1.6rem;
//           letter-spacing: 0.6em;
//           font-family: 'Cormorant Garamond', serif;
//         }

//         /* ── Alert ── */
//         .alert-msg {
//           padding: 10px 14px;
//           border-radius: 1px;
//           font-size: 0.72rem;
//           letter-spacing: 0.06em;
//           margin-bottom: 18px;
//           border-left: 2px solid;
//         }
//         .alert-msg.success { background: rgba(201,168,76,0.08); border-color: var(--gold); color: var(--gold-light); }
//         .alert-msg.danger  { background: rgba(220,50,50,0.08); border-color: #dc3232; color: #f08080; }

//         /* ── Submit button ── */
//         .btn-primary-luna {
//           width: 100%;
//           padding: 14px;
//           background: transparent;
//           border: 1px solid var(--gold);
//           color: var(--gold);
//           font-family: 'Montserrat', sans-serif;
//           font-size: 0.7rem;
//           letter-spacing: 0.35em;
//           text-transform: uppercase;
//           cursor: pointer;
//           position: relative;
//           overflow: hidden;
//           transition: color 0.4s;
//           border-radius: 1px;
//           margin-top: 4px;
//         }

//         .btn-primary-luna::before {
//           content: '';
//           position: absolute;
//           inset: 0;
//           background: var(--gold);
//           transform: translateX(-100%);
//           transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
//           z-index: 0;
//         }

//         .btn-primary-luna:hover { color: var(--dark); }
//         .btn-primary-luna:hover::before { transform: translateX(0); }
//         .btn-primary-luna span { position: relative; z-index: 1; }

//         /* ── Footer link ── */
//         .step-footer {
//           margin-top: 22px;
//           text-align: center;
//           font-size: 0.68rem;
//           color: var(--text-dim);
//           letter-spacing: 0.08em;
//         }

//         .step-link {
//           color: var(--gold);
//           cursor: pointer;
//           margin-left: 5px;
//           text-decoration: none;
//           border-bottom: 1px solid transparent;
//           transition: border-color 0.3s;
//         }
//         .step-link:hover { border-color: var(--gold); }

//         /* ── Form entrance animation ── */
//         .form-anim {
//           animation: formEnter 0.5s ease-out both;
//         }
//         @keyframes formEnter {
//           from { opacity: 0; transform: translateY(12px); }
//           to   { opacity: 1; transform: translateY(0); }
//         }
//       `}</style>

//       <div className="luna-root">
//         <div className="bg-glow" />

//         {/* Particles */}
//         {particles.map((p) => (
//           <div
//             key={p.id}
//             className="particle"
//             style={{
//               left: `${p.x}%`,
//               top: `${p.y}%`,
//               width: `${p.size}px`,
//               height: `${p.size}px`,
//               "--dur": `${p.dur}s`,
//               "--delay": `${p.delay}s`,
//             }}
//           />
//         ))}

//         {/* Corner accents */}
//         <div className="corner corner-tl" />
//         <div className="corner corner-tr" />
//         <div className="corner corner-bl" />
//         <div className="corner corner-br" />

//         {/* Intro overlay */}
//         {logoPhase !== "done" && (
//           <div className={`intro-overlay ${logoPhase === "shrink" ? "hiding" : ""}`}>
//             <img src={logo} alt="Luna" className="intro-logo" />
//             <div className="intro-title">Luna</div>
//             <div className="intro-tagline">Premium Collection</div>
//           </div>
//         )}

//         {/* Main card */}
//         <div className={`card-wrap ${mounted ? "visible" : ""}`}>
//           <div className="card">
//             <div className="card-logo-wrap">
//               <img src={logo} alt="Luna" className="card-logo" />
//               <div className="card-brand">Luna</div>
//               <div className="card-tagline">Premium Collection</div>
//             </div>

//             <div className="divider">
//               <div className="divider-line" />
//               <div className="divider-diamond" />
//               <div className="divider-line" />
//             </div>

//             {/* LOGIN */}
//             {step === 1 && (
//               <form onSubmit={handleLoginSubmit} className="form-anim" key="login">
//                 <div className="step-title">Sign In</div>
//                 <div className="field">
//                   <label className="field-label">Mobile Number</label>
//                   <div className="phone-group">
//                     <span className="phone-prefix">+91</span>
//                     <input
//                       type="tel"
//                       className="field-input"
//                       value={mobileNumber}
//                       onChange={handleMobileChange}
//                       maxLength="10"
//                       placeholder="9999999999"
//                     />
//                   </div>
//                 </div>
//                 <div className="field">
//                   <label className="field-label">Password</label>
//                   <input
//                     type="password"
//                     className="field-input"
//                     value={password}
//                     onChange={(e) => { setPassword(e.target.value); setError(""); }}
//                     placeholder="••••••••"
//                   />
//                 </div>
//                 {error && <div className={`alert-msg ${isSuccess ? "success" : "danger"}`}>{error}</div>}
//                 <button type="submit" className="btn-primary-luna"><span>Continue</span></button>
//                 <div className="step-footer">
//                   New to Luna?
//                   <span className="step-link" onClick={() => { setStep(2); setError(""); }}>Create Account</span>
//                 </div>
//               </form>
//             )}

//             {/* OTP */}
//             {step === 3 && (
//               <form onSubmit={handleVerifyOtp} className="form-anim" key="otp">
//                 <div className="step-title">Verify OTP</div>
//                 <div className="field">
//                   <label className="field-label">Enter the 4-digit code</label>
//                   <input
//                     type="text"
//                     className="field-input otp-input"
//                     placeholder="• • • •"
//                     maxLength="4"
//                     value={otp}
//                     onChange={(e) => { setOtp(e.target.value); setError(""); }}
//                   />
//                 </div>
//                 {error && <div className={`alert-msg ${isSuccess ? "success" : "danger"}`}>{error}</div>}
//                 <button type="submit" className="btn-primary-luna"><span>Verify & Enter</span></button>
//                 <div className="step-footer">
//                   <span className="step-link" onClick={() => { setStep(1); setError(""); }}>← Back to Login</span>
//                 </div>
//               </form>
//             )}

//             {/* REGISTER */}
//             {step === 2 && (
//               <form onSubmit={handleRegisterSubmit} className="form-anim" key="register">
//                 <div className="step-title">Create Account</div>
//                 <div className="field">
//                   <label className="field-label">Full Name</label>
//                   <input className="field-input" placeholder="Your Name" value={fullName} onChange={(e) => { setFullName(e.target.value); setError(""); }} />
//                 </div>
//                 <div className="field">
//                   <label className="field-label">Mobile Number</label>
//                   <div className="phone-group">
//                     <span className="phone-prefix">+91</span>
//                     <input type="tel" className="field-input" placeholder="9999999999" value={mobileNumber} onChange={handleMobileChange} maxLength="10" />
//                   </div>
//                 </div>
//                 <div className="field">
//                   <label className="field-label">Email Address</label>
//                   <input type="email" className="field-input" placeholder="you@email.com" value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }} />
//                 </div>
//                 <div className="field">
//                   <label className="field-label">Password</label>
//                   <input type="password" className="field-input" placeholder="••••••••" value={registerPassword} onChange={(e) => { setRegisterPassword(e.target.value); setError(""); }} />
//                 </div>
//                 <div className="field">
//                   <label className="field-label">Confirm Password</label>
//                   <input type="password" className="field-input" placeholder="••••••••" value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }} />
//                 </div>
//                 {error && <div className={`alert-msg ${isSuccess ? "success" : "danger"}`}>{error}</div>}
//                 <button type="submit" className="btn-primary-luna"><span>Create Account</span></button>
//                 <div className="step-footer">
//                   Already a member?
//                   <span className="step-link" onClick={() => { setStep(1); setError(""); }}>Sign In</span>
//                 </div>
//               </form>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Login;