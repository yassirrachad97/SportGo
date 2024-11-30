import React from 'react';

interface CardProps {
  image: string;
  title: string;
  description: string;
  buttonText: string;
  buttonColor: string;
}

export function Card({ image, title, description, date }: CardProps) {

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
        <h2 className="text-2xl font-bold text-gray-800 mb-3">{title}</h2>
        <p className="text-gray-600 mb-6 line-clamp-3">{description}</p>
        <p className="text-gray-500 text-sm mb-6">{formattedDate}</p> 
      
      </div>
    </div>
  );
}