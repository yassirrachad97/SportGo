import React from 'react';

interface CardProps {
  image: string;
  title: string;
  description: string;
  date: string;
  location: string;
  onEdit: () => void;
  onDelete: () => void;
  onclick: () => void;
}

export function Card({ image, title, description, date, location, onEdit, onDelete, onclick }: CardProps) {

  const formattedDate = new Date(date).toLocaleDateString("fr-FR", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6">
        <h2 onClick={onclick} className="text-2xl font-bold text-gray-800 mb-3">{title}</h2>
        <p className="text-gray-600 mb-6 line-clamp-3">{description}</p>
        <p className="text-gray-500 text-sm mb-6">{formattedDate}</p> 
        <p className="text-gray-500 text-sm mb-6">{location}</p> 


        <div className="flex justify-between">
          <button
            onClick={onEdit} 
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
          >
            Modifier
          </button>
          <button
            onClick={onDelete} 
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
          >
            Supprimer
          </button>
        </div>
      
      </div>
    </div>
  );
}