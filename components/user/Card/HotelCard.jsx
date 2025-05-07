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
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 text-textColor">
      {hotels.map((hotel) => (
        <div
          key={hotel.hotelId}
          className="flex flex-col gap-2 shadow-2xl rounded-xl bg-white transition-transform transform hover:scale-105 hover:shadow-3xl relative"
        >
          {/* Featured Badge */}
          {hotel.featured && (
            <span className="absolute top-4 left-4 bg-yellow-400 text-white px-3 py-1 rounded-full text-xs font-bold z-10">
              Featured
            </span>
          )}
          <img
            src={hotel.image || "/image/default-hotel.jpg"}
            alt="Hotel"
            className="h-52 w-full object-cover rounded-t-lg"
          />
          <div className="flex flex-col gap-4 p-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold">{hotel.hotelName}</h2>
              <div className="flex items-center gap-1">
                <span className="text-yellow-400">
                  {/* Example: 4.5 stars */}
                  ★★★★☆
                </span>
                <span className="text-sm text-gray-500">({hotel.rating || "N/A"})</span>
              </div>
            </div>
            <p className="text-sm text-gray-600">{hotel.description || "A wonderful place to stay!"}</p>
            <p className="text-sm">Location: <span className="font-medium">{hotel.location}</span></p>
            <div className="flex justify-between items-center">
              <div className="flex gap-4">
                <div className="flex flex-col items-center" title="TV">
                  <div className="bg-gray-200 p-2 rounded-full">
                    <FaTv size={20} />
                  </div>
                  <span className="text-xs mt-1">TV</span>
                </div>
                <div className="flex flex-col items-center" title="Shower">
                  <div className="bg-gray-200 p-2 rounded-full">
                    <PiShower size={20} />
                  </div>
                  <span className="text-xs mt-1">Shower</span>
                </div>
                <div className="flex flex-col items-center" title="WiFi">
                  <div className="bg-gray-200 p-2 rounded-full">
                    <FaWifi size={20} />
                  </div>
                  <span className="text-xs mt-1">WiFi</span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-green-600 font-bold text-lg">
                  ${hotel.price || "N/A"}
                  <span className="text-xs font-normal text-gray-500">/night</span>
                </span>
                <Button Rooms={Rooms} param="Explore" className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                  <span>Explore</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                  </svg>
                </Button>
              </div>
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>Available Rooms: {hotel.amountRoom}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HotelCard;
