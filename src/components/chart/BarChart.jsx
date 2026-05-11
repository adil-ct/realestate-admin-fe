import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = () => {
  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Sales Analytics',
        backgroundColor: '#34c38f',
        borderColor: '#34c38f',
        borderWidth: 1,
        hoverBackgroundColor: '#34c38f',
        hoverBorderColor: '#34c38f',
        data: [65, 59, 81, 45, 56, 80, 50, 20],
      },
    ],
  };

  const option = {
    scales: {
      x: 
        {
          barPercentage: 0.4,
        },
      
    },
  };

  return <Bar width={474} height={300} data={data} options={option} />;
};

export default BarChart;