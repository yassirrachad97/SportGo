import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Login from './components/auth/Login';
import Register from './components/auth/Register';
import DashboardLayout from './components/dashboard/DashboardLayout';
import AuthGuard from './components/layout/AuthGuard';
import {Events} from './components/dashboard/Events';
import Participants from './components/dashboard/EventDetail';
import EventDetails from './components/dashboard/EventDetail';




const App: React.FC = () => {
  return (
    <Router>
      <ToastContainer />
      <Routes>
      
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<AuthGuard />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
        <Route path="events" element={<Events />} />
        <Route path="participants" element={<Participants />} />
        <Route path="event/:eventId" element={<EventDetails />} />

       
           

        </Route>
        </Route>

      </Routes>
    </Router>
  );
};

export default App;
