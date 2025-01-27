"use client";
import React from "react";
import { useRouter } from "@node_modules/next/navigation";
import { BtnRoomDetails } from "@components/layout/Button";
import { RoomData } from "@/data/RoomData";

const Rooms = () => {
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };
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
      <div className="max-w-6xl mx-auto">
        <div className="max-w-6xl mx-auto grid grid-cols-2 gap-y-16 pt-8">
          {RoomData.map((Room) => (
            <div
              key={Room.id}
              className="flex flex-col md:flex-row justify-center items-center  "
            >
              <div className="flex flex-col max-w-sm shadow-lg rounded-xl bg-white overflow-hidden">
                <img
                  src="/image/HotelImage5.jpg"
                  alt="Hotel"
                  className="h-60 w-full object-cover"
                />
                <div className="flex flex-col gap-4 p-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold ">
                      <span className="text-textColor">Room: </span>
                      {Room.room}
                    </h2>
                    <p className="text-sm ">
                      <span className="text-textColor">Available: </span>
                      <span className="font-bold">{Room.available}</span>
                    </p>
                  </div>
                  <div className="flex flex-col justify-between items-start gap-4 font-bold">
                    <p className="text">
                      <span className=" text-textColor">Room Type: </span>
                      {Room.amountRoomType}&nbsp;{Room.roomType}
                    </p>
                    <p>
                      <span className=" text-textColor">
                        Number of Guests:{" "}
                      </span>
                      {Room.NumGuest}
                    </p>
                    <p className="text-xl font-bold ">
                      <span className="text-textColor">Price: </span>
                      {Room.price}
                    </p>
                  </div>
                  <hr className="border-t border-gray-300" />
                  <BtnRoomDetails />
                  <div className="text-sm text-textColor">
                    <p className="mt-2">
                      Rating: <span className="font-medium">4.5/5</span>
                    </p>
                    <p>
                      Location: <span className="font-medium">City Center</span>
                    </p>
                    <p>
                      Amenities:{" "}
                      <span className="font-medium">
                        Kitchen, Wifi, Free Parking
                      </span>
                    </p>
                    <p className="mt-2">
                      Description: This spacious room offers everything you need
                      for a comfortable stay.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Rooms;
