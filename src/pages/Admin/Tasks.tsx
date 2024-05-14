import React, { useState } from 'react';
import { Layout, Button, Modal, Form, Input, message } from 'antd';
import HeaderComponent from "@/pages/components/header";
import SidebarComponent from "@/pages/components/SideBars";
import Tabla from '../components/tablaTask';

const { Header, Content } = Layout;

const Task: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isAddTaskModalVisible, setIsAddTaskModalVisible] = useState(false);
  const [form] = Form.useForm();

  const handleToggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleShowAddTaskModal = () => {
    setIsAddTaskModalVisible(true);
  };

  const handleHideAddTaskModal = () => {
    setIsAddTaskModalVisible(false);
    form.resetFields();
  };

  const handleSaveTask = () => {
    form.validateFields()
      .then(values => {
        // Realizar solicitud HTTP POST al servidor
        fetch('/api/database', { // Cambia '/api/task' por '/api/database'
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        })
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Error al guardar la tarea');
          }
        })
        .then(data => {
          console.log('Respuesta del servidor:', data);
          message.success('Tarea guardada exitosamente');
          handleHideAddTaskModal();
        })
        .catch(error => {
          console.error('Error al guardar la tarea:', error);
          message.error('Error al guardar la tarea');
        });
      })
      .catch(error => {
        console.error('Error al validar el formulario:', error);
      });
  };
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <SidebarComponent collapsed={collapsed} />
      <Layout>
        <HeaderComponent collapsed={collapsed} onToggle={handleToggleSidebar} />
        <Content
          style={{
            margin: '90px 30px 15px',
            padding: 15,
            minHeight: 280,
            position: 'relative',
            backgroundColor: '#fff',
            marginLeft: '30px', 
          }}
        >
          <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '-1px' }}>Listado de tareas</h1>
            <Button
              onClick={handleShowAddTaskModal}
              type="primary"
              style={{ position: 'absolute', top: -60, right: 0 }}
            >
              Agregar tarea
            </Button>
          </div>
          <Modal
            title="Agregar Tarea"
            visible={isAddTaskModalVisible}
            onOk={handleSaveTask}
            onCancel={handleHideAddTaskModal}
            okText="Guardar"
            cancelText="Cancelar"
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSaveTask}
            >
              <Form.Item
                label="Tarea"
                name="task"
                rules={[{ required: true, message: 'Por favor, ingrese la tarea' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Descripción"
                name="description"
                rules={[{ required: true, message: 'Por favor, ingrese la descripción' }]}
              >
                <Input.TextArea rows={4} />
              </Form.Item>
            </Form>
          </Modal>

          <Tabla />
        </Content>
      </Layout>
    </Layout>
  );
};

export default Task;
