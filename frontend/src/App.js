import React from "react";
import { BrowserRouter as Router, Routes, Route, } from "react-router-dom";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import AttendanceDashboard from "./pages/AttendanceDashboard";
import Privacy from "./privacy";


import "./App.css";

export default function App() {

  return (
    <Router>
  <div className="app-container">
    <nav className="navbar">
      <div className="navbar-logo">
        NCE<span style={{ color: "#007185" }}>-Student Attendance</span>
      </div>
    </nav>

    <div className="main-content" style={{ flex: 1 }}>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/attendance" element={<AttendanceDashboard />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </div>

    <footer className="footer">
      &copy; {new Date().getFullYear()} Student Attendance | <a href="/privacy">Privacy Policy</a>
    </footer>
  </div>
</Router>

  );
}
