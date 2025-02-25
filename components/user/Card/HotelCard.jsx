"use client";
import React, { useEffect, useState } from "react";
import { LARAVEL_ENDPOINT } from "@utils/apiEndpoints";
import { Button } from "../layout/Button";

// React icons
import { FaTv } from "react-icons/fa";
import { PiShower } from "react-icons/pi";
import { FaWifi } from "react-icons/fa6";

const HotelCard = ({ Rooms }) => {
  const [hotels, setHotels] = useState([]);

  const fetchData = async () => {
    try {
      const res = await fetch(LARAVEL_ENDPOINT.HOTELS);

      if (!res.ok) {
        throw new Error("Failed to fetch HOTELS!");
      }

      const data = await res.json();
      setHotels(data);
    } catch (error) {
      console.log("Error fetching hotels:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-textColor">
      {hotels.map((hotel) => (
        <div
          key={hotel.hotelId}
          className="flex flex-col gap-2 shadow-2xl rounded-xl"
        >
          <img
            src={hotel.Image || "/image/default-hotel.jpg"}
            alt="Hotel"
            className="h-52 rounded-t-lg"
          />
          <div className="flex flex-col gap-4 p-4">
            <div className="flex justify-between">
              <h2>{hotel.hotelName}</h2>
              <p>Available Rooms: {hotel.amountRoom}</p>
            </div>
            <p>Location: {hotel.location}</p>
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
              <Button Rooms={Rooms} param="Explore" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HotelCard;
