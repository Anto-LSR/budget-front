import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNotification } from "../contexts/NotificationContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const InstallmentPayment = () => {
  const [title, setTitle] = useState("");
  const [monthlyAmount, setMonthlyAmount] = useState("");
  const [durationMonths, setDurationMonths] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [installmentPayments, setInstallmentPayments] = useState([]);
  const notify = useNotification();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

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

  const fetchInstallmentPayments = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/expenses/getInstallmentPayments",
        { withCredentials: true }
      );
      setInstallmentPayments(response.data);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des paiements en plusieurs fois:",
        error
      );
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchInstallmentPayments();
  }, []);

  const handleAddInstallment = async () => {
    if (title && monthlyAmount && durationMonths && selectedCategory) {
      try {
        await axios.post(
          "http://localhost:3001/expenses/addInstallmentPayment",
          {
            title,
            amount: monthlyAmount,
            categoryId: selectedCategory,
            isRecurring: true,
            isPaused: false,
            type: "installment",
            dateEnd: new Date(
              new Date().setMonth(
                new Date().getMonth() + parseInt(durationMonths)
              )
            ).toISOString(),
          },
          { withCredentials: true }
        );
        setTitle("");
        setMonthlyAmount("");
        setDurationMonths("");
        setSelectedCategory("");
        fetchInstallmentPayments();
        notify("Dépense ajoutée avec succès", "success");
      } catch (error) {
        console.error("Erreur lors de l'ajout de la dépense:", error);
        notify("Erreur lors de l'ajout de la dépense", "error");
      }
    } else {
      notify("Veuillez remplir tous les champs requis", "warn");
    }
  };

  const deleteExpense = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/expenses/deleteExpense/${id}`, {
        withCredentials: true,
      });
      setInstallmentPayments(
        installmentPayments.filter((expense) => expense.id !== id)
      );
      notify("Dépense supprimée avec succès", "success");
    } catch (error) {
      console.error("Erreur lors de la suppression de la dépense:", error);
      notify("Erreur lors de la suppression de la dépense", "error");
    }
  };

  const totalExpenses = installmentPayments.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

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

  return (
    <div className="flex flex-col p-4">
      <h1 className="text-2xl font-bold mb-4">Paiement en Plusieurs Fois</h1>

      <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titre de la dépense"
          className="border border-gray-300 rounded p-2 w-full"
        />
        <input
          type="number"
          value={monthlyAmount}
          onChange={(e) => setMonthlyAmount(e.target.value)}
          placeholder="Montant par mois"
          className="border border-gray-300 rounded p-2 w-full"
        />
        <input
          type="number"
          value={durationMonths}
          onChange={(e) => setDurationMonths(e.target.value)}
          placeholder="Durée (mois)"
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
          onClick={handleAddInstallment}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full md:w-auto"
        >
          Ajouter
        </button>
      </div>

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
                <td colSpan="2" className="py-2 px-4 border-b font-bold">
                  Total des dépenses :
                </td>
                <td colSpan="2" className="py-2 px-4 border-b font-bold">
                  {totalExpenses.toFixed(2)} €
                </td>
              </tr>
            )}
            {installmentPayments.map((expense) => (
              <tr key={expense.id}>
                <td className="py-2 px-4 border-b">{expense.title}</td>
                <td className="py-2 px-4 border-b">{expense.amount} €</td>
                <td className="py-2 px-4 border-b">
                  {categories.find((c) => c.id === expense.categoryId)?.name ||
                    "Non assignée"}
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
      </section>
    </div>
  );
};

export default InstallmentPayment;
