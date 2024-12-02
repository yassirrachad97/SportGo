import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Medal, CalendarHeart, LogOut } from 'lucide-react'; 

export function Sidebar() {
  const location = useLocation(); 
  const navigate = useNavigate(); 

  const handleLogout = () => {
  
    localStorage.removeItem("token");

    navigate("/");
  };

  return (
    <div className="w-64 bg-white h-screen border-r border-gray-200 p-4">
  
      <div className="flex items-center gap-2 mb-8">
        <Medal className="h-6 w-6 text-blue-600" />
        <span className="text-xl font-semibold text-blue-600">SportGo</span>
      </div>

    
      <nav>
     
        <Link
          to="/dashboard/events" 
          className={`flex items-center gap-3 p-3 rounded-lg mb-1 cursor-pointer ${
            location.pathname === '/dashboard/events'
              ? 'bg-blue-50 text-blue-600'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <CalendarHeart className="h-5 w-5" />
          <span>Events</span>
        </Link>

  
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 p-3 rounded-lg mt-4 cursor-pointer text-gray-600 hover:bg-gray-50"
        >
          <LogOut className="h-5 w-5" /> 
          <span>Logout</span>
        </button>
      </nav>
    </div>
  );
}
