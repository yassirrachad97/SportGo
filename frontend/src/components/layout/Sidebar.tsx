import React from 'react';
import {  BarChart2, Settings, Medal, User, CalendarHeart } from 'lucide-react';

const menuItems = [
  { icon: CalendarHeart, label: 'Events', active: true },
  { icon: User, label: 'Participants' },

 
 
 
  { icon: BarChart2, label: 'Charts' },
  { icon: Settings, label: 'Settings' }
];

export function Sidebar() {
  return (
    <div className="w-64 bg-white h-screen border-r border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-8">
        <Medal className="h-6 w-6 text-blue-600" />
        <span className="text-xl font-semibold text-blue-600">SportGo</span>
      </div>
      
      <nav>
        {menuItems.map((item) => (
          <div
            key={item.label}
            className={`flex items-center gap-3 p-3 rounded-lg mb-1 cursor-pointer ${
              item.active ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </div>
        ))}
      </nav>
    </div>
  );
}