import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const AuthGuard = () => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/" replace />;
  }

  try {
   
    const decodedToken: any = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);


    if (decodedToken.exp && decodedToken.exp < currentTime) {
      console.error("Token expiré.");
      localStorage.removeItem('token');
      return <Navigate to="/" replace />;
    }

    return <Outlet />;
  } catch (error) {
    console.error("Erreur lors de la vérification du token:", error);
    localStorage.removeItem('token');
    return <Navigate to="/" replace />;
  }
};

export default AuthGuard;
