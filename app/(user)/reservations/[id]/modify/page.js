'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ModifyReservationPage() {
  const LARAVEL_API_URL = process.env.NEXT_PUBLIC_LARAVEL_API_URL;
  const params = useParams();
  const router = useRouter();
  const reservationId = params.id;
  
  const [reservation, setReservation] = useState(null);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const [formData, setFormData] = useState({
    check_in_date: '',
    check_out_date: '',
    adults: 1,
    children: 0,
    room_id: '',
    special_requests: ''
  });

  useEffect(() => {
    fetchReservationDetails();
  }, [reservationId]);

  useEffect(() => {
    if (formData.check_in_date && formData.check_out_date && reservation) {
      checkRoomAvailability();
    }
  }, [formData.check_in_date, formData.check_out_date, reservation]);

  const fetchReservationDetails = async () => {
    try {
      setError(null);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${LARAVEL_API_URL}/api/reservations/${reservationId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch reservation: ${response.status}`);
      }
      
      const data = await response.json();
      const reservationData = data.data;
      
      setReservation(reservationData);
      setFormData({
        check_in_date: reservationData.check_in_date,
        check_out_date: reservationData.check_out_date,
        adults: reservationData.adults || 1,
        children: reservationData.children || 0,
        room_id: reservationData.room_id,
        special_requests: reservationData.special_requests || ''
      });
      
    } catch (error) {
      console.error('Error fetching reservation:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const checkRoomAvailability = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${LARAVEL_API_URL}/api/hotels/${reservation.hotel_id}/rooms/available`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          check_in_date: formData.check_in_date,
          check_out_date: formData.check_out_date,
          adults: formData.adults,
          children: formData.children,
          exclude_reservation_id: reservationId
        })
      });

      if (response.ok) {
        const data = await response.json();
        setAvailableRooms(data.data || []);
      }
    } catch (error) {
      console.error('Error checking availability:', error);
    }
  };

  const calculateNights = () => {
    if (!formData.check_in_date || !formData.check_out_date) return 0;
    
    const checkIn = new Date(formData.check_in_date);
    const checkOut = new Date(formData.check_out_date);
    const diffTime = Math.abs(checkOut - checkIn);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateNewTotal = () => {
    const selectedRoom = availableRooms.find(room => room.id.toString() === formData.room_id.toString());
    if (!selectedRoom) return reservation?.total_amount || 0;
    
    const nights = calculateNights();
    return selectedRoom.room_type.price_per_night * nights;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${LARAVEL_API_URL}/api/reservations/${reservationId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          nights: calculateNights(),
          total_amount: calculateNewTotal()
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to modify reservation');
      }

      setSuccess('Reservation modified successfully!');
      setTimeout(() => {
        router.push(`/reservations/${reservationId}`);
      }, 2000);

    } catch (error) {
      console.error('Error modifying reservation:', error);
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading reservation details...</p>
        </div>
      </div>
    );
  }

  if (error && !reservation) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error</h3>
          <p className="text-red-700 mb-4">{error}</p>
          <Link href="/reservations" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Back to Reservations
          </Link>
        </div>
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Reservation not found</h2>
          <Link href="/reservations" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Back to Reservations
          </Link>
        </div>
      </div>
    );
  }

  // Check if reservation can be modified
  const canModify = reservation.status === 'confirmed' && new Date(reservation.check_in_date) > new Date();
  
  if (!canModify) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">Cannot Modify Reservation</h3>
          <p className="text-yellow-700 mb-4">
            This reservation cannot be modified because it has already started or has been cancelled.
          </p>
          <Link href={`/reservations/${reservationId}`} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            View Reservation Details
          </Link>
        </div>
      </div>
    );
  }

  const nights = calculateNights();
  const newTotal = calculateNewTotal();
  const priceDifference = newTotal - reservation.total_amount;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Navigation */}
      <div className="mb-6">
        <Link 
          href={`/reservations/${reservationId}`}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Reservation Details
        </Link>
        
        <h1 className="text-3xl font-bold text-gray-900">Modify Reservation</h1>
        <p className="text-gray-600 mt-2">Confirmation Code: {reservation.reservation_code}</p>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-green-800 font-semibold">{success}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <p className="text-red-800 font-semibold">{error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Modification Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <h2 className="text-xl font-semibold mb-6">Modify Your Stay</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-in Date
                  </label>
                  <input
                    type="date"
                    name="check_in_date"
                    value={formData.check_in_date}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-out Date
                  </label>
                  <input
                    type="date"
                    name="check_out_date"
                    value={formData.check_out_date}
                    onChange={handleInputChange}
                    min={formData.check_in_date}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Guests */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adults
                  </label>
                  <select
                    name="adults"
                    value={formData.adults}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    {[1, 2, 3, 4, 5, 6].map(num => (
                      <option key={num} value={num}>{num} Adult{num > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Children
                  </label>
                  <select
                    name="children"
                    value={formData.children}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {[0, 1, 2, 3, 4].map(num => (
                      <option key={num} value={num}>{num} Child{num !== 1 ? 'ren' : ''}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Room Selection */}
              {availableRooms.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Room
                  </label>
                  <div className="space-y-3">
                    {availableRooms.map(room => (
                      <div key={room.id} className="border rounded-lg p-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="room_id"
                            value={room.id}
                            checked={formData.room_id.toString() === room.id.toString()}
                            onChange={handleInputChange}
                            className="mr-3"
                          />
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-semibold">{room.room_type.name}</h4>
                                <p className="text-sm text-gray-600">Room {room.room_number} • Floor {room.floor}</p>
                                <p className="text-sm text-gray-600">{room.room_type.size}m² • Up to {room.room_type.capacity} guests</p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-lg">${room.room_type.price_per_night}</p>
                                <p className="text-sm text-gray-600">per night</p>
                              </div>
                            </div>
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Special Requests */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Requests
                </label>
                <textarea
                  name="special_requests"
                  value={formData.special_requests}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Any special requests or preferences..."
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={saving || availableRooms.length === 0}
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
                >
                  {saving ? 'Saving Changes...' : 'Save Changes'}
                </button>
                
                <Link
                  href={`/reservations/${reservationId}`}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-center"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sticky top-6">
            <h3 className="text-lg font-semibold mb-4">Booking Summary</h3>
            
            {/* Hotel Info */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900">{reservation.hotel.name}</h4>
              <p className="text-sm text-gray-600">{reservation.hotel.city}, {reservation.hotel.state}</p>
            </div>

            {/* Current vs New */}
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Nights:</span>
                <span className="font-medium">{nights || reservation.nights}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Guests:</span>
                <span className="font-medium">
                  {formData.adults} Adult{formData.adults > 1 ? 's' : ''}
                  {formData.children > 0 && `, ${formData.children} Child${formData.children > 1 ? 'ren' : ''}`}
                </span>
              </div>
            </div>

            {/* Price Comparison */}
            <div className="border-t pt-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Original Total:</span>
                <span className="font-medium">${reservation.total_amount}</span>
              </div>
              
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">New Total:</span>
                <span className="font-medium">${newTotal}</span>
              </div>
              
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Price Difference:</span>
                <span className={priceDifference >= 0 ? 'text-red-600' : 'text-green-600'}>
                  {priceDifference >= 0 ? '+' : ''}${priceDifference}
                </span>
              </div>
            </div>

            {priceDifference > 0 && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  Additional payment of ${priceDifference} will be required.
                </p>
              </div>
            )}

            {priceDifference < 0 && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  You will receive a refund of ${Math.abs(priceDifference)}.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}