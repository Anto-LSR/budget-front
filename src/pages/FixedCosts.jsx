import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNotification } from "../contexts/NotificationContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const FixedCosts = () => {
  const [newFixedCostName, setNewFixedCostName] = useState("");
  const [newFixedCostAmount, setNewFixedCostAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [fixedCosts, setFixedCosts] = useState([]);
  const notify = useNotification();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const fixedCostNameRef = useRef(null);

  const fetchFixedCosts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/expenses/getFixedCosts",
        { withCredentials: true }
      );
      setFixedCosts(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des charges fixes:", error);
    }
  };

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
    fetchFixedCosts();
    fetchCategories();
  }, []);

  const handleAddFixedCost = async () => {
    if (newFixedCostName && newFixedCostAmount && selectedCategory) {
      try {
        await axios.post(
          "http://localhost:3001/expenses/addFixedCost",
          {
            title: newFixedCostName,
            amount: newFixedCostAmount,
            categoryId: selectedCategory,
            type: "fixed",
          },
          { withCredentials: true }
        );
        setNewFixedCostName("");
        setNewFixedCostAmount("");
        setSelectedCategory("");
        fetchFixedCosts();
        notify("Charge fixe ajoutée avec succès", "success");
        fixedCostNameRef.current.focus();
      } catch (error) {
        console.error("Erreur lors de l'ajout de la charge fixe:", error);
        notify("Erreur lors de l'ajout de la charge fixe", "error");
      }
    } else {
      notify("Veuillez remplir tous les champs requis", "warn");
    }
  };

  const deleteFixedCost = async (fixedCostId) => {
    try {
      await axios.delete(
        `http://localhost:3001/expenses/deleteExpense/${fixedCostId}`,
        { withCredentials: true }
      );
      fetchFixedCosts();
      notify("Charge fixe supprimée avec succès", "success");
    } catch (error) {
      console.error("Erreur lors de la suppression de la charge fixe:", error);
      notify("Erreur lors de la suppression de la charge fixe", "error");
    }
  };

  const totalFixedCosts = fixedCosts.reduce(
    (total, fixedCost) => total + fixedCost.amount,
    0
  );

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <main className="flex-grow p-4 lg:p-8 relative z-10">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <h1 className="text-2xl font-bold">Charges Fixes</h1>
        </header>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-4">
            Ajouter une Charge Fixe
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <input
              type="text"
              value={newFixedCostName}
              onChange={(e) => setNewFixedCostName(e.target.value)}
              placeholder="Nom de la charge fixe"
              className="border border-gray-300 rounded p-2 w-full"
              ref={fixedCostNameRef}
            />
            <input
              type="number"
              value={newFixedCostAmount}
              onChange={(e) => setNewFixedCostAmount(e.target.value)}
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
              onClick={handleAddFixedCost}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Ajouter
            </button>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">
            Liste des Charges Fixes
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-100 text-justify">
                  <th className="py-2 px-4 border-b">Nom</th>
                  <th className="py-2 px-4 border-b">Montant (€)</th>
                  <th className="py-2 px-4 border-b">Catégorie</th>
                  <th className="py-2 px-4 border-b">Action</th>
                </tr>
              </thead>
              <tbody>
                {totalFixedCosts > 0 && (
                  <tr className="font-semibold">
                    <td className="py-2 px-4 border-b">
                      Total des charges fixes:
                    </td>
                    <td className="py-2 px-4 border-b">{totalFixedCosts} €</td>
                    <td className="py-2 px-4 border-b" colSpan="2"></td>
                  </tr>
                )}
                {fixedCosts.map((fixedCost) => (
                  <tr key={fixedCost.id} className="even:bg-gray-50">
                    <td className="py-2 px-4 border-b">{fixedCost.title}</td>
                    <td className="py-2 px-4 border-b">{fixedCost.amount} €</td>
                    <td className="py-2 px-4 border-b">
                      {categories.find((c) => c.id === fixedCost.categoryId)
                        ?.name || "Non assignée"}
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      <button
                        className="text-red-500 hover:text-red-600"
                        onClick={() => deleteFixedCost(fixedCost.id)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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

export default FixedCosts;
