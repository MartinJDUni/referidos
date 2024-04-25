import React, { useState } from 'react';
import { Layout } from 'antd';
import HeaderComponent from "@/pages/components/headeremployee";
import SidebarComponent from "@/pages/components/sidebaremployee";
import CommentList from '../components/listComent';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const { Header, Content } = Layout;

const Cometarios: React.FC = () => {
  const router = useRouter();
  const { id } = router.query; // Obtiene el ID de la URL

  useEffect(() => {
    // Solo un ejemplo para verificar si se obtiene correctamente el ID
    console.log('ID:', id);
  }, [id]);


  const [collapsed, setCollapsed] = useState(false);

  const handleToggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <SidebarComponent collapsed={collapsed} />
      <Layout>
        <HeaderComponent collapsed={collapsed} onToggle={handleToggleSidebar} />
        <Content
        id='Ag2'
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
          }}
        >
        </Content>
      </Layout>
    </Layout>
  );
};

export default Cometarios;
