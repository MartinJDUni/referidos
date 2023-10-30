import React, { useState } from 'react';
import { Layout, Button, Modal } from 'antd';
import HeaderComponent from "@/pages/components/header";
import SidebarComponent from "@/pages/components/SideBars";
import Tabla from '../components/tablaTask';

const { Header, Content } = Layout;

const Task: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isAddTaskModalVisible, setIsAddTaskModalVisible] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleToggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleShowAddTaskModal = () => {
    setIsAddTaskModalVisible(true);
  };

  const handleHideAddTaskModal = () => {
    setIsAddTaskModalVisible(false);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  const handleSaveTask = () => {
    const taskData = {
      name,
      description,
    };
    
    fetch('/api/database', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    })
    .then((response) => response.json())
    .then((result) => {
      // Puedes actualizar la tabla aquí si lo deseas
      console.log('Tarea guardada exitosamente:', result);

      // También puedes actualizar la tabla realizando una nueva solicitud GET para obtener los datos actualizados
    })
    .catch((error) => {
      console.error('Error al guardar la tarea:', error);
    });

    handleHideAddTaskModal();
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <SidebarComponent collapsed={collapsed} />
      <Layout>
        <HeaderComponent collapsed={collapsed} onToggle={handleToggleSidebar} />
        <Content
          style={{
            margin: '60px 16px 24px',
            padding: 24,
            minHeight: 280,
            position: 'relative',
          }}
        >
          <h1>Tareas</h1>
          <Button
            onClick={handleShowAddTaskModal}
            type="primary"
            style={{ position: 'absolute', top: -20, right: 0 }}
          >
            Agregar tarea
          </Button>

          <Modal
            title="Agregar Tarea"
            visible={isAddTaskModalVisible}
            onOk={handleSaveTask}
            onCancel={handleHideAddTaskModal}
            footer={[
              <Button key="back" onClick={handleHideAddTaskModal}>
                Cancelar
              </Button>,
              <Button key="submit" type="primary" onClick={handleSaveTask}>
                Guardar
              </Button>,
            ]}
          >
            <form>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '8px' }}>
                  <label style={{ marginBottom: '4px' }}>Nombre:</label>
                  <input type="text" value={name} onChange={handleNameChange} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '8px' }}>
                  <label style={{ marginBottom: '4px' }}>Descripción:</label>
                  <input type="text" value={description} onChange={handleDescriptionChange} />
                </div>
              </div>
            </form>
          </Modal>

          {/* Pasa los datos a la tabla */}
          <Tabla/>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Task;
