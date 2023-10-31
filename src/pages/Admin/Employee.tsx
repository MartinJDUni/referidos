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

  const handleToggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleShowAddWorkerModal = () => {
    setIsAddWorkerModalVisible(true);
  };

  const handleHideAddWorkerModal = () => {
    setIsAddWorkerModalVisible(false);
    setError("");
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
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
      setError('El correo electrónico ingresado no es válido.');
      return;
    }

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
        // actualizar la tabla
        console.log('Tarea guardada exitosamente:', result);

        // actualizar tabla 
      })
      .catch((error) => {
        console.error('Error al guardar la tarea:', error);
      });

    handleHideAddWorkerModal();
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
            <h1>Trabajadores</h1>
            <Button
              onClick={handleShowAddWorkerModal}
              type="primary"
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
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '8px' }}>
                  <label style={{ marginBottom: '4px' }}>Nombre:</label>
                  <input type="text" value={name} onChange={handleNameChange} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '8px' }}>
                  <label style={{ marginBottom: '4px' }}>Contraseña:</label>
                  <input type="password" value={password} onChange={handlePasswordChange} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '8px' }}>
                  <label style={{ marginBottom: '4px' }}>Correo Electrónico:</label>
                  <input type="email" value={email} onChange={handleEmailChange} />
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
