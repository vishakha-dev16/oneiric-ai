import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  query,
  where,
  Timestamp
} from "firebase/firestore";

import "../Components/AdminBasicAnalysis.css";

const AdminBasicAnalysis = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    blockedUsers: 0,
    totalDreams: 0,
    dreamsToday: 0,
  });

  /* 🔐 Admin Check */
  useEffect(() => {
    const isAdmin = localStorage.getItem("oneiric_admin");
    if (!isAdmin) navigate("/admin-login");

    fetchStats();
  }, [navigate]);

  /* 📊 Fetch Data */
  const fetchStats = async () => {
    try {

      /* Users */
      const usersSnap = await getDocs(collection(db, "users"));
      const users = usersSnap.docs.map(doc => doc.data());

      const totalUsers = users.length;
      const blockedUsers = users.filter(u => u.blocked === true).length;
      const activeUsers = totalUsers - blockedUsers;

      /* Dreams */
      const dreamsSnap = await getDocs(collection(db, "dreams"));
      const dreams = dreamsSnap.docs.map(doc => doc.data());
      const totalDreams = dreams.length;

      /* Dreams Today */
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayTimestamp = Timestamp.fromDate(today);

      const todayQuery = query(
        collection(db, "dreams"),
        where("createdAt", ">=", todayTimestamp)
      );

      const todaySnap = await getDocs(todayQuery);
      const dreamsToday = todaySnap.size;

      setStats({
        totalUsers,
        activeUsers,
        blockedUsers,
        totalDreams,
        dreamsToday,
      });

    } catch (err) {
      console.error("Stats Error:", err);
    }
  };

  return (
    <>
      {/* 🔝 NAVBAR */}
      <div className="admin-navbar">
        <h2>Oneiric AI — Basic Analysis</h2>

        <div>
          <button onClick={() => navigate("/admin/dashboard")}>
            Dashboard
          </button>

          <button onClick={() => navigate("/")}>
            Home
          </button>

          <button
            className="logout"
            onClick={() => {
              localStorage.clear();
              navigate("/admin-login");
            }}
          >
            Logout
          </button>
        </div>
      </div>


      {/* 📊 MAIN */}
<div className="analysis-container">

  <h2 className="analysis-title">📈 System Overview</h2>

  <div className="stats-grid">

    <div className="stat-card">
      <span>Total Users</span>
      <h3>{stats.totalUsers}</h3>
    </div>

    <div className="stat-card">
      <span>Active Users</span>
      <h3>{stats.activeUsers}</h3>
    </div>

    <div className="stat-card">
      <span>Blocked Users</span>
      <h3>{stats.blockedUsers}</h3>
    </div>

    <div className="stat-card">
      <span>Total Dreams</span>
      <h3>{stats.totalDreams}</h3>
    </div>

    <div className="stat-card">
      <span>Dreams Today</span>
      <h3>{stats.dreamsToday}</h3>
    </div>

  </div>

</div>

    </>
  );
};

export default AdminBasicAnalysis;
