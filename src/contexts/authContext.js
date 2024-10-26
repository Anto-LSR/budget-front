import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null pour indiquer que l'auth est en cours de validation
  const [loading, setLoading] = useState(true); // pour gérer le chargement

  useEffect(() => {
    const validateAuth = async () => {
      try {        
        const response = await fetch('http://localhost:3001/auth/validate', {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();
        setIsAuthenticated(response.ok ? data.authenticated : false);
      } catch (error) {
        console.error('Erreur lors de la validation:', error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    validateAuth();
  }, []); // L'effet ne s'exécute qu'une seule fois

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook pour utiliser le contexte
export const useAuth = () => {
  return useContext(AuthContext);
};
