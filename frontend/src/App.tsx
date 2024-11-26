import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Components
import Login from './components/auth/Login';
import Register from './Components/auth/Register';




import PrivateRoute from './Components/PrivateRoute';

const App: React.FC = () => {
  return (
    <Router>
      {/* Toast Notifications */}
      <ToastContainer />

      {/* Application Routes */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        

      </Routes>
    </Router>
  );
};

export default App;
