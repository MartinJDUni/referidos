import React, { useState } from 'react';
import { Layout } from 'antd';
import HeaderComponent from "@/pages/components/headeremployee";
import SidebarComponent from "@/pages/components/sidebaremployee";
import CommentList from '../components/listComent';
import DataGridPremiumDemo from '../components/seguimientoporEmpleado';

const { Header, Content } = Layout;

const Inicio: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mostrarOtroComponente, setMostrarOtroComponente] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState<number | null>(null);

  const handleToggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleVerComentariosClick = (id: number) => {
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
          {mostrarOtroComponente && selectedCommentId !== null ? (
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
