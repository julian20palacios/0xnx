// src/components/pages/AuthenticatedHome.jsx
import React, { useEffect, useState } from 'react';
import {
  obtenerCategorias,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria
} from '../../api/Categorias';
import { useNavigate } from 'react-router-dom';

const AuthenticatedHome = () => {
  const [categorias, setCategorias] = useState([]);
  const [nueva, setNueva] = useState('');
  const [editarId, setEditarId] = useState(null);
  const [editarDesc, setEditarDesc] = useState('');
  const navigate = useNavigate();

  const cargarCategorias = async () => {
    try {
      const data = await obtenerCategorias();
      setCategorias(data);
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    cargarCategorias();
  }, []);

  const handleCrear = async () => {
    if (!nueva.trim()) return;
    try {
      await crearCategoria({ descripcion_categoria: nueva });
      setNueva('');
      cargarCategorias();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleActualizar = async () => {
    if (!editarDesc.trim()) return;
    try {
      await actualizarCategoria(editarId, { descripcion_categoria: editarDesc });
      setEditarId(null);
      setEditarDesc('');
      cargarCategorias();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Eliminar esta categoría?')) return;
    try {
      await eliminarCategoria(id);
      cargarCategorias();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    navigate('/iniciar-sesion');
  };

  return (
    <div>
      <h1>Gestión de Categorías</h1>
      
      <div>
        <input
          type="text"
          placeholder="Nueva categoría"
          value={nueva}
          onChange={(e) => setNueva(e.target.value)}
        />
        <button onClick={handleCrear}>Crear</button>
      </div>
      <h2>Categorías</h2>

  
      <ul>
        {categorias.map((cat) => (
          <li key={cat.id_categoria}>
            {editarId === cat.id_categoria ? (
              <>
                <input
                  type="text"
                  value={editarDesc}
                  onChange={(e) => setEditarDesc(e.target.value)}
                />
                <button onClick={handleActualizar}>Guardar</button>
                <button onClick={() => setEditarId(null)}>Cancelar</button>
              </>
            ) : (
              <>
                {cat.descripcion_categoria}
                <button onClick={() => {
                  setEditarId(cat.id_categoria);
                  setEditarDesc(cat.descripcion_categoria);
                }}>
                  Editar
                </button>
                <button onClick={() => handleEliminar(cat.id_categoria)}>
                  Eliminar
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
  
    </div>
  );
};
export default AuthenticatedHome;
