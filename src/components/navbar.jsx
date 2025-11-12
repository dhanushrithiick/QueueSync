import React from "react";
import { Link } from "react-router-dom";
import "../stylesheets/navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="brand">
          Queue<span>Sync</span>
        </Link>
      </div>

      <div className="navbar-right">
        <Link to="/register" className="join-btn">
          Join Queue
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
