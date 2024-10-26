import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNotification } from "../contexts/NotificationContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const Income = () => {
  const [newIncomeName, setNewIncomeName] = useState("");
  const [newIncomeAmount, setNewIncomeAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [categories, setCategories] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [isFixed, setIsFixed] = useState(false);
  const notify = useNotification();

  const incomeNameRef = useRef(null);

  const fetchIncomes = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/incomes/getIncomes",
        { withCredentials: true }
      );
      setIncomes(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des revenus:", error);
    }
  };

  useEffect(() => {
    fetchIncomes();
  }, []);

  const handleAddIncome = async () => {
    if (newIncomeName && newIncomeAmount) {
      try {
        const response = await axios.post(
          "http://localhost:3001/incomes/addIncome",
          {
            title: newIncomeName,
            amount: newIncomeAmount,
            categoryId: selectedCategory,
            isFixed: isFixed,
          },
          { withCredentials: true }
        );
        setNewIncomeName("");
        setNewIncomeAmount("");
        setIsFixed(false);
        fetchIncomes();
        notify("Revenu ajouté avec succès", "success");
        incomeNameRef.current.focus();
      } catch (error) {
        console.error("Erreur lors de l'ajout du revenu:", error);
        notify("Erreur lors de l'ajout du revenu", "error");
      }
    } else {
      console.error("Veuillez remplir tous les champs requis");
      notify("Veuillez remplir tous les champs requis", "warn");
    }
  };

  const deleteIncome = async (incomeId) => {
    try {
      await axios.delete(
        `http://localhost:3001/incomes/deleteIncome/${incomeId}`,
        { withCredentials: true }
      );
      fetchIncomes();
      notify("Revenu supprimé avec succès", "success");
    } catch (error) {
      console.error("Erreur lors de la suppression du revenu:", error);
      notify("Erreur lors de la suppression du revenu", "error");
    }
  };

  const totalIncome = incomes.reduce(
    (acc, income) => acc + parseFloat(income.amount),
    0
  );

  return (
    <div className="flex min-h-screen flex-col p-4">
      <main className="flex-grow p-4 lg:p-8">
        <header className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Gestion des Revenus</h1>
        </header>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Ajouter un Revenu</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <input
              type="text"
              value={newIncomeName}
              onChange={(e) => setNewIncomeName(e.target.value)}
              placeholder="Nom du revenu"
              className="border border-gray-300 rounded p-2"
              ref={incomeNameRef}
            />
            <input
              type="number"
              value={newIncomeAmount}
              onChange={(e) => setNewIncomeAmount(e.target.value)}
              placeholder="Montant"
              className="border border-gray-300 rounded p-2"
            />
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={isFixed}
                onChange={(e) => setIsFixed(e.target.checked)}
                className="sr-only"
              />
              <div
                className={`w-10 h-6 rounded-full flex items-center px-1 transition-colors duration-300 ease-in-out ${
                  isFixed ? "bg-green-500" : "bg-gray-400"
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full transition-transform duration-300 ease-in-out ${
                    isFixed ? "translate-x-4" : ""
                  }`}
                ></div>
              </div>
              <span className="ml-3 text-gray-700">Fixe</span>
            </label>
            <button
              onClick={handleAddIncome}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Ajouter
            </button>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Liste des Revenus</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden border border-gray-300">
              <thead>
                <tr className="bg-gray-100 text-justify">
                  <th className="py-2 px-4 border-b">Nom</th>
                  <th className="py-2 px-4 border-b">Montant (€)</th>
                  <th className="py-2 px-4 border-b">Type</th>
                  <th className="py-2 px-4 border-b">Action</th>
                </tr>
              </thead>
              <tbody>
                {incomes.map((income) => (
                  <tr key={income.id}>
                    <td className="py-2 px-4 border-b">{income.title}</td>
                    <td className="py-2 px-4 border-b">{income.amount}</td>
                    <td className="py-2 px-4 border-b">
                      {income.isFixed ? "Fixe" : "Ponctuel"}
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      <button
                        className="text-red-500 hover:text-red-600"
                        onClick={() => deleteIncome(income.id)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))}
                <tr>
                  <td className="py-2 px-4 border-b font-bold">Total</td>
                  <td className="py-2 px-4 border-b font-bold">
                    {totalIncome.toFixed(2)} €
                  </td>
                  <td className="py-2 px-4 border-b"></td>
                  <td className="py-2 px-4 border-b"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Income;
