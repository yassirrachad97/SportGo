import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface Participant {
  _id: string;
  name: string;
  email: string;
  phone: string;
}

interface EventDetail {
  title: string;
  description: string;
  location: string;
  date: string;
  capacity: number;
}

const EventDetail: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  
  const [eventDetail, setEventDetail] = useState<EventDetail | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newParticipant, setNewParticipant] = useState<Participant>({
    _id: "",
    name: "",
    email: "",
    phone: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const participantsPerPage = 10;

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("You must be logged in to view event details.");
          navigate("/login");
          return;
        }

        const response = await axios.get(
          `http://localhost:3000/api/event/${eventId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setEventDetail(response.data.event);
        setParticipants(response.data.participants);
      } catch (error: any) {
        const errorMessage =
          error?.response?.data?.message || "Failed to fetch event details.";
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    if (eventId) fetchEventDetails();
  }, [eventId, navigate]);

  const handleMenuClick = (participantId: string) => {
    setIsMenuOpen(isMenuOpen === participantId ? null : participantId);
  };

  const handleDeleteParticipant = async (participantId: string, eventId: string) => {
    if (!eventId) {
      toast.error("Event ID is missing.");
      console.log("Event ID is missing.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Token not found.");
        return;
      }

      const response = await axios.delete(
        `http://localhost:3000/api/participants/${participantId}/${eventId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Participant deleted successfully.");
      setParticipants((prevParticipants) =>
        prevParticipants.filter((participant) => participant._id !== participantId)
      );
    } catch (error) {
      toast.error(`Failed to delete participant: ${error.response ? error.response.data.message : error.message}`);
      console.error("Error deleting participant:", error);
    }
  };

  const handleAddParticipant = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Token not found.");
        return;
      }

      const response = await axios.post(
        `http://localhost:3000/api/participants/register`,
        {
          name: newParticipant.name,
          email: newParticipant.email,
          phone: newParticipant.phone,
          eventId: eventId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Participant added successfully.");
      setParticipants((prevParticipants) => [...prevParticipants, response.data.participant]);
      setNewParticipant({ _id: "", name: "", email: "", phone: "" });
      setIsModalOpen(false);
    } catch (error) {
      toast.error(`Failed to add participant: ${error.response ? error.response.data.message : error.message}`);
      console.error("Error adding participant:", error);
    }
  };

  const indexOfLastParticipant = currentPage * participantsPerPage;
  const indexOfFirstParticipant = indexOfLastParticipant - participantsPerPage;
  const currentParticipants = participants.slice(
    indexOfFirstParticipant,
    indexOfLastParticipant
  );

  const totalPages = Math.ceil(participants.length / participantsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold">Loading event details...</div>
      </div>
    );
  }

  if (!eventDetail) {
    return <div className="text-center text-red-500">Event not found!</div>;
  }

  return (
    <div className="event-detail p-4">
      <h2 className="text-2xl font-bold mb-4">{eventDetail.title}</h2>
      <p>{eventDetail.description}</p>
      <p>
        <strong>Location:</strong> {eventDetail.location}
      </p>
      <p>
        <strong>Date:</strong> {new Date(eventDetail.date).toLocaleString()}
      </p>
      <p>
        <strong>Capacity:</strong> {eventDetail.capacity}
      </p>

      <h3 className="text-xl mt-6 mb-2">Participants</h3>
      
    
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-green-500 text-white p-2 rounded mb-4"
      >
        Add Participant
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-600 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4">Add Participant</h3>
            <form onSubmit={handleAddParticipant}>
              <div className="mb-4">
                <label htmlFor="name" className="block">Name</label>
                <input
                  type="text"
                  id="name"
                  placeholder="Name"
                  value={newParticipant.name}
                  onChange={(e) => setNewParticipant({ ...newParticipant, name: e.target.value })}
                  className="border p-2 w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block">Email</label>
                <input
                  type="email"
                  id="email"
                  placeholder="Email"
                  value={newParticipant.email}
                  onChange={(e) => setNewParticipant({ ...newParticipant, email: e.target.value })}
                  className="border p-2 w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="phone" className="block">Phone</label>
                <input
                  type="text"
                  id="phone"
                  placeholder="Phone"
                  value={newParticipant.phone}
                  onChange={(e) => setNewParticipant({ ...newParticipant, phone: e.target.value })}
                  className="border p-2 w-full"
                  required
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)} 
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Phone</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentParticipants.map((participant) => (
            <tr key={participant._id}>
              <td className="border px-4 py-2">{participant.name}</td>
              <td className="border px-4 py-2">{participant.email}</td>
              <td className="border px-4 py-2">{participant.phone}</td>
              <td className="border px-4 py-2">
                <div className="relative">
                  <button
                    onClick={() => handleMenuClick(participant._id)}
                    className="text-gray-600"
                  >
                    &#x2022;&#x2022;&#x2022;
                  </button>
                  {isMenuOpen === participant._id && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg">
                      <button
                        onClick={() => handleDeleteParticipant(participant._id, eventId)}
                        className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination mt-4 flex justify-center space-x-2">
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`px-3 py-1 rounded ${currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EventDetail;
