'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function RoomTypesPage() {
  const LARAVEL_API_URL = process.env.NEXT_PUBLIC_LARAVEL_API_URL;
  const params = useParams();
  const searchParams = useSearchParams();
  
  const [roomTypes, setRoomTypes] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [availability, setAvailability] = useState({});
  const [loading, setLoading] = useState(true);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [showingAvailability, setShowingAvailability] = useState(false);
  const [hasCheckedAvailability, setHasCheckedAvailability] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  
  // Date states
  const [checkIn, setCheckIn] = useState(searchParams.get('check_in') || '');
  const [checkOut, setCheckOut] = useState(searchParams.get('check_out') || '');

  useEffect(() => {
    if (params.id) {
      // If dates are provided in URL, automatically check availability
      if (checkIn && checkOut) {
        setShowingAvailability(true);
        setHasCheckedAvailability(true);
        fetchRoomTypesWithAvailability();
      } else {
        fetchRoomTypes();
      }
    }
  }, [params.id]);

  const fetchRoomTypes = async () => {
    try {
      const roomTypesResponse = await fetch(`${LARAVEL_API_URL}/api/room-types?hotel_id=${params.id}`);
      const roomTypesData = await roomTypesResponse.json();
      setRoomTypes(roomTypesData.data);
    } catch (error) {
      console.error('Error fetching room types:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoomTypesWithAvailability = async () => {
    try {
      // Get room types
      const roomTypesResponse = await fetch(`${LARAVEL_API_URL}/api/room-types?hotel_id=${params.id}`);
      const roomTypesData = await roomTypesResponse.json();
      setRoomTypes(roomTypesData.data);

      // Check availability for each room type if dates are provided
      if (checkIn && checkOut) {
        const availabilityPromises = roomTypesData.data.map(async (roomType) => {
          const response = await fetch(
            `${LARAVEL_API_URL}/api/room-types/${roomType.id}/availability?check_in=${checkIn}&check_out=${checkOut}`
          );
          const data = await response.json();
          return { roomTypeId: roomType.id, ...data };
        });

        const availabilityResults = await Promise.all(availabilityPromises);
        const availabilityMap = {};
        const availableRoomTypes = [];

        availabilityResults.forEach(result => {
          availabilityMap[result.roomTypeId] = result;
          // Find the corresponding room type and add availability info
          const roomType = roomTypesData.data.find(rt => rt.id === result.roomTypeId);
          if (roomType && (result.available_count > 0 || (result.available_rooms && result.available_rooms.length > 0))) {
            availableRoomTypes.push({
              ...roomType,
              available_count: result.available_count || result.available_rooms?.length || 0,
              available_rooms: result.available_rooms || []
            });
          }
        });

        setAvailability(availabilityMap);
        setAvailableRooms(availableRoomTypes);
      }
    } catch (error) {
      console.error('Error fetching room types:', error);
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
        console.log(`Checking availability for room type ${roomType.id}: ${roomType.name}`);
        
        const response = await fetch(
          `${LARAVEL_API_URL}/api/room-types/${roomType.id}/availability?check_in=${checkIn}&check_out=${checkOut}`
        );
        const data = await response.json();
        
        console.log(`Availability response for room type ${roomType.id}:`, data);
        
        // TEMPORARY: If your backend always returns available_count: 0, 
        // let's treat all room types as available for testing
        // Remove this once your backend is fixed
        if (data.room_type) {
          return {
            ...roomType,
            available_count: 1, // Assume 1 available for testing
            available_rooms: [{ id: 1, room_number: "Test" }] // Mock data
          };
        }
        
        // Return room type with availability info if there are available rooms
        if (data.available_count && data.available_count > 0) {
          return {
            ...roomType,
            available_count: data.available_count,
            available_rooms: data.available_rooms || []
          };
        }
        
        // Also check if available_rooms array has items (alternative check)
        if (data.available_rooms && Array.isArray(data.available_rooms) && data.available_rooms.length > 0) {
          return {
            ...roomType,
            available_count: data.available_rooms.length,
            available_rooms: data.available_rooms
          };
        }
        
        return null;
      });

      const results = await Promise.all(availabilityPromises);
      const availableRoomTypes = results.filter(room => room !== null);
      
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

  const resetAvailability = () => {
    setShowingAvailability(false);
    setAvailableRooms([]);
    setHasCheckedAvailability(false);
    setShowWarning(false);
    setCheckIn('');
    setCheckOut('');
  };

  // Function to handle "Select Room" click when availability hasn't been checked
  const handleSelectRoomClick = (e) => {
    e.preventDefault();
    setShowWarning(true);
    // Scroll to top to show the warning
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Determine which rooms to display
  const roomsToDisplay = showingAvailability 
    ? (Array.isArray(availableRooms) ? availableRooms : [])
    : (Array.isArray(roomTypes) ? roomTypes : []);

  if (loading) return <div>Loading room types...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        {showingAvailability ? "Available Room Types" : "All Room Types"}
      </h1>

      {/* Check Availability Section */}
      <div className="bg-gray-50 p-6 rounded-lg mb-8">
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

        {/* Warning message when user tries to select room without checking availability */}
        {!hasCheckedAvailability && showWarning && (
          <div className="mb-4 p-3 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
            <p className="font-semibold">
              ⚠️ Please check availability first
            </p>
            <p className="text-sm">
              You must select your dates and check availability before you can select a room.
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

      {/* Room Types Grid */}
      {roomsToDisplay.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">
            {showingAvailability 
              ? "No rooms available for the selected dates. Please try different dates."
              : "No room types available."
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {roomsToDisplay.map(roomType => {
            const roomAvailability = availability[roomType.id];
            const availableCount = roomAvailability?.available_count || roomType.available_count || 0;
            const hasAvailability = showingAvailability ? availableCount > 0 : true;

            return (
              <div key={roomType.id} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-2">{roomType.name}</h3>
                <p className="text-gray-600 mb-3">{roomType.description}</p>
                <p className="text-2xl font-bold text-blue-600 mb-2">${roomType.base_price}/night</p>
                <p className="text-gray-500 mb-2">Capacity: {roomType.capacity} guests</p>
                
                {/* Availability status */}
                {showingAvailability && (
                  <div className="mb-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {availableCount ? `${availableCount} rooms available` : 'Available'}
                    </span>
                  </div>
                )}
                
                {/* Select Room Button Logic */}
                {hasCheckedAvailability && hasAvailability ? (
                  <Link 
                    href={`/hotels/${params.id}/rooms/${roomType.id}${checkIn && checkOut ? `?check_in=${checkIn}&check_out=${checkOut}` : ''}`}
                    className="inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                  >
                    Select Room
                  </Link>
                ) : hasCheckedAvailability && !hasAvailability ? (
                  <button 
                    disabled 
                    className="bg-gray-300 text-gray-500 px-4 py-2 rounded cursor-not-allowed"
                  >
                    Not Available
                  </button>
                ) : (
                  <button 
                    onClick={handleSelectRoomClick}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors cursor-pointer"
                  >
                    Select Room
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}