import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Dashboard as home */}
        <Route path="/" element={<Dashboard />} />

        {/* Explicit dashboard route (optional alias) */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Register page */}
        <Route path="/register" element={<Register />} />

        {/* Fallback */}
        <Route path="*" element={<h2 style={{ textAlign: "center", marginTop: "40px" }}>404 - Page Not Found</h2>} />
      </Routes>
    </Router>
  );
}
