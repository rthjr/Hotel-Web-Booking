"use client";
import React, { useEffect, useState } from "react";
import { LARAVEL_ENDPOINT } from "@utils/apiEndpoints";
import { Button } from "../layout/Button";import { FaCar, FaDumbbell, FaGlobe, FaMapMarkerAlt, FaPhone, FaStar, FaSwimmingPool, FaTv, FaWifi } from "@node_modules/react-icons/fa";
import { PiShower } from "@node_modules/react-icons/pi";
import { MdAcUnit, MdPets, MdRestaurant, MdSpa } from "@node_modules/react-icons/md";
;

const HotelCard = ({ Rooms, onExplore }) => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(LARAVEL_ENDPOINT.HOTELS);
        if (!res.ok) throw new Error("Failed to fetch HOTELS!");

        const json = await res.json();
        const hotelsArray = json?.data?.data ?? [];

        setHotels(hotelsArray);
      } catch (err) {
        console.error("Error fetching hotels:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Amenity icon mapping
  const getAmenityIcon = (amenity) => {
    const iconMap = {
      'wifi': FaWifi,
      'tv': FaTv,
      'shower': PiShower,
      'parking': FaCar,
      'gym': FaDumbbell,
      'pool': FaSwimmingPool,
      'restaurant': MdRestaurant,
      'spa': MdSpa,
      'ac': MdAcUnit,
      'pets': MdPets,
    };
    
    const IconComponent = iconMap[amenity.toLowerCase()] || FaWifi;
    return <IconComponent size={16} />;
  };

  // Generate star rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating || 0) % 1 !== 0;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<FaStar key={i} className="text-yellow-400 opacity-50" />);
      } else {
        stars.push(<FaStar key={i} className="text-gray-300" />);
      }
    }
    return stars;
  };

  const handleExplore = (hotel) => {
    if (onExplore) {
      onExplore(hotel);
    } else {
      // Default behavior - could navigate to hotel details page
      window.location.href = `/hotels/${hotel.slug || hotel.id}`;
    }
  };

  const openMap = (lat, lng, name) => {
    if (lat && lng) {
      window.open(`https://maps.google.com/?q=${lat},${lng}&label=${encodeURIComponent(name)}`, '_blank');
    }
  };

  if (loading) return <p className="text-center">Loading hotels…</p>;
  if (!Array.isArray(hotels) || hotels.length === 0)
    return <p className="text-center">No hotels available.</p>;

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-gray-800">
      {hotels.map((hotel) => (
        <div
          key={hotel.id}
          className="flex flex-col bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
        >
          {/* Image Container */}
          <div className="relative">
            <img
              src={hotel.images?.[0] || hotel.image || "/image/default-hotel.jpg"}
              alt={hotel.name || "Hotel"}
              className="h-48 w-full object-cover"
            />
            
            {/* Status Badge */}
            {hotel.status && (
              <span className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-semibold ${
                hotel.status === 'active' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
              }`}>
                {hotel.status === 'active' ? 'Available' : 'Unavailable'}
              </span>
            )}

            {/* Featured Badge */}
            {hotel.featured && (
              <span className="absolute top-3 right-3 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                Featured
              </span>
            )}
          </div>

          <div className="flex flex-col flex-grow p-4">
            {/* Header */}
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-bold text-gray-900 line-clamp-1">
                {hotel.name}
              </h3>
              
              {/* Rating */}
              <div className="flex items-center gap-1">
                <div className="flex">
                  {renderStars(hotel.average_rating || hotel.rating)}
                </div>
                <span className="text-sm text-gray-600 ml-1">
                  ({hotel.reviews_count || hotel.reviewCount || 0})
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {hotel.description || "A wonderful place to stay!"}
            </p>

            {/* Location */}
            <div className="flex items-start gap-2 mb-3">
              <FaMapMarkerAlt className="text-gray-400 mt-0.5 flex-shrink-0" size={14} />
              <div className="text-sm text-gray-600">
                <div>{hotel.address}</div>
                {(hotel.city || hotel.state || hotel.country) && (
                  <div className="text-xs text-gray-500">
                    {[hotel.city, hotel.state, hotel.country].filter(Boolean).join(', ')}
                  </div>
                )}
              </div>
              
              {/* Map button */}
              {hotel.latitude && hotel.longitude && (
                <button
                  onClick={() => openMap(hotel.latitude, hotel.longitude, hotel.name)}
                  className="text-blue-500 hover:text-blue-700 text-xs underline ml-auto"
                >
                  View Map
                </button>
              )}
            </div>

            {/* Contact Info */}
            {(hotel.phone || hotel.website) && (
              <div className="flex gap-4 mb-3 text-xs text-gray-600">
                {hotel.phone && (
                  <div className="flex items-center gap-1">
                    <FaPhone size={12} />
                    <span>{hotel.phone}</span>
                  </div>
                )}
                {hotel.website && (
                  <div className="flex items-center gap-1">
                    <FaGlobe size={12} />
                    <a 
                      href={hotel.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      Website
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Dynamic Amenities */}
            {hotel.amenities && Array.isArray(hotel.amenities) && hotel.amenities.length > 0 && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {hotel.amenities.slice(0, 6).map((amenity, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full text-xs"
                      title={amenity}
                    >
                      {getAmenityIcon(amenity)}
                      <span className="capitalize">{amenity}</span>
                    </div>
                  ))}
                  {hotel.amenities.length > 6 && (
                    <span className="text-xs text-gray-500 px-2 py-1">
                      +{hotel.amenities.length - 6} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Room Info */}
            <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
              <span>
                {hotel.room_types_count || hotel.roomTypesCount || 'Multiple'} room types
              </span>
              <span>
                {hotel.available_rooms || hotel.amountRoom || 0} available
              </span>
            </div>

            {/* Price and Action */}
            <div className="flex justify-between items-center mt-auto">
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-green-600">
                  ${hotel.starting_price || hotel.price || 'N/A'}
                </span>
                <span className="text-xs text-gray-500">per night</span>
              </div>

              <button
                onClick={() => handleExplore(hotel)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2 text-sm font-medium"
              >
                <span>Explore</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HotelCard;