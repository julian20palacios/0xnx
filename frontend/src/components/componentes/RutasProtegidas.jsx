  // src/components/RutaProtegida.jsx
  import React, { useEffect, useState } from 'react';
  import { Navigate } from 'react-router-dom';

  const RutaProtegida = ({ children }) => {
    const [autenticado, setAutenticado] = useState(null); // null = aún cargando
    const token = localStorage.getItem('access');

    useEffect(() => {
      const verificarToken = async () => {
        if (!token) {
          setAutenticado(false);
          return;
        }

        try {
          const response = await fetch('http://localhost:8000/api/validar-token/', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          setAutenticado(response.ok);
        } catch (error) {
          console.error('Error al verificar el token:', error);
          setAutenticado(false);
        }
      };

      verificarToken();
    }, [token]);

    if (autenticado === null) {
      return <div>Cargando...</div>; // puedes poner un spinner o algo similar
    }

    if (!autenticado) {
      return <Navigate to="/iniciar-sesion" replace />;
    }

    return children;
  };

  export default RutaProtegida;
