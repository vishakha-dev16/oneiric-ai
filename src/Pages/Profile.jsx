import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Components/Profile.css";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/login");
        return;
      }

      const docSnap = await getDoc(doc(db, "users", user.uid));
      if (docSnap.exists()) setUserData(docSnap.data());
    });

    return () => unsub();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  if (!userData) return <p style={{ textAlign: "center", marginTop: "40px" }}>Loading...</p>;

  return (
    <>
      <div className="navbar">
        <h2>Oneiric AI</h2>
        <div className="nav-links">
          <button className="btn-nav" onClick={() => navigate("/dashboard")}>Back to Dashboard</button>
          <button className="btn-nav logout" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div className="profile-container">
        <div className="profile-card">
         {/* <img src={userData.photoURL} alt="Profile" className="profile-pic" /> */}
         <img 
  src={userData.photoURL || "https://i.pravatar.cc/150?img=12"} 
  alt="Profile" 
  className="profile-pic" 
/>

          <h2 className="username">{userData.username}</h2>
          <p className="bio">{userData.bio || "No bio yet 🌙"}</p>
          <p className="email">{userData.email}</p>

          <button className="history-btn" onClick={() => navigate("/edit-profile")}>
            Edit Profile
          </button>
        </div>
      </div>
    </>
  );
};

export default Profile;
