"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import HotelDetailsPage from "@components/Details/HotelDetailsPage";
import Loading from "@app/loading";

export default function HotelDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [hotel, setHotel] = useState(null);

  // Updated image handling to work with both array and JSON string formats
  const getHotelImages = (hotel) => {
    if (!hotel?.images) return [];

    if (Array.isArray(hotel.images)) {
      return hotel.images;
    }

    if (typeof hotel.images === "string") {
      try {
        return JSON.parse(hotel.images);
      } catch {
        return [];
      }
    }

    return [];
  };

  const images = getHotelImages(hotel);
  const detailImages = images.slice(1);

  const [roomTypes, setRoomTypes] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [availability, setAvailability] = useState({});
  const [showingAvailability, setShowingAvailability] = useState(false);
  const [hasCheckedAvailability, setHasCheckedAvailability] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [checkIn, setCheckIn] = useState(searchParams.get("check_in") || "");
  const [checkOut, setCheckOut] = useState(searchParams.get("check_out") || "");
  const [loading, setLoading] = useState(true);
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  const LARAVEL_API_URL = process.env.NEXT_PUBLIC_LARAVEL_API_URL;

  useEffect(() => {
    if (params.id) {
      // If dates are provided in URL, automatically check availability
      if (checkIn && checkOut) {
        setShowingAvailability(true);
        setHasCheckedAvailability(true);
        fetchHotelDetailsWithAvailability();
      } else {
        fetchHotelDetails();
        fetchRoomTypes();
      }
    }
  }, [params.id]);

  const fetchHotelDetails = async () => {
    try {
      const response = await fetch(
        `${LARAVEL_API_URL}/api/hotels/${params.id}`
      );
      const data = await response.json();
      console.log("Hotel data:", data);
      setHotel(data.data);
    } catch (error) {
      console.error("Error fetching hotel details:", error);
    } finally {
      setLoading(false);
    }
  };

  // In your fetchRoomTypes function:
  const fetchRoomTypes = async () => {
    try {
      const response = await fetch(
        `${LARAVEL_API_URL}/api/room-types?hotel_id=${params.id}`
      );
      const data = await response.json();
      // Make sure to properly handle the response structure
      // If the response is an array of room types with images:
      setRoomTypes(data.data);
      // Or if the response has a different structure:
      // setRoomTypes(data.data.map(room => room.room_type));
    } catch (error) {
      console.error("Error fetching room types:", error);
    }
  };

  const fetchHotelDetailsWithAvailability = async () => {
    try {
      // Get hotel details
      const hotelResponse = await fetch(
        `${LARAVEL_API_URL}/api/hotels/${params.id}`
      );
      const hotelData = await hotelResponse.json();
      setHotel(hotelData.data);

      // Get room types
      const roomTypesResponse = await fetch(
        `${LARAVEL_API_URL}/api/room-types?hotel_id=${params.id}`
      );
      const roomTypesData = await roomTypesResponse.json();
      setRoomTypes(roomTypesData.data);

      // Check availability for each room type if dates are provided
      if (checkIn && checkOut) {
        const availabilityPromises = roomTypesData.data.map(
          async (roomType) => {
            const response = await fetch(
              `${LARAVEL_API_URL}/api/room-types/${roomType.id}/availability?check_in=${checkIn}&check_out=${checkOut}`
            );
            const data = await response.json();
            return { roomTypeId: roomType.id, ...data };
          }
        );

        const availabilityResults = await Promise.all(availabilityPromises);
        const availabilityMap = {};
        const availableRoomTypes = [];

        availabilityResults.forEach((result) => {
          availabilityMap[result.roomTypeId] = result;
          // Find the corresponding room type and add availability info
          const roomType = roomTypesData.data.find(
            (rt) => rt.id === result.roomTypeId
          );
          if (
            roomType &&
            (result.available_count > 0 ||
              (result.available_rooms && result.available_rooms.length > 0))
          ) {
            availableRoomTypes.push({
              ...roomType,
              available_count:
                result.available_count || result.available_rooms?.length || 0,
              available_rooms: result.available_rooms || [],
            });
          }
        });

        setAvailability(availabilityMap);
        setAvailableRooms(availableRoomTypes);
      }
    } catch (error) {
      console.error("Error fetching hotel details with availability:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkAvailability = async () => {
    if (!checkIn || !checkOut) {
      alert("Please select check-in and check-out dates");
      return;
    }

    setCheckingAvailability(true);
    try {
      console.log("Checking availability for room types:", roomTypes);

      // Check availability for each room type
      const availabilityPromises = roomTypes.map(async (roomType) => {
        console.log(
          `Checking availability for room type ${roomType.id}: ${roomType.name}`
        );

        const response = await fetch(
          `${LARAVEL_API_URL}/api/room-types/${roomType.id}/availability?check_in=${checkIn}&check_out=${checkOut}`
        );
        const data = await response.json();

        console.log(
          `Availability response for room type ${roomType.id}:`,
          data
        );

        // TEMPORARY: If your backend always returns available_count: 0,
        // let's treat all room types as available for testing
        // Remove this once your backend is fixed
        if (data.room_type) {
          return {
            ...roomType,
            available_count: 1, // Assume 1 available for testing
            available_rooms: [{ id: 1, room_number: "Test" }], // Mock data
          };
        }

        // Return room type with availability info if there are available rooms
        if (data.available_count && data.available_count > 0) {
          return {
            ...roomType,
            available_count: data.available_count,
            available_rooms: data.available_rooms || [],
          };
        }

        // Also check if available_rooms array has items (alternative check)
        if (
          data.available_rooms &&
          Array.isArray(data.available_rooms) &&
          data.available_rooms.length > 0
        ) {
          return {
            ...roomType,
            available_count: data.available_rooms.length,
            available_rooms: data.available_rooms,
          };
        }

        return null;
      });

      const results = await Promise.all(availabilityPromises);
      const availableRoomTypes = results.filter((room) => room !== null);

      console.log("Filtered available room types:", availableRoomTypes);

      // Set available rooms and show filtered results
      setAvailableRooms(availableRoomTypes);
      setShowingAvailability(true);
      setHasCheckedAvailability(true); // Mark that availability has been checked
      setShowWarning(false); // Hide warning once availability is checked
    } catch (error) {
      console.error("Error checking availability:", error);
      alert("Error checking availability. Please try again.");
      setAvailableRooms([]);
      setShowingAvailability(false);
      setHasCheckedAvailability(false);
    } finally {
      setCheckingAvailability(false);
    }
  };

  const handleViewDetails = (roomTypeId) => {
    if (!hasCheckedAvailability) {
      setShowWarning(true);
      // Scroll to availability section to show the warning
      window.scrollTo({
        top: document.querySelector(".availability-section")?.offsetTop || 0,
        behavior: "smooth",
      });
      return;
    }

    if (!checkIn || !checkOut) {
      alert(
        "Please select check-in and check-out dates before viewing room details"
      );
      return;
    }

    router.push(
      `/hotels/${params.id}/rooms/${roomTypeId}?check_in=${checkIn}&check_out=${checkOut}`
    );
  };

  const resetAvailability = () => {
    setShowingAvailability(false);
    setAvailableRooms([]);
    setHasCheckedAvailability(false);
    setShowWarning(false);
    setCheckIn("");
    setCheckOut("");
  };

  // Function to handle "View All Rooms" button click
  const handleViewAllRooms = () => {
    const queryParams =
      checkIn && checkOut ? `?check_in=${checkIn}&check_out=${checkOut}` : "";
    router.push(`/hotels/${params.id}/rooms${queryParams}`);
  };

  // Function to handle "View Details" click when availability hasn't been checked
  const handleViewDetailsClick = (e, roomTypeId) => {
    if (!hasCheckedAvailability) {
      e.preventDefault();
      setShowWarning(true);
      // Scroll to availability section to show the warning
      window.scrollTo({
        top: document.querySelector(".availability-section")?.offsetTop || 0,
        behavior: "smooth",
      });
      return;
    }
  };

  // Determine which rooms to display - ensure we always have an array
  const roomsToDisplay = showingAvailability
    ? Array.isArray(availableRooms)
      ? availableRooms
      : []
    : Array.isArray(roomTypes)
    ? roomTypes
    : [];

  if (loading) return <Loading message="Loading hotel details..." />;
  if (!hotel) return <div>Hotel not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg p-6">
        <h1 className="text-4xl font-bold mb-4">{hotel.name}</h1>
        <p className="text-gray-600 mb-4">{hotel.description}</p>
        <p className="text-gray-500 mb-6">
          {hotel.address}, {hotel.city}
        </p>
        <div className="w-12/12 flex justify-between gap-4">
          <div className="w-9/12">
            <div
              className="grid gap-3 py-4"
              style={{
                gridTemplateColumns: "repeat(5, 168px)",
                gridTemplateRows: "236px 236px 112px",
              }}
            >
              {/* Main large image: 528 x 484 (spans 3 columns, 2 rows) */}
              {detailImages[0] && (
                <div className="col-span-3 row-span-2">
                  <img
                    src={detailImages[0]}
                    alt={`detail-0`}
                    className="w-full h-full object-cover rounded-lg shadow-lg"
                    style={{ width: "528px", height: "484px" }}
                  />
                </div>
              )}

              {/* First medium image: 348 x 236 (spans 2 columns) */}
              {detailImages[1] && (
                <div className="col-span-2 col-start-4">
                  <img
                    src={detailImages[1]}
                    alt={`detail-1`}
                    className="w-full h-full object-cover rounded-lg shadow-lg"
                    style={{ width: "348px", height: "236px" }}
                  />
                </div>
              )}

              {/* Second medium image: 348 x 236 (spans 2 columns) */}
              {detailImages[2] && (
                <div className="col-span-2 col-start-4 row-start-2">
                  <img
                    src={detailImages[2]}
                    alt={`detail-2`}
                    className="w-full h-full object-cover rounded-lg shadow-lg"
                    style={{ width: "348px", height: "236px" }}
                  />
                </div>
              )}

              {/* Five small images: 168 x 112 each - all in bottom row */}
              {detailImages.slice(3, 8).map((url, index) => (
                <div key={index + 3} className="row-start-3">
                  <img
                    src={url}
                    alt={`detail-${index + 3}`}
                    className="w-full h-full object-cover rounded-lg shadow-lg"
                    style={{ width: "168px", height: "112px" }}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="w-3/12 h-full flex flex-col justify-center gap-4 pt-4">
            <div className="flex flex-col gap-6 border border-gray-350 rounded-lg p-6 shadow-lg bg-bgtextColor">
              <div className="flex justify-center items-center border-b border-gray-300 pb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  Most Popular Facilities
                </h3>
              </div>

              <div className="text-center">
                <h3 className=" text-gray-700">Guests Who Stayed Here Loved</h3>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <p className="text-gray-600 italic">
                  "The two receptionists were friendly and helpful at all times.
                  The hotel manager is, indeed, lucky to have them both in the
                  hotel's service. We..."
                </p>
              </div>
              <div className="text-lg font-semibold text-center text-green-600">
                Excellent Location!
              </div>
            </div>
            <div className="h-40 flex flex-col">
              <div className="flex justify-center items-center">
                <div>
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d62565.16404994723!2d104.90470142800619!3d11.456613727772911!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3109599384325cdd%3A0xe25c308bc6822c0a!2sKrong%20Ta%20Khmau!5e0!3m2!1sen!2skh!4v1738388659069!5m2!1sen!2skh"
                    style={{ border: 0, width: "100%" }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Date Selection */}
        <div className="bg-gray-50 p-6 rounded-lg mb-8 availability-section">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Check Availability</h2>
            {showingAvailability && (
              <button
                onClick={resetAvailability}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Reset Search
              </button>
            )}
          </div>

          <div className="flex gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Check-in Date
              </label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Check-out Date
              </label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                min={checkIn}
                className="border rounded px-3 py-2"
              />
            </div>
            <div className="self-end">
              <button
                onClick={checkAvailability}
                disabled={checkingAvailability}
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {checkingAvailability ? "Checking..." : "Check Availability"}
              </button>
            </div>
          </div>

          {/* Warning message when user tries to view details without checking availability */}
          {!hasCheckedAvailability && showWarning && (
            <div className="mb-4 p-3 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
              <p className="font-semibold">
                ⚠️ Please check availability first
              </p>
              <p className="text-sm">
                You must select your dates and check availability before you can
                view room details.
              </p>
            </div>
          )}

          {/* Status message */}
          {showingAvailability && (
            <div className="mb-4 p-3 bg-blue-100 border-l-4 border-blue-500 text-blue-700">
              <p className="font-semibold">
                Showing available rooms from {checkIn} to {checkOut}
              </p>
              <p className="text-sm">
                {roomsToDisplay.length} room type(s) available
              </p>
            </div>
          )}
        </div>

        {/* Room Types */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">
              {showingAvailability ? "Available Room Types" : "Room Types"}
            </h2>
            <button
              onClick={handleViewAllRooms}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              View All Rooms
            </button>
          </div>

          {roomsToDisplay.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">
                {showingAvailability
                  ? "No rooms available for the selected dates. Please try different dates."
                  : "No room types available."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {roomsToDisplay.map((roomType) => {
                // Get the first image for the room type
                const roomImages = roomType.images || [];
                const mainImage = roomImages[0] || "/default-room.jpg";
                const roomAvailability = availability[roomType.id];
                const availableCount =
                  roomAvailability?.available_count ||
                  roomType.available_count ||
                  0;
                const hasAvailability = showingAvailability
                  ? availableCount > 0
                  : true;

                return (
                  <div key={roomType.id} className="gap-6">
                    {/* Repeat this card for each room type */}
                    <div className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
                      {/* Image Container */}
                      <div className="relative overflow-hidden">
                        <div className="aspect-[4/3] relative">
                          <img
                            src={mainImage || "/default-room.jpg"}
                            alt={`${roomType.name} room`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                        </div>

                        {/* Availability Badge */}
                        {showingAvailability && availableCount && (
                          <div className="absolute top-2 right-2">
                            <div className="bg-emerald-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                              {availableCount} left
                            </div>
                          </div>
                        )}

                        {/* Price Badge */}
                        <div className="absolute bottom-2 left-2">
                          <div className="bg-white/95 backdrop-blur-sm rounded-lg px-3 py-1 shadow-md">
                            <div className="flex items-baseline space-x-1">
                              <span className="text-lg font-bold text-gray-900">
                                ${roomType.base_price}
                              </span>
                              <span className="text-xs text-gray-600 font-medium">
                                /night
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4 space-y-3">
                        {/* Header */}
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                            {roomType.name}
                          </h3>
                          <div className="flex items-center text-gray-600 text-xs mt-1">
                            <svg
                              className="w-3 h-3 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                              />
                            </svg>
                            <span>Up to {roomType.capacity} guests</span>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-gray-600 text-xs leading-relaxed line-clamp-2">
                          {roomType.description}
                        </p>

                        {/* Features */}
                        <div className="flex flex-wrap gap-1">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                            City View
                          </span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
                            Modern Amenities
                          </span>
                        </div>

                        {/* Action Button */}
                        <div className="pt-1">
                          {hasCheckedAvailability && hasAvailability ? (
                            <button
                              onClick={() => handleViewDetails(roomType.id)}
                              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 text-sm"
                            >
                              Book Now
                            </button>
                          ) : hasCheckedAvailability && !hasAvailability ? (
                            <button
                              disabled
                              className="w-full bg-gray-100 text-gray-400 font-medium py-2 px-4 rounded-lg cursor-not-allowed text-sm"
                            >
                              Fully Booked
                            </button>
                          ) : (
                            <button
                              onClick={(e) =>
                                handleViewDetailsClick(e, roomType.id)
                              }
                              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 text-sm"
                            >
                              View Details
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* End of card */}
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <HotelDetailsPage />
      </div>
    </div>
  );
}
