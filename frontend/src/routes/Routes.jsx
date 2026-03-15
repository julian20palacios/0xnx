import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "../components/pages/Index";
import IniciarSesion from "../components/pages/IniciarSesion";
import RegistroUser from "../components/pages/RegistroUser";
import AuthenticatedHome from "../components/pages/AuthenticatedHome";
import RutaProtegida from "../components/componentes/RutasProtegidas";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import Footer from "../components/layout/Footer";
import Peliculas from "../components/pages/Peliculas";
import ConfiguracionesPerfil from "../components/pages/ConfiguracionesPerfil";
import RecuperarContrasena from "../components/pages/RecuperarContrasena";

const PrivateLayoutContent = ({ children }) => (
  <div className="layout private-layout private-theme private-theme-black" style={{ minHeight: "100dvh" }}>
    <div
      className="private-shell"
      style={{ display: "flex", minHeight: "100dvh", width: "100%", overflowX: "hidden", alignItems: "stretch" }}
    >
      <Sidebar />
      <div className="content-area" style={{ flex: 1, minWidth: 0 }}>
        <main className="private-main app-main" style={{ minHeight: "100%", minWidth: 0 }}>
          {children}
        </main>
      </div>
    </div>
  </div>
);

const Layout = ({ children }) => {
  const location = useLocation();

  const rutasPrivadas = ["/home", "/peliculas", "/configuraciones-perfil"];
  const esRutaPrivada = rutasPrivadas.some((ruta) =>
    location.pathname.startsWith(ruta)
  );

  const rutasFullBleed = ["/", "/iniciar-sesion", "/registro", "/recuperar-contrasena"];
  const esFullBleed = rutasFullBleed.some((ruta) =>
    location.pathname === ruta || location.pathname.startsWith(`${ruta}/`)
  );

  if (esRutaPrivada) {
    return (
      <PrivateLayoutContent>{children}</PrivateLayoutContent>
    );
  }

  return (
    <div className={`layout${esFullBleed ? " layout--flush" : ""}`}>
      <Navbar />
      <div className="content-area" style={{ display: "flex" }}>
        <main className="app-main" style={{ flex: 1 }}>
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};

const Rutas = () => (
  <BrowserRouter>
    <Routes>
      <Route
        path="/"
        element={
          <Layout>
            <Index />
          </Layout>
        }
      />
      <Route
        path="/iniciar-sesion"
        element={
          <Layout>
            <IniciarSesion />
          </Layout>
        }
      />
      <Route
        path="/registro"
        element={
          <Layout>
            <RegistroUser />
          </Layout>
        }
      />
      <Route
        path="/recuperar-contrasena"
        element={
          <Layout>
            <RecuperarContrasena />
          </Layout>
        }
      />
      <Route
        path="/home"
        element={
          <RutaProtegida>
            <Layout>
              <AuthenticatedHome />
            </Layout>
          </RutaProtegida>
        }
      />
      <Route
        path="/peliculas"
        element={
          <RutaProtegida>
            <Layout>
              <Peliculas />
            </Layout>
          </RutaProtegida>
        }
      />
      <Route
        path="/configuraciones-perfil"
        element={
          <RutaProtegida>
            <Layout>
              <ConfiguracionesPerfil />
            </Layout>
          </RutaProtegida>
        }
      />
    </Routes>
  </BrowserRouter>
);

export default Rutas;
