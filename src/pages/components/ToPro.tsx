import React, { useState, useEffect } from 'react';
import '@/styles/progress.module.css';

const ProgressBars = () => {
  const [totalAceptados, setTotalAceptados] = useState(0);
  const [totalColumnaTotal, setTotalColumnaTotal] = useState(0);

  const fetchData = React.useCallback(() => {
    fetch('/api/graPro')
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Error al obtener los datos de la API');
      })
      .then(responseData => {
        const { data } = responseData;
        const { total_aceptados, total_columna_total } = data[0];
        setTotalAceptados(total_aceptados);
        setTotalColumnaTotal(total_columna_total);
      })
      .catch(error => {
        console.error('Error al obtener datos de la API:', error);
      });
  }, []);

  React.useEffect(() => {
    fetchData();

    const pollingInterval = setInterval(() => {
      fetchData();
    }, 5000);

    return () => {
      clearInterval(pollingInterval);
    };
  }, []);

  const porcentaje = (totalAceptados * 100) / totalColumnaTotal;
  const barraColor = porcentaje < 50 ? '#f44336' : porcentaje < 80 ? '#ffc107' : '#4caf50';
  const barraAncho = `${Math.min(porcentaje, 100)}%`;

  return (
    <div style={{ textAlign: 'center' }}>
      <h4 style={{ marginBottom: '10px' }}>Progreso de Sede</h4>
      <div
        className="progress-bar-container"
        style={{
          width: '100%',
          height: '20px',
          border: '1px solid #ccc',
          borderRadius: '5px',
          backgroundColor: '#f0f0f0',
          overflow: 'hidden', // Asegura que la barra de progreso esté oculta cuando no hay progreso
        }}
      >
        <div
          className="progress-bar"
          style={{
            width: porcentaje + '%',
            height: '100%',
            backgroundColor: '#0174BE',
            transition: 'width 0.5s ease-in-out', // Agrega una transición suave al cambio de ancho
          }}
        ></div>
      </div>
      <p style={{ marginTop: '5px' }}>{`${porcentaje.toFixed(2)}%`}</p>
    </div>

  );
};

export default ProgressBars;
