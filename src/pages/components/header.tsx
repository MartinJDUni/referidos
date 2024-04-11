// Header.js
import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from '@ant-design/icons';

interface HeaderComponentProps {
  collapsed: boolean;
  onToggle: () => void;
}

const HeaderComponent: React.FC<HeaderComponentProps> = ({ collapsed, onToggle }) => {
  const [userId, setUserId] = useState<number | null>(null); // Se asume que userId es un número
  const [userName, setUserName] = useState<string | null>(null); // Se asume que userName es una cadena de texto

  useEffect(() => {
    // Obtener userId de localStorage al cargar la página
    const storedUserId = localStorage.getItem('userId');
    const storedUserName = localStorage.getItem('userName');
    setUserId(storedUserId ? parseInt(storedUserId, 10) : null); // Se convierte a número si es posible
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
