import React from "react";
import { Link } from "react-router-dom";
import "../../../../styles/tutoriales/BannerEntrenamiento.css";

const categorias = [
  { label: "Yoyos", path: "/tutoriales/categorias/yoyos" },
  { label: "Ceros", path: "/tutoriales/categorias/ceros" },
  { label: "Giros", path: "/tutoriales/categorias/giros" },
  { label: "Fuerza", path: "/tutoriales/categorias/fuerza" },
  { label: "Entradas", path: "/tutoriales/categorias/entradas" },
];

const BannerEntrenamiento = () => {
  return (
    <section className="banner-training">
      <div className="banner-training__container">
        <header className="banner-training__hero">
          <div className="banner-training__hero-content">
            <h1 className="banner-training__title">Categorias</h1>
            <p className="banner-training__subtitle">Texto para modificar</p>
          </div>
          <div className="banner-training__hero-glow" aria-hidden="true" />
        </header>

        <div className="banner-training__cards" aria-label="Categorias disponibles">
          {categorias.map((categoria) => (
            <Link
              key={categoria.label}
              to={categoria.path}
              className="banner-training__card"
            >
              <span className="banner-training__card-label">{categoria.label}</span>
            </Link>
          ))}
        </div>

        <section className="banner-training__list">
          <h2>Lista general</h2>
          <p>Otro texto para modificar</p>
          <Link to="/tutoriales/categorias/general" className="banner-training__cta">
            Listado General
          </Link>
        </section>
      </div>
    </section>
  );
};

export default BannerEntrenamiento;
