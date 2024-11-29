import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart2, Settings, Medal, User, CalendarHeart } from 'lucide-react';

const menuItems = [
  { icon: CalendarHeart, label: 'Events', to: '/dashboard/events' },
  { icon: User, label: 'Participants', to: '/dashboard/participants' },
  { icon: BarChart2, label: 'Charts', to: '/dashboard/charts' },
  { icon: Settings, label: 'Settings', to: '/dashboard/settings' },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <div className="w-64 bg-white h-screen border-r border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-8">
        <Medal className="h-6 w-6 text-blue-600" />
        <span className="text-xl font-semibold text-blue-600">SportGo</span>
      </div>

      <nav>
        {menuItems.map((item) => (
          <Link
            key={item.label}
            to={item.to}
            className={`flex items-center gap-3 p-3 rounded-lg mb-1 cursor-pointer ${
              location.pathname === item.to
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
