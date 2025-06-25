"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Calendar, Users, Bed, MapPin, Star, Wifi, Car, Coffee, Waves } from "lucide-react";
import { checkAuth } from "@lib/auth";
import { useAuth } from "@Context/AuthContext/AuthContext";

export default function RoomSelectionPage() {
  const { isLogin } = useAuth()
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const LARAVEL_API_URL = process.env.NEXT_PUBLIC_LARAVEL_API_URL;

  const checkIn = searchParams.get("check_in");
  const checkOut = searchParams.get("check_out");

  const [roomType, setRoomType] = useState(null);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.roomTypeId && checkIn && checkOut) {
      fetchAvailableRooms();
    }
  }, [params.roomTypeId, checkIn, checkOut]);

  const fetchAvailableRooms = async () => {
    try {
      const response = await fetch(
        `${LARAVEL_API_URL}/api/room-types/${params.roomTypeId}/availability?check_in=${checkIn}&check_out=${checkOut}`
      );
      const data = await response.json();
      setRoomType(data.room_type);
      setAvailableRooms(data.available_rooms);
    } catch (error) {
      console.error("Error fetching available rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  const proceedToBooking = () => {
    
    if (!selectedRoom) {
      alert("Please select a room to continue");
      return;
    }
    // Check if user is logged in
    if (!isLogin) {
      // Store the selected room in localStorage before redirecting
      localStorage.setItem('pendingBookingRoom', JSON.stringify(selectedRoom));
      
      // Redirect to login page with return URL
      router.push('/login?returnUrl=/booking');
      return;
    }

    // In a real app, avoid localStorage - use React state or context
    const bookingData = {
      hotelId: params.id,
      roomId: selectedRoom.id,
      roomTypeId: params.roomTypeId,
      checkIn: checkIn,
      checkOut: checkOut,
      roomRate: roomType.base_price,
    };

    // Store booking data for the booking page to access
  localStorage.setItem('bookingData', JSON.stringify(bookingData));
  router.push(`/hotels/${params.id}/book`);
  };

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  };

  const nights = calculateNights();
  const basePrice = parseFloat(roomType?.base_price || 0);
  const totalPrice = nights * basePrice;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading room details...</p>
        </div>
      </div>
    );
  }

  if (!roomType) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">Room type not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{roomType.name}</h1>
                      <div className="flex items-center space-x-4 text-gray-600">
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>Up to {roomType.capacity} guests</span>
            </div>
            <div className="flex items-center space-x-1">
              <Bed className="w-4 h-4" />
              <span>{roomType.size} sqm</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span>4.8 (127 reviews)</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="grid grid-cols-4 grid-rows-3 gap-2 h-[450px]">
                {/* Main large image */}
                <div className="col-span-2 row-span-3">
                  <div className="w-full h-full relative overflow-hidden">
                    <img 
                      src={roomType.images?.[0] || '/placeholder-image.jpg'} 
                      alt="Main room view"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <p className="text-sm font-medium">Main Room View</p>
                    </div>
                  </div>
                </div>
                
                {/* Top right image */}
                <div className="col-span-2 row-span-1 col-start-3">
                  <div className="w-full h-full relative overflow-hidden">
                    <img 
                      src={roomType.images?.[1] || '/placeholder-image.jpg'} 
                      alt="Room view 2"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                    <div className="absolute bottom-2 left-2 text-white">
                      <p className="text-xs">Room Details</p>
                    </div>
                  </div>
                </div>
                
                {/* Bottom left small image */}
                <div className="col-span-1 row-span-2 col-start-3 row-start-2">
                  <div className="w-full h-full relative overflow-hidden">
                    <img 
                      src={roomType.images?.[2] || '/placeholder-image.jpg'} 
                      alt="Room amenities"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                    <div className="absolute bottom-2 left-2 text-white">
                      <p className="text-xs">Amenities</p>
                    </div>
                  </div>
                </div>
                
                {/* Bottom right small image */}
                <div className="col-span-1 row-span-2 col-start-4 row-start-2">
                  <div className="w-full h-full relative overflow-hidden">
                    <img 
                      src={roomType.images?.[3] || '/placeholder-image.jpg'} 
                      alt="Room bathroom"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                    <div className="absolute bottom-2 left-2 text-white">
                      <p className="text-xs">Bathroom</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Room Description */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">About this room</h2>
              <p className="text-gray-700 leading-relaxed mb-6">{roomType.description}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {roomType.amenities?.map((amenity, index) => {
                  // Map amenity codes to readable names and icons
                  const amenityMap = {
                    wifi: { name: "Free WiFi", icon: <Wifi className="w-4 h-4" /> },
                    tv: { name: "Television", icon: <div className="w-4 h-4 bg-gray-600 rounded"></div> },
                    ac: { name: "Air Conditioning", icon: <div className="w-4 h-4 bg-blue-500 rounded-full"></div> },
                    minibar: { name: "Mini Bar", icon: <Coffee className="w-4 h-4" /> }
                  };
                  
                  const amenityInfo = amenityMap[amenity] || { name: amenity, icon: <div className="w-2 h-2 bg-blue-500 rounded-full"></div> };
                  
                  return (
                    <div key={index} className="flex items-center space-x-2 text-gray-600">
                      {amenityInfo.icon}
                      <span className="text-sm">{amenityInfo.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Available Rooms */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-6">Available Rooms</h2>
              
              {availableRooms.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bed className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No rooms available</h3>
                  <p className="text-gray-600 mb-4">
                    Sorry, there are no rooms available for your selected dates.
                  </p>
                  <button
                    onClick={() => window.history.back()}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Try Different Dates
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {availableRooms.map((room) => (
                    <div
                      key={room.id}
                      className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                        selectedRoom?.id === room.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                      }`}
                      onClick={() => setSelectedRoom(room)}
                    >
                      <label className="flex items-center space-x-4 cursor-pointer">
                        <input
                          type="radio"
                          name="selectedRoom"
                          value={room.id}
                          checked={selectedRoom?.id === room.id}
                          onChange={() => setSelectedRoom(room)}
                          className="w-5 h-5 text-blue-500"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-semibold text-lg">Room {room.room_number}</span>
                              <div className="flex items-center space-x-4 text-gray-600 mt-1">
                                <span className="flex items-center space-x-1">
                                  <MapPin className="w-4 h-4" />
                                  <span>Floor {room.floor}</span>
                                </span>
                                <span>• {room.view} view</span>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{room.features}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-blue-600">
                                ${parseFloat(roomType.base_price).toFixed(0)}
                              </div>
                              <div className="text-sm text-gray-500">per night</div>
                            </div>
                          </div>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Booking Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h3 className="text-xl font-semibold mb-4">Booking Summary</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-600">Check-in</p>
                    <p className="font-medium">{checkIn}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-600">Check-out</p>
                    <p className="font-medium">{checkOut}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Users className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="font-medium">{nights} {nights === 1 ? 'night' : 'nights'}</p>
                  </div>
                </div>
              </div>

              {selectedRoom && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <p className="text-sm text-blue-600 font-medium">Selected Room</p>
                  <p className="font-semibold">Room {selectedRoom.room_number}</p>
                  <p className="text-sm text-gray-600">{selectedRoom.view} view • Floor {selectedRoom.floor}</p>
                </div>
              )}

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">${basePrice.toFixed(0)} × {nights} nights</span>
                  <span className="font-medium">${totalPrice.toFixed(0)}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Taxes & fees</span>
                  <span className="font-medium">${(totalPrice * 0.12).toFixed(0)}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-2xl font-bold text-blue-600">
                      ${(totalPrice + totalPrice * 0.12).toFixed(0)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={proceedToBooking}
                disabled={!selectedRoom || availableRooms.length === 0}
                className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-200 ${
                  selectedRoom && availableRooms.length > 0
                    ? "bg-blue-500 text-white hover:bg-blue-600 shadow-lg hover:shadow-xl"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {availableRooms.length === 0 
                  ? "No Rooms Available" 
                  : selectedRoom 
                    ? "Continue to Booking" 
                    : "Select a Room"
                }
              </button>
              
              <p className="text-xs text-gray-500 text-center mt-3">
                Free cancellation until 24 hours before check-in
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}