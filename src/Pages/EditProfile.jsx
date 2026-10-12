import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Components/EditProfile.css";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const EditProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [photoURL, setPhotoURL] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        navigate("/login");
        return;
      }

      setUser(currentUser);
      setEmail(currentUser.email);

      const snap = await getDoc(doc(db, "users", currentUser.uid));
      if (snap.exists()) {
        setUsername(snap.data().username || "");
        setBio(snap.data().bio || "");
        setPhotoURL(snap.data().photoURL || "");
      }
    });

    return () => unsub();
  }, [navigate]);

  const handleSave = async () => {
    if (!user) return;

    const newAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
      username
    )}&background=d8cfc4&color=4a2c2a&size=256`;

    await updateDoc(doc(db, "users", user.uid), {
      username,
      bio,
      photoURL: newAvatar,
    });

    alert("Profile updated successfully 🌙");
    navigate("/profile");
  };

  return (
    <>
      <div className="navbar">
        <h2>Oneiric AI</h2>
        <div className="nav-links">
          <button className="btn-nav" onClick={() => navigate("/profile")}>Back to Profile</button>
          <button className="btn-nav" onClick={() => navigate("/dashboard")}>Dashboard</button>
          <button className="btn-nav logout" onClick={() => signOut(auth)}>Logout</button>
        </div>
      </div>

      <div className="edit-profile-container">
        <div className="edit-profile-card">
          <h2>Edit Profile</h2>

          <img src={photoURL} alt="Profile" className="edit-profile-pic" />

          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} />
          <input type="email" value={email} disabled />

          <button className="save-btn" onClick={handleSave}>Save Changes</button>
        </div>
      </div>
    </>
  );
};

export default EditProfile;
