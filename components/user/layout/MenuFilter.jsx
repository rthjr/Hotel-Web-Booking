import React from "react";

// react icon
import { FaLocationDot } from "react-icons/fa6";
import { FaHotel } from "react-icons/fa";
import { BsFillPersonFill } from "react-icons/bs";
import { IoBagCheckOutline } from "react-icons/io5";
import { Button } from "./Button";

const MenuFilter = () => {
  return (
    <div className="flex flex-wrap gap-4 justify-between items-center p-4 bg-white rounded-lg shadow-2xl">
      <div className="flex gap-4 w-full sm:w-auto">
        <FaLocationDot size={24} />
        <div className="flex flex-col gap-2">
          <span className="text-base font-bold">Location</span>
          <select name="" id="" className="text-sm focus:outline-none">
            <option value="">Kandal</option>
            <option value="">Phnom Penh</option>
            <option value="">Takhmao</option>
          </select>
        </div>
      </div>
      <div className="flex gap-4 w-full sm:w-auto">
        <FaHotel size={24} />
        <div className="flex flex-col gap-2">
          <span className="text-base font-bold">Room Type</span>
          <select name="" id="" className="text-sm focus:outline-none">
            <option value="">Standard</option>
            <option value="">Medium</option>
            <option value="">Large</option>
          </select>
        </div>
      </div>
      <div className="flex gap-4 w-full sm:w-auto">
        <BsFillPersonFill size={24} />
        <div className="flex flex-col gap-2">
          <span className="text-base font-bold">Person</span>
          <select name="" id="" className="text-sm focus:outline-none">
            <option value="">01</option>
            <option value="">05 - 10</option>
            <option value="">10 up</option>
          </select>
        </div>
      </div>
      <div className="flex gap-4 w-full sm:w-auto">
        <IoBagCheckOutline size={24} />
        <div className="flex flex-col gap-2">
          <span className="text-base font-bold">Check In</span>
          <input
            type="date"
            name="selectedDate"
            id="selectedDate"
            className="text-sm focus:outline-none"
          />
        </div>
      </div>
      <div className="flex gap-4 w-full sm:w-auto">
        <IoBagCheckOutline size={24} />
        <div className="flex flex-col gap-2">
          <span className="text-base font-bold">Check Out</span>
          <input
            type="date"
            name="selectedDate"
            id="selectedDate"
            className="text-sm focus:outline-none"
          />
        </div>
      </div>
      <div className="w-full sm:w-auto">
        <Button param="Book Now" style="rounded-lg" />
      </div>
    </div>
  );
};

export default MenuFilter;
