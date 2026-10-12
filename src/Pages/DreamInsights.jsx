import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Components/DreamInsights.css";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";

const DreamInsights = () => {
  const navigate = useNavigate();
  const [dreams, setDreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/login");
        return;
      }

      try {
        const q = query(
  collection(db, "dreams"),
  where("uid", "==", user.uid)
);

const snapshot = await getDocs(q);

const userDreams = snapshot.docs
  .map(doc => ({
    id: doc.id,
    ...doc.data()
  }))
  .filter(d => d.createdAt) // remove invalid docs
  .sort((a, b) => a.createdAt.seconds - b.createdAt.seconds);

setDreams(userDreams);
analyzeDreams(userDreams);



        
        setDreams(userDreams);
        analyzeDreams(userDreams); // ✅ run analysis after fetch
        setLoading(false);
      } catch (err) {
        console.error("Dream fetch error:", err);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // 🧠 ANALYSIS ENGINE
  const analyzeDreams = (dreams) => {
    if (dreams.length === 0) {
      setInsights(null);
      return;
    }

    const fullText = dreams
      .map((d) => `${d.dreamText} ${d.interpretation}`)
      .join(" ")
      .toLowerCase();

    const emotions = {
      fear: ["fear", "scared", "dark", "chase", "death", "cry", "alone", "panic"],
      peace: ["peace", "calm", "light", "sky", "relax", "quiet", "beautiful"],
      freedom: ["fly", "flying", "freedom", "sky", "open", "bird"],
      water: ["water", "sea", "river", "rain", "ocean"],
      stress: ["stress", "pressure", "lost", "falling", "running", "late"],
      love: ["love", "hug", "family", "smile", "kiss", "heart"],
    };

    const scores = {};
    for (let emotion in emotions) {
      scores[emotion] = emotions[emotion].reduce(
        (count, word) =>
          count + (fullText.match(new RegExp(word, "g")) || []).length,
        0
      );
    }

    const dominantEmotion = Object.keys(scores).reduce((a, b) =>
      scores[a] > scores[b] ? a : b
    );

    const firstDate = dreams[0].createdAt
  ? new Date(dreams[0].createdAt.seconds * 1000).toDateString()
  : "Unknown";

    const lastDate = dreams[dreams.length - 1]?.createdAt
  ? new Date(dreams[dreams.length - 1].createdAt.seconds * 1000).toDateString()
  : "Unknown";

    setInsights({
      total: dreams.length,
      firstDate,
      lastDate,
      dominantEmotion,
      scores,
    });
  };

  if (loading) {
    return (
      <p style={{ textAlign: "center", marginTop: "40px" }}>
        Analyzing dreams...
      </p>
    );
  }

  return (
    <>
      {/* NAVBAR */}
      <div className="navbar">
        <div className="nav-left">
          <h2>Oneiric AI</h2>
        </div>

        <div className="nav-links">
          <button className="btn-nav" onClick={() => navigate("/dashboard")}>
            Dashboard
          </button>
          <button className="btn-nav" onClick={() => navigate("/decode")}>
            Decode Dream
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div className="insights-container">
        <h2>🌙 Dream Insights</h2>

        {dreams.length === 0 || !insights ? (
          <p className="empty-msg">
            You haven’t decoded any dreams yet. Decode dreams to unlock insights
            ✨
          </p>
        ) : (
          <>
            {/* OVERVIEW */}
            <div className="insight-cards">
              <div className="insight-card">
                <h3>Total Dreams</h3>
                <p>{insights.total}</p>
              </div>

              <div className="insight-card">
                <h3>First Dream</h3>
                <p>{insights.firstDate}</p>
              </div>

              <div className="insight-card">
                <h3>Latest Dream</h3>
                <p>{insights.lastDate}</p>
              </div>

              <div className="insight-card glow">
                <h3>Dominant Emotion</h3>
                <p>{insights.dominantEmotion.toUpperCase()}</p>
              </div>
            </div>

            {/* EMOTIONAL ANALYSIS */}
            <div className="analysis-box">
              <h3>🧠 Emotional Pattern</h3>
              <p>
                Your dreams show strong signs of <b>{insights.dominantEmotion}</b>.
                This suggests your subconscious mind is currently processing
                emotions related to <b>{insights.dominantEmotion}</b>, inner
                reflection, and imagination.
              </p>
            </div>

            {/* SCORES */}
            <div className="emotion-grid">
              {Object.entries(insights.scores).map(([key, value]) => (
                <div className="emotion-card" key={key}>
                  <h4>{key.toUpperCase()}</h4>
                  <p>{value} signals</p>
                </div>
              ))}
            </div>

            {/* FINAL INSIGHT */}
            <div className="final-insight">
              🌌 Your subconscious mind appears emotionally active and symbolic.
              Repeated dream elements indicate deep internal processing,
              creativity, and sensitivity. Tracking dreams regularly may improve
              emotional awareness.
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default DreamInsights;