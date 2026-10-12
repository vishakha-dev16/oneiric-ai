import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Components/Notifications.css";
import { auth, db } from "../firebase";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  updateDoc,
  doc
} from "firebase/firestore";

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate("/login");
        return;
      }

      try {
        // ✅ Fetch notifications for this user by UID
        const q = query(
          collection(db, "notifications"),
          where("uid", "==", user.uid),
          orderBy("createdAt", "desc")
        );

        const snapshot = await getDocs(q);
        const list = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setNotifications(list);
      } catch (err) {
        console.error("Notification fetch error:", err);
      }

      setLoading(false);
    };

    fetchNotifications();
  }, [navigate]);

  const markAsRead = async (id) => {
    try {
      await updateDoc(doc(db, "notifications", id), { isRead: true });
      setNotifications(prev =>
        prev.map(n =>
          n.id === id ? { ...n, isRead: true } : n
        )
      );
    } catch (err) {
      console.error("Mark as read error:", err);
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
          <button className="btn-nav" onClick={() => navigate("/dashboard")}>
            Dashboard
          </button>
          <button className="btn-nav" onClick={() => navigate("/")}>
            Home
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div className="notifications-container">
        <h2>🔔 Notifications</h2>

        {loading ? (
          <p>Loading notifications...</p>
        ) : notifications.length === 0 ? (
          <p className="empty-msg">No notifications yet ✨</p>
        ) : (
          <div className="notification-list">
            {notifications.map(item => (
              <div
                key={item.id}
                className={`notification-card ${item.isRead ? "read" : "unread"}`}
                onClick={() => markAsRead(item.id)}
              >
                <h4>{item.title}</h4>
                <p>{item.message}</p>
                <span className="type  "> {item.type}</span>
                <span className="time  ">
                  {item.createdAt?.seconds
                    ? new Date(item.createdAt.seconds * 1000).toLocaleString()
                    : ""}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Notifications;