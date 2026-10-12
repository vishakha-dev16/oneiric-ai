import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Components/AdminMaintenance.css";
import { db } from "../firebase";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";

const AdminMaintenance = () => {
  const navigate = useNavigate();
  const [enabled, setEnabled] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const isAdmin = localStorage.getItem("oneiric_admin");
    if (!isAdmin) navigate("/admin");

    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const snap = await getDoc(doc(db, "settings", "maintenance"));
    if (snap.exists()) {
      setEnabled(snap.data().enabled);
      setMessage(snap.data().message);
    }
  };

  const saveSettings = async () => {
    await updateDoc(doc(db, "settings", "maintenance"), {
      enabled,
      message,
      updatedAt: serverTimestamp()
    });

    alert("Maintenance settings updated ✅");
  };

  return (
    <>
      <div className="admin-navbar">
        <h2>Oneiric AI — Maintenance Mode</h2>
        <div>
          <button onClick={() => navigate("/admin/dashboard")}>Dashboard</button>
          <button onClick={() => navigate("/")}>Home</button>
        </div>
      </div>

      <div className="maintenance-container">
        <h3>🔧 Maintenance Control</h3>

        <label className="switch">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
          />
          <span className="slider"></span>
        </label>

        <p>Status: <b>{enabled ? "ON" : "OFF"}</b></p>

        <textarea
          placeholder="Maintenance message shown to users"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button className="save-btn" onClick={saveSettings}>
          Save Changes
        </button>
      </div>
    </>
  );
};

export default AdminMaintenance;
