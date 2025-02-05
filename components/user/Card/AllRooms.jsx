"use client";

import React, { useEffect, useState } from "react";
import { LARAVEL_ENDPOINT } from "@utils/apiEndpoints";
import { BtnRoomDetails } from "../layout/Button";
import { motion } from "framer-motion";
import AnimePopUp from "@components/motion/AnimePopUp";

const AllRooms = () => {
  const [RoomData, setDataRooms] = useState([]);
  const count = String(RoomData.length);

  const fetchData = async () => {
    try {
      const res = await fetch(LARAVEL_ENDPOINT.ROOMS);

      if (!res.ok) {
        throw new Error("Failed to fetch rooms");
      }

      const data = await res.json();
      setDataRooms(data);
    } catch (error) {
      console.log("Error fetching rooms:", error.message);
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.1,
      transition: { duration: 0.3 },
    },
    tap: {
      scale: 0.9,
    },
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 gap-y-16 pt-8">
          {RoomData.map((room) => (
            <div
              key={room.roomId}
              className="flex flex-col md:flex-row justify-center items-center"
            >
              <AnimePopUp
                whileHover={buttonVariants.hover}
                whileTap={buttonVariants.tap}
                variants={buttonVariants}
              >
                <div className="flex flex-col max-w-sm shadow-lg rounded-xl bg-white overflow-hidden">
                  <img
                    src={room.image || "/image/HotelImage5.jpg"}
                    alt="Room"
                    className="h-60 w-full object-cover"
                  />
                  <div className="flex flex-col gap-4 p-6">
                    <div className="flex justify-between items-center">
                      <h2 className="text-lg font-semibold">
                        <span className="text-textColor">Room ID: </span>
                        {room.roomId}
                      </h2>
                      <p className="text-sm">
                        <span className="text-textColor">Available: </span>
                        <span className="font-bold">
                          {room.available ? "Yes" : "No"}
                        </span>
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 font-bold">
                      <p>
                        <span className="text-textColor">Room Type: </span>
                        {room.roomType}
                      </p>
                      <p>
                        <span className="text-textColor">Bed Type: </span>
                        {room.bedType}
                      </p>
                      <p>
                        <span className="text-textColor">Max Occupancy: </span>
                        {room.maxOccupancy}
                      </p>
                      <p className="text-xl font-bold">
                        <span className="text-textColor">Price: </span>$
                        {room.pricePerNight} / night
                      </p>
                    </div>
                    <hr className="border-t border-gray-300" />
                    <BtnRoomDetails />
                    <div className="text-sm text-textColor">
                      <p>
                        Amenities:{" "}
                        <span className="font-medium">
                          {Array.isArray(room.amenities)
                            ? room.amenities.join(", ")
                            : room.amenities || "Not specified"}
                        </span>
                      </p>

                      <p className="mt-2">
                        Description: A comfortable room with great facilities.
                      </p>
                    </div>
                  </div>
                </div>
              </AnimePopUp>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllRooms;
