import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/Sidebar.css";
import login0xnx from "../../assets/images/login0xnx.jpg";
import { getCalificarPath, getProgresoPath, getTutorialesPath } from "../../utils/rolePaths";
import { useAuth } from "../../context/AuthContext";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openSections, setOpenSections] = useState({
    home: false,
    peliculas: false,
    configuraciones: false,
  });
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 768px)");
    const syncCollapse = () => {
      const mobile = mq.matches;
      setIsMobile(mobile);
      if (mobile) {
        setIsMobileOpen(false);
        setIsCollapsed(false);
      }
    };
    syncCollapse();
    if (mq.addEventListener) {
      mq.addEventListener("change", syncCollapse);
      return () => mq.removeEventListener("change", syncCollapse);
    }
    mq.addListener(syncCollapse);
    return () => mq.removeListener(syncCollapse);
  }, []);

  const { role, clearRole } = useAuth();

  const toggleSidebar = () => setIsCollapsed((prev) => !prev);
  const toggleMobileSidebar = () => setIsMobileOpen((prev) => !prev);
  const toggleSection = (key) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  const toggleProfileMenu = () => setProfileOpen((prev) => !prev);

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    clearRole();
    navigate("/iniciar-sesion");
  };

  const isSidebarVisible = !isMobile || isMobileOpen;
  const tutorialesPath = getTutorialesPath(role);
  const calificarPath = getCalificarPath(role);
  const progresoPath = getProgresoPath(role);

  return (
    <>
      {isMobile && (
        <div className="sidebar-mobile-bar">
          <span className="sidebar-mobile-title">SideBar</span>
          <button
            type="button"
            className="sidebar-mobile-trigger"
            onClick={toggleMobileSidebar}
            aria-expanded={isMobileOpen}
          >
            {isMobileOpen ? "Ocultar sidebar" : "Mostrar sidebar"}
          </button>
        </div>
      )}

      {isMobile && isMobileOpen && (
        <button
          type="button"
          className="sidebar-backdrop"
          onClick={toggleMobileSidebar}
          aria-label="Cerrar menu"
        />
      )}

      <aside
        className={`app-sidebar ${!isMobile && isCollapsed ? "collapsed" : ""} ${
          !isSidebarVisible ? "is-hidden" : ""
        }`}
      >
        <nav className="sidebar-nav">
          <p className="sidebar-section-title">Plataforma</p>
          <div className={`sidebar-group ${openSections.home ? "is-open" : ""}`}>
            <button
              type="button"
              className="sidebar-item sidebar-item--parent"
              onClick={() => toggleSection("home")}
              aria-expanded={openSections.home}
            >
              <span className="sidebar-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" role="img" focusable="false">
                  <path
                    d="M4 11.5L12 5l8 6.5V20a1 1 0 0 1-1 1h-5.5v-6.5h-3V21H5a1 1 0 0 1-1-1v-8.5Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="sidebar-label">Home</span>
              <span className="sidebar-chevron" aria-hidden="true">
                <svg className="sidebar-chevron-icon" viewBox="0 0 24 24" role="img" focusable="false">
                  <path
                    d="M9 6l6 6-6 6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </button>
            <div className="sidebar-submenu">
              <Link to="/home" className="sidebar-subitem">Dashboard</Link>
              <Link to="/home" className="sidebar-subitem">Actividad</Link>
              <Link to="/home" className="sidebar-subitem">Resumen</Link>
            </div>
          </div>

          <div className={`sidebar-group ${openSections.peliculas ? "is-open" : ""}`}>
            <button
              type="button"
              className="sidebar-item sidebar-item--parent"
              onClick={() => toggleSection("peliculas")}
              aria-expanded={openSections.peliculas}
            >
              <span className="sidebar-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" role="img" focusable="false">
                  <path
                    d="M5 6h14v12H5z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8 9h8M8 12h8M8 15h5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <span className="sidebar-label">Tutoriales</span>
              <span className="sidebar-chevron" aria-hidden="true">
                <svg className="sidebar-chevron-icon" viewBox="0 0 24 24" role="img" focusable="false">
                  <path
                    d="M9 6l6 6-6 6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </button>
            <div className="sidebar-submenu">
              {tutorialesPath ? (
                <Link to={tutorialesPath} className="sidebar-subitem">Tutoriales</Link>
              ) : (
                <button type="button" className="sidebar-subitem" disabled aria-disabled="true">
                  Tutoriales
                </button>
              )}
              {calificarPath ? (
                <Link to={calificarPath} className="sidebar-subitem">Calificar</Link>
              ) : (
                <button type="button" className="sidebar-subitem" disabled aria-disabled="true">
                  Calificar
                </button>
              )}
              {progresoPath ? (
                <Link to={progresoPath} className="sidebar-subitem">Progreso</Link>
              ) : (
                <button type="button" className="sidebar-subitem" disabled aria-disabled="true">
                  Progreso
                </button>
              )}
            </div>
          </div>

          <div className={`sidebar-group ${openSections.configuraciones ? "is-open" : ""}`}>
            <button
              type="button"
              className="sidebar-item sidebar-item--parent"
              onClick={() => toggleSection("configuraciones")}
              aria-expanded={openSections.configuraciones}
            >
              <span className="sidebar-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" role="img" focusable="false">
                  <path
                    d="M12 8.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                  <path
                    d="M4.5 12l1.6-.4a6.7 6.7 0 0 1 .6-1.5L5.7 8.7l1.7-1.7 1.4 1a6.7 6.7 0 0 1 1.6-.6L11 5.5h2l.4 1.6a6.7 6.7 0 0 1 1.6.6l1.4-1 1.7 1.7-1 1.4c.25.5.45 1 .6 1.6l1.6.4v2l-1.6.4a6.7 6.7 0 0 1-.6 1.6l1 1.4-1.7 1.7-1.4-1a6.7 6.7 0 0 1-1.6.6L13 18.5h-2l-.4-1.6a6.7 6.7 0 0 1-1.6-.6l-1.4 1-1.7-1.7 1-1.4a6.7 6.7 0 0 1-.6-1.6L4.5 14v-2Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="sidebar-label">Configuraciones</span>
              <span className="sidebar-chevron" aria-hidden="true">
                <svg className="sidebar-chevron-icon" viewBox="0 0 24 24" role="img" focusable="false">
                  <path
                    d="M9 6l6 6-6 6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </button>
            <div className="sidebar-submenu">
              <Link to="/configuraciones-perfil" className="sidebar-subitem">Perfil</Link>
              <Link to="/configuraciones-perfil" className="sidebar-subitem">Seguridad</Link>
            </div>
          </div>

          <p className="sidebar-section-title">Proyectos</p>
          <Link to="/proyectos/diseno" className="sidebar-item">
            <span className="sidebar-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" role="img" focusable="false">
                <path
                  d="M6 4v16M4 6h16M4 12h16M4 18h16M18 4v16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <span className="sidebar-label">Design Engineering</span>
          </Link>
          <Link to="/proyectos/marketing" className="sidebar-item">
            <span className="sidebar-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" role="img" focusable="false">
                <path
                  d="M4 10h6l7-4v12l-7-4H4z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
                <path
                  d="M6 14v4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <span className="sidebar-label">Sales & Marketing</span>
          </Link>

          <button type="button" className="sidebar-item sidebar-logout" onClick={handleLogout}>
            <span className="sidebar-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" role="img" focusable="false">
                <path
                  d="M5 4h9a2 2 0 0 1 2 2v3.5m0 5V18a2 2 0 0 1-2 2H5z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 12h7m0 0-2.5-2.5M19 12l-2.5 2.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="sidebar-label">Cerrar sesion</span>
          </button>
        </nav>

        <div className="sidebar-profile">
          <button
            type="button"
            className="sidebar-profile-btn"
            onClick={toggleProfileMenu}
            aria-expanded={profileOpen}
          >
            <img className="sidebar-profile-avatar" src={login0xnx} alt="Usuario" />
            <div className="sidebar-profile-meta">
              <span className="sidebar-profile-name">julixn</span>
              <span className="sidebar-profile-email">julixn@gmail.com</span>
            </div>
            <span className="sidebar-profile-chevron" aria-hidden="true">
              <svg viewBox="0 0 24 24" role="img" focusable="false">
                <path
                  d={profileOpen ? "M6 15l6-6 6 6" : "M6 9l6 6 6-6"}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </button>

          {profileOpen && (
            <div className="sidebar-menu" role="menu">
              <button type="button" className="sidebar-menu-item" role="menuitem">
                <span className="sidebar-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" role="img" focusable="false">
                    <path
                      d="M12 4l1.7 4.5L18 10l-4.3 1.5L12 16l-1.7-4.5L6 10l4.3-1.5L12 4Z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                Upgrade to Pro
              </button>
              <button type="button" className="sidebar-menu-item" role="menuitem">
                <span className="sidebar-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" role="img" focusable="false">
                    <path
                      d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm-7 8a7 7 0 0 1 14 0"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                Account
              </button>
              <button type="button" className="sidebar-menu-item" role="menuitem">
                <span className="sidebar-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" role="img" focusable="false">
                    <path
                      d="M5 7h14v10H5z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                    />
                    <path
                      d="M5 10h14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                    />
                  </svg>
                </span>
                Billing
              </button>
              <button type="button" className="sidebar-menu-item" role="menuitem">
                <span className="sidebar-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" role="img" focusable="false">
                    <path
                      d="M12 4a6 6 0 0 1 6 6v3l2 3H4l2-3v-3a6 6 0 0 1 6-6Z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9.5 18a2.5 2.5 0 0 0 5 0"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                Notifications
              </button>
              <button
                type="button"
                className="sidebar-menu-item sidebar-menu-item--danger"
                role="menuitem"
                onClick={handleLogout}
              >
                <span className="sidebar-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" role="img" focusable="false">
                    <path
                      d="M5 4h9a2 2 0 0 1 2 2v3.5m0 5V18a2 2 0 0 1-2 2H5z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 12h7m0 0-2.5-2.5M19 12l-2.5 2.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                Log out
              </button>
            </div>
          )}
        </div>

        {!isMobile && (
          <div className="sidebar-footer">
            <button
              type="button"
              className="sidebar-toggle"
              onClick={toggleSidebar}
              aria-label={isCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
            >
              ?
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
