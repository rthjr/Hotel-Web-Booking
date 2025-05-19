"use client";
import { LARAVEL_ENDPOINT } from "@utils/apiEndpoints";
import React, { useEffect, useState } from "react";
import { useRouter } from "@node_modules/next/navigation";
import { BtnRoomDetails } from "../layout/Button";
import { RoomData } from "@/data/RoomData";
import { FaKitchenSet } from "react-icons/fa6";
import { FaWifi } from "react-icons/fa6";
import { FaParking } from "react-icons/fa";

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch(LARAVEL_ENDPOINT.ROOMS);
        if (!res.ok) throw new Error("Failed to fetch rooms");
        const data = await res.json();
        setRooms(data);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };
    fetchRooms();
  }, []);

  return (
    <>
      <div>
        <button
          className="flex items-center px-4 py-2 text-white bg-buttonColor rounded-md hover:bg-bgDarkColor focus:outline-none focus:ring-2 focus:ring-blue-300"
          onClick={handleBack}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              d="M7.707 14.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L4.414 9H17a1 1 0 110 2H4.414l3.293 3.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back
        </button>
      </div>
      <div className="max-w-6xl mx-auto flex flex-col gap-8 pt-8">
        {rooms.map((Room) => (
          <div
            key={Room.roomId}
            className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200
              transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-bgDarkColor"
            style={{ willChange: "transform, box-shadow" }}
          >
            {/* Image */}
            <div className="w-60 h-[258px] ">
              <img
                src={Room.image || "/image/HotelImage5.jpg"}
                alt="Room"
                className="w-full h-full object-cover"
                style={{ minHeight: '100%', minWidth: '100%' }}
              />
            </div>
            {/* Details */}
            <div className="flex flex-col justify-between p-4 pl-6 flex-1">
              <div>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <h2 className="text-2xl font-bold text-textColor">
                    Room: {Room.roomType}
                  </h2>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      Room.available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}
                  >
                    {Room.available ? "Available" : "Unavailable"}
                  </span>
                </div>  
                <div className="flex flex-wrap gap-4 mt-2 text-gray-600 text-sm">
                  <span className="text-textColor"><b className="text-textColor">Type:</b> {Room.bedType}</span>
                  <span className="text-textColor"><b className="text-textColor">Guests:</b> {Room.maxOccupancy}</span>
                  <span className="text-textColor"><b className="text-textColor">Location:</b> City Center</span>
                </div>
                <div className="flex items-center gap-4 mt-4">
                  <span title="Kitchen" className="bg-gray-100 p-2 rounded-full text-xl text-textColor "><FaKitchenSet /></span>
                  <span title="Wifi" className="bg-gray-100 p-2 rounded-full text-xl text-textColor "><FaWifi /></span>
                  <span title="Parking" className="bg-gray-100 p-2 rounded-full text-xl text-textColor "><FaParking /></span>
                </div>
                <p className="mt-4 text-gray-500 text-sm">
                  {Room.amenities/* description */ || "This spacious room offers everything you need for a comfortable stay."}
                </p>
              </div>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-6 gap-4">
                <div>
                  <span className="text-2xl font-bold text-yellow-600">${Room.pricePerNight}</span>
                  <span className="text-gray-500 text-sm ml-1">/night</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-yellow-500 font-semibold">★ 4.5/5</span>
                  <BtnRoomDetails />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Rooms;
