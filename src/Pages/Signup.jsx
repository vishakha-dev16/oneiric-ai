import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Components/Signup.css";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";

const Signup = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    // ✅ Password match check
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      // 🔧 Maintenance check
      const snap = await getDoc(doc(db, "settings", "maintenance"));
      if (snap.exists() && snap.data().enabled) {
        alert("⚠️ Website is temporarily under maintenance.\nPlease try again later.");
        return;
      }

      // ✅ Create user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // ✅ Auto avatar
      const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
        username
      )}&background=DCCCBD&color=5A463A&size=256`;

      // ✅ Save user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        username,
        email,
        bio: "",
        photoURL: avatar,
        blocked: false,
        createdAt: serverTimestamp(),
      });

      alert("Signup successful 🎉");
      navigate("/login");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      {/* NAVBAR */}
      <div className="navbar">
        <div className="nav-left">
          <h2>Oneiric AI</h2>
        </div>
        <div className="nav-links">
          <button className="btn-nav" onClick={() => navigate("/login")}>
            Login
          </button>
        </div>
      </div>

      {/* SIGNUP FORM */}
      <div className="signup-container">
        <h2>Create Account</h2>

        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Username"
            required
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="Confirm Password"
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button type="submit">Sign Up</button>
        </form>

        <p className="login-link">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>Login here</span>
        </p>

        <p className="login-link">
          <span onClick={() => navigate("/")}>Back to Home</span>
        </p>
      </div>
    </>
  );
};

export default Signup;