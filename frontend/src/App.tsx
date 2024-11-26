import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


import Login from './components/auth/Login';
import Register from './components/auth/Register';






const App: React.FC = () => {
  return (
    <Router>
    
      <ToastContainer />

    
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        

      </Routes>
    </Router>
  );
};

export default App;
