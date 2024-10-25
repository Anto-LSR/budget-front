import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { NotificationProvider } from './contexts/NotificationContext'; // Importer le provider
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';


function App() {
  return (
    <NotificationProvider>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </MainLayout>
        <ToastContainer position="bottom-right"/> 
      </Router>
    </NotificationProvider>
  );
}

export default App;