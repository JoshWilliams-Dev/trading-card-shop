import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import NotFound from './pages/NotFound';
import Register from './pages/Register';
import SignIn from './pages/SignIn';
import SignOut from './pages/SignOut';
import Shop from './pages/Shop';
import Inventory from './pages/Inventory';
import ProtectedRoute from './components/ProtectedRoute';

import './App.css';
import Cardsmith from './pages/Cardsmith';
import { ToastProvider } from './contexts/ToastContext';
import Dashboard from './pages/Dashboard';


const App = () => {

  useEffect(() => {
    // Set the data-bs-theme attribute
    document.documentElement.setAttribute('data-bs-theme', 'dark');

    // Cleanup function to remove the attribute when the component unmounts (optional)
    return () => {
      document.documentElement.removeAttribute('data-bs-theme');
    };
  }, []); // Empty dependency array ensures this runs once on mount


  return (

    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route index element={<SignIn />} />
          <Route exact path="/" element={<SignIn />} />
          <Route path="/login" element={<SignIn />} />

          <Route path="/register" element={<Register />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/logout" element={<SignOut />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/cardsmith"
            element={
              <ProtectedRoute>
                <Cardsmith />
              </ProtectedRoute>
            }
          />
          <Route
            path="/inventory"
            element={
              <ProtectedRoute>
                <Inventory />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>


  );
};

export default App;