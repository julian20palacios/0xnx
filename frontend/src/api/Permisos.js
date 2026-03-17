const API_URL = import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '');

const defaultOptions = () => {
  const token = localStorage.getItem('access');
  return {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  };
};

export const obtenerPermisosUsuario = async () => {
  const res = await fetch(`${API_URL}/permisos/usuario/`, {
    ...defaultOptions(),
    method: 'GET',
  });

  if (!res.ok) throw new Error('Error al obtener permisos de usuario');
  return await res.json();
};
