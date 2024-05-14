import React, { useState, useEffect } from 'react';
import Chart from 'chart.js/auto';

const CustomLineChart = () => {
  const [chart, setChart] = useState<Chart<"line"> | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/timeChartData');
        if (!response.ok) {
          throw new Error(`Error al obtener los datos de la API: ${response.statusText}`);
        }
        const resultET = await response.json();

        const sortedData = resultET.data.sort((a: any, b: any) => {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        });

        const monthData = new Array(12).fill(0);
        sortedData.forEach((entry: { date: any; cantidad_aceptados: any; }) => {
          const month = new Date(entry.date).getMonth();
          monthData[month] = entry.cantidad_aceptados;
        });

        const labels = Array.from({ length: 12 }, (_, index) => {
          const dateObj = new Date();
          dateObj.setMonth(index);
          return dateObj.toLocaleString('default', { month: 'short' });
        });

        const ctx = document.getElementById('line-chart') as HTMLCanvasElement | null;
        if (ctx !== null) {
          if (chart !== null) {
            chart.data.labels = labels;
            chart.data.datasets[0].data = monthData;
            chart.update();
          } else {
            const newChart = new Chart(ctx, {
              type: 'line',
              data: {
                labels: labels,
                datasets: [{
                  label: 'Aceptados',
                  data: monthData,
                  fill: false,
                  borderColor: 'rgb(75, 192, 192)',
                  tension: 0.1
                }]
              }
            });
            setChart(newChart);
          }
        } else {
          console.error('No se encontró el elemento con ID "line-chart"');
        }
      } catch (error) {
        console.error('Error al obtener datos de la API:', error);
      }
    };
    fetchData();
    const pollingInterval = setInterval(fetchData, 5000);
    return () => {
      clearInterval(pollingInterval);
    };
  }, [chart]);

  return (
    <div className="custom-chart-container" style={{ background: 'white', maxWidth: '800px', margin: '20px auto', 
    display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' ,boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',borderRadius: '10px'}}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '20px', margin: '0' }}>Gráfica de tiempo</h3>
      </div>
      <canvas id="line-chart" width="600" height="300"></canvas>
    </div>
  );
};

export default CustomLineChart;
