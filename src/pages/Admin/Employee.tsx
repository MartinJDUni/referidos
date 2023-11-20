import React, { useState } from 'react';
import { Layout, Button, Modal } from 'antd';
import HeaderComponent from "@/pages/components/header";
import SidebarComponent from "@/pages/components/SideBars";
import Tabla from '../components/tableEmployee';

const { Header, Content } = Layout;

const Worker: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isAddWorkerModalVisible, setIsAddWorkerModalVisible] = useState(false);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [nameError, setNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleToggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleShowAddWorkerModal = () => {
    setIsAddWorkerModalVisible(true);
  };

  const handleHideAddWorkerModal = () => {
    setIsAddWorkerModalVisible(false);
    setError("");
    setNameError("");
    setPasswordError("");
    setEmailError("");
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setNameError("");
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setPasswordError("");
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailError("");
  };

  const handleSaveWorker = () => {
    // Validación de campos obligatorios
    if (!name || !password || !email) {
      setError('Por favor, completa todos los campos obligatorios.');
      return;
    }

    // Validación de formato de correo electrónico
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(email)) {
      setEmailError('El correo electrónico ingresado no es válido.');
      return;
    }

    // Otras validaciones necesarias...

    const workerData = {
      name,
      password,
      email,
    };

    fetch('/api/databaseemployee', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(workerData),
    })
      .then((response) => response.json())
      .then((result) => {
        // Actualizar la tabla
        console.log('Tarea guardada exitosamente:', result);
        setSuccessMessage('Trabajador añadido exitosamente.');

        // Limpiar campos y mostrar mensaje de éxito después de 2 segundos
        setTimeout(() => {
          setName("");
          setPassword("");
          setEmail("");
          setError("");
          setNameError("");
          setPasswordError("");
          setEmailError("");
          setSuccessMessage("");
          handleHideAddWorkerModal();
        }, 2000);
      })
      .catch((error) => {
        console.error('Error al guardar la tarea:', error);
      });
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <SidebarComponent collapsed={collapsed} />
      <Layout>
        <HeaderComponent collapsed={collapsed} onToggle={handleToggleSidebar} />
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>Personal</h1>
            <Button
              onClick={handleShowAddWorkerModal}
              type="primary"
              style={{ background: '#1890ff', borderColor: '#1890ff', marginRight: '16px' }}
            >
              Agregar trabajador
            </Button>
          </div>
          <Tabla />

          <Modal
            title="Agregar Trabajador"
            visible={isAddWorkerModalVisible}
            onOk={handleSaveWorker}
            onCancel={handleHideAddWorkerModal}
            footer={[
              <Button key="back" onClick={handleHideAddWorkerModal}>
                Cancelar
              </Button>,
              <Button key="submit" type="primary" onClick={handleSaveWorker}>
                Guardar
              </Button>,
            ]}
          >
            <form>
              <div style={{ marginBottom: '16px' }}>
                {error && <p style={{ color: 'red', marginBottom: '8px' }}>{error}</p>}
                {successMessage && <p style={{ color: 'green', marginBottom: '8px' }}>{successMessage}</p>}

                <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column' }}>
                  <label style={{ marginBottom: '4px' }}>Nombre:</label>
                  <input type="text" value={name} onChange={handleNameChange} />
                  {nameError && <p style={{ color: 'red', marginTop: '4px' }}>{nameError}</p>}
                </div>

                <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column' }}>
                  <label style={{ marginBottom: '4px' }}>Contraseña:</label>
                  <input type="password" value={password} onChange={handlePasswordChange} />
                  {passwordError && <p style={{ color: 'red', marginTop: '4px' }}>{passwordError}</p>}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ marginBottom: '4px' }}>Correo Electrónico:</label>
                  <input type="email" value={email} onChange={handleEmailChange} />
                  {emailError && <p style={{ color: 'red', marginTop: '4px' }}>{emailError}</p>}
                </div>
              </div>
            </form>
          </Modal>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Worker;
