import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Components/AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAdmin = localStorage.getItem("oneiric_admin");
    if (!isAdmin) {
      navigate("/admin");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("oneiric_admin");
    localStorage.removeItem("oneiric_admin_data");
    navigate("/admin");
  };

  const cards = [
    { title: "Manage Users", icon: "👤", path: "/admin/users" },
    { title: "Manage Dreams", icon: "🌙", path: "/admin/dreams" },
    { title: "Feedbacks & Replies", icon: "💬", path: "/admin/feedbacks" },
    { title: "Maintenance Mode", icon: "🛠", path: "/admin/maintenance" },
    { title: "Protect Routes", icon: "🔐", path: "/admin/security" },
    { title: "Basic Analysis", icon: "📊", path: "/admin/analysis" },
    
  ];

  return (
    <>
      {/* NAVBAR */}
      <div className="admin-navbar">
        <h2>Oneiric AI — Admin Panel</h2>
        <div>
          <button onClick={() => navigate("/")}>Back to Home</button>
          <button className="logout" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div className="admin-layout">
        
        {/* SIDEBAR */}
        <div className="admin-sidebar">
          <h3>Dashboard</h3>
          {cards.map((item, index) => (
            <div 
              key={index} 
              className="sidebar-link"
              onClick={() => navigate(item.path)}
            >
              <span>{item.icon}</span> {item.title}
            </div>
          ))}
        </div>

        {/* MAIN */}
        <div className="admin-main">
          <h2>Admin Control Center</h2>
          <p className="admin-sub">
            Monitor, control and analyze Oneiric AI from one powerful panel.
          </p>

          <div className="admin-cards">
            {cards.map((item, index) => (
              <div 
                key={index} 
                className="admin-card"
                onClick={() => navigate(item.path)}
              >
                <h1>{item.icon}</h1>
                <h3>{item.title}</h3>
                <p>Click to manage</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </>
  );
};

export default AdminDashboard;
