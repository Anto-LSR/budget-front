import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { NotificationProvider } from "./contexts/NotificationContext";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Subscriptions from "./pages/Subscriptions";
import { AuthProvider } from "./contexts/authContext"; // Ajoutez AuthProvider
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FixedCosts from "./pages/FixedCosts";
import Income from "./pages/Income";
import Expenses from "./pages/Expenses";
import InstallmentPayments from "./pages/InstallmentPayments";

function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <Router>
          <MainLayout>
            {/* Nécessaire pour afficher les notifications */}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/subscriptions" element={<Subscriptions />} />
              <Route path="/fixedcosts" element={<FixedCosts />} />
              <Route path="/income" element={<Income />} />
              <Route path="/expenses" element={<Expenses />} />
              <Route path="/installmentPayments" element={<InstallmentPayments />} />
            </Routes>
          </MainLayout>
          <ToastContainer position="bottom-right" />{" "}
        </Router>
      </AuthProvider>
    </NotificationProvider>
  );
}

export default App;
