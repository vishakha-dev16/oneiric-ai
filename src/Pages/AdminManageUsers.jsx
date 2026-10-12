import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Components/AdminManageUsers.css";

import { db } from "../firebase";

import {
  collection,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  serverTimestamp
} from "firebase/firestore";

const AdminManageUsers = () => {

  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);


  /* 🔐 Admin Protection */
  useEffect(() => {

    const isAdmin = localStorage.getItem("oneiric_admin");

    if (!isAdmin) {
      navigate("/admin-login");
      return;
    }

    fetchUsers();

  }, [navigate]);


  /* 📥 Fetch Users */
  const fetchUsers = async () => {

    try {

      const snapshot = await getDocs(collection(db, "users"));

      const list = snapshot.docs.map((docSnap) => ({
        id: docSnap.id, // THIS IS UID
        ...docSnap.data()
      }));

      setUsers(list);

    } catch (err) {

      console.error("User fetch error:", err);

    }

    setLoading(false);

  };



  /* 🚫 BLOCK / UNBLOCK USER */
  const toggleBlock = async (userId, currentStatus) => {

    try {

      const newStatus = !currentStatus;

      /* 1️⃣ Update user block status */
      await updateDoc(doc(db, "users", userId), {
        blocked: newStatus
      });


      /* 2️⃣ Create notification */
      await addDoc(collection(db, "notifications"), {

        uid: userId,

        title: newStatus
          ? "Account Blocked 🚫"
          : "Account Unblocked ✅",

        message: newStatus
          ? "Your account has been blocked by admin due to policy violations."
          : "Your account has been restored. You can now use Oneiric AI.",

        type: newStatus ? "block" : "unblock",

        isRead: false,

        createdAt: serverTimestamp()

      });


      /* 3️⃣ Update UI instantly */
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId
            ? { ...user, blocked: newStatus }
            : user
        )
      );


      console.log("User status updated and notification sent");


    } catch (err) {

      console.error("Block/unblock error:", err);

      alert("Error updating user status");

    }

  };



  /* 📊 Stats */
  const total = users.length;

  const blocked = users.filter((u) => u.blocked === true).length;

  const active = total - blocked;



  return (
    <>

      {/* 🔝 NAVBAR */}
      <div className="admin-navbar">

        <h2>Oneiric AI — Manage Users</h2>

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



      {/* MAIN */}
      <div className="manage-users-container">


        {/* 📊 Stats */}
        <div className="user-stats">

          <div className="stat-card">
            Total Users
            <span>{total}</span>
          </div>

          <div className="stat-card">
            Active
            <span>{active}</span>
          </div>

          <div className="stat-card">
            Blocked
            <span>{blocked}</span>
          </div>

        </div>



        {/* 👤 Users Grid */}
        {loading ? (

          <p>Loading users...</p>

        ) : (

          <div className="users-grid">

            {users.map((user) => (

              <div className="user-card" key={user.id}>

                <img
                  src={
                    user.photoURL ||
                    "https://i.imgur.com/6VBx3io.png"
                  }
                  alt="profile"
                />

                <h3>{user.username || "No name"}</h3>

                <p>{user.email}</p>


                <span
                  className={
                    user.blocked
                      ? "blocked"
                      : "active"
                  }
                >
                  {user.blocked ? "Blocked" : "Active"}
                </span>



                <div className="user-actions">

                  <button
                    onClick={() =>
                      navigate(`/admin/user/${user.id}`)
                    }
                  >
                    View Profile
                  </button>


                  <button
                    className={
                      user.blocked
                        ? "unblock"
                        : "block"
                    }
                    onClick={() =>
                      toggleBlock(user.id, user.blocked)
                    }
                  >
                    {user.blocked
                      ? "Unblock"
                      : "Block"}
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </>
  );

};

export default AdminManageUsers;
