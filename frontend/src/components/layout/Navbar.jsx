// src/components/layout/Navbar.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/Nabvar.css";


const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">Plantilla</Link>
      </div>

      <div className={`navbar-links ${menuOpen ? "open" : ""}`}>
        <Link to="/">Inicio</Link>
        <Link to="/iniciar-sesion">Iniciar Sesión</Link>
        <Link to="/home">Dashboard</Link>
      </div>

      <div className="navbar-toggle" onClick={toggleMenu}>
        ☰
      </div>
    </nav>
  );
};

export default Navbar;
