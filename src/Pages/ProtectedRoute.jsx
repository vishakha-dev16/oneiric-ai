// src/Components/ProtectedRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const ProtectedRoute = ({ children, allowDecode = false }) => {
  const [loading, setLoading] = useState(true);
  const [blocked, setBlocked] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setBlocked(data.blocked === true);
        }
        setUser(currentUser);
      } catch (err) {
        console.error("Route protection error:", err);
      }
      setLoading(false);
    };

    checkUser();
  }, []);

  if (loading) return <p>Loading...</p>;

  // 🚫 Not logged in → redirect to login
  if (!user) return <Navigate to="/login" />;

  // 🚫 Blocked users
  if (blocked) {
    // If trying to decode or dashboard → redirect to notifications
    if (allowDecode || window.location.pathname === "/dashboard") {
      return <Navigate to="/notifications" />;
    }
  }

  // ✅ Allowed
  return children;
};

export default ProtectedRoute;