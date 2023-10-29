import React, { useState, ChangeEvent, FormEvent } from 'react';
import Modal from 'react-modal';
import axios from 'axios';

import styles from '@/styles/addTask.module.css'; // Importa los estilos CSS

Modal.setAppElement('#__next');

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose }) => {
  const [nameTask, setNameTask] = useState<string>('');
  const [comments, setComments] = useState<string>('Descripcion de la tarea');
  const [idAsignado, setIdAsignado] = useState<number>(1);

  const handleNameTaskChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNameTask(e.target.value);
  };

  const handleCommentsChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setComments(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3001/api/tareas', {
        nombreTarea: nameTask,
        descripcion: comments,
        idAsignado: idAsignado,
      });

      if (response.status === 201) {
        onClose();
      } else {
        console.error('Error al agregar la tarea:', response.data.error);
      }
    } catch (error) {
      console.error('Error al agregar la tarea:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Añadir tarea"
    >
      <h2 className={styles.title}>Añadir tarea</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div>
          <label className={`${styles.label} ${styles.titleTask}`}>Nombre de la tarea:</label>
          <input
            type="text"
            value={nameTask}
            onChange={handleNameTaskChange}
            className={styles.input}
          />
        </div>
        <br></br>
        <div>
          <textarea
            className={`${styles.textarea} ${styles.input}`}
            value={comments}
            onChange={handleCommentsChange}
          />
        </div>
        <br></br>
        <button className={`${styles.button} ${styles.btnAdd}`} type="submit">Aceptar</button>
        <button className={`${styles.button} ${styles.btnCancel}`} onClick={onClose}>Cancelar</button>
      </form>
    </Modal>
  );
};

export default AddTaskModal;
