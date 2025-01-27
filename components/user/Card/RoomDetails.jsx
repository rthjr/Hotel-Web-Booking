"use client"
import React from "react";
import { useRouter } from "@node_modules/next/navigation";

const RoomDetails = () => {
    const router = useRouter();
    const handleBack = () => {
        router.back();
    }
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
        <h1>RoomDetail</h1>
      </div>
    </>
  );
};

export default RoomDetails;
