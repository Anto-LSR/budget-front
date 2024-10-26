// PieChart.jsx
import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Enregistrer les composants Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ chartData }) => {
  const data = {
    labels: chartData.map(item => item.label), // Utiliser les labels du tableau de données
    datasets: [
      {
        label: 'Dépenses et Revenus',
        data: chartData.map(item => item.value), // Utiliser les valeurs du tableau de données
        backgroundColor: chartData.map((_, index) =>
          `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.6)` // Couleurs aléatoires
        ),
        borderColor: chartData.map((_, index) =>
          `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`
        ),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            let label = context.label || '';
            if (context.parsed > 0) {
              label += `: ${context.parsed}`;
            }
            return label;
          },
        },
      },
    },
  };

  return (
    <div className="w-full max-w-xs mx-auto">
      <Pie data={data} options={options} />
    </div>
  );
};

export default PieChart;
