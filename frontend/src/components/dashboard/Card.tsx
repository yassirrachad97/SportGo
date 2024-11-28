import React from 'react';

interface CardProps {
  image: string;
  title: string;
  description: string;
  buttonText: string;
  buttonColor: string;
}

export function Card({ image, title, description, buttonText, buttonColor }: CardProps) {
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
        <button 
          className={`px-6 py-2 rounded-full text-white font-medium transition-transform duration-300 hover:scale-105 ${buttonColor}`}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}