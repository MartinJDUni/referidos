import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

// Define la interfaz para describir la estructura de los objetos en el array
interface ProgressData {
  name: string;
  value: number;
}

interface GoalData {
  state: number;
  Goal: number;
  // Otros campos si existen
}

const ProgressBarChart = () => {
  const [progressData, setProgressData] = useState<ProgressData[]>([]); // Define el tipo de progressData como ProgressData[]

  const fetchData = async () => {
    try {
      // Obtener los datos de las metas totales con estado 1
      const totalResponse = await fetch('/api/databaseET');
      const totalResult = await totalResponse.json();
      
      // Filtrar el array usando la interfaz GoalData
      const totalData = totalResult.data.filter((item: GoalData) => item.state === 1);
      
      // Obtener los datos de las metas aceptadas con estado 1
      const acceptedResponse = await fetch('/api/DB');
      const acceptedResult = await acceptedResponse.json();
      const acceptedData = acceptedResult.data.filter((item: GoalData) => item.state === 1);

      // Calcular el porcentaje de metas aceptadas
      const totalGoals = totalData.reduce((sum: number, item: GoalData) => sum + item.Goal, 0);
      const acceptedGoals = acceptedData.reduce((sum: number, item: GoalData) => sum + item.state, 0);
      const progressPercentage = totalGoals === 0 ? 0 : (acceptedGoals / totalGoals) * 100;

      console.log('Total de metas:', totalGoals);
      console.log('Metas aceptadas:', acceptedGoals);
      console.log('Porcentaje de progreso:', progressPercentage);

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
        label={{ position: 'insideTop', content: ({ value }) => `${value}%` }} // Envuelve el contenido dentro de una función
        animationBegin={0}
      />
    </BarChart>
  );
};

export default ProgressBarChart;
