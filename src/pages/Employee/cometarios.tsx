import React, { useState } from 'react';
import { Layout } from 'antd';
import { useParams } from 'react-router-dom'; // Importa useParams
import HeaderComponent from "@/pages/components/headeremployee";
import SidebarComponent from "@/pages/components/sidebaremployee";
import { useRouter } from 'next/router';

const { Header, Content } = Layout;

const cometarios: React.FC = () => {
    const router = useRouter();
    const { id } = router.query;
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
                    <h1>ID recuperado de la URL: {id}</h1>
                </Content>
            </Layout>
        </Layout>
    );
};

export default cometarios;
