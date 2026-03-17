import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "../components/pages/Index";
import IniciarSesion from "../components/pages/IniciarSesion";
import RegistroUser from "../components/pages/RegistroUser";
import AuthenticatedHome from "../components/pages/AuthenticatedHome";
import RutaProtegida from "../components/componentes/RutasProtegidas";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import PrivateLayout from "../components/layout/PrivateLayout";
import Peliculas from "../components/pages/Peliculas";
import ConfiguracionesPerfil from "../components/pages/ConfiguracionesPerfil";
import RecuperarContrasena from "../components/pages/RecuperarContrasena";
import EntrenamientoAdmin from "../components/pages/tutoriales/EntrenamientoAdmin";
import EntrenamientoUser from "../components/pages/tutoriales/EntrenamientoUser";

const Layout = ({ children }) => {
  const location = useLocation();

  const rutasPrivadas = ["/home", "/peliculas", "/configuraciones-perfil", "/admin", "/user"];
  const esRutaPrivada = rutasPrivadas.some((ruta) =>
    location.pathname.startsWith(ruta)
  );

  const rutasFullBleed = ["/", "/iniciar-sesion", "/registro", "/recuperar-contrasena"];
  const esFullBleed = rutasFullBleed.some((ruta) =>
    location.pathname === ruta || location.pathname.startsWith(`${ruta}/`)
  );

  if (esRutaPrivada) {
    return (
      <PrivateLayout>{children}</PrivateLayout>
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
      <Route
        path="/admin/tutoriales"
        element={
          <RutaProtegida roles={["admin"]}>
            <Layout>
              <EntrenamientoAdmin />
            </Layout>
          </RutaProtegida>
        }
      />
      <Route
        path="/user/tutoriales"
        element={
          <RutaProtegida roles={["user"]}>
            <Layout>
              <EntrenamientoUser />
            </Layout>
          </RutaProtegida>
        }
      />
    </Routes>
  </BrowserRouter>
);

export default Rutas;
