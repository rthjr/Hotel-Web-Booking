"use client"; // Required for Next.js App Router (client-side context)

import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the context
const HotelContext = createContext();

// Create a provider component
export const HotelProvider = ({ children }) => {
  // Load initial hotelId from sessionStorage, if available
  const storedHotelId = typeof window !== "undefined" ? sessionStorage.getItem("hotelId") : null;
  const [hotelId, setHotelId] = useState(storedHotelId);

  // Sync hotelId with sessionStorage whenever it changes
  useEffect(() => {
    if (hotelId) {
      sessionStorage.setItem("hotelId", hotelId);
    }
  }, [hotelId]);

  return (
    <HotelContext.Provider value={{ hotelId, setHotelId }}>
      {children}
    </HotelContext.Provider>
  );
};

// Custom hook to use the context
export const useHotelContext = () => useContext(HotelContext);
