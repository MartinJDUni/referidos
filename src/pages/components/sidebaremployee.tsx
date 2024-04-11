// Importa las definiciones necesarias
import { Layout, Menu } from 'antd';
import Image from 'next/image';
import router from 'next/router';
import Link from 'next/link';
import { BarChartOutlined, CommentOutlined, EditOutlined, LogoutOutlined } from '@ant-design/icons';

const { Sider } = Layout;

// Define la interfaz para las propiedades del componente
interface SidebarComponentProps {
  collapsed: boolean; // Declara collapsed como un booleano
}

// Define el componente SidebarComponent con la interfaz de propiedades
const SidebarComponent: React.FC<SidebarComponentProps> = ({ collapsed }) => {
  // Define la función handleLogout
  const handleLogout = () => {
    // Elimina la información de autenticación al cerrar sesión
    localStorage.removeItem('userId');

    // Redirige a la página de inicio de sesión
    router.push('/');
  };

  // Renderiza el componente Sidebar
  return (
    <Sider trigger={null} collapsible collapsed={collapsed}>
      {!collapsed && (
        <div className="logo-container">
          <Image src="/images/logo3.png" alt="Logo" width={150} height={80} />
        </div>
      )}
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
          <Link href="/" style={{ textDecoration: 'none' }} onClick={handleLogout}>Salir</Link>
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

// Exporta el componente SidebarComponent
export default SidebarComponent;
