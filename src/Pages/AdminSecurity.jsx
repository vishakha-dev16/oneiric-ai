import React from "react";
import { useNavigate } from "react-router-dom";
import "../Components/AdminSecurity.css";

const AdminSecurity = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* NAVBAR */}
      <div className="admin-navbar">
        <h2>Oneiric AI — Security</h2>

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
      <div className="admin-security-container">

        <h3>🔐 Route Protection Status</h3>

        <div className="security-card">
          <p>✅ User Authentication Enabled</p>
          <p>✅ Blocked User Protection Active</p>
          <p>✅ Decode Access Controlled</p>
          <p>✅ Admin Routes Secured</p>
        </div>

      </div>
    </>
  );
};

export default AdminSecurity;
