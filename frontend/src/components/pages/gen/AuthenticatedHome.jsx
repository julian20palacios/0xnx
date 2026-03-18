// src/components/pages/AuthenticatedHome.jsx
import React, { useEffect, useState } from 'react';
import {
  obtenerCategorias,
  obtenerPermisosCategoria,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria
} from '../../../api/Categorias';
import { useNavigate } from 'react-router-dom';

const AuthenticatedHome = () => {
  const [categorias, setCategorias] = useState([]);
  const [nueva, setNueva] = useState('');
  const [editarId, setEditarId] = useState(null);
  const [editarDesc, setEditarDesc] = useState('');
  const [permisos, setPermisos] = useState({
    can_view: false,
    can_add: false,
    can_change: false,
    can_delete: false,
  });
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
    let isMounted = true;
    const init = async () => {
      try {
        const perms = await obtenerPermisosCategoria();
        if (!isMounted) return;
        setPermisos(perms);
        if (perms.can_view) {
          await cargarCategorias();
        }
      } catch (err) {
        if (!isMounted) return;
        setPermisos({ can_view: false, can_add: false, can_change: false, can_delete: false });
      }
    };
    init();
    return () => {
      isMounted = false;
    };
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
      
      {permisos.can_add && (
        <div>
          <input
            type="text"
            placeholder="Nueva categoría"
            value={nueva}
            onChange={(e) => setNueva(e.target.value)}
          />
          <button onClick={handleCrear}>Crear</button>
        </div>
      )}
      <h2>Categorías</h2>

      {!permisos.can_view ? (
        <p>No tienes permisos para ver categorías.</p>
      ) : (
        <ul>
          {categorias.map((cat) => (
            <li key={cat.id_categoria}>
              {editarId === cat.id_categoria && permisos.can_change ? (
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
                  {permisos.can_change && (
                    <button onClick={() => {
                      setEditarId(cat.id_categoria);
                      setEditarDesc(cat.descripcion_categoria);
                    }}>
                      Editar
                    </button>
                  )}
                  {permisos.can_delete && (
                    <button onClick={() => handleEliminar(cat.id_categoria)}>
                      Eliminar
                    </button>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      )}
  
    </div>
  );
};
export default AuthenticatedHome;


