import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "../components/pages/gen/Index";
import IniciarSesion from "../components/pages/gen/IniciarSesion";
import RegistroUser from "../components/pages/gen/RegistroUser";
import AuthenticatedHome from "../components/pages/gen/AuthenticatedHome";
import RutaProtegida from "../components/componentes/RutasProtegidas";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import PrivateLayout from "../components/layout/PrivateLayout";
import Peliculas from "../components/pages/gen/Peliculas";
import ConfiguracionesPerfil from "../components/pages/gen/ConfiguracionesPerfil";
import RecuperarContrasena from "../components/pages/gen/RecuperarContrasena";
import EntrenamientoAdmin from "../components/pages/admin/tutoriales/EntrenamientoAdmin";
import EntrenamientoUser from "../components/pages/user/tutoriales/EntrenamientoUser";
import BannerEntrenamiento from "../components/pages/user/tutoriales/BannerEntrenamiento";
import XCeros from "../components/pages/user/tutoriales/XCeros";
import XEntradas from "../components/pages/user/tutoriales/XEntradas";
import XFuerza from "../components/pages/user/tutoriales/XFuerza";
import XGiros from "../components/pages/user/tutoriales/XGiros";
import XYoyos from "../components/pages/user/tutoriales/XYoyos";

const Layout = ({ children }) => {
  const location = useLocation();

  const rutasPrivadas = ["/home", "/peliculas", "/configuraciones-perfil", "/admin", "/user", "/tutoriales"];
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
        path="/tutoriales/categorias/general"
        element={
          <RutaProtegida roles={["user"]}>
            <Layout>
              <EntrenamientoUser />
            </Layout>
          </RutaProtegida>
        }
      />
      <Route
        path="/tutoriales/categorias"
        element={
          <RutaProtegida>
            <Layout>
              <BannerEntrenamiento />
            </Layout>
          </RutaProtegida>
        }
      />
      <Route
        path="/tutoriales/categorias/ceros"
        element={
          <RutaProtegida>
            <Layout>
              <XCeros />
            </Layout>
          </RutaProtegida>
        }
      />
      <Route
        path="/tutoriales/categorias/entradas"
        element={
          <RutaProtegida>
            <Layout>
              <XEntradas />
            </Layout>
          </RutaProtegida>
        }
      />
      <Route
        path="/tutoriales/categorias/fuerza"
        element={
          <RutaProtegida>
            <Layout>
              <XFuerza />
            </Layout>
          </RutaProtegida>
        }
      />
      <Route
        path="/tutoriales/categorias/giros"
        element={
          <RutaProtegida>
            <Layout>
              <XGiros />
            </Layout>
          </RutaProtegida>
        }
      />
      <Route
        path="/tutoriales/categorias/yoyos"
        element={
          <RutaProtegida>
            <Layout>
              <XYoyos />
            </Layout>
          </RutaProtegida>
        }
      />
    </Routes>
  </BrowserRouter>
);

export default Rutas;
