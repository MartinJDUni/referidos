import Link from 'next/link';
import { BarChartOutlined, TeamOutlined, EditOutlined, LogoutOutlined, ScheduleOutlined, CommentOutlined } from '@ant-design/icons'; // Importa los íconos faltantes
import { Layout, Menu } from 'antd';

const { Sider } = Layout;

const SidebarComponent = ({ collapsed }) => (
  <Sider trigger={null} collapsible collapsed={collapsed}>
    <div className="demo-logo-vertical" />
    <Menu
      theme="dark"
      mode="vertical"
      defaultSelectedKeys={['1']}
    >
      <Menu.Item key="1" icon={<BarChartOutlined />}>
        <Link href="/Admin/Graphics" style={{ textDecoration: 'none' }}>Gráficas</Link>
      </Menu.Item>
      <Menu.Item key="2" icon={<TeamOutlined />}>
        <Link href="/Admin/Employee" style={{ textDecoration: 'none' }}>Trabajadores</Link>
      </Menu.Item>
      <Menu.Item key="3" icon={<ScheduleOutlined />}>
        <Link href="/Admin/Tasks" style={{ textDecoration: 'none' }}>Gráficas</Link>
      </Menu.Item>
      <Menu.Item key="4" icon={<CommentOutlined />}>
        <Link href="/Admin/Comentarios" style={{ textDecoration: 'none' }}>Comentarios</Link>
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
        <Link href="/components/login" style={{ textDecoration: 'none' }}>Cerrar Sesión</Link>
      </Menu.Item>
    </Menu>
  </Sider>
);

export default SidebarComponent;



