import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Components/Login.css";
import { auth, db } from "../firebase"; // ✅ Import db here
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore"; // ✅ Import Firestore helpers

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // 🔧 Maintenance check
      const snap = await getDoc(doc(db, "settings", "maintenance"));
      if (snap.exists() && snap.data().enabled) {
        alert("⚠️ Website is under maintenance");
        return;
      }

      // ✅ Sign in user
      const userCred = await signInWithEmailAndPassword(auth, email, password);

      // 🔎 Check if user is blocked
      const userDoc = await getDoc(doc(db, "users", userCred.user.uid));
      if (userDoc.exists() && userDoc.data().blocked) {
        alert("❌ You are blocked by admin");
        return;
      }

      alert("Login successful 🎉");
      navigate("/dashboard");
    } catch (error) {
      alert("Invalid email or password");
    }
  };

  return (
    <>
      {/* NAVBAR */}
      <div className="navbar">
        <div className="nav-left">
          <h2 onClick={() => navigate("/")}>Oneiric AI</h2>
        </div>

        <div className="nav-links">
          <button className="btn-nav" onClick={() => navigate("/")}>
            Back to Home
          </button>

          <button
            className="btn-nav guest"
            onClick={() => navigate("/decode")}
          >
            Wanna be Guest
          </button>
        </div>
      </div>

      {/* LOGIN CARD */}
      <div className="login-container">
        <h2>Login</h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Login</button>
        </form>

        <p className="signup-link">
          Are you new here?{" "}
          <span onClick={() => navigate("/signup")}>Signup first</span>
        </p>
        <p className="login-link">
          <span onClick={() => navigate("/")}>Back to Home</span>
        </p>
      </div>
    </>
  );
};

export default Login;