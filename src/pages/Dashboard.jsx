import React, { useEffect, useState } from "react";
import Modal from "../components/Modal";
import PieChart from "../components/Piechart";
import axios from "axios";

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [categoryChartData, setCategoryChartData] = useState([]);
  const [fixedCosts, setFixedCosts] = useState([]);
  const [onceExpenses, setOnceExpenses] = useState([]);
  const [subscriptionExpenses, setSubscriptionExpenses] = useState([]);
  const [installmentExpenses, setInstallmentExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);

  const fetchExpenses = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/expenses/getExpenseSummary`,
        { withCredentials: true }
      );
      setExpenses(response.data);

      const aggregatedData = response.data.reduce((acc, expense) => {
        const type = expense.type;
        if (type) {
          if (!acc[type]) {
            acc[type] = 0;
          }
          acc[type] += expense.amount;
          acc[type] = parseFloat(acc[type].toFixed(2));
        }
        return acc;
      }, {});

      const aggregatedCategoryData = response.data.reduce((acc, expense) => {
        const category = expense.categoryEntity?.name;
        if (category) {
          if (!acc[category]) {
            acc[category] = 0;
          }
          acc[category] += expense.amount;
          acc[category] = parseFloat(acc[category].toFixed(2));
        }
        return acc;
      }, {});

      setFixedCosts(
        response.data.filter((expense) => expense.type === "fixed")
      );
      setOnceExpenses(
        response.data.filter(
          (expense) =>
            expense.type === "once" &&
            new Date(expense.dateCreate).getMonth() === new Date().getMonth() &&
            new Date(expense.dateCreate).getFullYear() ===
              new Date().getFullYear()
        )
      );
      setSubscriptionExpenses(
        response.data.filter((expense) => expense.type === "subscription")
      );
      setInstallmentExpenses(
        response.data.filter((expense) => expense.type === "installment")
      );

      const typeTranslations = {
        fixed: "Charges fixes",
        once: "Dépenses du mois en cours",
        subscription: "Abonnements",
        installment: "Paiement en plusieurs fois",
      };

      const translatedData = response.data.map((expense) => {
        const translatedType = typeTranslations[expense.type] || expense.type;
        return { ...expense, type: translatedType };
      });

      setExpenses(translatedData);

      const chartData = Object.keys(aggregatedData).map((type) => ({
        label: typeTranslations[type] || type,
        value: aggregatedData[type],
      }));

      setChartData(chartData);

      const categoryChartData = Object.keys(aggregatedCategoryData).map(
        (category) => ({
          label: category,
          value: aggregatedCategoryData[category],
        })
      );
      setCategoryChartData(categoryChartData);
    } catch (error) {
      console.error("Erreur lors de la récupération des dépenses:", error);
    }
  };

  const fetchIncomes = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/incomes/getIncomes`,
        { withCredentials: true }
      );
      setIncomes(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des revenus:", error);
    }
  };

  useEffect(() => {
    fetchExpenses();
    fetchIncomes();
  }, []);

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <main className="flex-grow p-4 lg:p-8 relative z-10">
        <header className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Tableau de bord</h1>
        </header>

        <section className="gap-4">
          <h2 className="text-xl font-semibold mb-4">Résumé des dépenses</h2>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-l font-semibold">Revenus</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white shadow-md rounded-lg p-4">
                <h3 className="text-lg font-medium">Revenus fixes</h3>
                <p className="text-2xl font-bold">
                  {incomes
                    .filter((income) => income.isFixed)
                    .reduce((total, income) => total + income.amount, 0)
                    .toFixed(2)}{" "}
                  €
                </p>
              </div>
              <div className="bg-white shadow-md rounded-lg p-4">
                <h3 className="text-lg font-medium">Revenus Additionnels</h3>
                <p className="text-2xl font-bold">
                  {incomes
                    .filter((income) => !income.isFixed)
                    .reduce((total, income) => total + income.amount, 0)
                    .toFixed(2)}{" "}
                  €
                </p>
              </div>
              <div className="bg-white shadow-md rounded-lg p-4">
                <h3 className="text-lg font-medium">Revenus Totaux</h3>
                <p className="text-2xl font-bold">
                  {incomes
                    .reduce((total, income) => total + income.amount, 0)
                    .toFixed(2)}{" "}
                  €
                </p>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-l font-semibold">Dépenses</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white shadow-md rounded-lg p-4">
                <h3 className="text-lg font-medium">Charges fixes</h3>
                <p className="text-2xl font-bold">
                  {fixedCosts
                    .reduce((total, expense) => total + expense.amount, 0)
                    .toFixed(2)}{" "}
                  €
                </p>
              </div>
              <div className="bg-white shadow-md rounded-lg p-4">
                <h3 className="text-lg font-medium">
                  Dépenses du mois en cours
                </h3>
                <p className="text-2xl font-bold">
                  {onceExpenses
                    .reduce((total, expense) => total + expense.amount, 0)
                    .toFixed(2)}{" "}
                  €
                </p>
              </div>
              <div className="bg-white shadow-md rounded-lg p-4">
                <h3 className="text-lg font-medium">Abonnements</h3>
                <p className="text-2xl font-bold">
                  {subscriptionExpenses
                    .reduce((total, expense) => total + expense.amount, 0)
                    .toFixed(2)}{" "}
                  €
                </p>
              </div>
              <div className="bg-white shadow-md rounded-lg p-4">
                <h3 className="text-lg font-medium">
                  {
                    installmentExpenses.filter(
                      (expense) => expense.type === "installment"
                    ).length
                  }
                  &nbsp;
                  {installmentExpenses.filter(
                    (expense) => expense.type === "installment"
                  ).length > 1
                    ? "Paiements"
                    : "Paiement"}{" "}
                  en plusieurs fois en cours
                </h3>
                <p className="text-2xl font-bold">
                  {installmentExpenses
                    .reduce((total, expense) => total + expense.amount, 0)
                    .toFixed(2)}{" "}
                  €
                </p>
              </div>
              <div className="bg-white shadow-md rounded-lg p-4">
                <h3 className="text-lg font-medium">Dépenses totales</h3>
                <p className="text-2xl font-bold">
                  {expenses
                    .reduce((total, expense) => total + expense.amount, 0)
                    .toFixed(2)}{" "}
                  €
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">
            Répartition des dépenses
          </h2>
          <PieChart chartData={chartData} />
          <h2 className="text-xl font-semibold mb-4 mt-6">
            Répartition par Catégorie
          </h2>
          <PieChart chartData={categoryChartData} />{" "}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
