import React from "react";
import "../Components/About.css";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* NAVBAR */}
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

      {/* MAIN */}
      <div className="about-container">

        <h1>🌙 About Oneiric AI</h1>

        <p className="about-intro">
          Oneiric AI is an intelligent dream companion designed to help users explore,
          understand, and reflect on their dreams. Dreams are windows to the subconscious,
          and Oneiric AI transforms them into meaningful psychological insights.
        </p>

        <div className="about-section">
          <h2>✨ What does Oneiric AI do?</h2>
          <ul>
            <li>Decode dreams using AI-powered interpretation</li>
            <li>Generate dream-based visualizations</li>
            <li>Store dreams securely for future reflection</li>
            <li>Analyze emotional patterns and insights</li>
            <li>Provide a calm, aesthetic, and user-friendly experience</li>
          </ul>
        </div>

        <div className="about-section">
          <h2>🧠 Why dreams?</h2>
          <p>
            Dreams reflect emotions, stress, creativity, memories, and desires.
            By tracking and interpreting dreams, users can gain self-awareness,
            emotional clarity, and a deeper connection to their inner world.
          </p>
        </div>

        <div className="about-section highlight">
          <h2>🚀 Project Vision</h2>
          <p>
            Our goal is to build a digital dream journal that combines artificial intelligence,
            psychology, and creativity into one platform. Oneiric AI is not just an app —
            it is a space to understand the unseen mind.
          </p>
        </div>

        <div className="about-footer">
          🌌 Designed with imagination. Built with intelligence.
        </div>

      </div>
    </>
  );
};

export default About;
