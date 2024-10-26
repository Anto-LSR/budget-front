import React, { createContext, useContext } from 'react';
import { toast } from 'react-toastify';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const notify = (message, type) => {
    const toastTypes = {
      success: toast.success,
      error: toast.error,
      info: toast.info,
      warn: toast.warn,
    };

    const toastFunction = toastTypes[type];
    if (toastFunction) {
      toastFunction(message);
    } else {
      console.error(`Invalid toast type: ${type}`);
    }
  };

  return (
    <NotificationContext.Provider value={notify}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};