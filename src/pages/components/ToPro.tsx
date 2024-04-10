import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const ProgressBarChart = () => {
  const [progressData, setProgressData] = useState([]);

  const fetchData = async () => {
    try {
      // Obtener los datos de las metas totales con estado 1
      const totalResponse = await fetch('/api/databaseET');
      const totalResult = await totalResponse.json();
      const totalData = totalResult.data.filter(item => item.state === 1);

      // Obtener los datos de las metas aceptadas con estado 1
      const acceptedResponse = await fetch('/api/DB');
      const acceptedResult = await acceptedResponse.json();
      const acceptedData = acceptedResult.data.filter(item => item.state === 1);

      // Calcular el porcentaje de metas aceptadas
      const totalGoals = totalData.reduce((sum, item) => sum + item.Goal, 0);
      const acceptedGoals = acceptedData.reduce((sum, item) => sum + item.state, 0);
      const progressPercentage = totalGoals === 0 ? 0 : (acceptedGoals / totalGoals) * 100;

      console.log('Total de meta:', totalGoals);
      console.log('Metas aceptadas:', acceptedGoals);
      console.log('Porcentaje progreso:', progressPercentage);

      setProgressData([{ name: 'Progreso', value: progressPercentage }]);
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

  return (
    <BarChart width={400} height={100} data={progressData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" hide />
      <YAxis type="number" domain={[0, 100]} hide />
      <Tooltip />
      <Legend />
      <Bar
        dataKey="value"
        fill="rgba(75, 192, 192, 0.6)"
        label={{ position: 'insideTop', content: `${progressData[0]?.value}%` }}
        animationBegin={0}
      />
    </BarChart>
  );
};

export default ProgressBarChart;
