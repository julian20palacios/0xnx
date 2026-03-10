// src/components/layout/Footer.jsx
import React from "react";
import "../../styles/Footer.css"; // Importa el CSS

const Footer = () => {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} MiApp - Todos los derechos reservados</p>
    </footer>
  );
};

export default Footer;