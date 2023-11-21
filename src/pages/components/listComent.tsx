import React, { useEffect, useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';

const CommentList = ({ id }: { id: number }) => {
  const [comments, setComments] = useState([]);
  const [selectedComments, setSelectedComments] = useState([]);
  const [allSelected, setAllSelected] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    // Función para realizar la solicitud a la API
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/databaseCEP?id=${id}`);
        const data = await response.json();
        setComments(data.data);
      } catch (error) {
        console.error('Error al obtener datos de la API:', error);
      }
    };

    // Realizar la primera solicitud al montar el componente
    fetchData();

    // Configurar un intervalo para realizar la solicitud cada 5 segundos
    const intervalId = setInterval(() => {
      fetchData();
    }, 3000);

    // Limpiar el intervalo al desmontar el componente
    return () => {
      clearInterval(intervalId);
    };
  }, [id]);

  const toggleSelectComment = (commentId) => {
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
    } catch (error) {
      console.error('Error al marcar como leídos:', error);
    }
  };

  const markSelectedAsUnread = async () => {
    try {
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
    } catch (error) {
      console.error('Error al marcar como leídos:', error);
    }
  };

  const showMarkAsReadUnreadButtons = selectedComments.length > 0;

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleNewCommentChange = (event) => {
    setNewComment(event.target.value);
  };

  const agregarComentarioYCerrarModal = async () => {
    try {
      // Realiza la solicitud al servidor para agregar el nuevo comentario a la base de datos
      await fetch(`/api/databaseComentList`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, newComment }),
      });

      // Actualiza la lista de comentarios después de agregar el nuevo comentario
      fetch(`/api/databaseCEP?id=${id}`)
        .then((response) => response.json())
        .then((data) => {
          setComments(data.data);
        })
        .catch((error) => {
          console.error('Error al obtener datos de la API:', error);
        });

      // Cierra el modal después de agregar el comentario
      closeModal();
    } catch (error) {
      console.error('Error al agregar comentario:', error);
    }
  };

  return (
    <div className="comment-list-container">
      <h1>Conversación de Correo</h1>
      {showMarkAsReadUnreadButtons && (
        <div className="comment-actions">
          <button onClick={markSelectedAsRead}>
            <MarkEmailReadIcon /> Marcar como Leído
          </button>
          <button onClick={markSelectedAsUnread}>
            <MarkEmailUnreadIcon /> Marcar como No Leído
          </button>
        </div>
      )}
      <div className="select-all-button">
        <button onClick={toggleSelectAll}>
          {allSelected ? (
            <CheckBoxIcon /> // Ícono de marca de verificación
          ) : (
            <CheckBoxOutlineBlankIcon />
          )}
          {allSelected ? 'Deseleccionar todo' : 'Seleccionar todo'}
        </button>
      </div>
      <button onClick={openModal}>Agregar Comentario</button>
      <ul className="comment-list">
        {comments.map((comment, index) => (
          <li
            key={index}
            className={`comment ${comment.hidden ? 'hidden' : ''} ${
              comment.state === 0 ? 'read-comment' : 'unread-comment'
            }`}
          >
            <div className={`comment-header ${comment.state === 1 ? 'bold-text' : ''}`}>
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

      {/* Modal para agregar comentario */}
      <Modal open={isModalOpen} onClose={closeModal}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
          <TextField
            label="Nuevo Comentario"
            multiline
            rows={4}
            fullWidth
            value={newComment}
            onChange={handleNewCommentChange}
          />
          <Button onClick={closeModal}>Cancelar</Button>
          <Button onClick={agregarComentarioYCerrarModal}>Agregar Comentario</Button>
        </Box>
      </Modal>
    </div>
  );
};
export default CommentList;
