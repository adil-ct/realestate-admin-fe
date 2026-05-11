import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = () => {
  const data = {
    labels: ['Desktops', 'Tablets'],
    datasets: [
      {
        data: [300, 180],
        backgroundColor: ['#34c38f', '#ebeff2'],
        hoverBackgroundColor: ['#34c38f', '#ebeff2'],
        hoverBorderColor: '#fff',
      },
    ],
  };

  // Provide an empty options object even if you don't have custom options
  const options = {};

  return <Pie width={474} height={300} data={data} options={options} />;
};

export default PieChart;