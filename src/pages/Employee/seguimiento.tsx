import React, { useState } from 'react';
import { Layout } from 'antd';
import HeaderComponent from "@/pages/components/headeremployee";
import SidebarComponent from "@/pages/components/sidebaremployee";
import DataGridPremiumDemo from '../components/tablaEC';

const { Header, Content } = Layout;

const Inicio: React.FC = () => {
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
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
          }}
        >
        <DataGridPremiumDemo/>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Inicio;
