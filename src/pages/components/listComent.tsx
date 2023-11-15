import React, { useEffect, useState } from 'react';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';

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

  const markSelectedAsRead = async () => {
    try {
      // Realiza la solicitud al servidor para actualizar los comentarios seleccionados a estado 0
      await Promise.all(
        selectedComments.map(async (commentId) => {
          await fetch(`/api/databaseCEP`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ commentId, newState: 0 }),
          });
        })
      );

      // Actualiza el estado local o realiza otras acciones según sea necesario
    } catch (error) {
      console.error('Error al marcar como leídos:', error);
    }
  };

  const markSelectedAsUnread = async () => {
    try {
      // Realiza la solicitud al servidor para actualizar los comentarios seleccionados a estado 0
      await Promise.all(
        selectedComments.map(async (commentId) => {
          await fetch(`/api/databaseCEP`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ commentId, newState: 1 }),
          });
        })
      );

      // Actualiza el estado local o realiza otras acciones según sea necesario
    } catch (error) {
      console.error('Error al marcar como leídos:', error);
    }
  };

  const showMarkAsReadUnreadButtons = selectedComments.length > 0;

  return (
    <div className="comment-list-container">
      <h1>Conversación de Correo</h1>
      {showMarkAsReadUnreadButtons && (
        <div className="comment-actions">
          <button onClick={markSelectedAsRead}>
            <MarkEmailReadIcon /> </button>
          <button onClick={markSelectedAsUnread}>
            <MarkEmailUnreadIcon /> </button>
        </div>
      )}
      <div className="select-all-button">
        <button onClick={toggleSelectAll}>
        {allSelected ? (
            <CheckBoxIcon /> // Ícono de marca de verificación
          ) : (
            <CheckBoxOutlineBlankIcon /> // Ícono de marca de verificación en blanco
          )}
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
