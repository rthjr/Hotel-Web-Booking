"use client"; // Mark this as a Client Component since we're using useState and onClick

import { useEffect, useState } from "react";
import { useRouter } from "@node_modules/next/navigation";
import { useHotelContext } from "@Context/owner/ChosseHotelContext";
import { API_ENDPOINTS } from "@utils/apiEndpoints";
import Sidebar from "@components/owner/component/layout/Sidebar";
import Image from "@node_modules/next/image";

export default function ReservationManagement() {
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [selectedReservation, setSelectedReservation] = useState(null);
  const { hotelId } = useHotelContext();
  const [hotels, setHotels] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const [visibleReservations, setVisibleReservations] = useState(15);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reservationData, setReservationData] = useState({
    email: "",
    name: "",
    startDay: "",
    endDay: "",
    people: 1,
    floor: "",
    price: 0,
    status: "none",
    image: "", // Add image field
  });

  // Fetch data from the API
  const fetchData = async () => {
    try {
      const res = await fetch(API_ENDPOINTS.HOTELS);

      if (!res.ok) {
        throw new Error("Failed to fetch Hotels");
      }

      const data = await res.json();

      if (Array.isArray(data)) {
        const hotelsWithReservations = data.filter(
          (hotel) =>
            hotel.reservations &&
            Array.isArray(hotel.reservations) &&
            String(hotel.id) === String(hotelId)
        );
        setHotels(hotelsWithReservations);
        setFilteredReservations(hotelsWithReservations.flatMap((hotel) => hotel.reservations));
      } else {
        setHotels([]);
        setFilteredReservations([]);
      }
    } catch (error) {
      console.log("Error fetching Hotels:", error.message);
    }
  };

  // Delete reservation function
  const deletePost = async (id) => {
    const response = await fetch(`/api/owner/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      console.log("Reservation deleted successfully");
      fetchData();
    } else {
      console.error("Failed to delete the reservation");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const loadMoreReservations = () => {
    setVisibleReservations((prev) => prev + 15);
  };

  const handleFilter = () => {
    const filtered = hotels
      .flatMap((hotel) => hotel.reservations)
      .filter(
        (reservation) =>
          reservation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          reservation.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    setFilteredReservations(filtered);
    setVisibleReservations(15);
  };

  const handleInputChange = (e) => {
    setReservationData({ ...reservationData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReservationData({ ...reservationData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const generateReservationId = () => {
    const lastReservation = filteredReservations[filteredReservations.length - 1];
    const lastId = lastReservation ? parseInt(lastReservation.id, 10) : 100;
    return (lastId + 1).toString();
  };

  const handleSubmitReservation = async (e) => {
    e.preventDefault();
    if (!hotelId) {
      alert("Hotel ID is missing.");
      return;
    }

    const newReservation = {
      ...reservationData,
      id: generateReservationId(), // Auto-generate ID
    };

    try {
      const response = await fetch(`/api/owner/addReservation/${hotelId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: hotelId, reservation: newReservation }),
      });

      if (!response.ok) {
        throw new Error("Failed to add reservation");
      }

      alert("Reservation added successfully!");
      setIsModalOpen(false); // Close modal
      fetchData(); // Refresh reservation list
    } catch (error) {
      console.error("Error adding reservation:", error);
      alert("Error adding reservation");
    }
  };

  const handleEdit = async (reservationId) => {
    try {
      // Call the API to update the reservation status
      const response = await fetch('/api/owner/editReservation', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reservationId }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // If the API call is successful, refresh the reservation list
        fetchData();
      } 
    } catch (error) {
      console.error('Error updating reservation status:', error);
    }
  
    // Close the dropdown
    setDropdownOpen({ ...dropdownOpen, [reservationId]: false });
  };

  const handleDelete = (reservationId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this reservation?");
    if (confirmDelete) {
      deletePost(reservationId);
      setDropdownOpen({ ...dropdownOpen, [reservationId]: false });
    }
  };

  const handleViewDetails = (reservationId) => {
    const reservation = filteredReservations.find((res) => res.id === reservationId);
    setSelectedReservation(reservation);
    setDropdownOpen({ ...dropdownOpen, [reservationId]: false });
  };

  const ReservationDetailsModal = ({ reservation, onClose }) => {
    if (!reservation) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4">Reservation Details</h2>
          <div className="space-y-3">
            <p><span className="font-semibold">ID:</span> {reservation.id}</p>
            <p><span className="font-semibold">Name:</span> {reservation.name}</p>
            <p><span className="font-semibold">Email:</span> {reservation.email}</p>
            <p><span className="font-semibold">Floor:</span> {reservation.floor}</p>
            <p><span className="font-semibold">Dates:</span> {reservation.startDay} - {reservation.endDay}</p>
            <p><span className="font-semibold">Status:</span> {reservation.status}</p>
          </div>
          <div className="mt-6 flex justify-end">
            <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex">
      <aside className="sticky top-0 w-auto min-h-screen">
        <Sidebar />
      </aside>
      <main className="flex-1">
        <div className="p-8 bg-gray-100 min-h-screen">
          <h1 className="text-3xl font-bold mb-6">Reservation Management</h1>

          {/* Filter Section */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search by name or email"
              className="p-2 border border-gray-300 rounded-md mr-4"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={handleFilter} className="bg-textColor text-white px-4 py-2 rounded-md">
              Filter
            </button>
          </div>

          {/* Add Reservation Button */}
          <div className="mb-6">
            <button onClick={() => setIsModalOpen(true)} className="bg-green-500 text-white px-4 py-2 rounded-md">
              Add New Reservation
            </button>
          </div>

          {/* Reservation List */}
          <div className="space-y-4">
            <table className="w-full border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Image</th>
                  <th className="p-3 text-left">Room</th>
                  <th className="p-3 text-left">Floor</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Reservation Date</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReservations.slice(0, visibleReservations).map((reservation, index) => (
                  <tr key={reservation.id} className={`${index % 2 === 0 ? "bg-white" : "bg-gray-200"}`}>
                    <td className="p-3">
                      <div className="relative w-24 h-16">
                        <Image
                          src={reservation.image}
                          alt={reservation.name}
                          width={800}
                          height={600}
                          layout="responsive"
                          className="rounded-lg"
                        />
                      </div>
                    </td>
                    <td className="p-3 text-gray-600">{reservation.id}</td>
                    <td className="p-3 text-gray-600">{reservation.floor}</td>
                    <td className="p-3 text-gray-900 font-semibold">{reservation.name}</td>
                    <td className="p-3 text-gray-600">{reservation.email}</td>
                    <td className="p-3 text-gray-500">{reservation.startDay} - {reservation.endDay}</td>
                    <td className="p-3 text-gray-500">{reservation.status}</td>
                    <td className="p-3">
                      <div className="relative">
                        <button
                          className="p-2 rounded-full hover:bg-gray-200 focus:outline-none"
                          onClick={() => {
                            const updatedDropdowns = { ...dropdownOpen };
                            updatedDropdowns[reservation.id] = !updatedDropdowns[reservation.id];
                            setDropdownOpen(updatedDropdowns);
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                          </svg>
                        </button>
                        {dropdownOpen[reservation.id] && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10">
                            <ul>
                              <li>
                                <button
                                  className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                                  onClick={() => handleEdit(reservation.id)}
                                >
                                  Change to Paid
                                </button>
                              </li>
                              <li>
                                <button
                                  className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                                  onClick={() => handleDelete(reservation.id)}
                                >
                                  Delete
                                </button>
                              </li>
                              <li>
                                <button
                                  className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                                  onClick={() => handleViewDetails(reservation.id)}
                                >
                                  View Details
                                </button>
                              </li>
                            </ul>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* See More Button */}
          {visibleReservations < filteredReservations.length && (
            <div className="mt-6 text-center">
              <button
                onClick={loadMoreReservations}
                className="bg-purple-500 text-white px-4 py-2 rounded-md"
              >
                See More
              </button>
            </div>
          )}

          {/* Reservation Details Modal */}
          {selectedReservation && (
            <ReservationDetailsModal
              reservation={selectedReservation}
              onClose={() => setSelectedReservation(null)}
            />
          )}

          {/* Reservation Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 min-h-screen">
              <div className="bg-white p-6 rounded-lg w-full max-w-md min-h-screen text-sm">
                <h2 className="text-xl font-semibold mb-4">Add New Reservation</h2>
                <form onSubmit={handleSubmitReservation}>
                  <div className="space-y-4 flex flex-col">
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={reservationData.email}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                    <input
                      type="text"
                      name="name"
                      placeholder="Name"
                      value={reservationData.name}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                    <input
                      type="date"
                      name="startDay"
                      value={reservationData.startDay}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                    <input
                      type="date"
                      name="endDay"
                      value={reservationData.endDay}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                    <div className="flex flex-col gap-1">
                      <span>Amount of People</span>
                      <input
                        type="number"
                        name="people"
                        placeholder="Number of People"
                        value={reservationData.people}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <input
                      type="text"
                      name="floor"
                      placeholder="Floor"
                      value={reservationData.floor}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                    <div className="flex flex-col gap-1">
                      <span>Price</span>
                      <input
                        type="text"
                        name="price"
                        placeholder="Price"
                        value={reservationData.price}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    {/* Payment Status Dropdown */}
                    <div className="flex flex-col gap-2">
                      <span>Payment Status</span>
                      <select
                        name="status"
                        value={reservationData.status}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="none">None</option>
                        <option value="paid">Paid</option>
                      </select>
                    </div>
                    {/* Image Upload */}
                    <div className="flex flex-col gap-1">
                      <span>Upload Image</span>
                      <input
                        type="file"
                        name="image"
                        onChange={handleImageUpload}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>

                    <div className="mt-4 flex justify-end gap-4">
                      <button
                        onClick={() => setIsModalOpen(false)}
                        className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                      >
                        Close
                      </button>
                      <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}