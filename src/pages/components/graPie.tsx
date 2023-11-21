import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

const CustomBarChart = () => {
  const [totalChartData, setTotalChartData] = useState([]);
  const [completedChartData, setCompletedChartData] = useState([]);

  const fetchData = async () => {
    try {
      // Obtener el total de metas por tarea
      const totalResponse = await fetch('/api/databaseET');
      if (totalResponse.ok) {
        const totalResult = await totalResponse.json();

        const totalData = totalResult.data;

        // Filtrar solo los elementos con estado 1
        const filteredTotalData = totalData.filter(item => item.state === 1);

        // Agrupar los datos por tarea y sumar las metas
        const groupedTotalData = filteredTotalData.reduce((accumulator, current) => {
          const existingItem = accumulator.find(item => item.TaskName === current.TaskName);

          if (existingItem) {
            existingItem.Total += current.Goal;
          } else {
            accumulator.push({
              TaskName: current.TaskName,
              Total: current.Goal
            });
          }

          return accumulator;
        }, []);

        setTotalChartData(groupedTotalData);
      } else {
        console.error('Error al obtener datos totales de la API');
      }

      // Obtener el total de metas completadas (estado "ACEPTADO") por tarea
      const completedResponse = await fetch('/api/DB');
      if (completedResponse.ok) {
        const completedResult = await completedResponse.json();

        const completedData = completedResult.data;

        // Filtrar solo los elementos con estado 1
        const filteredCompletedData = completedData.filter(item => item.state === 1);

        // Agrupar los datos por tarea y sumar las metas completadas
        const groupedCompletedData = filteredCompletedData.reduce((accumulator, current) => {
          const existingItem = accumulator.find(item => item.TaskName === current.TaskName);

          if (existingItem) {
            existingItem.Completed += current.Goal;
          } else {
            accumulator.push({
              TaskName: current.TaskName,
              Completed: current.Goal
            });
          }

          return accumulator;
        }, []);

        setCompletedChartData(groupedCompletedData);

      } else {
        console.error('Error al obtener datos de tareas completadas de la API');
      }
    } catch (error) {
      console.error('Error al procesar datos:', error);
    }
  };

  useEffect(() => {
    // Realizar la primera consulta al cargar el componente
    fetchData();

    // Configurar una consulta periódica cada 5 segundos (ajusta el intervalo según tus necesidades)
    const pollingInterval = setInterval(() => {
      fetchData();
    }, 5000);

    return () => {
      clearInterval(pollingInterval); // Limpiar el intervalo al desmontar el componente
    };
  }, []);

  // Combinar la información de total y completado
  const combinedChartData = totalChartData.map(item => ({
    TaskName: item.TaskName,
    Total: item.Total,
    Completed: completedChartData.find(completedItem => completedItem.TaskName === item.TaskName)?.Completed || 0
  }));

  return (
    <div className="custom-chart-container" style={{ background: 'white', width: '800px', margin: '20px auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <h3 style={{ fontSize: '20px', margin: '0' }}>Gráfica de meta por tarea</h3>
      </div>
      <BarChart width={600} height={380} data={combinedChartData}>
        <CartesianGrid stroke="transparent" />
        <XAxis dataKey="TaskName" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Total" fill="#D71313" name="Total de Metas por Tarea" /> {/* Cambiar color a amarillo */}
        <Bar dataKey="Completed" fill="#3F51B5" name="Metas Completadas por Tarea" /> {/* Cambiar color a índigo */}
      </BarChart>
    </div>
  );
};

export default CustomBarChart;
