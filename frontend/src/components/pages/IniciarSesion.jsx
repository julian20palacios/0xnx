import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginGoogle, loginUsuario } from '../../api/Login';
import "../../styles/Nabvar.css";

const IniciarSesion = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const googleButtonRef = useRef(null);
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUsuario(email, password);
      localStorage.setItem('access', data.access);
      localStorage.setItem('refresh', data.refresh);
      navigate('/home');
    } catch (err) {
      setError('Correo o contraseña incorrectos');
    }
  };

  const handleGoogleCredential = async (response) => {
    if (!response?.credential) {
      setError('No se recibio credencial de Google.');
      return;
    }
    try {
      const data = await loginGoogle(response.credential);
      localStorage.setItem('access', data.access);
      localStorage.setItem('refresh', data.refresh);
      navigate('/home');
    } catch (err) {
      setError(err.message || 'No se pudo iniciar sesion con Google.');
    }
  };

  useEffect(() => {
    if (!googleClientId || !googleButtonRef.current) return;

    const initGoogle = () => {
      if (!window.google || !googleButtonRef.current) return false;
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: handleGoogleCredential,
      });
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: 'outline',
        size: 'large',
        text: 'continue_with',
        shape: 'pill',
        width: 260,
      });
      return true;
    };

    if (initGoogle()) return;

    const timer = setInterval(() => {
      if (initGoogle()) clearInterval(timer);
    }, 300);

    return () => clearInterval(timer);
  }, [googleClientId]);

  return (
    <div>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Correo electrónico</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p>{error}</p>}
        <button type="submit">Iniciar sesión</button> 
      </form>

      {googleClientId && (
        <div>
          <p>Registrarse con Google o Iniciar Sesión</p>
          <div className="google-login" ref={googleButtonRef} />
        </div>
      )}

      <div>
        <Link to="/registro">Registrarse con formulario</Link>
      </div>

      <div>
        <Link to="/recuperar-contrasena">Recuperar contrasena</Link>
      </div>

      <div>
        <p>pxlxciosjulixn@gmail.com</p>
        <p>Pass-2023</p>
      </div>

      <div>
        <p><a href="/">Volver al inicio</a></p>
      </div>
    </div>
  );
};

export default IniciarSesion;
