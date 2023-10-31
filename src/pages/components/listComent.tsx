import React, { useEffect, useState } from 'react';

const CommentList = ({ id }: { id: number }) => {
  const [comments, setComments] = useState([]);
  const [selectedComments, setSelectedComments] = useState([]);
  const [allSelected, setAllSelected] = useState(false);

  useEffect(() => {
    // Realiza una solicitud GET a la API con el ID específico
    fetch(`/api/databaseCEP?id=${id}`)
      .then((response) => response.json())
      .then((data) => {
        // Maneja los datos de respuesta
        setComments(data.data);
      })
      .catch((error) => {
        console.error('Error al obtener datos de la API:', error);
      });
  }, [id]);

  const toggleSelectComment = (commentId) => {
    // Implementa la lógica para seleccionar o deseleccionar el comentario
    const isSelected = selectedComments.includes(commentId);
    if (isSelected) {
      setSelectedComments(selectedComments.filter((id) => id !== commentId));
    } else {
      setSelectedComments([...selectedComments, commentId]);
    }
  };

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedComments([]);
    } else {
      setSelectedComments(comments.map((comment) => comment.Id));
    }
    setAllSelected(!allSelected);
  };

  const markSelectedAsRead = () => {
    // Implementa la lógica para marcar los comentarios seleccionados como leídos
    // Actualiza el estado o realiza una solicitud al servidor, según tu aplicación
  };

  const markSelectedAsUnread = () => {
    // Implementa la lógica para marcar los comentarios seleccionados como no leídos
    // Actualiza el estado o realiza una solicitud al servidor, según tu aplicación
  };

  const showMarkAsReadUnreadButtons = selectedComments.length > 0;

  return (
    <div className="comment-list-container">
      <h1>Conversación de Correo</h1>
      {showMarkAsReadUnreadButtons && (
        <div className="comment-actions">
          <button onClick={markSelectedAsRead}>Marcar seleccionados como leídos</button>
          <button onClick={markSelectedAsUnread}>Marcar seleccionados como no leídos</button>
        </div>
      )}
      <div className="select-all-button">
        <button onClick={toggleSelectAll}>
          {allSelected ? 'Deseleccionar todo' : 'Seleccionar todo'}
        </button>
      </div>
      <ul className="comment-list">
        {comments.map((comment, index) => (
          <li key={index} className={`comment ${comment.hidden ? 'hidden' : ''}`}>
            <div className="comment-header">
              <div className="comment-sender">
                <strong>{comment.senderName}</strong> <span>{comment.timestamp}</span>
              </div>
              <div className="comment-actions">
                <input
                  type="checkbox"
                  checked={selectedComments.includes(comment.Id)}
                  onChange={() => toggleSelectComment(comment.Id)}
                />
              </div>
            </div>
            <div className="comment-body">{comment.comment}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommentList;
