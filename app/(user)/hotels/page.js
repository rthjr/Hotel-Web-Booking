/* 'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HotelsPage() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/hotels');
      const data = await response.json();
      setHotels(data.data);
    } catch (error) {
      console.error('Error fetching hotels:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading hotels...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Hotels</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotels.map(hotel => (
          <div key={hotel.id} className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-2">{hotel.name}</h3>
            <p className="text-gray-600 mb-4">{hotel.description}</p>
            <p className="text-sm text-gray-500 mb-4">{hotel.city}</p>
            <Link 
              href={`/hotels/${hotel.id}`}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
} */

"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { LARAVEL_ENDPOINT } from "@utils/apiEndpoints";
import {
  FaCar,
  FaDumbbell,
  FaGlobe,
  FaMapMarkerAlt,
  FaPhone,
  FaStar,
  FaSwimmingPool,
  FaTv,
  FaWifi,
} from "@node_modules/react-icons/fa";
import { PiShower } from "@node_modules/react-icons/pi";
import {
  MdAcUnit,
  MdPets,
  MdRestaurant,
  MdSpa,
} from "@node_modules/react-icons/md";
import BannerHotel from "@components/user/Banners/BannerHotel";
import Loading from "@app/loading";
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

        const hotelsWithValidImages = hotelsArray.map((hotel) => {
          // Check if images is already an array, if not try to parse it
          let images = [];

          if (Array.isArray(hotel.images)) {
            // Images is already an array of URLs
            images = hotel.images;
          } else if (typeof hotel.images === "string") {
            // Images is a JSON string, try to parse it
            try {
              images = JSON.parse(hotel.images);
            } catch {
              images = [];
            }
          }

          return { ...hotel, images };
        });

        console.log("hotelsWithValidImages", hotelsWithValidImages);

        setHotels(hotelsWithValidImages);
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
      wifi: FaWifi,
      tv: FaTv,
      shower: PiShower,
      parking: FaCar,
      gym: FaDumbbell,
      pool: FaSwimmingPool,
      restaurant: MdRestaurant,
      spa: MdSpa,
      ac: MdAcUnit,
      pets: MdPets,
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
      window.open(
        `https://maps.google.com/?q=${lat},${lng}&label=${encodeURIComponent(
          name
        )}`,
        "_blank"
      );
    }
  };

  if (loading) return <Loading message="Hotels loading..." />;
  if (!Array.isArray(hotels) || hotels.length === 0)
    return <p className="text-center">No hotels available.</p>;

  return (
    <>
      <div className="w-full">
        <section className="w-full flex justify-center items-center">
          <BannerHotel />
        </section>
      </div>
      <div className="max-w-[1050px] mx-auto my-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-gray-800">
        {hotels.map((hotel) => (
          <div
            key={hotel.id}
            className="flex flex-col bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
          >
            {/* Image Container */}
            <div className="relative">
              <img
                src={
                  hotel.images?.[0] ||
                  hotel.images ||
                  "/image/default-hotel.jpg"
                }
                alt={hotel.name || "Hotel"}
                className="h-48 w-full object-cover"
              />

              {/* Status Badge */}
              {hotel.status && (
                <span
                  className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-semibold ${
                    hotel.status === "active"
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {hotel.status === "active" ? "Available" : "Unavailable"}
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
                <FaMapMarkerAlt
                  className="text-gray-400 mt-0.5 flex-shrink-0"
                  size={14}
                />
                <div className="text-sm text-gray-600">
                  <div>{hotel.address}</div>
                  {(hotel.city || hotel.state || hotel.country) && (
                    <div className="text-xs text-gray-500">
                      {[hotel.city, hotel.state, hotel.country]
                        .filter(Boolean)
                        .join(", ")}
                    </div>
                  )}
                </div>

                {/* Map button */}
                {hotel.latitude && hotel.longitude && (
                  <button
                    onClick={() =>
                      openMap(hotel.latitude, hotel.longitude, hotel.name)
                    }
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
              {hotel.amenities &&
                Array.isArray(hotel.amenities) &&
                hotel.amenities.length > 0 && (
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
                  {hotel.room_types_count || hotel.roomTypesCount || "Multiple"}{" "}
                  room types
                </span>
                <span>
                  {hotel.available_rooms || hotel.amountRoom || 0} available
                </span>
              </div>

              {/* Price and Action */}
              <div className="flex justify-between items-center mt-auto">
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-green-600">
                    ${hotel.starting_price || hotel.price || "N/A"}
                  </span>
                  <span className="text-xs text-gray-500">per night</span>
                </div>

                <button>
                  <Link
                    href={`/hotels/${hotel.id}`}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                  >
                    Explore
                  </Link>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default HotelCard;
