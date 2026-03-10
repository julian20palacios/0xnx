import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/Sidebar.css";
import { usePrivateTheme } from "../../context/PrivateThemeContext";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const { mode, setTheme } = usePrivateTheme();

  const toggleSidebar = () => setIsCollapsed((prev) => !prev);

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/iniciar-sesion");
  };

  const toggleThemeMode = () => {
    setTheme(mode === "dark" ? "light" : "dark");
  };

  return (
    <aside className={`app-sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-top">
        {isCollapsed ? (
          <button
            type="button"
            className="theme-btn-single"
            onClick={toggleThemeMode}
            aria-label={mode === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
            title={mode === "dark" ? "Modo oscuro" : "Modo claro"}
          >
            {mode === "dark" ? "🌙" : "☀️"}
          </button>
        ) : (
          <div className={`theme-switcher mode-${mode}`} role="group" aria-label="Modo de color">
            <button
              type="button"
              className={`theme-btn ${mode === "dark" ? "active" : ""}`}
              onClick={() => setTheme("dark")}
              aria-label="Modo oscuro"
              title="Modo oscuro"
            >
              🌙
            </button>
            <button
              type="button"
              className={`theme-btn ${mode === "light" ? "active" : ""}`}
              onClick={() => setTheme("light")}
              aria-label="Modo claro"
              title="Modo claro"
            >
              ☀️
            </button>
            <span className="theme-thumb" aria-hidden="true" />
          </div>
        )}
      </div>

      <nav className="sidebar-nav">
        <Link to="/home" className="sidebar-item" title="Home">
          <span className="sidebar-emoji">🏠</span>
          <span className="sidebar-label">Home</span>
        </Link>

        <Link to="/peliculas" className="sidebar-item" title="Peliculas">
          <span className="sidebar-emoji">🎬</span>
          <span className="sidebar-label">Peliculas</span>
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
