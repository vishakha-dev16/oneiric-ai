import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Components/AdminManageFeedbacks.css";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp
} from "firebase/firestore";

const AdminManageFeedbacks = () => {
  const navigate = useNavigate();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replies, setReplies] = useState({}); // 👈 per-feedback reply

  useEffect(() => {
    const isAdmin = localStorage.getItem("oneiric_admin");
    if (!isAdmin) navigate("/admin");

    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const snapshot = await getDocs(collection(db, "feedbacks"));
      const list = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data()
      }));
      setFeedbacks(list);
    } catch (err) {
      console.error("Fetch feedback error:", err);
    }
    setLoading(false);
  };

  const sendReply = async (fb) => {
    const text = replies[fb.id];
    if (!text || !text.trim()) return;

    try {
      // 🔔 Send notification to user
      await addDoc(collection(db, "notifications"), {
        uid: fb.uid,
        title: "Admin replied to your feedback 🌙",
        message: text,
        type: "feedback_reply",
        isRead: false,
        createdAt: serverTimestamp()
      });

      // ✅ Mark feedback as replied
      await updateDoc(doc(db, "feedbacks", fb.id), {
        replied: true,
        adminReply: text,
        repliedAt: serverTimestamp()
      });

      // Clear reply input
      setReplies(prev => ({ ...prev, [fb.id]: "" }));

      fetchFeedbacks();
    } catch (err) {
      console.error("Reply error:", err);
    }
  };

  return (
    <>
      {/* NAVBAR */}
      <div className="admin-navbar">
        <h2>Oneiric AI — Feedbacks</h2>
        <div>
          <button onClick={() => navigate("/admin/dashboard")}>Dashboard</button>
          <button onClick={() => navigate("/")}>Home</button>
          <button
            className="logout"
            onClick={() => {
              localStorage.clear();
              navigate("/admin");
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div className="manage-feedbacks-container">
        {loading ? (
          <p>Loading feedbacks...</p>
        ) : feedbacks.length === 0 ? (
          <p className="no-feedback">No feedbacks yet ✨</p>
        ) : (
          <div className="feedback-grid">
            {feedbacks.map(fb => (
              <div className="feedback-card" key={fb.id}>
                <h3>{fb.name || "Anonymous User"}</h3>
                <p className="email">{fb.email}</p>

                <p className="message">“{fb.message}”</p>

                <p className="rating">⭐ {fb.rating}/5</p>

                {fb.replied ? (
                  <span className="replied">✔ Replied</span>
                ) : (
                  <>
                    <textarea
                      placeholder="Write reply..."
                      value={replies[fb.id] || ""}
                      onChange={(e) =>
                        setReplies(prev => ({
                          ...prev,
                          [fb.id]: e.target.value
                        }))
                      }
                    />

                    <button
                      className="reply-btn"
                      onClick={() => sendReply(fb)}
                    >
                      Send Reply
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default AdminManageFeedbacks;
