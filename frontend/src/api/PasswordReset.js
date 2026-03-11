const API_URL = import.meta.env.VITE_API_BASE_URL.replace(/\/$/, "");

export const requestPasswordReset = async (email) => {
  const response = await fetch(`${API_URL}/password-reset/request/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.detail || "No se pudo enviar el correo.");
  }

  return await response.json();
};

export const verifyPasswordResetCode = async (email, code) => {
  const response = await fetch(`${API_URL}/password-reset/verify/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, code }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.detail || "Codigo incorrecto.");
  }

  return await response.json();
};

export const confirmPasswordReset = async (email, code, newPassword) => {
  const response = await fetch(`${API_URL}/password-reset/confirm/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, code, new_password: newPassword }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    const detail = Array.isArray(data.detail) ? data.detail.join(" ") : data.detail;
    throw new Error(detail || "No se pudo actualizar la contrasena.");
  }

  return await response.json();
};
