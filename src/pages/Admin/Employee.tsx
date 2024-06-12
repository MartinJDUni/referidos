import React, { useState, useEffect } from 'react';
import { Layout, Button, Modal, Select, Spin, Form, Input, message } from 'antd';
import HeaderComponent from "@/pages/components/header";
import SidebarComponent from "@/pages/components/SideBars";
import Tabla from '../components/tableEmployee';

const { Header, Content } = Layout;
const { Option } = Select;

const Employee: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<{ id: number; name: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await fetch('/api/roles');
      const data = await response.json();
      if (data) {
        const rolesData = data.map((role: any) => ({ id: role.id, name: role.rol }));
        setRoles(rolesData);
      }
    } catch (error) {
      console.error('Error al obtener roles:', error);
    }
  };

  const handleToggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleShowModal = () => {
    setModalVisible(true);
  };

  const handleHideModal = () => {
    setModalVisible(false);
    form.resetFields();
    setError(null);
    setSuccessMessage(null);
  };

  const handleSaveEmployee = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      const response = await fetch('/api/databaseemployee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      const result = await response.json();
      console.log('Trabajador guardado exitosamente:', result);
      message.success('Trabajador añadido exitosamente.');
    } catch (error) {
      console.error('Error al guardar el trabajador:', error);
      setError('Error al guardar el trabajador. Inténtalo de nuevo más tarde.');
    } finally {
      setLoading(false);
      setTimeout(() => {
        setSuccessMessage(null);
        setError(null);
        handleHideModal();
      }, 2000);
    }
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
              onClick={handleShowModal}
              type="primary"
              style={{ background: '#1890ff', borderColor: '#1890ff', marginRight: '16px' }}
            >
              Agregar empleado
            </Button>
          </div>
          <div className="data-grid" style={{ flex: 1, marginRight: '20px', padding: '20px', backgroundColor: 'white', display: 'flex', flexDirection: 'column' }}>
            <Tabla />
          </div>
          <Modal
            title="Agregar Trabajador"
            visible={modalVisible}
            onOk={handleSaveEmployee}
            onCancel={handleHideModal}
            footer={[
              <Button key="back" onClick={handleHideModal}>
                Cancelar
              </Button>,
              <Button key="submit" type="primary" onClick={handleSaveEmployee} loading={loading}>
                Guardar
              </Button>,
            ]}
          >
            <Form form={form} layout="vertical">
              {error && <p style={{ color: 'red', marginBottom: '8px' }}>{error}</p>}
              {successMessage && <p style={{ color: 'green', marginBottom: '8px' }}>{successMessage}</p>}
              <Form.Item
                name="name"
                label="Nombre"
                rules={[{ required: true, message: 'Por favor ingresa el nombre del empleado' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="password"
                label="Contraseña"
                rules={[{ required: true, message: 'Por favor ingresa la contraseña' }]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                name="idRol"
                label="Rol del Empleado"
                rules={[{ required: true, message: 'Por favor selecciona el rol del empleado' }]}
              >
                <Select placeholder="Selecciona un rol">
                  {roles.map(roleOption => (
                    <Option key={roleOption.id} value={roleOption.id}>{roleOption.name}</Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="email"
                label="Correo Electrónico"
                rules={[{ required: true, message: 'Por favor ingresa el correo electrónico' }]}
              >
                <Input type="email" />
              </Form.Item>
            </Form>
          </Modal>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Employee;
