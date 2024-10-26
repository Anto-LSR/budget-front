import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNotification } from "../contexts/NotificationContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const Expenses = () => {
  const [newExpenseName, setNewExpenseName] = useState("");
  const [newExpenseAmount, setNewExpenseAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const notify = useNotification();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const expenseNameRef = useRef(null);

  // Fonction pour récupérer les dépenses
  const fetchExpenses = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/expenses/getExpenses?year=${selectedYear}&month=${selectedMonth}&permonth=true`,
        { withCredentials: true }
      );
      setExpenses(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des dépenses:", error);
    }
  };

  // Fonction pour récupérer les catégories
  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/categories/getCategories",
        { withCredentials: true }
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des catégories:", error);
    }
  };

  const handleCreateCategory = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3001/categories/createCategory",
        { name: newCategoryName },
        { withCredentials: true }
      );
      setCategories([...categories, response.data]);
      setIsModalOpen(false);
      notify("Catégorie créée avec succès", "success");
    } catch (error) {
      console.error("Erreur lors de la création de la catégorie:", error);
      notify("Erreur lors de la création de la catégorie", "error");
    }
  };

  useEffect(() => {
    fetchExpenses();
    fetchCategories();
  }, [selectedYear, selectedMonth]);

  // Fonction pour ajouter une nouvelle dépense
  const handleAddExpense = async () => {
    if (newExpenseName && newExpenseAmount) {
      try {
        await axios.post(
          "http://localhost:3001/expenses/addExpense",
          {
            title: newExpenseName,
            amount: newExpenseAmount,
            categoryId: selectedCategory,
            type: "once",
          },
          { withCredentials: true }
        );
        setNewExpenseName("");
        setNewExpenseAmount("");
        fetchExpenses();
        notify("Dépense ajoutée avec succès", "success");
        expenseNameRef.current.focus();
      } catch (error) {
        console.error("Erreur lors de l'ajout de la dépense:", error);
        notify("Erreur lors de l'ajout de la dépense", "error");
      }
    } else {
      console.error("Veuillez remplir tous les champs requis");
      notify("Veuillez remplir tous les champs requis", "warn");
    }
  };

  // Fonction pour supprimer une dépense
  const deleteExpense = async (expenseId) => {
    try {
      await axios.delete(
        `http://localhost:3001/expenses/deleteExpense/${expenseId}`,
        { withCredentials: true }
      );
      fetchExpenses();
      notify("Dépense supprimée avec succès", "success");
    } catch (error) {
      console.error("Erreur lors de la suppression de la dépense:", error);
      notify("Erreur lors de la suppression de la dépense", "error");
    }
  };

  // Calculez le total des montants des dépenses
  const totalExpenses = expenses.reduce(
    (total, expense) => total + expense.amount,
    0
  );

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Sidebar */}

      {/* Main Content */}
      <main className="flex-grow p-4 lg:p-8 relative z-10 w-full max-w-full">
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4">
          <h1 className="text-2xl font-bold mb-4 lg:mb-0">Dépenses par mois</h1>
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="border border-gray-300 rounded p-2 w-full sm:w-auto"
            >
              {Array.from(
                { length: 10 },
                (_, i) => new Date().getFullYear() - i
              ).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="border border-gray-300 rounded p-2 w-full sm:w-auto"
            >
              {[
                "Janvier",
                "Février",
                "Mars",
                "Avril",
                "Mai",
                "Juin",
                "Juillet",
                "Août",
                "Septembre",
                "Octobre",
                "Novembre",
                "Décembre",
              ].map((month, index) => (
                <option key={index} value={index + 1}>
                  {month}
                </option>
              ))}
            </select>
          </div>
        </header>

        {/* Section pour ajouter une nouvelle dépense */}
        <section className="mb-4">
          <h2 className="text-xl font-semibold mb-4">Ajouter une Dépense</h2>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
            <input
              type="text"
              value={newExpenseName}
              onChange={(e) => setNewExpenseName(e.target.value)}
              placeholder="Nom de la dépense"
              className="border border-gray-300 rounded p-2 w-full"
              ref={expenseNameRef}
            />
            <input
              type="number"
              value={newExpenseAmount}
              onChange={(e) => setNewExpenseAmount(e.target.value)}
              placeholder="Montant"
              className="border border-gray-300 rounded p-2 w-full"
            />
            <select
              value={selectedCategory}
              onChange={(e) => {
                if (e.target.value === "create-category") {
                  setIsModalOpen(true);
                } else {
                  setSelectedCategory(e.target.value);
                }
              }}
              className="border border-gray-300 rounded p-2 flex-grow"
            >
              <option value="">Sélectionner une catégorie</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
              <option value="create-category">Créer une catégorie</option>
            </select>
            <button
              onClick={handleAddExpense}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full md:w-auto"
            >
              Ajouter
            </button>
          </div>
        </section>

        {/* Section pour afficher le tableau des dépenses */}
        <section className="overflow-x-auto">
          <table className="w-full border">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Nom</th>
                <th className="py-2 px-4 border-b">Montant (€)</th>
                <th className="py-2 px-4 border-b">Catégorie</th>
                <th className="py-2 px-4 border-b">Action</th>
              </tr>
            </thead>
            <tbody>
              {totalExpenses > 0 && (
                <tr>
                  <td colSpan="1" className="py-2 px-4 border-b font-bold">
                    Total des dépenses:
                  </td>
                  <td colSpan="3" className="py-2 px-4 border-b font-bold">
                    {totalExpenses.toFixed(2)} €
                  </td>
                </tr>
              )}
              {expenses
                .map((expense) => ({
                  ...expense,
                  categoryName:
                    categories.find((c) => c.id === expense.categoryId)?.name ||
                    "Non assignée",
                }))
                .sort((a, b) => (a.categoryName > b.categoryName ? 1 : -1)) // Tri par nom de catégorie
                .map((expense) => (
                  <tr key={expense.id}>
                    <td className="py-2 px-4 border-b">{expense.title}</td>
                    <td className="py-2 px-4 border-b">{expense.amount} €</td>
                    <td className="py-2 px-4 border-b">
                      {expense.categoryName}
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      <button
                        className="text-red-500 hover:text-red-600"
                        onClick={() => deleteExpense(expense.id)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </section>
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
              <h3 className="text-lg font-semibold mb-4">
                Créer une catégorie
              </h3>
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Nom de la catégorie"
                className="border border-gray-300 rounded p-2 mb-4 w-full"
              />
              <div className="flex justify-end">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
                >
                  Annuler
                </button>
                <button
                  onClick={handleCreateCategory}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Expenses;
