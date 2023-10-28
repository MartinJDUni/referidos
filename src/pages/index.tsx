// App.js
import React, { useState } from 'react';
import { Layout } from 'antd';
import HeaderComponent from "@/pages/components/header";
import SidebarComponent from "@/pages/components/SideBars";
import MainContent from './components/Main';

const { Header, Content } = Layout;

const App: React.FC = () => {
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
          <MainContent/>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
