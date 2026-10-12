import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Components/AdminLogin.css";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // ✅ Step 1: Sign in with Firebase Auth admin123
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCred.user.uid;

      // ✅ Step 2: Check if UID exists in /admins
      const adminSnap = await getDoc(doc(db, "admins", uid));
      if (!adminSnap.exists()) {
        setError("❌ You are not authorized as admin");
        setLoading(false);
        return;
      }

      // ✅ Step 3: Save session and redirect
      localStorage.setItem("oneiric_admin", "true");
      localStorage.setItem("oneiric_admin_data", JSON.stringify(adminSnap.data()));
      navigate("/admin/dashboard");

    } catch (err) {
  console.error("Admin login error:", err);

  if (err.code === "auth/user-not-found") {
    setError("❌ Admin account not found");
  } 
  else if (err.code === "auth/wrong-password") {
    setError("❌ Incorrect password");
  } 
  else if (err.code === "auth/invalid-email") {
    setError("❌ Invalid email address");
  } 
  else {
    setError("⚠️ Login failed. Please try again.");
  }

    }

    setLoading(false);
  };

  return (
    <>
      <div className="navbar">
        <div className="nav-left">
          <h2>Oneiric AI</h2>
        </div>
        <div className="nav-links">
          <button className="btn-nav" onClick={() => navigate("/")}>
            Back to Home
          </button>
        </div>
      </div>

      <div className="admin-login-page">
        <form className="admin-login-box" onSubmit={handleAdminLogin}>
          <h2>🔐 Admin Panel Login</h2>
          <p className="subtitle">Authorized access only</p>

          {error && <p className="error">{error}</p>}

          <input
            type="email"
            placeholder="Admin email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Verifying..." : "Login"}
          </button>

          <p className="back-home" onClick={() => navigate("/")}>
            ← Back to Oneiric AI
          </p>
        </form>
      </div>
    </>
  );
};

export default AdminLogin;