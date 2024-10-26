import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import "tailwindcss/tailwind.css";

// Enregistrer les composants Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ chartData }) => {
  const tailwindColors = [
    "#EF4444", // red-500
    "#3B82F6", // blue-500
    "#10B981", // green-500
    "#F59E0B", // yellow-500
    "#8B5CF6", // purple-500
    "#EC4899", // pink-500
    "#6366F1", // indigo-500
    "#6B7280", // gray-500
  ];

  const data = {
    labels: chartData.map((item) => item.label),
    datasets: [
      {
        label: "Dépenses et Revenus",
        data: chartData.map((item) => item.value),
        backgroundColor: chartData.map(
          (_, index) => tailwindColors[index % tailwindColors.length]
        ),
        borderColor: chartData.map(
          (_, index) => tailwindColors[index % tailwindColors.length]
        ),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allow chart to take up full height
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            let label = context.label || "";
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
    <div className="relative w-full h-64 md:h-80 lg:h-96">
      {" "}
      {/* Adjust height as needed */}
      <Pie data={data} options={options} />
    </div>
  );
};

export default PieChart;
