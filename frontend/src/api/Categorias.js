const API_URL = import.meta.env.VITE_API_BASE_URL.replace(/\/$/, ''); 
const RESOURCE = 'categorias/';

const defaultOptions = () => {
  const token = localStorage.getItem('access');
  return {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  };
};

export const obtenerCategorias = async () => {
  const res = await fetch(`${API_URL}/${RESOURCE}`, {
    ...defaultOptions(),
    method: 'GET',
  });

  if (!res.ok) throw new Error("Error al obtener categorías");
  return await res.json();
};

export const crearCategoria = async (datos) => {
  const res = await fetch(`${API_URL}/${RESOURCE}`, {
    ...defaultOptions(),
    method: 'POST',
    body: JSON.stringify(datos),
  });

  const body = await res.json();

  if (!res.ok) throw new Error(JSON.stringify(body));
  return body;
};

export const actualizarCategoria = async (id, datos) => {
  const res = await fetch(`${API_URL}/${RESOURCE}${id}/`, {
    ...defaultOptions(),
    method: 'PUT',
    body: JSON.stringify(datos),
  });

  if (!res.ok) throw new Error("Error al actualizar categoría");
  return await res.json();
};

export const eliminarCategoria = async (id) => {
  const res = await fetch(`${API_URL}/${RESOURCE}${id}/`, {
    ...defaultOptions(),
    method: 'DELETE',
  });

  if (!res.ok) throw new Error("Error al eliminar categoría");
};
