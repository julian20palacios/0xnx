import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registrarUsuario } from '../../api/RegistroUser';
import '../../styles/RegistroUser.css';
import login0xnx from '../../assets/images/login0xnx.jpg';
import { useAuth } from '../../context/AuthContext';

const RegistroUser = () => {
  const [form, setForm] = useState({
    email: '',
    username: '',
    nombre: '',
    apellido: '',
    edad: '',
    password: '',
    password2: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { refreshRole, refreshUser } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const payload = {
        email: form.email,
        username: form.username,
        nombre: form.nombre,
        apellido: form.apellido || null,
        edad: form.edad ? Number(form.edad) : null,
        password: form.password,
        password2: form.password2,
      };

      const data = await registrarUsuario(payload);
      if (data.access && data.refresh) {
        localStorage.setItem('access', data.access);
        localStorage.setItem('refresh', data.refresh);
        await Promise.all([refreshRole(), refreshUser()]);
        navigate('/home');
      } else {
        navigate('/iniciar-sesion');
      }
    } catch (err) {
      setError(err.message || 'No se pudo registrar');
    }
  };

  useEffect(() => {
    document.body.classList.add('register-theme', 'dark');
    return () => {
      document.body.classList.remove('register-theme', 'dark');
    };
  }, []);

  return (
    <div className="register-page dark" role="main">
      <div className="register-shell" aria-labelledby="register-title">
        <aside className="register-hero" aria-hidden="true">
          <div className="register-hero__content">
            <div className="register-hero-title-row">
              <img
                className="register-hero-avatar"
                src={login0xnx}
                alt="Registro"
                loading="lazy"
              />
              <p className="register-hero-title">Crea tu cuenta</p>
            </div>
            <p>
              Registra tu perfil para administrar pedidos, aliados y reportes en un
              solo lugar.
            </p>
          </div>
        </aside>

        <main className="register-card" aria-labelledby="register-title">
          <div className="register-card__header">
            <h2 id="register-title">Registro con formulario</h2>
            <p>Crea tu cuenta corporativa en minutos.</p>
          </div>

          <form onSubmit={handleSubmit} className="register-form" noValidate>
            <label className="register-field">
              <span>Correo electronico</span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="nombre@empresa.com"
                autoComplete="email"
                required
              />
            </label>
            <label className="register-field">
              <span>Usuario</span>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="usuario"
                autoComplete="username"
                required
              />
            </label>
            <label className="register-field">
              <span>Nombre</span>
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Tu nombre"
                autoComplete="given-name"
                required
              />
            </label>
            <label className="register-field">
              <span>Apellido</span>
              <input
                type="text"
                name="apellido"
                value={form.apellido}
                onChange={handleChange}
                placeholder="Tu apellido"
                autoComplete="family-name"
              />
            </label>
            <label className="register-field">
              <span>Edad</span>
              <input
                type="number"
                name="edad"
                value={form.edad}
                onChange={handleChange}
                min="0"
                placeholder="18"
              />
            </label>
            <label className="register-field">
              <span>Contrasena</span>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Tu clave"
                autoComplete="new-password"
                required
              />
            </label>
            <label className="register-field">
              <span>Confirmar contrasena</span>
              <input
                type="password"
                name="password2"
                value={form.password2}
                onChange={handleChange}
                placeholder="Repite tu clave"
                autoComplete="new-password"
                required
              />
            </label>

            {error && (
              <p className="register-error" role="alert" aria-live="polite">
                {error}
              </p>
            )}

            <button type="submit" className="primary-button">
              Registrarse
            </button>
          </form>

          <div className="register-footer">
            <Link to="/iniciar-sesion">Volver a iniciar sesion</Link>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RegistroUser;
