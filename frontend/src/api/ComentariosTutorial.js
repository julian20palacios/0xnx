const API_URL = import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '');
const RESOURCE = 'comentarios-tutoriales/';

const defaultOptions = () => {
  const token = localStorage.getItem('access');
  return {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  };
};

export const obtenerComentariosTutorial = async (jugadaId) => {
  const query = jugadaId ? `?jugada=${jugadaId}` : '';
  const res = await fetch(`${API_URL}/${RESOURCE}${query}`, {
    ...defaultOptions(),
    method: 'GET',
  });

  if (!res.ok) throw new Error('Error al obtener comentarios');
  return await res.json();
};

export const crearComentarioTutorial = async (datos) => {
  const res = await fetch(`${API_URL}/${RESOURCE}`, {
    ...defaultOptions(),
    method: 'POST',
    body: JSON.stringify(datos),
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const detail = body.detail || 'No se pudo guardar la calificacion.';
    throw new Error(detail);
  }
  return body;
};

export const actualizarComentarioTutorial = async (id, datos) => {
  const res = await fetch(`${API_URL}/${RESOURCE}${id}/`, {
    ...defaultOptions(),
    method: 'PATCH',
    body: JSON.stringify(datos),
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const detail = body.detail || 'No se pudo actualizar el comentario.';
    throw new Error(detail);
  }
  return body;
};
