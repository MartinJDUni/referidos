import React, { useState } from 'react';
import { Layout } from 'antd';
import HeaderComponent from "@/pages/components/header";
import SidebarComponent from "@/pages/components/SideBars";
import DataGridPremiumDemo from '../components/tablaCA';
import CommentList from '../components/listComent';

const { Header, Content } = Layout;

const Inicio: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mostrarOtroComponente, setMostrarOtroComponente] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState(null);

  const handleToggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleVerComentariosClick = (id: React.SetStateAction<null>) => {
    setMostrarOtroComponente(true);
    setSelectedCommentId(id);
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
          {mostrarOtroComponente ? (
            <CommentList id={selectedCommentId} />
          ) : (
            <DataGridPremiumDemo onClickVerComentarios={handleVerComentariosClick} />
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default Inicio;
