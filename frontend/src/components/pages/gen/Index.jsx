import React from 'react';
import "../../../styles/IndexHome.css";

const Index = () => {
  return (
    <div className="index-home">
      <section className="slice hero-slice">
        <div className="slice-content">
          <p className="eyebrow">Gimbarr • Street Workout</p>
          <h1>
            Entrena con calle, ritmo y comunidad.
            <span>Tu progreso se ve en la barra.</span>
          </h1>
          <p className="hero-subtitle">
            Calistenia real, gimbarr y street workout. Rutinas con progresiones,
            retos semanales y seguimiento claro. No es un gimnasio, es calle con método.
          </p>
          <div className="hero-actions">
            <a className="btn primary" href="/iniciar-sesion">Iniciar sesión</a>
            <a className="btn ghost" href="/registro">Registrarse</a>
          </div>
          <div className="hero-tags">
            <span>Calistenia</span>
            <span>Freestyle</span>
            <span>Street Workout</span>
            <span>Gimbarr</span>
          </div>
        </div>
        <div className="hero-visual">
          <div className="orb large" />
          <div className="orb mid" />
          <div className="orb small" />
          <div className="bar-card">
            <p className="card-label">Plan semanal</p>
            <h3>Dominadas + flujo</h3>
            <p className="card-subtitle">Fuerza, control y estilo en 45 min</p>
            <div className="card-metrics">
              <div>
                <span className="metric-value">+30</span>
                <span className="metric-label">rutinas</span>
              </div>
              <div>
                <span className="metric-value">4</span>
                <span className="metric-label">niveles</span>
              </div>
              <div>
                <span className="metric-value">24/7</span>
                <span className="metric-label">acceso</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="slice split-slice">
        <div className="slice-content">
          <p className="eyebrow">Bloques de progreso</p>
          <h2>Programas con intención</h2>
          <p>
            Entrenamiento por objetivos: fuerza base, combos de barras, movilidad y flow.
            Cada bloque tiene métricas claras y progresiones reales.
          </p>
          <div className="cta-row">
            <a className="btn dark" href="/iniciar-sesion">Ver programas</a>
            <span className="muted">Actualizado cada semana</span>
          </div>
        </div>
        <div className="stack-cards">
          <div className="mini-card">
            <h4>Fuerza urbana</h4>
            <p>Dominadas, dips, holds y negatives con progresiones seguras.</p>
          </div>
          <div className="mini-card">
            <h4>Flow & freestyle</h4>
            <p>Transiciones limpias, combos y control corporal en barras.</p>
          </div>
          <div className="mini-card">
            <h4>Movilidad real</h4>
            <p>Hombro, muñeca y core para desbloquear nuevos movimientos.</p>
          </div>
        </div>
      </section>

      <section className="slice stats-slice">
        <div className="slice-content">
          <p className="eyebrow">Resultados visibles</p>
          <h2>Seguimiento simple, progreso real</h2>
          <p>
            Marca repeticiones, guarda tus rutinas y mide tu evolución con reportes claros.
            No más entrenar a ciegas.
          </p>
        </div>
        <div className="stats-grid">
          <div className="stat-card">
            <span className="metric-value">12</span>
            <p>semanas de base</p>
          </div>
          <div className="stat-card">
            <span className="metric-value">5</span>
            <p>retos por temporada</p>
          </div>
          <div className="stat-card">
            <span className="metric-value">+120</span>
            <p>movimientos guiados</p>
          </div>
        </div>
      </section>

      <section className="slice spotlight-slice">
        <div className="slice-content">
          <p className="eyebrow">Comunidad</p>
          <h2>Entrena en equipo</h2>
          <p>
            Retiros, eventos y sesiones abiertas. Aquí se celebra cada logro,
            grande o pequeño, con feedback directo.
          </p>
        </div>
        <div className="spotlight-grid">
          <div className="spotlight-card">
            <p className="card-label">Sesiones</p>
            <h3>AM • PM</h3>
            <p className="card-subtitle">Horarios flexibles por nivel</p>
          </div>
          <div className="spotlight-card">
            <p className="card-label">Eventos</p>
            <h3>Batallas</h3>
            <p className="card-subtitle">Retos mensuales y jams</p>
          </div>
          <div className="spotlight-card">
            <p className="card-label">Soporte</p>
            <h3>Feedback</h3>
            <p className="card-subtitle">Correcciones directas en técnica</p>
          </div>
        </div>
      </section>

      <section className="slice cta-slice">
        <div className="slice-content">
          <h2>Empieza hoy</h2>
          <p>Únete a Gimbarr y entrena con estructura, ritmo y comunidad real.</p>
        </div>
        <div className="hero-actions">
          <a className="btn primary" href="/registro">Crear cuenta</a>
          <a className="btn ghost" href="/iniciar-sesion">Ya tengo cuenta</a>
        </div>
      </section>
    </div>
  );
};

export default Index;


