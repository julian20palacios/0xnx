const API_URL = import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '');

export const registrarUsuario = async (datos) => {
  const res = await fetch(`${API_URL}/register-form/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(datos),
  });

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    const mensaje = body?.detail || JSON.stringify(body);
    throw new Error(mensaje || 'Error al registrar');
  }

  return body;
};
