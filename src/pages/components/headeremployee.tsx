import React, { useState, useEffect } from 'react';
import { Button, notification } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  ExclamationCircleOutlined,
  BellOutlined,
} from '@ant-design/icons';

const HeaderComponent: React.FC<{ collapsed: boolean; onToggle: () => void }> = ({ collapsed, onToggle }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [closedNotifications, setClosedNotifications] = useState<string[]>([]);

  useEffect(() => {
    // Obtener userId de localStorage al cargar la página
    const storedUserId = localStorage.getItem('userId');
    const storedUserName = localStorage.getItem('userName');
    setUserId(storedUserId);
    setUserName(storedUserName);
  }, []);

  useEffect(() => {
    // Verificar si la fecha está cerca y mostrar una notificación
    const checkFinalDate = async () => {
      try {
        // Realizar la petición a la API para obtener la fecha final
        const response = await fetch(`/api/dbprogres?employeeId=${userId}`);
        const result = await response.json();

        if (result && result.data && result.data.length > 0) {
          const task = result.data[0]; // Supongamos que solo hay una tarea, ajusta según tus necesidades
          const finalDate = new Date(task.Finaldate);
          const currentDate = new Date();
          const timeDifference = finalDate.getTime() - currentDate.getTime();
          const daysDifference = timeDifference / (1000 * 3600 * 24);

          const proximityThreshold = 3; // Días

          if (daysDifference <= proximityThreshold) {
            const notificationKey = `notification_${finalDate.getTime()}`;
            if (!closedNotifications.includes(notificationKey)) {
              notification.open({
                message: 'Fecha de finalización cercana',
                description: `La tarea está programada para finalizar pronto. Fecha de finalización: ${finalDate.toDateString()}`,
                icon: <ExclamationCircleOutlined style={{ color: '#FFA000' }} />,
                key: notificationKey,
                onClose: () => handleCloseNotification(notificationKey),
              });
            }
          }
        }
      } catch (error) {
        console.error('Error al obtener la fecha de finalización:', error);
      }
    };

    // Llama a la función al cargar el componente y cada vez que el usuario cambie
    checkFinalDate();

    // Configura un intervalo para verificar la fecha en intervalos regulares
    const intervalId = setInterval(() => {
      checkFinalDate();
    }, 1000 * 60 * 60); // Verifica cada hora

    // Limpia el intervalo al desmontar el componente
    return () => clearInterval(intervalId);
  }, [userId, closedNotifications]);

  const handleShowClosedNotifications = () => {
    // Abre todas las notificaciones cerradas
    setClosedNotifications([]);
  };

  const handleCloseNotification = (key: string) => {
    // Cierra una notificación y la agrega a la lista de cerradas
    setClosedNotifications((prevClosedNotifications) => [...prevClosedNotifications, key]);
  };

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
        <Button type="link" icon={<BellOutlined />} onClick={handleShowClosedNotifications} />
        <span style={{ fontSize: '16px', marginRight: 16 }}>{userName}</span>
        <UserOutlined style={{ fontSize: '24px' }} />
      </div>
    </header>
  );
};

export default HeaderComponent;
