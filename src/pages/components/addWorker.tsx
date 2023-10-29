import React, { useState, ChangeEvent, FormEvent } from 'react';
import Modal from 'react-modal';
import styles from '@/styles/addWorker.module.css'; // Asegúrate de que la ruta sea correcta
import axios from 'axios';

Modal.setAppElement('#__next');

type AddWorkerModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const AddWorkerModal: React.FC<AddWorkerModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState<string>('');
  const [apellido, setApellido] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [contrasena, setContrasena] = useState<string>('');

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleApellidoChange = (e: ChangeEvent<HTMLInputElement>) => {
    setApellido(e.target.value);
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleContrasenaChange = (e: ChangeEvent<HTMLInputElement>) => {
    setContrasena(e.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      // Send the data
      const response = await axios.post('', {
        Nombre: name,
        Apellido: apellido,
        Email: email,
        Contrasena: contrasena,
      });

      if (response.status === 201) {
        onClose();
      } else {
        // Handle the error
        console.error('Error al agregar el empleado:', response.data.error);
      }
    } catch (error) {
      console.error('Error al agregar el empleado:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} contentLabel="Añadir Empleado">
      <div className={styles.ReactModal__Overlay}>
        <div className={styles.ReactModal__Content}>
          <h2 className={styles.h2}>Añadir empleado</h2>
          <form onSubmit={handleSubmit}>
            <div className={styles.formControls}>
              <label className={styles.label}>Nombre:</label>
              <input type="text" value={name} onChange={handleNameChange} className={styles.inputText} />
            </div>
            <div className={styles.formControls}>
              <label className={styles.label}>Apellido:</label>
              <input type="text" value={apellido} onChange={handleApellidoChange} className={styles.inputText} />
            </div>
            <div className={styles.formControls}>
              <label className={styles.label}>Email:</label>
              <input type="email" value={email} onChange={handleEmailChange} className={styles.inputEmail} />
            </div>
            <div className={styles.formControls}>
              <label className={styles.label}>Contraseña:</label>
              <input type="password" value={contrasena} onChange={handleContrasenaChange} className={styles.inputText} />
            </div>
            <br />
            <button className={styles.btnAdd}>Agregar</button>
            <button className={styles.btnCancel} onClick={onClose}>
              Cancelar
            </button>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default AddWorkerModal;