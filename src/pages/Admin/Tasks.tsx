import React, { useState, useEffect } from 'react';
import { Layout, Button, Modal, Form, Input, InputNumber, message, Select } from 'antd';
import HeaderComponent from "@/pages/components/header";
import SidebarComponent from "@/pages/components/SideBars";
import Tabla from '../components/tablaTask';

const { Header, Content } = Layout;
const { Option } = Select;

const Task: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isAddTaskModalVisible, setIsAddTaskModalVisible] = useState(false);
  const [roles, setRoles] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    // Función para cargar roles desde la API
    const fetchRoles = async () => {
      try {
        const response = await fetch('/api/roles'); // Asegúrate de que la API de roles esté correctamente configurada
        if (!response.ok) {
          throw new Error('Error al cargar los roles');
        }
        const data = await response.json();
        setRoles(data);
      } catch (error) {
        console.error('Error al cargar los roles:', error);
        message.error('Error al cargar los roles');
      }
    };

    fetchRoles();
  }, []);

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

  const handleSaveTask = async () => {
    try {
      const values = await form.validateFields();
      // Realizar solicitud HTTP POST al servidor
      const response = await fetch('/api/database', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          task: values.task,
          idRol: values.role, // Enviar el id del rol
          status: 1, // Puedes ajustar el status aquí si es necesario
          percentages: values.percentage,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al guardar la tarea');
      }

      const data = await response.json();
      console.log('Respuesta del servidor:', data);
      message.success('Tarea guardada exitosamente');
      handleHideAddTaskModal();
    } catch (error) {
      console.error('Error al guardar la tarea:', error);
      message.error('Error al guardar la tarea');
    }
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
            open={isAddTaskModalVisible}
            onOk={handleSaveTask}
            onCancel={handleHideAddTaskModal}
            okText="Guardar"
            cancelText="Cancelar"
          >
            <Form
              form={form}
              layout="vertical"
            >
              <Form.Item
                label="Tarea"
                name="task"
                rules={[{ required: true, message: 'Por favor, ingrese la tarea' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Rol"
                name="role"
                rules={[{ required: true, message: 'Por favor, seleccione un rol' }]}
              >
                <Select placeholder="Seleccione un rol">
                  {roles.map(role => (
                    <Option key={role.id} value={role.id}>
                      {role.id} - {role.rol}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="Porcentaje"
                name="percentage"
                rules={[
                  { required: true, message: 'Por favor, ingrese un porcentaje' },
                  { type: 'number', min: 0, max: 100, message: 'El porcentaje debe estar entre 0 y 100' }
                ]}
              >
                <InputNumber
                  min={0}
                  max={100}
                  formatter={value => `${value}%`}
                  parser={value => value?.replace('%', '')}
                  style={{ width: '100%' }}
                />
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
