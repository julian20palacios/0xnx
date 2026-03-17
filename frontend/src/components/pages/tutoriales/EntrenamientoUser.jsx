import React, { useEffect, useState } from 'react';
import { obtenerEntrenamientos } from '../../../api/Entrenamiento';

const EntrenamientoUser = () => {
  const [entrenamientos, setEntrenamientos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  return (
    <div>
      <h1>Entrenamientos</h1>

      {loading && <p>Cargando...</p>}
      {error && <p>{error}</p>}

      {!loading && !error && (
        <ul>
          {entrenamientos.map((item) => (
            <li key={item.id_jugada}>
              <strong>{item.nombre_jugada}</strong>
              <div>Nivel: {item.nivel_dificultad}</div>
              <div>Categoria: {item.categoria || 'sin categoria'}</div>
              {item.youtube_url && (
                <div>
                  Video: <a href={item.youtube_url} target="_blank" rel="noreferrer">{item.youtube_url}</a>
                </div>
              )}
              {item.descripcion && <div>Descripcion: {item.descripcion}</div>}
              {item.consejos && <div>Consejos: {item.consejos}</div>}
              {item.requisitos_posteriores && <div>Requisitos: {item.requisitos_posteriores}</div>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EntrenamientoUser;
