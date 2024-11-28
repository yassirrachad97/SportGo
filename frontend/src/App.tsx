import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Login from './components/auth/Login';
import Register from './components/auth/Register';
import DashboardLayout from './Dashbord';
// import DashboardLayout from './components/layout/DashboardLayout'; // Correct import for DashboardLayout

const App: React.FC = () => {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Dashboard Routes */}
        <Route path="/*" element={<DashboardLayout />} />
      </Routes>
    </Router>
  );
};

export default App;
