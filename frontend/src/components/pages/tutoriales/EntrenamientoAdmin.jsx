import React, { useEffect, useState } from 'react';
import {
  obtenerEntrenamientos,
  crearEntrenamiento,
  actualizarEntrenamiento,
  eliminarEntrenamiento,
} from '../../../api/Entrenamiento';

const emptyForm = {
  nombre_jugada: '',
  nivel_dificultad: 'novato',
  youtube_url: '',
  descripcion: '',
  consejos: '',
  numero_orden: 1,
  categoria: '',
  requisitos_posteriores: '',
  realizado: false,
};

const Entrenamiento = () => {
  const [entrenamientos, setEntrenamientos] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const cargarEntrenamientos = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await obtenerEntrenamientos();
      setEntrenamientos(data);
    } catch (err) {
      setError(err.message || 'Error al cargar entrenamientos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarEntrenamientos();
  }, []);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    let nextValue = type === 'checkbox' ? checked : value;
    if (name === 'numero_orden') {
      const parsed = parseInt(nextValue, 10);
      nextValue = Number.isNaN(parsed) ? 1 : parsed;
    }
    setForm((prev) => ({ ...prev, [name]: nextValue }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (!form.nombre_jugada.trim()) {
        setError('El nombre de la jugada es obligatorio');
        return;
      }
      if (editId) {
        await actualizarEntrenamiento(editId, form);
      } else {
        await crearEntrenamiento(form);
      }
      resetForm();
      await cargarEntrenamientos();
    } catch (err) {
      setError(err.message || 'Error al guardar entrenamiento');
    }
  };

  const handleEdit = (item) => {
    setEditId(item.id_jugada);
    setForm({
      nombre_jugada: item.nombre_jugada || '',
      nivel_dificultad: item.nivel_dificultad || 'novato',
      youtube_url: item.youtube_url || '',
      descripcion: item.descripcion || '',
      consejos: item.consejos || '',
      numero_orden: item.numero_orden ?? 1,
      categoria: item.categoria || '',
      requisitos_posteriores: item.requisitos_posteriores || '',
      realizado: Boolean(item.realizado),
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Eliminar este entrenamiento?')) return;
    setError('');
    try {
      await eliminarEntrenamiento(id);
      await cargarEntrenamientos();
    } catch (err) {
      setError(err.message || 'Error al eliminar entrenamiento');
    }
  };

  return (
    <div>
      <h1>Gestion de Entrenamientos</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre de la jugada</label>
          <input
            type="text"
            name="nombre_jugada"
            value={form.nombre_jugada}
            onChange={handleChange}
            placeholder="Nombre"
          />
        </div>

        <div>
          <label>Nivel de dificultad</label>
          <select name="nivel_dificultad" value={form.nivel_dificultad} onChange={handleChange}>
            <option value="novato">Novato</option>
            <option value="intermedio">Intermedio</option>
            <option value="avanzado">Avanzado</option>
          </select>
        </div>

        <div>
          <label>Categoria</label>
          <select name="categoria" value={form.categoria} onChange={handleChange}>
            <option value="">Sin categoria</option>
            <option value="yoyos">Yoyos</option>
            <option value="ceros">Ceros</option>
            <option value="fuerza">Fuerza</option>
            <option value="entradas">Entradas</option>
            <option value="giros">Giros</option>
          </select>
        </div>

        <div>
          <label>Numero de orden</label>
          <input
            type="number"
            name="numero_orden"
            value={form.numero_orden}
            onChange={handleChange}
            min="1"
          />
        </div>

        <div>
          <label>Youtube URL</label>
          <input
            type="text"
            name="youtube_url"
            value={form.youtube_url}
            onChange={handleChange}
            placeholder="https://..."
          />
        </div>

        <div>
          <label>Descripcion</label>
          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            rows="3"
          />
        </div>

        <div>
          <label>Consejos</label>
          <textarea
            name="consejos"
            value={form.consejos}
            onChange={handleChange}
            rows="3"
          />
        </div>

        <div>
          <label>Requisitos posteriores</label>
          <textarea
            name="requisitos_posteriores"
            value={form.requisitos_posteriores}
            onChange={handleChange}
            rows="3"
          />
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              name="realizado"
              checked={form.realizado}
              onChange={handleChange}
            />
            Realizado
          </label>
        </div>

        <div>
          <button type="submit">{editId ? 'Actualizar' : 'Crear'}</button>
          {editId && <button type="button" onClick={resetForm}>Cancelar</button>}
        </div>
      </form>

      {error && <p>{error}</p>}
      {loading && <p>Cargando...</p>}

      <h2>Listado</h2>
      <ul>
        {entrenamientos.map((item) => (
          <li key={item.id_jugada}>
            <strong>{item.nombre_jugada}</strong> - {item.nivel_dificultad} - {item.categoria || 'sin categoria'}
            <button onClick={() => handleEdit(item)}>Editar</button>
            <button onClick={() => handleDelete(item.id_jugada)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Entrenamiento;
