"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "@components/owner/component/layout/Sidebar";

const Page = () => {
    const [bookingData, setBookingData] = useState([]);
    const [totals, setTotals] = useState({ totalPrice: 0, totalBooked: 0 });

    useEffect(() => {
        // Simulating fetching data from JSON (can be fetched from API or local file)
        const data = [
            {
                user: "John Doe",
                booked: 3,
                price: 150,
                room: "Deluxe Suite",
                floor: 2,
            },
            {
                user: "Jane Smith",
                booked: 2,
                price: 200,
                room: "Presidential Suite",
                floor: 5,
            },
        ];
        setBookingData(data);

        // Calculate total price and total bookings
        const totalPrice = data.reduce((sum, item) => sum + item.booked * item.price, 0);
        const totalBooked = data.reduce((sum, item) => sum + item.booked, 0);
        setTotals({ totalPrice, totalBooked });
    }, []);

    return (
        <div className="flex">
            <aside className="sticky top-0 w-auto min-h-screen">
                <Sidebar />
            </aside>
            <main className="flex-1 p-4">
                <div>
                    <h1 className="text-xl font-bold mb-4">Booking Report</h1>
                    <table className="w-full border border-gray-300 text-left mb-4">
                        <thead>
                            <tr className="bg-gray-300">
                                <th className="p-2 border border-gray-300">User</th>
                                <th className="p-2 border border-gray-300">Booked</th>
                                <th className="p-2 border border-gray-300">Price</th>
                                <th className="p-2 border border-gray-300">Room</th>
                                <th className="p-2 border border-gray-300">Floor</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookingData.map((booking, index) => (
                                <tr
                                    key={index}
                                    className={`${
                                        index % 2 === 0 ? "bg-white" : "bg-gray-200"
                                    }`}
                                >
                                    <td className="p-2 border border-gray-300">{booking.user}</td>
                                    <td className="p-2 border border-gray-300">{booking.booked}</td>
                                    <td className="p-2 border border-gray-300">
                                        ${booking.price}
                                    </td>
                                    <td className="p-2 border border-gray-300">{booking.room}</td>
                                    <td className="p-2 border border-gray-300">{booking.floor}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="text-lg font-medium">
                        <p>Total Price: <span className="font-bold">${totals.totalPrice}</span></p>
                        <p>Total Booked: <span className="font-bold">{totals.totalBooked}</span></p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Page;
