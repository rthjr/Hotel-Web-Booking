
"use client";
import React, { useEffect, useState } from "react";
import { LARAVEL_ENDPOINT } from "@utils/apiEndpoints";
import { useRouter } from "@node_modules/next/navigation";
// Components
import { Button } from "@components/user/layout/Button";
// React Icons
import { FaTv } from "react-icons/fa";
import { PiShower } from "react-icons/pi";
import { FaWifi } from "react-icons/fa6";
import { useHotelContext } from "@Context/owner/ChosseHotelContext";
import Topbar from '@components/owner/component/layout/Topbar';

const Page = () => {

  const { setHotelId } = useHotelContext();
  const [hotels, setHotels] = useState([]);
  const router = useRouter();

  const fetchData = async () => {
    try {
      const res = await fetch(LARAVEL_ENDPOINT.HOTELS);

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

  // Store data in context and navigate to new page
  const handleNextPage = (hotelId) => {
    setHotelId(hotelId);
    router.push("/ChooseHotel/Reservation");
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="lg:p-4 p-0 flex flex-col gap-8 place-items-center">
      <Topbar />
      <div>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-textColor">
          {hotels.map((hotel) => (
            <div
              key={hotel.hotelId} // Use `hotelId` from your new data structure
              className="flex flex-col gap-2 shadow-2xl rounded-xl"
            >
              <img
                src={hotel.image || "/default-hotel.jpg"} // Use fallback image
                alt={hotel.hotelName || "Hotel Image"}
                className="h-52 rounded-t-lg"
              />
              <div className="flex flex-col gap-4 p-4">
                <div className="flex justify-between">
                  <h2 className="font-semibold">{hotel.hotelName || "Unnamed Hotel"}</h2>
                  <p>Rooms: {hotel.amountRoom || "N/A"}</p>
                </div>
                <p className="text-sm text-gray-500">{hotel.location || "Unknown Location"}</p>
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
                  <Button Rooms={() => handleNextPage(hotel.roomID)} param="Explore" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;