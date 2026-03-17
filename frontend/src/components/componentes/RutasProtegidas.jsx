// src/components/RutaProtegida.jsx
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import AccesoDenegado from '../pages/AccesoDenegado';
import PrivateLayout from '../layout/PrivateLayout';
import { useAuth } from '../../context/AuthContext';

const API_URL = import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '');

const RutaProtegida = ({ children, roles }) => {
  const [autenticado, setAutenticado] = useState(null); // null = aun cargando
  const [autorizado, setAutorizado] = useState(null);
  const token = localStorage.getItem('access');
  const { role, roleLoading, refreshRole, refreshUser } = useAuth();

  useEffect(() => {
    const verificarToken = async () => {
      if (!token) {
        setAutenticado(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/validar-token/`, {
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

  useEffect(() => {
    const verificarRol = async () => {
      if (!roles || !roles.length) {
        setAutorizado(true);
        return;
      }
      if (!token) {
        setAutorizado(false);
        return;
      }
      if (roleLoading) {
        setAutorizado(null);
        return;
      }
      if (role === 'admin') {
        setAutorizado(true);
        return;
      }
      setAutorizado(Boolean(role && roles.includes(role)));
    };

    if (autenticado) {
      verificarRol();
    }
    if (autenticado === false) {
      setAutorizado(false);
    }
  }, [roles, token, autenticado, role, roleLoading]);

  useEffect(() => {
    if (token) {
      refreshRole();
      refreshUser();
    }
  }, [token, refreshRole, refreshUser]);

  if (autenticado === null || (roles && autorizado === null)) {
    return <div>Cargando...</div>; // puedes poner un spinner o algo similar
  }

  if (!autenticado) {
    return <Navigate to="/iniciar-sesion" replace />;
  }

  if (roles && !autorizado) {
    return (
      <PrivateLayout>
        <AccesoDenegado />
      </PrivateLayout>
    );
  }

  return children;
};

export default RutaProtegida;
