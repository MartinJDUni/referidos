import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

const CustomBarChart = () => {
  const [chartData, setChartData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/databaseET');
      if (response.ok) {
        const result = await response.json();
        const filteredData = result.data.filter(item => item.state === 1);

        setChartData(filteredData);
      } else {
        console.error('Error al obtener datos de la API');
      }
    } catch (error) {
      console.error('Error al procesar datos:', error);
    }
  };

  useEffect(() => {
    fetchData();
    const pollingInterval = setInterval(() => {
      fetchData();
    }, 5000);

    return () => {
      clearInterval(pollingInterval);
    };
  }, []);

  return (
    <div className="custom-chart-container" style={{ background: '#FFFFFF', width: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <h3 style={{ fontSize: '20px', margin: '0' }}>Gráfica de empleado por tarea</h3>
      </div>
      <BarChart width={600} height={380} data={chartData}>
        <CartesianGrid stroke="transparent" />
        <XAxis dataKey="EmployeeName" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Goal" fill="#0174BE" name="Meta" /> {/* Cambiar color a verde */}
        <Bar dataKey="TaskName" fill="#D71313" name="Tarea" /> {/* Cambiar color a azul */}
      </BarChart>
    </div>
  );
};

export default CustomBarChart;
