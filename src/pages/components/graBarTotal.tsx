import React, { useState, useEffect, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

const CustomBarChart = () => {
  const [chartData, setChartData] = useState([]);

  const fetchData = useCallback(() => {
    fetch('/api/graBarrasTotal')
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al obtener los datos de la API de barras');
        }
        return response.json();
      })
      .then(resultET => {
        if (resultET && Array.isArray(resultET.data)) {
          const formattedData = resultET.data.map((row: any) => ({
            idRol: row.idRol,
            nombreRol: row.nombreRol,
            totalTareas: row.totalTareas,
          }));
          setChartData(formattedData);
        } else {
          console.error('La respuesta de la API no es válida:', resultET);
        }
      })
      .catch(error => {
        console.error('Error al obtener datos de la API:', error);
      });
  }, []);


  useEffect(() => {
    fetchData();
    const pollingInterval = setInterval(fetchData, 5000);

    return () => {
      clearInterval(pollingInterval);
    };
  }, [fetchData]);

  return (
    <div className="custom-chart-container" style={{
      background: '#FFFFFF', width: '100%', maxWidth: '800px', margin: '0 auto', display: 'flex',
      flexDirection: 'column', alignItems: 'center', padding: '20px', borderRadius: '10px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h3 style={{ fontSize: '20px', margin: '0' }}>Gráfica de empleado por tarea</h3>
      </div>
      <div style={{ width: '100%', maxWidth: '600px' }}>
        <BarChart width={300} height={190} data={chartData}>
          <CartesianGrid stroke="transparent" />
          <XAxis dataKey="nombreRol" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="totalTareas" fill="#0174BE" name="Total de Tareas" />
        </BarChart>
      </div>
    </div>
  );
};

export default CustomBarChart;
