"use client";
import React from "react";
import { useRouter } from "@node_modules/next/navigation";

const RoomDetails = () => {
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };
  return (
    <>
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
      <div>
        <div className="flex justify-between">
          <div>
            <div className="font-bold text-2xl">
              <h2>Hotel 1</h2>
            </div>
            <div className="font-bold text-xl">
              <h3>Room 1</h3>
            </div>
            <div>
              <p>
                97 Preah Sisowath Quay, Daun Penh, Phnom Penh, Cambodia
                Excellent location
              </p>
            </div>
          </div>
          <div>
            <div>
              <div>
                <button className="font-bold bg-bgDarkColor text-bgColor py-3 px-6 rounded-lg">
                  Reservation
                </button>
              </div>
              <div className="text-3xl flex justify-evenly">
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="none"
                      stroke="#857749"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4.318 6.318a4.5 4.5 0 0 0 0 6.364L12 20.364l7.682-7.682a4.5 4.5 0 0 0-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 0 0-6.364 0"
                    ></path>
                  </svg>
                </div>
                <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill="#857749"
                    d="M15 8a3 3 0 1 0-2.977-2.63l-4.94 2.47a3 3 0 1 0 0 4.319l4.94 2.47a3 3 0 1 0 .895-1.789l-4.94-2.47a3 3 0 0 0 0-.74l4.94-2.47C13.456 7.68 14.19 8 15 8"
                  ></path>
                </svg>
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RoomDetails;
