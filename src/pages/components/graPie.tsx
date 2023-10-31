import React, { useEffect, useRef } from 'react';
import Chart, { ChartType } from 'chart.js/auto';
import 'chartjs-plugin-datalabels'; // Importa el complemento

interface PieChartProps {
  data: number[];
  labels: string[];
}

const PieChart: React.FC<PieChartProps> = ({ data, labels }) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      if (chartInstance.current) {
        // Destruye el gráfico anterior si existe
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');

      if (ctx) {
        chartInstance.current = new Chart(ctx, {
          type: 'pie' as ChartType, // Asegura que el tipo es 'pie'
          data: {
            labels: labels,
            datasets: [
              {
                data: data,
                backgroundColor: [
                  'red', 'yellow', 'purple', 'orange', 'pink' // Colores personalizables
                ],
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              datalabels: {
                color: '#fff', // Color del texto dentro de las secciones
                font: {
                  weight: 'bold',
                },
                formatter: (value: number) => {
                  // Muestra el nombre de la sección y su valor
                  return `${labels[value.index as number]}: ${data[value.index as number]}`;
                },
              },
            },
          },
        });
      }
    }
  }, [data, labels]);

  return <canvas ref={chartRef} width={300} height={300} />;
};

export default PieChart;
