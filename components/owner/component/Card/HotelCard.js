"use client";
import React, { useEffect, useState } from "react";
import { API_ENDPOINTS } from "@utils/apiEndpoints";
import { useRouter } from "@node_modules/next/navigation";
// Component
import { Button } from "@components/user/layout/Button";
// React Icons
import { FaTv } from "react-icons/fa";
import { PiShower } from "react-icons/pi";
import { FaWifi } from "react-icons/fa6";
import { useHotelContext } from "@Context/owner/ChosseHotelContext";

const HotelCard = () => {

  const { setHotelId } = useHotelContext();

  const [hotels, setHotels] = useState([]);
  const router = useRouter();

  const fetchData = async () => {
    try {
      const res = await fetch(API_ENDPOINTS.HOTELS);

      if (!res.ok) {
        throw new Error("Failed to fetch HOTELS!");
      }

      const data = await res.json();

      // Validate data structure
      if (Array.isArray(data)) {
        setHotels(data);
      } else {
        console.error("Unexpected data format received from API.");
        setHotels([]);
      }
    } catch (error) {
      console.log("Error fetching Hotels:", error.message);
    }
  };

  // store data in context and render to new page
  const handleNextPage = (Id) => {
    setHotelId(Id);
    router.push("/ChooseHotel/Reservation");
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-textColor">
      {hotels.map((hotel) => (
        <div
          key={hotel.id || Math.random()} // Use fallback key if hotel.id is undefined
          className="flex flex-col gap-2 shadow-2xl rounded-xl"
        >
          <img
            src={hotel.image || "/default-hotel.jpg"} // Add fallback image
            alt={hotel.name || "Hotel Image"}
            className="h-52 rounded-t-lg"
          />
          <div className="flex flex-col gap-4 p-4">
            <div className="flex justify-between">
              <h2>{hotel.name || "Unnamed Hotel"}</h2>
              <p>Available: {hotel.available || "N/A"}</p>
            </div>
            <p>Price: {hotel.price ? `$${hotel.price}` : "Contact for price"}</p>
            <span className="flex items-center">
              <span className="h-px flex-1 bg-textColor"></span>
            </span>
            <div className="flex justify-between items-center">
              <div className="flex gap-8">
                <div className="bg-gray-200 p-2 rounded-full">
                  <FaTv size={20} />
                </div>
                <div className="bg-gray-200 p-2 rounded-full">
                  <PiShower size={20} />
                </div>
                <div className="bg-gray-200 p-2 rounded-full">
                  <FaWifi size={20} />
                </div>
              </div>
              <Button Rooms={()=>handleNextPage(hotel.id)} param="Explore" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HotelCard;
