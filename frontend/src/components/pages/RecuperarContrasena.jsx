import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  confirmPasswordReset,
  requestPasswordReset,
  verifyPasswordResetCode,
} from "../../api/PasswordReset";
import "../../styles/RecuperarContrasena.css";
import login0xnx from "../../assets/images/login0xnx.jpg";

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

  const helperText = useMemo(() => {
    if (step === "reset") return "Define una nueva contrasena para tu cuenta.";
    if (step === "verify") return "Ingresa el codigo de 6 digitos que enviamos a tu correo.";
    return "Te enviaremos un codigo de 6 digitos para cambiar tu contrasena.";
  }, [step]);

  useEffect(() => {
    document.body.classList.add("reset-theme", "dark");
    return () => {
      document.body.classList.remove("reset-theme", "dark");
    };
  }, []);

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
    <div className="reset-page dark" role="main">
      <div className="reset-shell" aria-labelledby="reset-title">
        <aside className="reset-hero" aria-hidden="true">
          <div className="reset-hero__content">
            <div className="reset-hero-title-row">
              <img
                className="reset-hero-avatar"
                src={login0xnx}
                alt="Recuperacion"
                loading="lazy"
              />
            </div>
          </div>
        </aside>

        <main className="reset-card" aria-labelledby="reset-title">
          <div className="reset-card__header">
            <h2 id="reset-title">{headerText}</h2>
            <p>{helperText}</p>
          </div>

          {step === "verify" ? (
            <form className="reset-form" onSubmit={handleVerify} noValidate>
              <label className="reset-field">
                <span>Codigo de 6 digitos</span>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={code}
                  onChange={(event) =>
                    setCode(event.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  placeholder="000000"
                  required
                />
              </label>
              {error && (
                <p className="reset-error" role="alert" aria-live="polite">
                  {error}
                </p>
              )}
              <button type="submit" className="primary-button">
                Verificar codigo
              </button>
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
            <form className="reset-form" onSubmit={handleConfirm} noValidate>
              <label className="reset-field">
                <span>Nueva contrasena</span>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  placeholder="Tu nueva clave"
                  required
                />
              </label>
              <label className="reset-field">
                <span>Confirmar contrasena</span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Repite tu clave"
                  required
                />
              </label>
              {error && (
                <p className="reset-error" role="alert" aria-live="polite">
                  {error}
                </p>
              )}
              {actionStatus && (
                <p className="reset-status" role="status" aria-live="polite">
                  {actionStatus}
                </p>
              )}
              <button type="submit" className="primary-button">
                Actualizar contrasena
              </button>
            </form>
          ) : (
            <form className="reset-form" onSubmit={handleRequest} noValidate>
              <label className="reset-field">
                <span>Correo electronico</span>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="nombre@empresa.com"
                autoComplete="email"
                required
              />
              </label>
              {error && (
                <p className="reset-error" role="alert" aria-live="polite">
                  {error}
                </p>
              )}
              {requestStatus && (
                <p className="reset-status" role="status" aria-live="polite">
                  {requestStatus}
                </p>
              )}
              <button type="submit" className="primary-button">
                Enviar codigo
              </button>
            </form>
          )}

          <div className="reset-footer">
            <Link to="/iniciar-sesion">Volver al inicio de sesion</Link>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RecuperarContrasena;
