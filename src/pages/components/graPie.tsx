import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Tooltip, Legend, Cell } from 'recharts';

// Definir el tipo de los datos
interface PieData {
    name: string;
    value: number;
}

const PieChartComponent = () => {
    const [data, setData] = useState<PieData[]>([]); // Usar el tipo definido

    useEffect(() => {
        fetchData();
        const pollingInterval = setInterval(fetchData, 5000);

        return () => {
            clearInterval(pollingInterval);
        };
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch('/api/graPei');
            if (response.ok) {
                const result = await response.json();
                const formattedData = result.data.map((item: { nombre_empleado: any; total_tareas_aceptadas: any; }) => ({
                    name: item.nombre_empleado,
                    value: item.total_tareas_aceptadas,
                }));
                setData(formattedData);
            } else {
                console.error('Error al obtener datos del servidor');
            }
        } catch (error) {
            console.error('Error al procesar datos:', error);
        }
    };

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    // Función para calcular el porcentaje
    const getPercentage = (value: number) => ((value / data.reduce((acc, cur) => acc + cur.value, 0)) * 100).toFixed(2);

    return (
        <div style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: '20px', margin: '0' ,paddingBottom: '5px'}}>Gráfica de porcentaje por empleado</h3>
            </div>
            <PieChart width={300} height={230}>
                <Pie
                    data={data}
                    cx={150}
                    cy={100}
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `(${getPercentage(value)}%)`}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </div>
    );
};

export default PieChartComponent;
