import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNotification } from "../contexts/NotificationContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faCheck,
  faPause,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";

const Subscriptions = () => {
  const [newSubscriptionName, setNewSubscriptionName] = useState("");
  const [newSubscriptionAmount, setNewSubscriptionAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [categories, setCategories] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const notify = useNotification();
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
        await axios.post(
          "http://localhost:3001/expenses/addExpense",
          {
            title: newSubscriptionName,
            amount: newSubscriptionAmount,
            categoryId:
              selectedCategory === "create-category" ? null : selectedCategory,
            isSubscription: true,
            isPaused: false,
            type: "subscription",
          },
          { withCredentials: true }
        );
        setNewSubscriptionName("");
        setNewSubscriptionAmount("");
        fetchSubscriptions();
        notify("Abonnement ajouté avec succès", "success");
        subscriptionNameRef.current.focus();
      } catch (error) {
        console.error("Erreur lors de l'ajout de la souscription:", error);
        notify("Erreur lors de l'ajout de la souscription", "error");
      }
    } else {
      notify("Veuillez remplir tous les champs requis", "warn");
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

  const deleteSubscription = async (subscriptionId) => {
    try {
      await axios.delete(
        `http://localhost:3001/expenses/deleteExpense/${subscriptionId}`,
        { withCredentials: true }
      );
      fetchSubscriptions();
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
      fetchSubscriptions();
      notify(
        `Abonnement ${isPaused ? "repris" : "mis en pause"} avec succès`,
        "success"
      );
    } catch (error) {
      console.error(
        `Erreur lors de la mise à jour de la souscription: ${error}`
      );
      notify("Erreur lors de la mise à jour de la souscription", "error");
    }
  };

  const totalSubscription = subscriptions
    .filter((subscription) => !subscription.isPaused)
    .reduce((total, subscription) => total + subscription.amount, 0)
    .toFixed(2);

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-grow p-4 lg:p-8 relative z-10">
        <header className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Gestion des Abonnements</h1>
        </header>

        {/* Section pour ajouter un nouvel abonnement */}
        <section className="mb-4">
          <h2 className="text-xl font-semibold mb-4">Ajouter un Abonnement</h2>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
            <input
              type="text"
              value={newSubscriptionName}
              onChange={(e) => setNewSubscriptionName(e.target.value)}
              placeholder="Nom de l'abonnement"
              className="border border-gray-300 rounded p-2 flex-grow"
              ref={subscriptionNameRef}
            />
            <input
              type="number"
              value={newSubscriptionAmount}
              onChange={(e) => setNewSubscriptionAmount(e.target.value)}
              placeholder="Montant"
              className="border border-gray-300 rounded p-2 flex-grow"
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
              onClick={handleAddSubscription}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Ajouter
            </button>
          </div>
        </section>

        {/* Section pour afficher le tableau des abonnements */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Liste des Abonnements</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden border-gray-300">
              <thead>
                <tr className="bg-gray-100 text-justify">
                  <th className="py-2 px-4 border-b">Nom</th>
                  <th className="py-2 px-4 border-b">Montant (€)</th>
                  <th className="py-2 px-4 border-b">Catégorie</th>
                  <th className="py-2 px-4 border-b">Statut</th>
                  <th className="py-2 px-4 border-b">Action</th>
                </tr>
              </thead>
              <tbody>
                {totalSubscription > 0 && (
                  <tr>
                    <td className="py-2 px-4 border-b font-bold">Total</td>
                    <td className="py-2 px-4 border-b font-bold">
                      {totalSubscription}€
                    </td>
                    <td colSpan="3" className="py-2 px-4 border-b"></td>
                  </tr>
                )}
                {subscriptions.map((subscription) => (
                  <tr key={subscription.id}>
                    <td className="py-2 px-4 border-b">{subscription.title}</td>
                    <td className="py-2 px-4 border-b">
                      {subscription.amount}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {
                        categories.find((c) => c.id === subscription.categoryId)
                          ?.name
                      }
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      {subscription.isPaused ? (
                        <FontAwesomeIcon
                          icon={faPause}
                          className="text-blue-500"
                        />
                      ) : (
                        <FontAwesomeIcon
                          icon={faCheck}
                          className="text-green-500"
                        />
                      )}
                    </td>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Modal pour créer une nouvelle catégorie */}
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

export default Subscriptions;
