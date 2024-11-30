import React, { useEffect, useState } from "react";
import { Card } from "./Card";
import axios from "axios";
import { toast } from "react-toastify";

export function Events() {
  const [cardData, setCardData] = useState<any[]>([]); 
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 6;
  const [totalPages, setTotalPages] = useState(1); 

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    capacity: 1,
    image: null,
  });

 
  const fetchEvents = async (page: number) => {
    try {
   
      const token = localStorage.getItem("token");
  
      if (!token) {
        console.error("Token not found in localStorage");
        setCardData([]); 
        return;
      }
  
   
      const response = await axios.get(`http://localhost:3000/api/event/organizer`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      console.log("API Response:", response.data.message);
  
      
      if (Array.isArray(response.data)) {
        setCardData(response.data); 
      
      } else {
        console.error("Unexpected response structure:", response.data);
        setCardData([]); 
      }
    } catch (error: any) {
    
      console.error("Error fetching events:", error?.response?.data || error.message || error);
      setCardData([]); 
    }
  };
  
  
  


  useEffect(() => {
    fetchEvents(currentPage);
  }, [currentPage]); 


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewEvent({ ...newEvent, [name]: value });
  };

 
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewEvent({ ...newEvent, image: e.target.files ? e.target.files[0] : null });
  };


  const handleAddEvent = async () => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("title", newEvent.title); 
      formData.append("description", newEvent.description); 
      formData.append("location", newEvent.location); 
      formData.append("date", newEvent.date); 
      formData.append("capacity", newEvent.capacity.toString());
      
  
      if (newEvent.image) {
        formData.append("image", newEvent.image); 
      }
  
     
      const response = await axios.post("http://localhost:3000/api/event/create", formData, {
        headers: {
          "Authorization": `Bearer ${token}`, 
          "Content-Type": "multipart/form-data" 
        },
      });

      toast.success(response.data.message);
      console.log(response.data.message);
  
      setCardData([...cardData, response.data]); 
      setIsModalOpen(false);
      setNewEvent({
        title: "",
        description: "",
        location: "",
        date: "",
        capacity: 1,
        image: null,
      });
  
    } catch (error: any) {
      console.error("Failed to add event:", error);$

      const errorMessage = error?.response?.data?.message || "An unexpected error occurred.";

    
    toast.error(errorMessage);
    }
  };
  

  
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);  
    }
  };

  return (
    <div className="p-6 bg-gray-50 flex-1">
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded shadow"
        >
          Ajouter un événement
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {cardData.map((card, index) => (
          <Card
            key={index}
            image={card.image}
            title={card.title}
            description={card.description}
            location={card.location}
            date={card.date}
          />
        ))}
      </div>

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

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Ajouter un événement</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Titre</label>
              <input
                type="text"
                name="title"
                value={newEvent.title}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                value={newEvent.description}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Localisation</label>
              <input
                type="text"
                name="location"
                value={newEvent.location}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                name="date"
                value={newEvent.date}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Capacité</label>
              <input
                type="number"
                name="capacity"
                value={newEvent.capacity}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded"
                min="1"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 mr-2 bg-gray-300 hover:bg-gray-400 rounded"
              >
                Annuler
              </button>
              <button
                onClick={handleAddEvent}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded"
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
