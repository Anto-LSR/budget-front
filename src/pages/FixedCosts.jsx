import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNotification } from "../contexts/NotificationContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faTimes,
  faPause,
  faPlay,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

const FixedCosts = () => {
  const [newFixedCostName, setNewFixedCostName] = useState("");
  const [newFixedCostAmount, setNewFixedCostAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [categories, setCategories] = useState([]);
  const [fixedCosts, setFixedCosts] = useState([]);
  const notify = useNotification();

  // Créez une référence pour l'input "Nom de la charge fixe"
  const fixedCostNameRef = useRef(null);

  // Fonction pour récupérer les charges fixes
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

  // Utilisez useEffect pour récupérer les charges fixes et les catégories au chargement du composant
  useEffect(() => {
    fetchFixedCosts();
    fetchCategories();
  }, []);

  // Fonction pour ajouter une nouvelle charge fixe
  const handleAddFixedCost = async () => {
    if (newFixedCostName && newFixedCostAmount) {
      try {
        const response = await axios.post(
          "http://localhost:3001/expenses/addExpense",
          {
            title: newFixedCostName,
            amount: newFixedCostAmount,
            categoryId:
              selectedCategory === "create-category" ? null : selectedCategory,
            isRecurring: true,
            isPaused: false, // Par défaut, la charge fixe n'est pas en pause
            type: "fixed",
          },
          { withCredentials: true }
        );
        setNewFixedCostName("");
        setNewFixedCostAmount("");
        fetchFixedCosts();
        notify("Charge fixe ajoutée avec succès", "success");
        // Placez le focus sur l'input "Nom de la charge fixe"
        fixedCostNameRef.current.focus();
      } catch (error) {
        console.error("Erreur lors de l'ajout de la charge fixe:", error);
        notify("Erreur lors de l'ajout de la charge fixe", "error");
      }
    } else {
      console.error("Veuillez remplir tous les champs requis");
      notify("Veuillez remplir tous les champs requis", "warn");
    }
  };

  // Fonction pour créer une nouvelle catégorie
  const handleCreateCategory = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3001/categories/createCategory",
        {
          name: newCategoryName,
        },
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

  // Fonction pour supprimer une charge fixe
  const deleteFixedCost = async (fixedCostId) => {
    try {
      await axios.delete(
        `http://localhost:3001/expenses/deleteExpense/${fixedCostId}`,
        { withCredentials: true }
      );
      fetchFixedCosts(); // Recharger le tableau après la suppression de la charge fixe
      notify("Charge fixe supprimée avec succès", "success");
    } catch (error) {
      console.error("Erreur lors de la suppression de la charge fixe:", error);
      notify("Erreur lors de la suppression de la charge fixe", "error");
    }
  };

  // Calculez le total des montants des charges fixes
  const totalFixedCosts = fixedCosts.reduce(
    (total, fixedCost) => total + fixedCost.amount,
    0
  );

  return (
    <div className="flex flex-col justify-center items-center">
      <h3 className="text-xl font-semibold mb-4">Charges Fixes</h3>
      <table>
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Nom</th>
            <th className="py-2 px-4 border-b">Montant (€)</th>
            <th className="py-2 px-4 border-b">Catégorie</th>
            {fixedCosts.length > 0 && (
              <th className="py-2 px-4 border-b">Action</th>
            )}
          </tr>
        </thead>
        <tbody>
          {/* Ligne pour ajouter une nouvelle charge fixe */}
          <tr>
            <td className="py-2 px-4 border-b">
              <input
                type="text"
                value={newFixedCostName}
                onChange={(e) => setNewFixedCostName(e.target.value)}
                placeholder="Nom de la charge fixe"
                className="border border-gray-300 rounded p-2 w-full"
                ref={fixedCostNameRef} // Assignez la référence à l'input
              />
            </td>
            <td className="py-2 px-4 border-b">
              <input
                type="number"
                value={newFixedCostAmount}
                onChange={(e) => setNewFixedCostAmount(e.target.value)}
                placeholder="Montant"
                className="border border-gray-300 rounded p-2 w-full"
              />
            </td>
            <td className="py-2 px-4 border-b">
              <select
                value={selectedCategory}
                onChange={(e) => {
                  if (e.target.value === "create-category") {
                    setIsModalOpen(true);
                  } else {
                    setSelectedCategory(e.target.value);
                  }
                }}
                className="w-full py-1 px-2 border rounded bg-white"
              >
                <option value="">Sélectionner une catégorie</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
                <option value="create-category">Créer une catégorie</option>
              </select>
            </td>
            <td className="py-2 px-4 border-b">
              <button
                onClick={handleAddFixedCost}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Ajouter
              </button>
            </td>
          </tr>
          {/* Lignes pour afficher les charges fixes */}
          {fixedCosts.map((fixedCost) => (
            <tr key={fixedCost.id}>
              <td className="py-2 px-4 border-b">{fixedCost.title}</td>
              <td className="py-2 px-4 border-b">{fixedCost.amount}</td>
              <td className="py-2 px-4 border-b">
                {categories.find((c) => c.id === fixedCost.categoryId)?.name}
              </td>
              {fixedCosts.length > 0 && (
                <td className="py-2 px-4 border-b text-center">
                  <button
                    className="text-red-500 hover:text-red-600"
                    onClick={() => deleteFixedCost(fixedCost.id)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              )}
            </tr>
          ))}

          {/* Ligne pour afficher le total des charges fixes */}
          {/* Ligne pour afficher le total des charges fixes */}
          {totalFixedCosts > 0 && (
            <tr>
              <td colSpan="1" className="py-2 px-4 border-b">
                <strong>Total des charges fixes:</strong>
              </td>
              <td className="py-2 px-4 border-b">
                <strong>{totalFixedCosts}€</strong>
              </td>
              <td className="py-2 px-4 border-b"></td>{" "}
              <td className="py-2 px-4 border-b"></td>{" "}
              {/* Cellule vide pour aligner avec le tableau */}
            </tr>
          )}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl mb-4">Créer une nouvelle catégorie</h2>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Nom de la catégorie"
              className="border border-gray-300 rounded p-2 w-full mb-4"
            />
            <div className="flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600"
              >
                Annuler
              </button>
              <button
                onClick={handleCreateCategory}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Créer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FixedCosts;
