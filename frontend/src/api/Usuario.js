// src/api/Usuario.js
// API helpers for user profile data.

const API_URL = import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '');

export const obtenerUsuarioActual = async () => {
  const token = localStorage.getItem('access');
  const response = await fetch(`${API_URL}/usuario/me/`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('No se pudo cargar el usuario.');
  }

  return await response.json(); // { username, email }
};
