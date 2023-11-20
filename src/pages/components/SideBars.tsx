import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BarChartOutlined, TeamOutlined, EditOutlined, LogoutOutlined, ScheduleOutlined, CommentOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import router from 'next/router';

const { Sider } = Layout;
const handleLogout = () => {
  // Elimina la información de autenticación al cerrar sesión
  localStorage.removeItem('userId');

  // Redirige a la página de inicio de sesión
  router.push('/');
};

const SidebarComponent = ({ collapsed }) => {
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

  return (
    <Sider trigger={null} collapsible collapsed={collapsed}>
      {!collapsed && (
        <div className="logo-container">
          <Image src="/images/logo3.png" alt="Logo" width={150} height={80} />
        </div>
      )}
      <Menu theme="dark" mode="vertical" selectedKeys={[currentPath]}>
        <Menu.Item key="/Admin/Graphics" icon={<BarChartOutlined />}>
          <Link href="/Admin/Graphics" style={{ textDecoration: 'none' }}>Gráficas</Link>
        </Menu.Item>
        <Menu.Item key="/Admin/Employee" icon={<TeamOutlined />}>
          <Link href="/Admin/Employee" style={{ textDecoration: 'none' }}>Trabajadores</Link>
        </Menu.Item>
        <Menu.Item key="/Admin/Tasks" icon={<ScheduleOutlined />}>
          <Link href="/Admin/Tasks" style={{ textDecoration: 'none' }}>Tareas</Link>
        </Menu.Item>
        <Menu.Item key="/Admin/AdminC" icon={<CommentOutlined />}>
          <Link href="/Admin/AdminC" style={{ textDecoration: 'none' }}>Comentarios</Link>
        </Menu.Item>
      </Menu>
      <Menu theme="dark" mode="vertical" style={{ position: 'absolute', bottom: '0', width: '100%' }}>
        <Menu.Item key="/Admin/EditProfile" icon={<EditOutlined />}>
          <Link href="/Admin/EditProfile">Editar Perfil</Link>
        </Menu.Item>
        <Menu.Item key="/components/login" icon={<LogoutOutlined />}>
          <button onClick={handleLogout}>salir</button>
        </Menu.Item>
      </Menu>

      <style jsx>{`
        .logo-container {
          text-align: center;
          margin: 16px;
        }

        .logo-container img {
          display: block;
        }
      `}</style>
    </Sider>
  );
};

export default SidebarComponent;
