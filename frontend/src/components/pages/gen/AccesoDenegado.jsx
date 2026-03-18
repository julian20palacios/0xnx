import React from 'react';
import { useNavigate } from 'react-router-dom';

const AccesoDenegado = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '2rem' }}>
      <h1>No puedes acceder</h1>
      <p>No tienes permisos para ver esta pagina.</p>
      <button onClick={() => navigate(-1)}>Volver</button>
    </div>
  );
};

export default AccesoDenegado;


