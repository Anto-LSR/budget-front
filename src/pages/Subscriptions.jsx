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

const Subscriptions = () => {
  const [newSubscriptionName, setNewSubscriptionName] = useState("");
  const [newSubscriptionAmount, setNewSubscriptionAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [categories, setCategories] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const notify = useNotification();

  // Créez une référence pour l'input "Nom de l'abonnement"
  const subscriptionNameRef = useRef(null);

  const fetchSubscriptions = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/expenses/getSubscriptions",
        { withCredentials: true }
      );
      setSubscriptions(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des abonnements:", error);
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

  useEffect(() => {
    fetchSubscriptions();
    fetchCategories();
  }, []);

  const handleAddSubscription = async () => {
    if (newSubscriptionName && newSubscriptionAmount) {
      try {
        const response = await axios.post(
          "http://localhost:3001/expenses/addExpense",
          {
            title: newSubscriptionName,
            amount: newSubscriptionAmount,
            categoryId:
              selectedCategory === "create-category" ? null : selectedCategory,
            isSubscription: true,
            isPaused: false, // Par défaut, l'abonnement n'est pas en pause
          },
          { withCredentials: true }
        );
        setNewSubscriptionName("");
        setNewSubscriptionAmount("");
        fetchSubscriptions();
        notify("Abonnement ajouté avec succès", "success");
        // Placez le focus sur l'input "Nom de l'abonnement"
        subscriptionNameRef.current.focus();
      } catch (error) {
        console.error("Erreur lors de l'ajout de la souscription:", error);
        notify("Erreur lors de l'ajout de la souscription", "error");
      }
    } else {
      console.error("Veuillez remplir tous les champs requis");
      notify("Veuillez remplir tous les champs requis", "warn");
    }
  };

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

  const deleteSubscription = async (subscriptionId) => {
    try {
      await axios.delete(
        `http://localhost:3001/expenses/deleteExpense/${subscriptionId}`,
        { withCredentials: true }
      );
      fetchSubscriptions(); // Recharger le tableau après la suppression de l'abonnement
      notify("Abonnement supprimé avec succès", "success");
    } catch (error) {
      console.error("Erreur lors de la suppression de la souscription:", error);
      notify("Erreur lors de la suppression de la souscription", "error");
    }
  };

  const togglePauseSubscription = async (subscriptionId, isPaused) => {
    try {
      await axios.patch(
        `http://localhost:3001/expenses/pauseSubscription/${subscriptionId}`,
        { isPaused: !isPaused },
        { withCredentials: true }
      );
      fetchSubscriptions(); // Recharger le tableau après la mise à jour de l'abonnement
      notify(
        `Abonnement ${isPaused ? "repris" : "mis en pause"} avec succès`,
        "success"
      );
    } catch (error) {
      console.error(
        `Erreur lors de la mise à jour de la souscription: ${error}`
      );
      notify(`Erreur lors de la mise à jour de la souscription`, "error");
    }
  };

  const totalSubscription = subscriptions
    .filter((subscription) => !subscription.isPaused)
    .reduce((total, subscription) => total + subscription.amount, 0);

  return (
    <div className="flex flex-col justify-center items-center">
      <h3 className="text-xl font-semibold mb-4">Abonnements</h3>
      <table>
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Nom</th>
            <th className="py-2 px-4 border-b">Montant (€)</th>
            <th className="py-2 px-4 border-b">Catégorie</th>
            <th className="py-2 px-4 border-b">Statut</th>
            {subscriptions.length > 0 && (
              <th className="py-2 px-4 border-b">Action</th>
            )}
          </tr>
        </thead>
        <tbody>
          {/* Ligne pour ajouter un nouvel abonnement */}
          <tr>
            <td className="py-2 px-4 border-b">
              <input
                type="text"
                value={newSubscriptionName}
                onChange={(e) => setNewSubscriptionName(e.target.value)}
                placeholder="Nom de l'abonnement"
                className="border border-gray-300 rounded p-2 w-full"
                ref={subscriptionNameRef} // Assignez la référence à l'input
              />
            </td>
            <td className="py-2 px-4 border-b">
              <input
                type="number"
                value={newSubscriptionAmount}
                onChange={(e) => setNewSubscriptionAmount(e.target.value)}
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
                onClick={handleAddSubscription}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Ajouter
              </button>
            </td>
          </tr>
          {/* Lignes pour afficher les abonnements */}
          {subscriptions.map((subscription) => (
            <tr key={subscription.id}>
              <td className="py-2 px-4 border-b">{subscription.title}</td>
              <td className="py-2 px-4 border-b">{subscription.amount}</td>
              <td className="py-2 px-4 border-b">
                {categories.find((c) => c.id === subscription.categoryId)?.name}
              </td>
              <td className="py-2 px-4 border-b text-center">
                {subscription.isPaused ? (
                  <FontAwesomeIcon icon={faPause} className="text-blue-500" />
                ) : (
                  <FontAwesomeIcon icon={faCheck} className="text-green-500" />
                )}
              </td>
              {subscriptions.length > 0 && (
                <td className="py-2 px-4 border-b flex justify-between">
                  <button
                    className="text-blue-500 hover:text-blue-600 mr-2"
                    onClick={() =>
                      togglePauseSubscription(
                        subscription.id,
                        subscription.isPaused
                      )
                    }
                  >
                    {subscription.isPaused ? (
                      <FontAwesomeIcon icon={faPlay} />
                    ) : (
                      <FontAwesomeIcon icon={faPause} />
                    )}
                  </button>
                  <button
                    className="text-red-500 hover:text-red-600"
                    onClick={() => deleteSubscription(subscription.id)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              )}
            </tr>
          ))}
          
          {totalSubscription > 0 && (
            <tr>
              <td colSpan="4" className="py-2 px-4 border-b">
                <strong>Total des abonnements:</strong>
              </td>
              <td className="py-2 px-4 border-b">
                <strong>{totalSubscription}€</strong>
              </td>
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

export default Subscriptions;
