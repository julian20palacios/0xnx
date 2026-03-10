// src/components/layout/Navbar.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/NavHome.css";

const NavHome = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    navigate('/iniciar-sesion');
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/home">Plantilla</Link>
      </div>

      <div className={`navbar-links ${menuOpen ? "open" : ""}`}>
        <Link to="/home">Dashboard</Link>
        <Link to="/peliculas">Películas</Link>
        <button onClick={handleLogout} className="navbar-link-button">
          Cerrar sesión
        </button>
      </div>

      <div className="navbar-toggle" onClick={toggleMenu}>
        ☰
      </div>
    </nav>
  );
};

export default NavHome;
