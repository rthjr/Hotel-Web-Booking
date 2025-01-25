"use client"
import React, { useState, useEffect } from 'react';
import Sidebar from "@components/owner/component/layout/Sidebar";

const Page = () => {
    const [hotelData, setHotelData] = useState([]);

    useEffect(() => {
        // Simulating fetching data from JSON (can be fetched from API or local file)
        const data = [
            {
                name: "Hotel California",
                location: "California, USA",
                rating: 4.5,
                price: "$200 per night",
                amenities: ["Free Wi-Fi", "Swimming Pool", "Gym", "Restaurant"],
                reviews: "Excellent service and great location."
            },
            {
                name: "Grand Palace Hotel",
                location: "Paris, France",
                rating: 4.8,
                price: "$350 per night",
                amenities: ["Free Wi-Fi", "Spa", "Bar", "Parking"],
                reviews: "Luxurious experience and friendly staff."
            }
        ];
        setHotelData(data);
    }, []);

    return (
        <div className="flex">
            <aside className="sticky top-0 w-auto min-h-screen">
                <Sidebar />
            </aside>
            <main className="flex-1">
                <div>
                    <h1>Hotel Report</h1>
                    <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Location</th>
                                <th>Rating</th>
                                <th>Price</th>
                                <th>Amenities</th>
                                <th>Reviews</th>
                            </tr>
                        </thead>
                        <tbody>
                            {hotelData.map((hotel, index) => (
                                <tr key={index}>
                                    <td>{hotel.name}</td>
                                    <td>{hotel.location}</td>
                                    <td>{hotel.rating}</td>
                                    <td>{hotel.price}</td>
                                    <td>{hotel.amenities.join(', ')}</td>
                                    <td>{hotel.reviews}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}

export default Page;
