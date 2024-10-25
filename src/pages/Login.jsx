import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useNotification } from "../contexts/NotificationContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const notify = useNotification(); // Déstructure notify à partir du hook

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include", // Inclure les cookies dans la requête
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log("Error Data:", errorData);
        throw new Error(errorData.message || "Erreur lors de la connexion.");
      }

      const data = await response.json();
      notify(data.message, "success");
      navigate("/");
    } catch (error) {
      console.error("Fetch Error:", error);
      notify(error.message, "error");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4 text-center">Connexion</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Mot de passe:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded p-2"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Se connecter
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link to="/signup" className="text-blue-500 hover:underline">
            S'inscrire
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
