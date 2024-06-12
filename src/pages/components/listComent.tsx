import React, { useEffect, useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';

interface Comment {
  Id: number;
  hidden: boolean;
  stateView: number;
  senderName: string;
  timestamp: string;
  comment: string;
}

const CommentList = ({ id }: { id: number }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [selectedComments, setSelectedComments] = useState<number[]>([]);
  const [allSelected, setAllSelected] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newComment, setNewComment] = useState('');

  const fetchData = async () => {
    try {
      const response = await fetch(`/api/databaseCEP?id=${id}`);
      const data = await response.json();
      setComments(data.data);
    } catch (error) {
      console.error('Error al obtener datos de la API:', error);
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(() => {
      fetchData();
    }, 3000);

    return () => {
      clearInterval(intervalId);
    };
  }, [id]);

  const toggleSelectComment = (commentId: number) => {
    setSelectedComments((prevSelected) =>
      prevSelected.includes(commentId) ? prevSelected.filter((id) => id !== commentId) : [...prevSelected, commentId]
    );
  };

  const toggleSelectAll = () => {
    setSelectedComments(allSelected ? [] : comments.map((comment) => comment.Id));
    setAllSelected(!allSelected);
  };

  const markSelectedComments = async (newState: number) => {
    try {
      await Promise.all(
        selectedComments.map(async (commentId) => {
          await fetch(`/api/databaseCEP`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ commentId, newState }),
          });
        })
      );
      fetchData(); // Refresh comments after marking them
    } catch (error) {
      console.error('Error al marcar comentarios:', error);
    }
  };

  const markSelectedAsRead = () => markSelectedComments(0);
  const markSelectedAsUnread = () => markSelectedComments(1);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleNewCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewComment(event.target.value);
  };

  const agregarComentarioYCerrarModal = async () => {
    try {
      await fetch(`/api/databaseComentList`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, newComment }),
      });

      setNewComment('');
      fetchData(); // Refresh comments after adding new one
      closeModal();
    } catch (error) {
      console.error('Error al agregar comentario:', error);
    }
  };

  const handleBack = () => {
    console.log("Atrás");
  };

  return (
    <div className="comment-list-container">
      <h1>Comentarios por tarea</h1>
      {selectedComments.length > 0 && (
        <div className="comment-actions">
          <Button onClick={markSelectedAsRead} startIcon={<MarkEmailReadIcon />}>
            Marcar como Leído
          </Button>
          <Button onClick={markSelectedAsUnread} startIcon={<MarkEmailUnreadIcon />}>
            Marcar como No Leído
          </Button>
        </div>
      )}
      <div className="select-all-button">
        <Button onClick={toggleSelectAll} startIcon={allSelected ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}>
          {allSelected ? 'Deseleccionar todo' : 'Seleccionar todo'}
        </Button>
      </div>
      <Button onClick={openModal}>Agregar Comentario</Button>
      <Button onClick={handleBack}>Ir al listado de tareas</Button>
      <ul className="comment-list">
        {comments && comments.length > 0 ? (
          comments.map((comment) => (
            <li
              key={comment.Id}
              className={`comment ${comment.hidden ? 'hidden' : ''} ${
                comment.stateView === 0 ? 'read-comment' : 'unread-comment'
              }`}
            >
              <div className={`comment-header ${comment.stateView === 1 ? 'bold-text' : ''}`}>
                <div className="comment-sender">
                  <strong>{comment.senderName}</strong> <span>{comment.timestamp}</span>
                </div>
                <div className="comment-actions">
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedComments.includes(comment.Id)}
                        onChange={() => toggleSelectComment(comment.Id)}
                      />
                    }
                    label=""
                  />
                </div>
              </div>
              <div className="comment-body">{comment.comment}</div>
            </li>
          ))
        ) : (
          <li>No hay comentarios disponibles</li>
        )}
      </ul>

      <Modal open={isModalOpen} onClose={closeModal}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
          <TextField
            id='newComment'
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
