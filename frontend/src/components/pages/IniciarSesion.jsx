import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUsuario } from '../../api/Login';
import "../../styles/Nabvar.css";

const IniciarSesion = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

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

      <div>
        <p>palaciosjulieth@gmail.com</p>
        <p>A3142327562a</p>
      </div>

      <div>
        <p><a href="/">Volver al inicio</a></p>
      </div>
    </div>
  );
};

export default IniciarSesion;
