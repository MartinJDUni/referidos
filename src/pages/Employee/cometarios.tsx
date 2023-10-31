import React, { useState } from 'react';
import { Layout } from 'antd';
import { useParams } from 'react-router-dom'; // Importa useParams
import HeaderComponent from "@/pages/components/headeremployee";
import SidebarComponent from "@/pages/components/sidebaremployee";
import { useRouter } from 'next/router';
import CommentList from '../components/listComent';

const { Header, Content } = Layout;

const cometarios: React.FC = () => {
    const id = 3;
    const router = useRouter();
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
                <CommentList id={id} />
                </Content>
            </Layout>
        </Layout>
    );
};

export default cometarios;
