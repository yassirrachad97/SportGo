import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../layout/Sidebar';
import { Header } from '../layout/Header';

const DashboardLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-md p-4">
          <Header />
        </header>
        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
