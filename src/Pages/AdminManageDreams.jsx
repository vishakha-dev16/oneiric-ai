import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Components/AdminManageDreams.css";
import { db } from "../firebase";
import { collection, getDocs, deleteDoc, doc, orderBy, query } from "firebase/firestore";

const AdminManageDreams = () => {
  const navigate = useNavigate();
  const [dreams, setDreams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isAdmin = localStorage.getItem("oneiric_admin");
    if (!isAdmin) navigate("/admin");

    fetchDreams();
  }, []);

  const fetchDreams = async () => {
    try {
      const q = query(
        collection(db, "dreams"),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setDreams(list);
    } catch (err) {
      console.error("Dream fetch error:", err);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this dream permanently?")) return;

    try {
      await deleteDoc(doc(db, "dreams", id));
      fetchDreams();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // 📊 STATS
  const total = dreams.length;

  const today = dreams.filter(d => {
    if (!d.createdAt) return false;
    const date = d.createdAt.toDate();
    return date.toDateString() === new Date().toDateString();
  }).length;

  const month = dreams.filter(d => {
    if (!d.createdAt) return false;
    const date = d.createdAt.toDate();
    const now = new Date();
    return date.getMonth() === now.getMonth() &&
           date.getFullYear() === now.getFullYear();
  }).length;

  return (
    <>
      {/* NAVBAR */}
      <div className="admin-navbar">
        <h2>Oneiric AI — Manage Dreams</h2>
        <div>
          <button onClick={() => navigate("/admin/dashboard")}>Dashboard</button>
          <button onClick={() => navigate("/")}>Home</button>
          <button className="logout" onClick={() => {
            localStorage.clear();
            navigate("/admin");
          }}>
            Logout
          </button>
        </div>
      </div>

      <div className="manage-dreams-container">

        {/* STATS */}
        <div className="dream-stats">
          <div className="stat-card">Total Dreams <span>{total}</span></div>
          <div className="stat-card">Today <span>{today}</span></div>
          <div className="stat-card">This Month <span>{month}</span></div>
        </div>

        {loading ? <p>Loading dreams...</p> : (
          <div className="dreams-grid">
            {dreams.map(dream => (
              <div className="dream-card" key={dream.id}>
                <p className="dream-text">
                  <b>Dream:</b> {dream.dreamText?.slice(0, 120)}...
                </p>

                <p className="dream-meaning">
                  <b>Meaning:</b> {dream.interpretation?.slice(0, 120)}...
                </p>

                {dream.imageUrl && (
                  <img src={dream.imageUrl} alt="dream" />
                )}

                <p className="dream-date">
                  {dream.createdAt?.toDate().toDateString()}
                </p>

                <button className="delete-btn" onClick={() => handleDelete(dream.id)}>
                  Delete Dream
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default AdminManageDreams;
