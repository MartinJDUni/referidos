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
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            overflow: 'auto',
          }}
        >
          {mostrarOtroComponente && selectedCommentId !== null ? (
            <CommentList id={selectedCommentId} />
          ) : (
            <div className="data-grid" style={{ height:'100%',flex: 1, marginRight: '20px', padding: '20px', backgroundColor: 'white', display: 'flex', flexDirection: 'column' }}>
              <DataGridPremiumDemo onClickVerComentarios={handleVerComentariosClick} />
            </div>
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default Inicio;
