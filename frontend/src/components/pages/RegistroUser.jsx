import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registrarUsuario } from '../../api/RegistroUser';

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
        navigate('/home');
      } else {
        navigate('/iniciar-sesion');
      }
    } catch (err) {
      setError(err.message || 'No se pudo registrar');
    }
  };

  return (
    <div>
      <h2>Registro con formulario</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Correo electronico</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Usuario</label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Nombre</label>
          <input
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Apellido</label>
          <input
            type="text"
            name="apellido"
            value={form.apellido}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Edad</label>
          <input
            type="number"
            name="edad"
            value={form.edad}
            onChange={handleChange}
            min="0"
          />
        </div>
        <div>
          <label>Contrasena</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Confirmar contrasena</label>
          <input
            type="password"
            name="password2"
            value={form.password2}
            onChange={handleChange}
            required
          />
        </div>

        {error && <p>{error}</p>}

        <button type="submit">Registrarse</button>
      </form>

      <div>
        <p>
          <Link to="/iniciar-sesion">Volver a iniciar sesion</Link>
        </p>
      </div>
    </div>
  );
};

export default RegistroUser;
