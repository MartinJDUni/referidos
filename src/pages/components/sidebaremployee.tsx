import Link from 'next/link';
import { BarChartOutlined, TeamOutlined, EditOutlined, LogoutOutlined, ScheduleOutlined, CommentOutlined } from '@ant-design/icons'; // Importa los íconos faltantes
import { Layout, Menu } from 'antd';
import router from 'next/router';

const { Sider } = Layout;
const handleLogout = () => {
  // Elimina la información de autenticación al cerrar sesión
  localStorage.removeItem('userId');

  // Redirige a la página de inicio de sesión
  router.push('/');
};
const SidebarComponent = ({ collapsed }) => (
  <Sider trigger={null} collapsible collapsed={collapsed}>
    <div className="demo-logo-vertical" />
    <Menu
      theme="dark"
      mode="vertical"
      defaultSelectedKeys={['1']}
    >
      <Menu.Item key="1" icon={<BarChartOutlined />}>
        <Link href="/Employee/InicioEmployee" style={{ textDecoration: 'none' }}>Gráficas</Link>
      </Menu.Item>
      <Menu.Item key="4" icon={<CommentOutlined />}>
        <Link href="/Employee/seguimiento" style={{ textDecoration: 'none' }}>Seguimiento</Link>
      </Menu.Item>
    </Menu>
    <Menu
      theme="dark"
      mode="vertical"
      style={{ position: 'absolute', bottom: '0', width: '100%' }}
    >
      <Menu.Item key="4" icon={<EditOutlined />}>
        Editar Perfil
      </Menu.Item>
      <Menu.Item key="5" icon={<LogoutOutlined />}>
        <button onClick={handleLogout}>salir</button>
      </Menu.Item>
    </Menu>
  </Sider>
);
export default SidebarComponent;
