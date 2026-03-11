import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/Sidebar.css";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => setIsCollapsed((prev) => !prev);

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/iniciar-sesion");
  };

  return (
    <aside className={`app-sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <nav className="sidebar-nav">
        <Link to="/home" className="sidebar-item" title="Home">
          <span className="sidebar-emoji">🏠</span>
          <span className="sidebar-label">Home</span>
        </Link>

        <Link to="/peliculas" className="sidebar-item" title="Peliculas">
          <span className="sidebar-emoji">🎬</span>
          <span className="sidebar-label">Peliculas</span>
        </Link>

        <Link to="/configuraciones-perfil" className="sidebar-item" title="Configuraciones">
          <span className="sidebar-emoji">⚙️</span>
          <span className="sidebar-label">Configuraciones</span>
        </Link>

        <button type="button" className="sidebar-item sidebar-logout" onClick={handleLogout}>
          <span className="sidebar-emoji">🚪</span>
          <span className="sidebar-label">Cerrar sesion</span>
        </button>
      </nav>

      <div className="sidebar-footer">
        <button
          type="button"
          className="sidebar-toggle"
          onClick={toggleSidebar}
          aria-label={isCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
        >
          {isCollapsed ? "➡" : "⬅"}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
