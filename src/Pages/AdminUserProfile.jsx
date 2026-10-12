import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../Components/AdminUserProfile.css";
import { db } from "../firebase";
import { doc, getDoc, collection, query, where, getDocs, updateDoc } from "firebase/firestore";

const AdminUserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [dreams, setDreams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isAdmin = localStorage.getItem("oneiric_admin");
    if (!isAdmin) navigate("/admin");

    fetchUser();
    fetchDreams();
  }, []);

  const fetchUser = async () => {
    const snap = await getDoc(doc(db, "users", id));
    if (snap.exists()) setUser(snap.data());
  };

  const fetchDreams = async () => {
    const q = query(collection(db, "dreams"), where("uid", "==", id));
    const snap = await getDocs(q);
    setDreams(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    setLoading(false);
  };

  const toggleBlock = async () => {
    await updateDoc(doc(db, "users", id), {
      blocked: !user.blocked
    });
    fetchUser();
  };

  if (!user) return <p style={{ textAlign: "center" }}>Loading...</p>;

  return (
    <>
      {/* NAVBAR */}
      <div className="admin-navbar">
        <h2>Oneiric AI — User Profile</h2>
        <div>
          <button onClick={() => navigate("/admin/users")}>Manage Users</button>
          <button onClick={() => navigate("/admin/dashboard")}>Dashboard</button>
          <button className="logout" onClick={() => {
            localStorage.clear();
            navigate("/admin");
          }}>Logout</button>
        </div>
      </div>

      <div className="admin-user-page">

        {/* PROFILE CARD */}
        <div className="admin-user-card">
          <img src={user.photoURL} alt="profile" />
          <h2>{user.username}</h2>
          <p>{user.email}</p>
          <p className="bio">{user.bio || "No bio"}</p>

          <span className={user.blocked ? "blocked" : "active"}>
            {user.blocked ? "Blocked" : "Active"}
          </span>

          <p className="meta">
            Joined: {user.createdAt?.toDate().toDateString()}
          </p>

          <button 
            className={user.blocked ? "unblock" : "block"} 
            onClick={toggleBlock}
          >
            {user.blocked ? "Unblock User" : "Block User"}
          </button>
        </div>

        {/* DREAMS */}
        <div className="admin-user-dreams">
          <h3>User Dreams ({dreams.length})</h3>

          {loading ? <p>Loading dreams...</p> :

            dreams.length === 0 ? (
              <p>No dreams found.</p>
            ) : (
              dreams.map(d => (
                <div key={d.id} className="admin-dream-card">
                  <h4>{d.title || "Dream"}</h4>
                  <p>{d.dreamText?.slice(0, 120)}...</p>
                </div>
              ))
            )
          }
        </div>

      </div>
    </>
  );
};

export default AdminUserProfile;
