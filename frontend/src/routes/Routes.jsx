import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "../components/pages/Index";
import IniciarSesion from "../components/pages/IniciarSesion";
import AuthenticatedHome from "../components/pages/AuthenticatedHome";
import RutaProtegida from "../components/componentes/RutasProtegidas";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import Footer from "../components/layout/Footer";
import Peliculas from "../components/pages/Peliculas";
import { PrivateThemeProvider, usePrivateTheme } from "../context/PrivateThemeContext";

const PrivateLayoutContent = ({ children }) => {
  const { mode } = usePrivateTheme();

  return (
    <div className={`layout private-layout private-theme private-theme-${mode}`} style={{ minHeight: "100dvh" }}>
      <div
        className="private-shell"
        style={{ display: "flex", minHeight: "100dvh", width: "100%", overflowX: "hidden", alignItems: "stretch" }}
      >
        <Sidebar />
        <div className="content-area" style={{ flex: 1, minWidth: 0 }}>
          <main className="private-main" style={{ minHeight: "100%", minWidth: 0 }}>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

const Layout = ({ children }) => {
  const location = useLocation();

  const rutasPrivadas = ["/home", "/peliculas"];
  const esRutaPrivada = rutasPrivadas.some((ruta) =>
    location.pathname.startsWith(ruta)
  );

  if (esRutaPrivada) {
    return (
      <PrivateThemeProvider>
        <PrivateLayoutContent>{children}</PrivateLayoutContent>
      </PrivateThemeProvider>
    );
  }

  return (
    <div className="layout">
      <Navbar />
      <div className="content-area" style={{ display: "flex" }}>
        <main style={{ flex: 1 }}>{children}</main>
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
    </Routes>
  </BrowserRouter>
);

export default Rutas;
