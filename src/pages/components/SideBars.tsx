// Sidebar.js
import React from 'react';
import { UserOutlined, VideoCameraOutlined, UploadOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';

const { Sider } = Layout;

const SidebarComponent = ({ collapsed }) => (
    <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['1']}
        >
            <Menu.Item key="1" icon={<UserOutlined />}>
                Nav 1
            </Menu.Item>
            <Menu.Item key="2" icon={<VideoCameraOutlined />}>
                Nav 2
            </Menu.Item>
            <Menu.Item key="3" icon={<UploadOutlined />}>
                Nav 3
            </Menu.Item>
        </Menu>
    </Sider>
);

export default SidebarComponent;
