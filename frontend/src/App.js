import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from './pages/Home';
import NotFound from './pages/NotFound';
import DatePage from './pages/DatePage';
import Register from './pages/Register';
import SignIn from './pages/SignIn';

import './App.css';


const App = () => (
  <BrowserRouter>
    <Routes>
      <Route index element={<Home />} />
      <Route exact path="/" element={<Home />} />
      <Route exact path="/home" element={<Home />} />
      <Route path="/date" element={<DatePage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<SignIn />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;