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

  const [eventToUpdate, setEventToUpdate] = useState<any | null>(null);

  const handleEditEvent = (event: any) => {
    console.log("Editing event:", event); 
    setIsModalOpen(true);
    setEventToUpdate(event);
    setNewEvent({
      title: event.title,
      description: event.description,
      location: event.location,
      date: event.date,
      capacity: event.capacity,
      image: event.image,
    });
  };

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

      if (Array.isArray(response.data)) {
        setCardData(response.data);
        const totalEvents = response.data.length;
        setTotalPages(Math.ceil(totalEvents / cardsPerPage));
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
    if (eventToUpdate) {
      setEventToUpdate({ ...eventToUpdate, [name]: value });
    } else {
      setNewEvent({ ...newEvent, [name]: value });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
  
    if (file) {
    
      setEventToUpdate({ ...eventToUpdate, image: file });
    } else {
     
      setEventToUpdate({ ...eventToUpdate, image: eventToUpdate.image });
    }
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
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(response.data.message);
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
      toast.error(error?.response?.data?.message || "An unexpected error occurred.");
    }
  };

  const handleUpdateEvent = async () => {
    if (!eventToUpdate || !eventToUpdate._id) {
      toast.error("Event ID is missing.");
      return;
    }

    console.log("eventToUpdate before sending:", eventToUpdate);
  
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Token not found.");
      return;
    }
  
    console.log("Event to update:", eventToUpdate);
  
    const formData = new FormData();
    formData.append("title", eventToUpdate.title);
    formData.append("description", eventToUpdate.description);
    formData.append("location", eventToUpdate.location);
    formData.append("date", eventToUpdate.date);
    formData.append("capacity", eventToUpdate.capacity.toString());
  
 
    if (eventToUpdate.image && eventToUpdate.image instanceof File) {
      console.log("New image selected, appending to form data");
      formData.append("image", eventToUpdate.image);
    } else if (typeof eventToUpdate.image === "string") {
      console.log("No new image selected, keeping the existing image:", eventToUpdate.image);
      formData.append("image", eventToUpdate.image);
    }
  
    console.log("Title before sending:", eventToUpdate.title); 

  
    try {
     
      const response = await axios.patch(
        `http://localhost:3000/api/event/${eventToUpdate._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      console.log("Response from API:", response.data); 
  
      toast.success("Événement mis à jour avec succès.");
  
     
      setCardData((prevData) => {
        const updatedData = prevData.map((event) =>
          event._id === eventToUpdate._id ? response.data : event
        );
        console.log("Updated data in setCardData:", updatedData); 
        return updatedData;
      });
  
      setIsModalOpen(false); 
      setEventToUpdate(null); 
  
    } catch (error) {
      console.error("Update failed:", error);
      toast.error(error?.response?.data?.message || "Échec de la mise à jour.");
    }
  };
  
  
  
  
  

  const handleDeleteEvent = async (id: string) => {

    if (!id) {
      toast.error("Event ID is missing.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Token not found.");
        return;
      }

      const response = await axios.delete(`http://localhost:3000/api/event/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Event deleted successfully.");
      setCardData((prevData) => prevData.filter((event) => event._id !== id));
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete event.");
    }
  };

  return (
    <div className="p-6 bg-gray-50 flex-1">
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded shadow"
        >
          Add Event
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
            onEdit={() => handleEditEvent(card)}
            onDelete={() => handleDeleteEvent(card._id)}
          />
        ))}
      </div>

      <div className="flex justify-between items-center mt-6">
        <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">{eventToUpdate ? 'Update Event' : 'Add Event'}</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                name="title"
                value={eventToUpdate ? eventToUpdate.title : newEvent.title}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                value={eventToUpdate ? eventToUpdate.description : newEvent.description}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                name="location"
                value={eventToUpdate ? eventToUpdate.location : newEvent.location}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                name="date"
                value={eventToUpdate ? eventToUpdate.date : newEvent.date}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Capacity</label>
              <input
                type="number"
                name="capacity"
                value={eventToUpdate ? eventToUpdate.capacity : newEvent.capacity}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Image</label>
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full"
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={eventToUpdate ? handleUpdateEvent : handleAddEvent}
                className="px-4 py-2 bg-blue-500 text-white rounded shadow"
              >
                {eventToUpdate ? 'Update' : 'Add'} Event
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="ml-2 px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
