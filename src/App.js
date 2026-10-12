import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MaintenanceAlert from "./Pages/MaintenanceAlert";
//import { useEffect, useState } from "react";
import { useEffect } from "react";
import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";

import Index from "./Pages/Index";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import Decode from "./Pages/Decode";
import Dashboard from "./Pages/Dashboard";
import Profile from "./Pages/Profile";
import EditProfile from "./Pages/EditProfile";
import DreamHistory from "./Pages/DreamHistory";
import DreamInsights from "./Pages/DreamInsights";
import Feedback from "./Pages/Feedback";
import About from "./Pages/About";
import Notifications from "./Pages/Notifications";


// Admin
import AdminLogin from "./Pages/AdminLogin";
import AdminDashboard from "./Pages/AdminDashboard";
import AdminManageUsers from "./Pages/AdminManageUsers";
import AdminUserProfile from "./Pages/AdminUserProfile";
import AdminManageDreams from "./Pages/AdminManageDreams";
import AdminManageFeedbacks from "./Pages/AdminManageFeedbacks";
import AdminMaintenance from "./Pages/AdminMaintenance";
import ProtectedRoute from "./Pages/ProtectedRoute";
import AdminBasicAnalysis from "./Pages/AdminBasicAnalysis";
import AdminSecurity from "./Pages/AdminSecurity";




function App() {
  //const [maintenance, setMaintenance] = useState(false);

useEffect(() => {
  const checkMaintenance = async () => {
    const snap = await getDoc(doc(db, "settings", "maintenance"));
    if (snap.exists() && snap.data().enabled) {
     // setMaintenance(true);
    }
  };

  checkMaintenance();
}, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/decode" element={<Decode />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/history" element={<DreamHistory />} />
        <Route path="/insights" element={<DreamInsights />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/about" element={<About />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/maintenancealert" element={<MaintenanceAlert />} />
        

         {/* Admin routes */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminManageUsers />} />
        <Route path="/admin/user/:id" element={<AdminUserProfile />} />
        <Route path="/admin/dreams" element={<AdminManageDreams />} />
        <Route path="/admin/feedbacks" element={<AdminManageFeedbacks />} />
        <Route path="/admin/maintenance" element={<AdminMaintenance />} />
        <Route path="/admin/analysis" element={<AdminBasicAnalysis />} />
        <Route path="/admin/security" element={<ProtectedRoute> <AdminSecurity /> </ProtectedRoute> } />

        

      {/* User-only routes */}
<Route path="/dashboard" element={
  <ProtectedRoute><Dashboard /></ProtectedRoute>
} />
<Route path="/profile" element={
  <ProtectedRoute><Profile /></ProtectedRoute>
} />
<Route path="/history" element={
  <ProtectedRoute><DreamHistory /></ProtectedRoute>
} />
<Route path="/insights" element={
  <ProtectedRoute><DreamInsights /></ProtectedRoute>
} />
<Route path="/notifications" element={
  <ProtectedRoute><Notifications /></ProtectedRoute>
} />

{/* Decode route: only if not blocked */}
<Route path="/decode" element={
  <ProtectedRoute allowDecode={true}><Decode /></ProtectedRoute>
} />



      </Routes>
    </Router>
  );
}

export default App;
