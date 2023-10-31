// Header.js
import React from 'react';
import { Button } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from '@ant-design/icons';

const HeaderComponent = ({ collapsed, onToggle }) => (
  <header style={{ background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px' }}>
    <div>
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={onToggle}
        style={{
          fontSize: '16px',
          width: 64,
          height: 64,
          marginRight: 16,
        }}
      />
    </div>
    <div>
      <span style={{ fontSize: '16px', marginRight: 16 }}>Nombre de Usuario</span>
      <UserOutlined style={{ fontSize: '24px' }} />
    </div>
  </header>
);

export default HeaderComponent;
