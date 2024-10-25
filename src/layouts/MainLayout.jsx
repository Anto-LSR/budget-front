import { React, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../contexts/NotificationContext";

const MainLayout = ({ children }) => {
  const { isAuthenticated, setIsAuthenticated, setUser } = useAuth();
  const location = useLocation(); // Récupérer la localisation actuelle
  const navigate = useNavigate();
  const notify = useNotification(); // Déstructure notify à partir du hook

  useEffect(() => {
    const validateAuth = async () => {
      const response = await fetch("http://localhost:3001/auth/validate", {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        setIsAuthenticated(data.authenticated);
      } else {
        setIsAuthenticated(false);
      }
    };

    validateAuth();
  }, [location]); // Revalider l'authentification chaque fois que l'utilisateur change de page

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:3001/auth/logout", {
        method: "POST",
        credentials: "include", // Inclure les cookies dans la requête
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la déconnexion.");
      }

      const data = await response.json();
      // Mettez à jour l'état de votre application pour refléter que l'utilisateur n'est plus authentifié
      setIsAuthenticated(false); // Mettre à jour l'état de l'authentification
      navigate('/')
      notify(data.message, "success");
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gray-800 p-4">
        <nav className="flex justify-between items-center">
          <div className="text-white text-lg font-bold">Bernard-Budget</div>
          <ul className="flex space-x-4">
            <li>
              <a href="/" className="text-white hover:text-gray-300">
                Accueil
              </a>
            </li>
            {isAuthenticated ? (
              <li>
                <p
                  onClick={handleLogout}
                  href="/logout"
                  className="text-white hover:text-gray-300"
                >
                  Déconnexion
                </p>
              </li>
            ) : (
              <li>
                <a href="/login" className="text-white hover:text-gray-300">
                  Connexion
                </a>
              </li>
            )}
          </ul>
        </nav>
      </header>
      <main className="flex-grow p-4">{children}</main>
      <footer className="bg-gray-800 text-white text-center p-4">
        © 2024 MyApp
      </footer>
    </div>
  );
};

export default MainLayout;
