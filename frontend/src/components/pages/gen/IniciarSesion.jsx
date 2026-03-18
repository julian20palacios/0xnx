import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginGoogle, loginUsuario } from '../../../api/Login';
import "../../../styles/InicioSesion.css";
import login0xnx from "../../../assets/images/login0xnx.jpg";
import { useAuth } from '../../../context/AuthContext';

const IniciarSesion = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { refreshRole, refreshUser } = useAuth();
  const googleButtonRef = useRef(null);
  const googleInitialized = useRef(false);
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await loginUsuario(email.trim(), password);
      localStorage.setItem('access', data.access);
      localStorage.setItem('refresh', data.refresh);
      await Promise.all([refreshRole(), refreshUser()]);
      navigate('/home');
    } catch (err) {
      setError('Correo o contraseña incorrectos');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleCredential = async (response) => {
    setError('');
    if (!response?.credential) {
      setError('No se recibió credencial de Google.');
      return;
    }
    setLoading(true);
    try {
      const data = await loginGoogle(response.credential);
      localStorage.setItem('access', data.access);
      localStorage.setItem('refresh', data.refresh);
      await Promise.all([refreshRole(), refreshUser()]);
      navigate('/home');
    } catch (err) {
      setError(err?.message || 'No se pudo iniciar sesión con Google.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.body.classList.add('login-theme', 'dark');
    return () => {
      document.body.classList.remove('login-theme', 'dark');
    };
  }, []);

  useEffect(() => {
    if (!googleClientId || !googleButtonRef.current) return;

    const initGoogle = () => {
      if (!window.google || !googleButtonRef.current) return false;
      if (!googleInitialized.current) {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleGoogleCredential,
        });
        googleInitialized.current = true;
      }
      const containerWidth = Math.floor(
        googleButtonRef.current.getBoundingClientRect().width || 0
      );
      const buttonWidth = Math.min(400, Math.max(260, containerWidth));
      googleButtonRef.current.innerHTML = '';
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: 'filled_black',
        size: 'large',
        text: 'continue_with',
        shape: 'pill',
        width: buttonWidth,
      });
      return true;
    };

    if (initGoogle()) return;
    const timer = setInterval(() => {
      if (initGoogle()) clearInterval(timer);
    }, 300);
    const handleResize = () => initGoogle();
    window.addEventListener('resize', handleResize);
    return () => {
      clearInterval(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [googleClientId]);

  return (
    <div className="login-page dark" role="main">
      <div className="login-shell" aria-labelledby="login-title">
        <aside className="login-hero" aria-hidden="true">
          <div className="login-hero__content">
            <div className="login-hero-title-row">
              <img
                className="login-hero-avatar"
                src={login0xnx}
                alt="Bienvenido"
                loading="lazy"
              />
              <p className="login-hero-title">Bienvenido de nuevo</p>
            </div>
            <p>
              Inicia sesión para seguir administrando tus pedidos, aliados y
              reportes en un solo lugar.
            </p>
          </div>
          <div className="login-hero__glow" aria-hidden="true" />
        </aside>

        <main className="login-card" aria-labelledby="login-title">
          <div className="login-card__header">
            <h2 id="login-title">Iniciar sesión</h2>
            <p>Accede con tu correo y contraseña corporativos.</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form" noValidate>
            <label className="input-field">
              <span>Correo electrónico</span>
              <input
                type="email"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nombre@empresa.com"
                required
                aria-label="Correo electrónico"
              />
            </label>

            <label className="input-field password-field">
              <span>Contraseña</span>
              <div className="password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  aria-label="Contraseña"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-pressed={showPassword}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  <svg
                    className="password-icon"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path
                      d="M1.5 12s4-6.5 10.5-6.5S22.5 12 22.5 12s-4 6.5-10.5 6.5S1.5 12 1.5 12Z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="3.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                  <span className="sr-only">
                    {showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  </span>
                </button>
              </div>
            </label>

            <p className="form-error" role="alert" aria-live="polite" style={{ display: error ? 'block' : 'none' }}>
              {error}
            </p>

            <button
              type="submit"
              className="primary-button"
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? 'Ingresando…' : 'Iniciar sesión'}
            </button>
          </form>

          {googleClientId && (
            <div className="login-google" aria-hidden={loading}>
              <div className="login-divider">
                <span>o continúa con</span>
              </div>
              <div className="google-login" ref={googleButtonRef} />
            </div>
          )}

          <div className="login-links">
            <Link to="/registro">Registrarse con formulario</Link>
            <Link to="/recuperar-contrasena">Recuperar contraseña</Link>
          </div>

          <div className="login-footer">
            <Link to="/">Volver al inicio</Link>
          </div>
        </main>
      </div>
    </div>
  );
};

export default IniciarSesion;


