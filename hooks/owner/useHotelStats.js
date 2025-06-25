import { useState, useCallback, useMemo } from 'react';
import axios from 'axios';

export const useHotelStats = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';

  const api = axios.create({
    baseURL: API_BASE_URL,
  });

  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }, (error) => Promise.reject(error));

  // Calculate comprehensive hotel statistics
  const calculateHotelStats = useCallback((hotel, rooms, reservations) => {
    if (!hotel || !Array.isArray(rooms)) {
      return {
        totalRooms: 0,
        availableRooms: 0,
        occupiedRooms: 0,
        maintenanceRooms: 0,
        cleaningRooms: 0,
        occupancyRate: 0,
        avgPrice: 0,
        monthlyRevenue: 0,
        activeReservations: 0,
        roomTypeBreakdown: {}
      };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Basic room statistics
    const totalRooms = rooms.length;
    const availableRooms = rooms.filter(r => r.status === 'available').length;
    const occupiedRooms = rooms.filter(r => r.status === 'occupied').length;
    const maintenanceRooms = rooms.filter(r => ['maintenance', 'out_of_order'].includes(r.status)).length;
    const cleaningRooms = rooms.filter(r => r.status === 'cleaning').length;

    // Calculate occupancy rate
    const occupancyRate = totalRooms > 0 ? 
      parseFloat(((occupiedRooms / totalRooms) * 100).toFixed(2)) : 0;

    // Calculate average room price
    const avgPrice = totalRooms > 0 ? 
      Math.round(rooms.reduce((sum, room) => {
        const price = room.pricePerNight || room.price_per_night || room.room_type?.base_price || 0;
        return sum + parseFloat(price);
      }, 0) / totalRooms) : 0;

    // Room type breakdown
    const roomTypeBreakdown = rooms.reduce((acc, room) => {
      const typeName = room.room_type?.name || room.type || 'Unknown';
      acc[typeName] = (acc[typeName] || 0) + 1;
      return acc;
    }, {});

    // Calculate monthly revenue and active reservations
    let monthlyRevenue = 0;
    let activeReservations = 0;

    if (Array.isArray(reservations)) {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();

      reservations.forEach(reservation => {
        // Count active reservations
        if (['pending', 'confirmed', 'checked_in'].includes(reservation.status)) {
          activeReservations++;
        }

        // Calculate monthly revenue
        try {
          const checkInValue = reservation.check_in_date;
          if (checkInValue) {
            const checkInDate = new Date(checkInValue);
            if (!isNaN(checkInDate.getTime())) {
              const resMonth = checkInDate.getMonth();
              const resYear = checkInDate.getFullYear();
              const isCurrentMonth = resMonth === currentMonth && resYear === currentYear;
              const validStatuses = ['confirmed', 'checked_in', 'checked_out'];
              
              if (isCurrentMonth && validStatuses.includes(reservation.status)) {
                const amount = parseFloat(reservation.total_amount) || 0;
                monthlyRevenue += amount;
              }
            }
          }
        } catch (error) {
          console.warn('Error calculating revenue for reservation:', reservation.id, error);
        }
      });
    }

    return {
      totalRooms,
      availableRooms,
      occupiedRooms,
      maintenanceRooms,
      cleaningRooms,
      occupancyRate,
      avgPrice,
      monthlyRevenue: parseFloat(monthlyRevenue.toFixed(2)),
      activeReservations,
      roomTypeBreakdown,
      // Additional useful metrics
      utilizationRate: totalRooms > 0 ? parseFloat((((occupiedRooms + cleaningRooms) / totalRooms) * 100).toFixed(2)) : 0,
      maintenanceRate: totalRooms > 0 ? parseFloat(((maintenanceRooms / totalRooms) * 100).toFixed(2)) : 0
    };
  }, []);

  // Fetch hotel-specific reservations
  const fetchHotelReservations = useCallback(async (hotelId) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get('/api/owner/reservations');
      const allReservations = response.data?.data?.data || [];
      
      // Filter reservations for this specific hotel
      const hotelReservations = allReservations.filter(
        reservation => reservation.hotel_id?.toString() === hotelId?.toString()
      );
      
      return hotelReservations;
    } catch (err) {
      console.error('Error fetching hotel reservations:', err);
      setError(err.message || 'Failed to fetch reservations');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    calculateHotelStats,
    fetchHotelReservations,
    loading,
    error
  };
};