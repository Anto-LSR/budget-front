// Dashboard.js
import React, { useState } from "react";
import Modal from "../components/Modal";
import PieChart from "../components/Piechart";

const AddIncome = () => (
  <div>
    <h3>Ajouter un revenu</h3>
    {/* Formulaire ou autre contenu pour ajouter un revenu */}
  </div>
);

const AddExpense = () => (
  <div>
    <h3>Ajouter une dépense</h3>
    {/* Formulaire ou autre contenu pour ajouter une dépense */}
  </div>
);

const Dashboard = () => {
  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    content: null,
  });

  const handleOpenModal = (title, content) => {
    setModal({ isOpen: true, title, content });
  };

  const handleCloseModal = () => {
    setModal({ ...modal, isOpen: false, content: null });
  };



  const chartData = [
    { label: "Revenus fixes", value: 1200 },
    { label: "Revenus additionnels", value: 3000 },
    { label: "Charges fixes", value: 800 },
    { label: "Dépenses variables", value: 500 },
  ];

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Sidebar */}


      {/* Main Content */}
      <main className="flex-grow p-4 lg:p-8 relative z-10">
        <header className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Tableau de bord</h1>
        </header>

        <section className="gap-4">
          <h2 className="text-xl font-semibold mb-4">Résumé des dépenses</h2>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-l font-semibold">Revenus</h3>
              <button
                onClick={() =>
                  handleOpenModal("Ajouter un revenu", <AddIncome />)
                }
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Ajouter un revenu
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white shadow-md rounded-lg p-4">
                <h3 className="text-lg font-medium">Revenus fixes</h3>
                <p className="text-2xl font-bold">$1,200</p>
              </div>
              <div className="bg-white shadow-md rounded-lg p-4">
                <h3 className="text-lg font-medium">Revenus Additionnels</h3>
                <p className="text-2xl font-bold">$3,000</p>
              </div>
              <div className="bg-white shadow-md rounded-lg p-4">
                <h3 className="text-lg font-medium">Revenus Totaux</h3>
                <p className="text-2xl font-bold">$3,000</p>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-l font-semibold">Dépenses</h3>
              <button
                onClick={() =>
                  handleOpenModal("Ajouter une dépense", <AddExpense />)
                }
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Ajouter une dépense
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white shadow-md rounded-lg p-4">
                <h3 className="text-lg font-medium">Charges fixes</h3>
                <p className="text-2xl font-bold">$800</p>
              </div>
              <div className="bg-white shadow-md rounded-lg p-4">
                <h3 className="text-lg font-medium">Dépenses du mois en cours</h3>
                <p className="text-2xl font-bold">$800</p>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-6">
          <PieChart chartData={chartData} />
        </div>

        {/* Modale */}
        {modal.isOpen && (
          <Modal
            isOpen={modal.isOpen}
            onClose={handleCloseModal}
            title={modal.title}
          >
            {modal.content}
          </Modal>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
