"use client"
import TiltCard from "@components/motion/TiltCard";
import { RoomDetail } from "@data/HotelData";
import Image from "@node_modules/next/image";
import { FacilitiesHotel } from "@data/HotelData";
import MenuFilter from "@components/user/layout/MenuFilter";
import { Button } from "@components/user/layout/Button";
import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_LARAVEL_API_URL;
const roomIds = [1, 2, 3];

export const HomePage = () => {
  const [roomsInHomePage, setRoomsInHomePage] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch(
          `${API_URL}/api/rooms/filter?ids=${roomIds.join(',')}`,
          { method: "GET", headers: { "Content-Type": "application/json" } }
        );
        if (!res.ok) throw new Error("Failed to fetch rooms");
        const data = await res.json();
        setRoomsInHomePage(data);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };
    fetchRooms();
  }, []);

  return (
    <>
      <div className="w-full h-screen flex flex-col gap-8  pb-8">
        {/* first */}
        <div className="flex justify-center items-center w-full">
          <div className="w-10/12 flex justify-between h-[70vh]">
            <div className="w-5/12 flex flex-col gap-8 justify-center h-full">
              <h2 className="text-textColor text-3xl font-semibold">
                Paradise View
              </h2>
              <h1 className="text-black text-5xl font-bold">
                Hotel for every <br /> moment rich in <br /> emotion
              </h1>
              <p className="text-sm">
                Every moment feels like the first time <br /> in paradise view{" "}
              </p>
              <div className="w-fit">
                {" "}
                <Button param="Book Now" style="rounded-lg" />
              </div>
            </div>
            <div className="w-5/12 h-full lg:h-[80vh] relative">
              <Image
                src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="banner"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* menu filter */}
      <div className="lg:-mt-[19%] w-full flex justify-center items-center sticky top-24 z-20">
        <div className="w-10/12">
          {/* MenuFilter */}
          <div>
            <MenuFilter />
          </div>
        </div>
      </div>
      {/* second */}
      {/* facility */}
      <div className="flex flex-col gap-8 w-full h-full justify-center items-center mt-12">
        <div className="flex flex-col gap-4 justify-center items-center w-10/12">
          <h2 className="text-2xl font-bold text-black">Our Facilities</h2>
          <p className="text-black text-base">
            We offer modern (5 star) hotel facilities for your comfort.
          </p>
        </div>
        <div className="w-10/12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-textColor">
          {FacilitiesHotel.map((fh) => (
            <TiltCard key={fh.id} icon={fh.icon} text={fh.facility} />
          ))}
        </div>
      </div>

      {/* third */}
      {/* banner */}
      <div
        className="flex flex-col gap-8 w-full h-full justify-center items-center py-4 relative"
        style={{
          backgroundImage:
            "url('https://plus.unsplash.com/premium_photo-1681922761648-d5e2c3972982?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40 z-0"></div>
        <div className="flex flex-col gap-8 justify-center items-center w-10/12 relative z-10">
          <div className="flex flex-col gap-4 justify-center items-center">
            <h2 className="text-2xl font-bold text-white drop-shadow-lg">
              Luxurious Rooms
            </h2>
            <div className="border-t-2 border-t-white w-40 h-1"></div>
            <span className="text-sm text-white drop-shadow">
              All rooms are designed for your comfort
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full gap-6">
            {roomsInHomePage.map((rihp) => (
              <div
                className="flex flex-col gap-4 p-4 bg-white/90 rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300"
                key={rihp.roomId}
              >
                <div className="relative aspect-square">
                  <Image 
                    src={rihp.image || "/image/HotelImage5.jpg"}
                    alt={rihp.roomType || "Room image"}
                    fill
                    className="object-cover rounded-2xl"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute top-4 right-4 flex items-center gap-2 px-4 py-1  text-textColor rounded-full text-xs transition-transform duration-300 hover:scale-105">
                    <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      rihp.available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}
                  >
                    {rihp.available ? "Available" : "Unavailable"}
                  </span>
                  </div>
                </div>
                <div>
                  <p className="inline-block px-3 py-1 bg-[#d5d1b3] text-textColor rounded-full text-sm font-semibold shadow">
                    {rihp.roomType}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
