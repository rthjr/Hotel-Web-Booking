"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "@components/owner/component/layout/Sidebar";
import { API_ENDPOINTS } from "@utils/apiEndpoints";
import { useHotelContext } from "@Context/owner/ChosseHotelContext";

const Page = () => {
    const [bookingData, setBookingData] = useState([]); // Stores full hotel data
    const [totals, setTotals] = useState({
        totalPrice: 0,
        totalBooked: 0,
        totalOnHold: 0 // New state for on-hold reservations
    });
    const [report, setReport] = useState([]); // Stores flattened reservations for the table
    const [searchQuery, setSearchQuery] = useState(""); // Search query for filtering by name
     // Context for selected hotel

    const fetchData = async () => {
        // Exit if hotelId is not set

        try {
            const res = await fetch(API_ENDPOINTS.HOTELS);
            if (!res.ok) throw new Error("Failed to fetch data");
            const data = await res.json();

            if (Array.isArray(data)) {
                let totalBooked = 0;
                let totalPrice = 0;
                let totalOnHold = 0; // Initialize on-hold counter
                const allReservations = [];

                // Find the selected hotel by hotelId
                const selectedHotel = data.find((hotel) => hotel.id === hotelId);
                if (selectedHotel) {
                    // Access the reservations array
                    const reservations = selectedHotel.reservations || [];

                    // Process each reservation
                    reservations.forEach((reservation) => {
                        if (reservation.status === "paid") {
                            totalBooked += 1; // Count paid reservations
                            totalPrice += reservation.price; // Add reservation price
                        } else if (reservation.status === "none") {
                            totalOnHold += 1; // Count on-hold reservations
                        }

                        // Add reservation data to the report
                        allReservations.push({
                            user: reservation.name,
                            people: reservation.people,
                            price: reservation.price,
                            room: reservation.id,
                            floor: reservation.floor,
                            status: reservation.status, // Include status in the report
                        });
                    });
                }

                // Update state
                setBookingData(data);
                setTotals({ totalPrice, totalBooked, totalOnHold });
                setReport(allReservations);
            }
        } catch (error) {
            console.log("Error fetching Hotels:", error.message);
        }
    };

    useEffect(() => {
        fetchData();
    }, [hotelId]); // Refetch data when hotelId changes

    // Filter reservations based on search query
    const filteredReport = report.filter((reservation) =>
        reservation.user.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex">
            <aside className="sticky top-0 w-auto min-h-screen">
                <Sidebar />
            </aside>
            <main className="flex-1 p-4">
                <div>
                    <h1 className="text-xl font-bold mb-4">Booking Report</h1>

                    {/* Search input for filtering by name */}
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Search by name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="p-2 border border-gray-300 rounded-lg w-full max-w-md"
                        />
                    </div>

                    <div className="text-lg font-medium w-full flex justify-around items-center mb-4">
                        <div className="bg-gray-100 border-2 border-textColor shadow-lg rounded-lg min-h-32 min-w-52 flex flex-col justify-center text-xl place-items-center text-black">
                            <p>Total Price</p>
                            <span className="font-bold">${totals.totalPrice}</span>
                        </div>
                        <div className="bg-gray-100 border-2 border-textColor shadow-lg rounded-lg min-h-32 min-w-52 flex flex-col justify-center text-xl place-items-center text-black">
                            <p>Room Booked</p>
                            <span className="font-bold">{totals.totalBooked}</span>
                        </div>
                        <div className="bg-gray-100 border-2 border-textColor shadow-lg rounded-lg min-h-32 min-w-52 flex flex-col justify-center text-xl place-items-center text-black">
                            <p>On Hold</p>
                            <span className="font-bold">{totals.totalOnHold}</span>
                        </div>
                    </div>

                    <table className="w-full border border-gray-300 text-left mb-4">
                        <thead>
                            <tr className="bg-gray-300">
                                <th className="p-2 border border-gray-300">User</th>
                                <th className="p-2 border border-gray-300">People</th>
                                <th className="p-2 border border-gray-300">Price</th>
                                <th className="p-2 border border-gray-300">Room</th>
                                <th className="p-2 border border-gray-300">Floor</th>
                                <th className="p-2 border border-gray-300">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredReport.map((reservation, index) => (
                                <tr
                                    key={index}
                                    className={index % 2 === 0 ? "bg-white" : "bg-gray-200"}
                                >
                                    <td className="p-2 border border-gray-300">{reservation.user}</td>
                                    <td className="p-2 border border-gray-300">{reservation.people}</td>
                                    <td className="p-2 border border-gray-300">
                                        {reservation.price !== null ? `$${reservation.price}` : "N/A"}
                                    </td>
                                    <td className="p-2 border border-gray-300">{reservation.room}</td>
                                    <td className="p-2 border border-gray-300">{reservation.floor}</td>
                                    <td className="p-2 border border-gray-300">{reservation.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

export default Page;