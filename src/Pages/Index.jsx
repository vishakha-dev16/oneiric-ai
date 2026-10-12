import React from "react";
import { useNavigate } from "react-router-dom";
import "../Components/Index.css";
import Logo from "../Logo/Logo.png";

const Index = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* NAVBAR */}
      <div className="navbar">
        <div className="nav-left">
          
          <h2>Oneiric AI</h2>
        </div>

        <div className="nav-links">
          <a href="admin-login">Admin</a>
          <a href="feedback">Feedback</a>
          <a href="about">About</a>
          <button className="btn-nav" onClick={() => navigate("/decode?guest=true")}>
  Continue as Guest
</button> 
      
          <button className="btn-nav" onClick={() => navigate("/login")}>Login</button>
        </div>
      </div>

      {/* HERO SECTION */}
      <div className="hero">
        <img src={Logo} alt="Oneiric AI Logo" className="logo" />
        <h1>Where Your Dreams Are Decoded by AI</h1>
        <p>
          Experience the magic of dream interpretation with AI-powered insights,
          symbolism analysis, emotional mapping, and personalized guidance.
        </p>
        <button
  className="btn-main"
  onClick={() => navigate("/signup")}
>
  Decode My Dream
</button>

      </div>

      {/* WHY CHOOSE US */}
      <div className="section">
        <h2>Why Choose Us?</h2>

        <div className="card-container">
          <div className="card">
            <h3>AI Interpretation</h3>
            <p>
              Instant dream decoding based on symbolism and psychology.
            </p>
          </div>

          <div className="card">
            <h3>Emotion Mapping</h3>
            <p>
              Understand the feelings hidden inside your subconscious.
            </p>
          </div>

          <div className="card">
            <h3>Dream Symbols</h3>
            <p>
              Analyze key symbols and their deeper meaning.
            </p>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="footer">
        © 2025 Oneiric AI — Dream Interpretation Powered by AI
      </div>
    </>
  );
};

export default Index;
