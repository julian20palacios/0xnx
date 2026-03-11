import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  confirmPasswordReset,
  requestPasswordReset,
  verifyPasswordResetCode,
} from "../../api/PasswordReset";
import "../../styles/RecuperarContrasena.css";

const RecuperarContrasena = () => {
  const [step, setStep] = useState("request");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [requestStatus, setRequestStatus] = useState("");
  const [actionStatus, setActionStatus] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const headerText = useMemo(() => {
    if (step === "verify") return "Verificar codigo";
    if (step === "reset") return "Restablecer contrasena";
    return "Recuperar contrasena";
  }, [step]);

  const handleRequest = async (event) => {
    event.preventDefault();
    setError("");
    setActionStatus("");

    try {
      const data = await requestPasswordReset(email);
      setRequestStatus(data.detail || "Si el correo existe, revisa tu bandeja.");
      setCode("");
      setNewPassword("");
      setConfirmPassword("");
      setStep("verify");
    } catch (err) {
      setError(err.message || "No se pudo enviar el correo.");
    }
  };

  const handleVerify = async (event) => {
    event.preventDefault();
    setError("");
    setActionStatus("");

    if (!email) {
      setError("Primero ingresa tu correo para recibir el codigo.");
      setStep("request");
      return;
    }

    if (!/^\d{6}$/.test(code)) {
      setError("El codigo debe tener 6 digitos.");
      return;
    }

    try {
      await verifyPasswordResetCode(email, code);
      setStep("reset");
    } catch (err) {
      setError(err.message || "Codigo incorrecto.");
    }
  };

  const handleConfirm = async (event) => {
    event.preventDefault();
    setError("");
    setActionStatus("");

    if (newPassword !== confirmPassword) {
      setError("Las contrasenas no coinciden.");
      return;
    }

    if (!/^\d{6}$/.test(code)) {
      setError("El codigo debe tener 6 digitos.");
      return;
    }

    try {
      const data = await confirmPasswordReset(email, code, newPassword);
      setActionStatus(data.detail || "Contrasena actualizada.");
      setTimeout(() => navigate("/iniciar-sesion"), 800);
    } catch (err) {
      setError(err.message || "No se pudo actualizar la contrasena.");
    }
  };

  return (
    <section className="reset-page">
      <header className="reset-header">
        <h2>{headerText}</h2>
        <p>
          {step === "reset"
            ? "Define una nueva contrasena para tu cuenta."
            : step === "verify"
            ? "Ingresa el codigo de 6 digitos que enviamos a tu correo."
            : "Te enviaremos un codigo de 6 digitos para cambiar tu contrasena."}
        </p>
      </header>

      {step === "verify" ? (
        <form className="reset-form" onSubmit={handleVerify}>
          <label>
            Codigo de 6 digitos
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
              required
            />
          </label>
          {error && <p className="reset-error">{error}</p>}
          <button type="submit">Verificar codigo</button>
          <button
            type="button"
            className="reset-link"
            onClick={() => {
              setError("");
              setActionStatus("");
              setStep("request");
            }}
          >
            Enviar otro codigo
          </button>
        </form>
      ) : step === "reset" ? (
        <form className="reset-form" onSubmit={handleConfirm}>
          <label>
            Nueva contrasena
            <input
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              required
            />
          </label>
          <label>
            Confirmar contrasena
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />
          </label>
          {error && <p className="reset-error">{error}</p>}
          {actionStatus && <p className="reset-status">{actionStatus}</p>}
          <button type="submit">Actualizar contrasena</button>
        </form>
      ) : (
        <form className="reset-form" onSubmit={handleRequest}>
          <label>
            Correo electronico
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          {error && <p className="reset-error">{error}</p>}
          {requestStatus && <p className="reset-status">{requestStatus}</p>}
          <button type="submit">Enviar codigo</button>
        </form>
      )}

      <div className="reset-footer">
        <Link to="/iniciar-sesion">Volver al inicio de sesion</Link>
      </div>
    </section>
  );
};

export default RecuperarContrasena;
