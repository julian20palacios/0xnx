// src/api/Login.js
// This file contains the API call for user login.

const API_URL = import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '');

export const loginUsuario = async (email, password) => {
  const response = await fetch(`${API_URL}/login/`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Credenciales incorrectas");
  }

  return await response.json(); // {access, refresh}
};

export const loginGoogle = async (idToken) => {
  const response = await fetch(`${API_URL}/login-google/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id_token: idToken }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.detail || "No se pudo iniciar sesion con Google.");
  }

  return await response.json();
};
