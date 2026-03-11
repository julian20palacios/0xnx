import React from "react";
import { usePrivateTheme } from "../../context/PrivateThemeContext";
import "../../styles/ConfiguracionesPerfil.css";

const OPTIONS = [
  {
    id: "white",
    title: "Blanco",
    description: "Fondo claro con texto negro.",
  },
  {
    id: "gray",
    title: "Gris",
    description: "Fondo gris con contraste suave.",
  },
  {
    id: "black",
    title: "Negro",
    description: "Fondo oscuro con texto blanco.",
  },
];

const ConfiguracionesPerfil = () => {
  const { palette, setPalette } = usePrivateTheme();

  return (
    <section className="config-page">
      <header className="config-header">
        <h1>Configuraciones de diseno</h1>
        <p>Selecciona el color base para tu panel.</p>
      </header>

      <div className="config-options" role="list">
        {OPTIONS.map((option) => (
          <button
            key={option.id}
            type="button"
            className={`config-card ${palette === option.id ? "is-active" : ""}`}
            onClick={() => setPalette(option.id)}
            aria-pressed={palette === option.id}
            role="listitem"
          >
            <span className={`config-swatch swatch-${option.id}`} aria-hidden="true" />
            <div className="config-meta">
              <h2 className="config-title">{option.title}</h2>
              <p className="config-desc">{option.description}</p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};

export default ConfiguracionesPerfil;
