import React, { useState } from 'react';
import { Card } from './Card'; 

export function Dashboard() {
  const cardData = [
    {
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
      title: "Mountain Retreat",
      description: "Simple Yet Beautiful Card Design with TailwindCSS. Subscribe to our Youtube channel for more tutorials and tips.",
      buttonText: "Learn More",
      buttonColor: "bg-purple-600 hover:bg-purple-700"
    },
    {
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
      title: "Valley Vista",
      description: "Simple Yet Beautiful Card Design with TailwindCSS. Subscribe to our Youtube channel for more tutorials and tips.",
      buttonText: "Learn More",
      buttonColor: "bg-blue-500 hover:bg-blue-600"
    },
    {
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
      title: "Forest Haven",
      description: "Simple Yet Beautiful Card Design with TailwindCSS. Subscribe to our Youtube channel for more tutorials and tips.",
      buttonText: "Learn More",
      buttonColor: "bg-emerald-500 hover:bg-emerald-600"
    },
    {
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
      title: "River Canyon",
      description: "Simple Yet Beautiful Card Design with TailwindCSS. Subscribe to our Youtube channel for more tutorials and tips.",
      buttonText: "Learn More",
      buttonColor: "bg-orange-500 hover:bg-orange-600"
    },
    {
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
      title: "Desert Oasis",
      description: "Relax in the serenity of the desert.",
      buttonText: "Learn More",
      buttonColor: "bg-yellow-500 hover:bg-yellow-600"
    },
    {
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
      title: "Beach Paradise",
      description: "Relax on sunny beaches.",
      buttonText: "Learn More",
      buttonColor: "bg-teal-500 hover:bg-teal-600"
    },
    {
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
      title: "Snowy Escape",
      description: "Enjoy the snowy landscapes.",
      buttonText: "Learn More",
      buttonColor: "bg-gray-500 hover:bg-gray-600"
    },
    {
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
      title: "Urban Adventure",
      description: "Explore cityscapes like never before.",
      buttonText: "Learn More",
      buttonColor: "bg-indigo-500 hover:bg-indigo-600"
    }
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 6;

 
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = cardData.slice(indexOfFirstCard, indexOfLastCard);

  const totalPages = Math.ceil(cardData.length / cardsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="p-6 bg-gray-50 flex-1">
      {/* Grille des cartes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {currentCards.map((card, index) => (
          <Card
            key={index}
            image={card.image}
            title={card.title}
            description={card.description}
            buttonText={card.buttonText}
            buttonColor={card.buttonColor}
          />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
