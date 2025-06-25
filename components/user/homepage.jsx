"use client";
import TiltCard from "@components/motion/TiltCard";
import { RoomDetail } from "@data/HotelData";
import Image from "@node_modules/next/image";
import { FacilitiesHotel } from "@data/HotelData";
import MenuFilter from "@components/user/layout/MenuFilter";
import { Button } from "@components/user/layout/Button";
import { useEffect, useState } from "react";
import Loading from "@app/loading";

const API_URL = process.env.NEXT_PUBLIC_LARAVEL_API_URL;
const roomIds = [1, 2, 3];

export const HomePage = () => {
  const [roomsInHomePage, setRoomsInHomePage] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        setError(null);

        // Create URL with proper array syntax
        const url = new URL(`${API_URL}/api/room-types/featured`);
        roomIds.forEach((id) => url.searchParams.append("ids[]", id));

        const res = await fetch(url, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        setRoomsInHomePage(data);
      } catch (error) {
        console.error("Error fetching rooms:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  if (loading) return <Loading/>
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <div className="w-full h-screen flex flex-col gap-8 mt-8 pb-8">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full gap-8">
            {roomsInHomePage.map((room) => (
              <div
                className="group relative flex flex-col bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border-0 hover:-translate-y-2"
                key={room.id}
              >
                {/* Image Section */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={room.images?.[0] || "/image/HotelImage5.jpg"}
                    alt={room.name || "Room image"}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Status Badge */}
                  <div className="absolute top-5 right-5">
                    <div
                      className={`px-4 py-2 rounded-2xl text-sm font-semibold backdrop-blur-md border shadow-lg ${
                        room.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {room.status === "active" ? "Available" : "Unavailable"}
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="flex flex-col gap-4 p-7">
                  {/* Title & Description */}
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-gray-900 group-hover:text-[#857749] transition-colors duration-300">
                      {room.name}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-sm">
                      {room.description}
                    </p>
                  </div>

                  {/* Price & Size */}
                  <div className="flex justify-between items-end py-3">
                    <div className="space-y-1">
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-gray-900">
                          ${room.base_price}
                        </span>
                        <span className="text-gray-500 text-sm font-medium">
                          / night
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-gray-600">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                        <span className="text-sm font-medium">
                          {room.size} m²
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex flex-wrap gap-2">
                      {room.amenities?.slice(0, 5).map((amenity, index) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 bg-gradient-to-r from-[#857749]/10 to-[#857749]/20 hover:from-[#857749]/20 hover:to-[#857749]/30 text-[#857749] text-xs font-medium rounded-xl transition-all duration-300 cursor-default border border-[#857749]/20"
                        >
                          {amenity}
                        </span>
                      ))}
                      {room.amenities?.length > 5 && (
                        <span className="px-3 py-1.5 text-gray-500 text-xs font-medium bg-gray-50 rounded-xl border border-gray-200">
                          +{room.amenities.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[#857749]/10 to-[#857749]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
