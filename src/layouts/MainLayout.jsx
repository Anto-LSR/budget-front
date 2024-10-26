import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import { useNotification } from "../contexts/NotificationContext";
import Sidebar from "../components/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";

const MainLayout = ({ children }) => {
  const { isAuthenticated, loading, setIsAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const notify = useNotification();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isAuthChecked = useRef(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  useEffect(() => {
    const validateAuth = async () => {
      try {
        const response = await fetch("http://localhost:3001/auth/validate", {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        setIsAuthenticated(response.ok ? data.authenticated : false);
      } catch {
        setIsAuthenticated(false);
      }
    };

    if (!isAuthChecked.current) {
      validateAuth();
      isAuthChecked.current = true;
    }

    // Redirection en fonction de l'état d'authentification
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [loading, isAuthenticated, navigate]);

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:3001/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        setIsAuthenticated(false); // Met à jour l'état d'authentification
        navigate("/"); // Redirige vers la page d'accueil
        notify("Déconnexion réussie.", "success");
      } else {
        throw new Error("Erreur lors de la déconnexion.");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  // Définir les éléments du menu de la barre latérale
  const getSidebarMenu = () => {
    switch (location.pathname) {
      case "/dashboard":
        return [
          { name: "Revenus", link: "/income" },
          { name: "Charges fixes", link: "/fixedcosts" },
          { name: "Abonnements", link: "/subscriptions" },
          { name: "Dépenses", link: "/profile" },
        ];
      case "/subscriptions":
        return [
          { name: "Tableau de bord", link: "/dashboard" },
          { name: "Charges fixes", link: "/fixedcosts" },
        ];
      case "/fixedcosts":
        return [
          { name: "Tableau de bord", link: "/dashboard" },
          { name: "Abonnements", link: "/subscriptions" },
        ];
      default:
        return [];
    }
  };

  const sidebarMenu = getSidebarMenu();

  const noSidebarRoutes = ["/login", "/register", "/"];
  const showSidebar = !noSidebarRoutes.includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen w-full overflow-hidden">
      <header className="bg-gray-800 p-4 w-full flex justify-between items-center">
        <div className="text-white text-lg font-bold hidden lg:block">
          Bernard-Budget
        </div>
        <button
          onClick={toggleSidebar}
          className="lg:hidden bg-gray-800 text-white p-2 rounded flex items-center"
        >
          <FontAwesomeIcon icon={sidebarOpen ? faTimes : faBars} />
        </button>
        <ul className="flex space-x-4">
          <li>
            <a href="/" className="text-white hover:text-gray-300">
              Accueil
            </a>
          </li>
          {isAuthenticated ? (
            <>
              <li>
                <a href="/dashboard" className="text-white hover:text-gray-300">
                  Tableau de bord
                </a>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="text-white hover:text-gray-300"
                >
                  Déconnexion
                </button>
              </li>
            </>
          ) : (
            <li>
              <a href="/login" className="text-white hover:text-gray-300">
                Connexion
              </a>
            </li>
          )}
        </ul>
      </header>

      <main className="flex-grow p-4 w-full">
        <div className="flex relative">
          {showSidebar && (
            <Sidebar
              isOpen={sidebarOpen}
              toggleSidebar={toggleSidebar}
              menuItems={sidebarMenu}
            />
          )}
          <div className={`flex-grow ${sidebarOpen ? "ml-64" : "ml-0"}`}>
            {children}
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-white text-center p-4 w-full">
        © 2024 MyApp
      </footer>
    </div>
  );
};

export default MainLayout;
