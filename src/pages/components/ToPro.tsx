import React, { useState, useEffect } from 'react';

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
      <h4 style={{ marginBottom: '10px' }}>Progreso de Aceptados</h4>
      <div
        className="progress-bar"
        style={{
          width: '100%',
          height: '20px',
          border: '1px solid #ccc',
          borderRadius: '5px',
          backgroundColor: '#f0f0f0',
          boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div
          className="progress"
          style={{
            width: barraAncho,
            height: '100%',
            borderRadius: '5px',
            backgroundColor: barraColor,
          }}
        ></div>
      </div>
      <p style={{ marginTop: '5px' }}>{`${porcentaje.toFixed(2)}%`}</p>
    </div>
  );
  
};

export default ProgressBars;
