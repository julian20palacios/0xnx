import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { obtenerEntrenamientos } from '../../../../api/Entrenamiento';
import {
  actualizarComentarioTutorial,
  crearComentarioTutorial,
  obtenerComentariosTutorial,
} from '../../../../api/ComentariosTutorial';
import { useAuth } from '../../../../context/AuthContext';

const EntrenamientoUser = () => {
  const [entrenamientos, setEntrenamientos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [commentsByJugada, setCommentsByJugada] = useState({});
  const [commentsOpen, setCommentsOpen] = useState({});
  const [commentLoading, setCommentLoading] = useState({});
  const [commentError, setCommentError] = useState({});
  const [formByJugada, setFormByJugada] = useState({});
  const [formOpen, setFormOpen] = useState({});
  const [editByJugada, setEditByJugada] = useState({});
  const { user } = useAuth();

  const userEmail = useMemo(() => (user?.email || '').toLowerCase(), [user]);

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

  const loadComments = async (jugadaId) => {
    setCommentLoading((prev) => ({ ...prev, [jugadaId]: true }));
    setCommentError((prev) => ({ ...prev, [jugadaId]: '' }));
    try {
      const data = await obtenerComentariosTutorial(jugadaId);
      setCommentsByJugada((prev) => ({ ...prev, [jugadaId]: data }));
    } catch (err) {
      setCommentError((prev) => ({
        ...prev,
        [jugadaId]: err.message || 'Error al cargar comentarios',
      }));
    } finally {
      setCommentLoading((prev) => ({ ...prev, [jugadaId]: false }));
    }
  };

  const toggleComments = async (jugadaId) => {
    const isOpen = Boolean(commentsOpen[jugadaId]);
    const nextOpen = !isOpen;
    setCommentsOpen((prev) => ({ ...prev, [jugadaId]: nextOpen }));
    if (nextOpen && !commentsByJugada[jugadaId]) {
      await loadComments(jugadaId);
    }
  };

  const getFormState = (jugadaId) =>
    formByJugada[jugadaId] || { comentario: '', calificacion: 0 };

  const updateFormState = (jugadaId, patch) => {
    setFormByJugada((prev) => ({
      ...prev,
      [jugadaId]: { ...getFormState(jugadaId), ...patch },
    }));
  };

  const handleSubmitComentario = async (event, jugadaId) => {
    event.preventDefault();
    setCommentError((prev) => ({ ...prev, [jugadaId]: '' }));
    const formState = getFormState(jugadaId);
    if (!formState.calificacion) {
      setCommentError((prev) => ({ ...prev, [jugadaId]: 'Selecciona una calificacion.' }));
      return;
    }
    if (!formState.comentario.trim()) {
      setCommentError((prev) => ({ ...prev, [jugadaId]: 'Escribe un comentario.' }));
      return;
    }

    try {
      const editId = editByJugada[jugadaId];
      if (editId) {
        await actualizarComentarioTutorial(editId, {
          comentario: formState.comentario.trim(),
          calificacion: formState.calificacion,
        });
      } else {
        await crearComentarioTutorial({
          jugada: jugadaId,
          comentario: formState.comentario.trim(),
          calificacion: formState.calificacion,
        });
      }
      updateFormState(jugadaId, { comentario: '', calificacion: 0 });
      setFormOpen((prev) => ({ ...prev, [jugadaId]: false }));
      setEditByJugada((prev) => ({ ...prev, [jugadaId]: null }));
      await loadComments(jugadaId);
      await cargarEntrenamientos();
    } catch (err) {
      setCommentError((prev) => ({
        ...prev,
        [jugadaId]: err.message || 'No se pudo guardar la calificacion.',
      }));
    }
  };

  const renderStars = (value) => {
    const safeValue = Number.isFinite(value) ? value : 0;
    const rounded = Math.round(Math.max(0, Math.min(5, safeValue)));
    return `${'★'.repeat(rounded)}${'☆'.repeat(5 - rounded)}`;
  };

  return (
    <div>
      <h1>Entrenamientos</h1>
      <Link to="/tutoriales/categorias">Volver</Link>

      {loading && <p>Cargando...</p>}
      {error && <p>{error}</p>}

      {!loading && !error && (
        <ul>
          {entrenamientos.map((item) => (
            <li key={item.id_jugada}>
              <strong>{item.nombre_jugada}</strong>
              <div>Nivel: {item.nivel_dificultad}</div>
              <div>Categoria: {item.categoria || 'sin categoria'}</div>
              <div>
                Calificacion:{' '}
                {item.calificaciones_total ? (
                  <>
                    {renderStars(item.calificacion_promedio)}{' '}
                    <span>({Number(item.calificacion_promedio || 0).toFixed(1)}/5)</span>{' '}
                    <span>- {item.calificaciones_total} votos</span>
                  </>
                ) : (
                  <span>Sin calificaciones</span>
                )}
              </div>
              {item.url_jugada && (
                <div>
                  Ver Jugada: <a href={item.url_jugada} target="_blank" rel="noreferrer">{item.url_jugada}</a>
                </div>
              )}
              {item.youtube_url && (
                <div>
                  Tutorial: <a href={item.youtube_url} target="_blank" rel="noreferrer">{item.youtube_url}</a>
                </div>
              )}
              {item.descripcion && <div>Descripcion: {item.descripcion}</div>}
              {item.consejos && <div>Consejos: {item.consejos}</div>}
              {item.requisitos_posteriores && <div>Requisitos: {item.requisitos_posteriores}</div>}

              <div>
                <button type="button" onClick={() => toggleComments(item.id_jugada)}>
                  {commentsOpen[item.id_jugada] ? 'Ocultar comentarios' : 'Ver comentarios'}
                </button>
              </div>

              {commentsOpen[item.id_jugada] && (
                <div>
                  {commentLoading[item.id_jugada] && <p>Cargando comentarios...</p>}
                  {commentError[item.id_jugada] && <p>{commentError[item.id_jugada]}</p>}
                  {!commentLoading[item.id_jugada] && !commentError[item.id_jugada] && (
                    <>
                      {(commentsByJugada[item.id_jugada] || []).length === 0 && (
                        <p>Sin comentarios.</p>
                      )}
                      <ul>
                        {(commentsByJugada[item.id_jugada] || []).map((comentario) => (
                          <li key={comentario.id_comentario}>
                            <strong>{comentario.usuario_nombre}</strong>
                            <div>Calificacion: {renderStars(comentario.calificacion)} ({comentario.calificacion}/5)</div>
                            <div>{comentario.comentario}</div>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}

                  {(() => {
                    const comentarios = commentsByJugada[item.id_jugada] || [];
                    const yaCalifico = Boolean(
                      userEmail &&
                      comentarios.some(
                        (comentario) =>
                          (comentario.usuario_email || '').toLowerCase() === userEmail
                      )
                    );

                    if (yaCalifico) {
                      const comentarioUsuario = comentarios.find(
                        (comentario) =>
                          (comentario.usuario_email || '').toLowerCase() === userEmail
                      );
                      return (
                        <>
                          <p>Ya calificaste esta jugada.</p>
                          <button
                            type="button"
                            onClick={() => {
                              if (!comentarioUsuario) return;
                              updateFormState(item.id_jugada, {
                                comentario: comentarioUsuario.comentario || '',
                                calificacion: comentarioUsuario.calificacion || 0,
                              });
                              setEditByJugada((prev) => ({
                                ...prev,
                                [item.id_jugada]: comentarioUsuario.id_comentario,
                              }));
                              setFormOpen((prev) => ({
                                ...prev,
                                [item.id_jugada]: true,
                              }));
                            }}
                          >
                            Editar comentario
                          </button>
                          {formOpen[item.id_jugada] && (
                            <form onSubmit={(event) => handleSubmitComentario(event, item.id_jugada)}>
                              <div>
                                <label>Calificacion</label>
                                <div>
                                  {[1, 2, 3, 4, 5].map((value) => (
                                    <button
                                      key={value}
                                      type="button"
                                      onClick={() => updateFormState(item.id_jugada, { calificacion: value })}
                                    >
                                      {value <= getFormState(item.id_jugada).calificacion ? '★' : '☆'}
                                    </button>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <label>Comentario</label>
                                <textarea
                                  rows="3"
                                  value={getFormState(item.id_jugada).comentario}
                                  onChange={(event) =>
                                    updateFormState(item.id_jugada, { comentario: event.target.value })
                                  }
                                />
                              </div>
                              <button type="submit">Guardar cambios</button>
                              <button
                                type="button"
                                onClick={() => {
                                  setFormOpen((prev) => ({ ...prev, [item.id_jugada]: false }));
                                  setEditByJugada((prev) => ({ ...prev, [item.id_jugada]: null }));
                                }}
                              >
                                Cancelar
                              </button>
                            </form>
                          )}
                        </>
                      );
                    }

                    return (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            setEditByJugada((prev) => ({ ...prev, [item.id_jugada]: null }));
                            setFormOpen((prev) => ({
                              ...prev,
                              [item.id_jugada]: !prev[item.id_jugada],
                            }));
                          }}
                        >
                          Calificar
                        </button>
                        {formOpen[item.id_jugada] && (
                          <form onSubmit={(event) => handleSubmitComentario(event, item.id_jugada)}>
                            <div>
                              <label>Calificacion</label>
                              <div>
                                {[1, 2, 3, 4, 5].map((value) => (
                                  <button
                                    key={value}
                                    type="button"
                                    onClick={() => updateFormState(item.id_jugada, { calificacion: value })}
                                  >
                                    {value <= getFormState(item.id_jugada).calificacion ? '★' : '☆'}
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div>
                              <label>Comentario</label>
                              <textarea
                                rows="3"
                                value={getFormState(item.id_jugada).comentario}
                                onChange={(event) =>
                                  updateFormState(item.id_jugada, { comentario: event.target.value })
                                }
                              />
                            </div>
                            <button type="submit">Enviar calificacion</button>
                            <button
                              type="button"
                              onClick={() => {
                                setFormOpen((prev) => ({ ...prev, [item.id_jugada]: false }));
                                setEditByJugada((prev) => ({ ...prev, [item.id_jugada]: null }));
                              }}
                            >
                              Cancelar
                            </button>
                          </form>
                        )}
                      </>
                    );
                  })()}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EntrenamientoUser;
