import React from 'react';
import '../../styles/Index.css';

const Peliculas = () => {
  // Array de películas para generar contenido dinámico
  const peliculasDestacadas = [
    {
      titulo: "Dune: Parte Dos",
      año: 2024,
      director: "Denis Villeneuve",
      genero: "Ciencia Ficción",
      sinopsis: "Paul Atreides se une a Chani y los Fremen mientras planea su venganza contra los conspiradores que destruyeron a su familia.",
      rating: 8.9
    },
    {
      titulo: "Oppenheimer",
      año: 2023,
      director: "Christopher Nolan",
      genero: "Drama/Histórico",
      sinopsis: "El físico J. Robert Oppenheimer trabaja con un equipo de científicos durante el Proyecto Manhattan, que condujo al desarrollo de la bomba atómica.",
      rating: 8.5
    },
    {
      titulo: "Pobres Criaturas",
      año: 2023,
      director: "Yorgos Lanthimos",
      genero: "Comedia/Drama",
      sinopsis: "La historia de Bella Baxter, una joven revivida por el brillante y poco ortodoxo científico Dr. Godwin Baxter.",
      rating: 8.2
    },
    {
      titulo: "Killers of the Flower Moon",
      año: 2023,
      director: "Martin Scorsese",
      genero: "Crimen/Drama",
      sinopsis: "Miembros de la tribu Osage son asesinados en Oklahoma durante la década de 1920 después de que se descubriera petróleo en sus tierras.",
      rating: 8.4
    },
    {
      titulo: "Barbie",
      año: 2023,
      director: "Greta Gerwig",
      genero: "Comedia/Aventura",
      sinopsis: "Barbie sufre una crisis existencial y se embarca en una aventura en el mundo real para descubrir el verdadero significado de la existencia.",
      rating: 7.8
    }
  ];

  const proximosEstrenos = [
    "Deadpool 3 - Julio 2024",
    "Joker: Folie à Deux - Octubre 2024",
    "Gladiator 2 - Noviembre 2024",
    "Mufasa: El Rey León - Diciembre 2024",
    "Kraven the Hunter - Agosto 2024"
  ];

  const generos = [
    "Acción", "Aventura", "Ciencia Ficción", "Comedia", 
    "Drama", "Terror", "Suspenso", "Animación", 
    "Documental", "Romance", "Fantasía", "Musical"
  ];

  return (
    <div className="main-content">
      {/* Hero Section */}
      <section className="hero-section" style={styles.heroSection}>
        <h1 style={styles.heroTitle}>🎬 Bienvenido a la Cartelera de Películas</h1>
        <p style={styles.heroText}>
          Descubre las mejores películas, críticas, recomendaciones y todo sobre el séptimo arte.
          Desde los clásicos del cine hasta los últimos estrenos, tenemos todo lo que necesitas
          para alimentar tu pasión por el cine.
        </p>
      </section>

      {/* Películas Destacadas */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>🎥 Películas Destacadas</h2>
        <div style={styles.peliculasGrid}>
          {peliculasDestacadas.map((pelicula, index) => (
            <div key={index} style={styles.peliculaCard}>
              <div style={styles.cardHeader}>
                <h3 style={styles.peliculaTitulo}>{pelicula.titulo}</h3>
                <span style={styles.rating}>⭐ {pelicula.rating}</span>
              </div>
              <div style={styles.peliculaInfo}>
                <p><strong>Año:</strong> {pelicula.año}</p>
                <p><strong>Director:</strong> {pelicula.director}</p>
                <p><strong>Género:</strong> {pelicula.genero}</p>
                <p><strong>Sinopsis:</strong> {pelicula.sinopsis}</p>
              </div>
              <button style={styles.boton}>Ver más</button>
            </div>
          ))}
        </div>
      </section>

      {/* Próximos Estrenos */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>📅 Próximos Estrenos</h2>
        <div style={styles.proximosEstrenosGrid}>
          {proximosEstrenos.map((estreno, index) => (
            <div key={index} style={styles.estrenoCard}>
              <span style={styles.estrenoIcon}>🎞️</span>
              <p style={styles.estrenoTexto}>{estreno}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Géneros */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>🎯 Explorar por Géneros</h2>
        <div style={styles.generosGrid}>
          {generos.map((genero, index) => (
            <div key={index} style={styles.generoCard}>
              <span style={styles.generoNombre}>{genero}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Artículos y Noticias */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>📰 Noticias y Artículos</h2>
        <div style={styles.articulosContainer}>
          <article style={styles.articulo}>
            <h3 style={styles.articuloTitulo}>El renacimiento del cine de ciencia ficción</h3>
            <p style={styles.articuloMeta}>Por María González · 15 mayo 2024 · 5 min lectura</p>
            <p style={styles.articuloContenido}>
              La última década ha visto un resurgimiento espectacular del género de ciencia ficción,
              con películas que no solo exploran efectos visuales impresionantes, sino que también
              abordan temas profundos sobre la naturaleza humana, la tecnología y nuestro lugar en el
              universo. Directores como Denis Villeneuve y Christopher Nolan han elevado el género a
              nuevas alturas, combinando conceptos complejos con narrativas accesibles...
            </p>
            <button style={styles.botonSecundario}>Leer artículo completo</button>
          </article>

          <article style={styles.articulo}>
            <h3 style={styles.articuloTitulo}>Las mejores películas de 2024 hasta ahora</h3>
            <p style={styles.articuloMeta}>Por Carlos Rodríguez · 10 mayo 2024 · 7 min lectura</p>
            <p style={styles.articuloContenido}>
              Estamos casi a mitad de año y ya hemos visto algunos títulos extraordinarios que están
              marcando la pauta para el resto de 2024. Desde secuelas esperadas hasta propuestas
              originales, este año está demostrando ser excepcional para los amantes del cine. Aquí
              presentamos nuestra selección de las mejores películas que han llegado a la pantalla
              grande en los primeros meses del año...
            </p>
            <button style={styles.botonSecundario}>Leer artículo completo</button>
          </article>
        </div>
      </section>

      {/* Footer con información adicional */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.footerSection}>
            <h4 style={styles.footerTitle}>🎬 Sobre Nosotros</h4>
            <p style={styles.footerText}>
              Somos tu fuente confiable de información cinematográfica. Desde reseñas hasta
              noticias, te mantenemos al día con todo lo relacionado al mundo del cine.
            </p>
          </div>
          
          <div style={styles.footerSection}>
            <h4 style={styles.footerTitle}>📞 Contacto</h4>
            <p style={styles.footerText}>Email: info@peliculas.com</p>
            <p style={styles.footerText}>Teléfono: +34 123 456 789</p>
            <p style={styles.footerText}>Dirección: Calle del Cine, 123, Madrid</p>
          </div>
          
          <div style={styles.footerSection}>
            <h4 style={styles.footerTitle}>📱 Síguenos</h4>
            <p style={styles.footerText}>Facebook: /peliculas</p>
            <p style={styles.footerText}>Instagram: @peliculas_oficial</p>
            <p style={styles.footerText}>Twitter: @peliculas</p>
            <p style={styles.footerText}>TikTok: @peliculas</p>
          </div>
        </div>
        
        <div style={styles.copyright}>
          <p>© 2024 Películas.com - Todos los derechos reservados.</p>
          <p>Diseñado con ❤️ para amantes del cine</p>
        </div>
      </footer>
    </div>
  );
};

// Estilos en línea para asegurar que haya scroll
const styles = {
  heroSection: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '60px 40px',
    borderRadius: '10px',
    margin: '20px 0',
    textAlign: 'center'
  },
  heroTitle: {
    fontSize: '2.5rem',
    marginBottom: '20px'
  },
  heroText: {
    fontSize: '1.2rem',
    lineHeight: '1.6',
    maxWidth: '800px',
    margin: '0 auto'
  },
  section: {
    margin: '40px 20px',
    padding: '20px'
  },
  sectionTitle: {
    fontSize: '2rem',
    color: '#333',
    marginBottom: '30px',
    borderBottom: '3px solid #667eea',
    paddingBottom: '10px'
  },
  peliculasGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '25px',
    marginTop: '20px'
  },
  peliculaCard: {
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s ease',
    border: '1px solid #e0e0e0'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px'
  },
  peliculaTitulo: {
    fontSize: '1.3rem',
    color: '#333',
    margin: 0
  },
  rating: {
    backgroundColor: '#ffd700',
    padding: '5px 10px',
    borderRadius: '20px',
    fontSize: '0.9rem',
    fontWeight: 'bold'
  },
  peliculaInfo: {
    lineHeight: '1.8',
    color: '#555'
  },
  boton: {
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
    marginTop: '15px',
    transition: 'background-color 0.3s ease'
  },
  proximosEstrenosGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px'
  },
  estrenoCard: {
    backgroundColor: '#f0f4ff',
    padding: '20px',
    borderRadius: '8px',
    textAlign: 'center'
  },
  estrenoIcon: {
    fontSize: '2rem',
    display: 'block',
    marginBottom: '10px'
  },
  estrenoTexto: {
    fontSize: '1.1rem',
    color: '#333',
    margin: 0
  },
  generosGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '15px'
  },
  generoCard: {
    backgroundColor: '#764ba2',
    color: 'white',
    padding: '20px',
    borderRadius: '8px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'transform 0.3s ease'
  },
  generoNombre: {
    fontSize: '1.1rem',
    fontWeight: 'bold'
  },
  articulosContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  articulo: {
    backgroundColor: '#f9f9f9',
    padding: '25px',
    borderRadius: '10px',
    borderLeft: '4px solid #667eea'
  },
  articuloTitulo: {
    fontSize: '1.4rem',
    color: '#333',
    marginBottom: '10px'
  },
  articuloMeta: {
    color: '#666',
    fontSize: '0.9rem',
    marginBottom: '15px'
  },
  articuloContenido: {
    lineHeight: '1.8',
    color: '#444',
    marginBottom: '20px'
  },
  botonSecundario: {
    backgroundColor: 'transparent',
    color: '#667eea',
    border: '2px solid #667eea',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'all 0.3s ease'
  },
  footer: {
    backgroundColor: '#2c3e50',
    color: 'white',
    padding: '40px 20px 20px',
    marginTop: '40px',
    borderRadius: '10px 10px 0 0'
  },
  footerContent: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '30px',
    marginBottom: '30px'
  },
  footerSection: {
    lineHeight: '1.8'
  },
  footerTitle: {
    fontSize: '1.2rem',
    marginBottom: '15px',
    color: '#ffd700'
  },
  footerText: {
    color: '#ecf0f1',
    margin: '5px 0'
  },
  copyright: {
    textAlign: 'center',
    borderTop: '1px solid #34495e',
    paddingTop: '20px',
    color: '#bdc3c7'
  }
};

export default Peliculas;