import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

const CustomBarChart = () => {
  const [chartData, setChartData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/databaseET');
      if (response.ok) {
        const result = await response.json();

        // Agrupa los datos por tarea y suma las metas
        const groupedData = result.data.reduce((accumulator, current) => {
          const existingItem = accumulator.find(item => item.TaskName === current.TaskName);

          if (existingItem) {
            existingItem.Goal += current.Goal;
          } else {
            accumulator.push({
              TaskName: current.TaskName,
              Goal: current.Goal
            });
          }

          return accumulator;
        }, []);

        setChartData(groupedData);
      } else {
        console.error('Error al obtener datos de la API');
      }
    } catch (error) {
      console.error('Error al procesar datos:', error);
    }
  };

  useEffect(() => {
    // Realiza la primera consulta al cargar el componente
    fetchData();

    // Configura una consulta periódica cada 5 segundos (ajusta el intervalo según tus necesidades)
    const pollingInterval = setInterval(() => {
      fetchData();
    }, 5000);

    return () => {
      clearInterval(pollingInterval); // Limpia el intervalo al desmontar el componente
    };
  }, []);

  return (
    <BarChart width={800} height={400} data={chartData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="TaskName" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="Goal" fill="rgba(75, 192, 192, 0.6)" name="Meta Total por Tarea" />
    </BarChart>
  );
};

export default CustomBarChart;
