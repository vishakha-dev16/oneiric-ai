import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Components/Dashboard.css";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const Dashboard = () => {
  const navigate = useNavigate();
  

  useEffect(() => {
    const checkBlockedUser = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (userDoc.exists() && userDoc.data().blocked) {
        navigate("/notifications");
      }
    };

    checkBlockedUser(); // ✅ CALL IT
  }, [navigate]);

  return (
    <>
      <div className="navbar">
        <h2>Oneiric AI</h2>
        <div className="nav-links">
          <button className="btn-nav" onClick={() => navigate("/notifications")}>
            Notifications
          </button>
          <button className="btn-nav" onClick={() => navigate("/profile")}>
            Profile
          </button>
          <button
            className="btn-nav logout"
            onClick={async () => {
              await signOut(auth);
              navigate("/login");
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-container">
        <h1>Welcome to your Dashboard 🌙</h1>
        <p className="subtitle">
          Track your dreams, decode meanings, and explore your subconscious.
        </p>

        <div className="dashboard-cards">
          <div className="dashboard-card primary" onClick={() => navigate("/profile")}>
            <h3>Profile</h3>
            <p>View and edit your personal dream profile.</p>
          </div>

          <div className="dashboard-card primary" onClick={() => navigate("/decode")}>
            <h3>Decode Your Dream</h3>
            <p>Describe your dream and let Oneiric AI interpret it.</p>
          </div>

          <div className="dashboard-card primary" onClick={() => navigate("/history")}>
            <h3>Dream History</h3>
            <p>All your past dream interpretations.</p>
          </div>

          <div className="dashboard-card primary" onClick={() => navigate("/insights")}>
            <h3>Dream Insights</h3>
            <p>Patterns, emotions & recurring symbols.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
