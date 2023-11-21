// Header.js
import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from '@ant-design/icons';

const HeaderComponent = ({ collapsed, onToggle }) => {
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    // Obtener userId de localStorage al cargar la página
    const storedUserId = localStorage.getItem('userId');
    const storedUserName = localStorage.getItem('userName');
    setUserId(storedUserId);
    setUserName(storedUserName); // Corregido a setUserName
  }, []); // El segundo parámetro [] asegura que este efecto se ejecute solo una vez al montar el componente
  
  return (
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
        <span style={{ fontSize: '16px', marginRight: 16 }}>{userName}</span>
        <UserOutlined style={{ fontSize: '24px' }} />
      </div>
    </header>
  );
};

export default HeaderComponent;
