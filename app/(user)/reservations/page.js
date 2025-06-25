'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Loading from '@app/loading';

export default function ReservationsPage() {
  const LARAVEL_API_URL = process.env.NEXT_PUBLIC_LARAVEL_API_URL;
  const searchParams = useSearchParams();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Debug state to help identify issues
  const [debugInfo, setDebugInfo] = useState({
    apiUrl: '',
    hasToken: false,
    responseStatus: null,
    rawResponse: null
  });

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    }
    
    fetchReservations();
  }, [searchParams]);

  const fetchReservations = async () => {
    try {
      setError(null);
      setLoading(true);
      
      // Debug: Check API URL
      //console.log('API URL:', LARAVEL_API_URL);
      setDebugInfo(prev => ({ ...prev, apiUrl: LARAVEL_API_URL || 'Not set' }));
      
      // Debug: Check token
      const token = localStorage.getItem('token');
      //console.log('Token exists:', !!token);
      //console.log('Token preview:', token ? `${token.substring(0, 20)}...` : 'No token');
      setDebugInfo(prev => ({ ...prev, hasToken: !!token }));
      
      if (!token) {
        throw new Error('Authentication required - no token found');
      }

      if (!LARAVEL_API_URL) {
        throw new Error('API URL not configured - check NEXT_PUBLIC_LARAVEL_API_URL');
      }

      const url = `${LARAVEL_API_URL}/api/reservations`;
      console.log('Fetching from:', url);

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      //console.log('Response status:', response.status);
      //console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      setDebugInfo(prev => ({ ...prev, responseStatus: response.status }));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Full API Response:', data);
      
      setDebugInfo(prev => ({ ...prev, rawResponse: data }));
      
      // Handle different possible response structures
      let reservationsData = [];
      if (data && data.data && Array.isArray(data.data.data)) {
        // Laravel pagination structure: response.data.data
        reservationsData = data.data.data;
        console.log('Using data.data.data array:', reservationsData.length, 'items');
      } else if (Array.isArray(data.data)) {
        // Simple data.data structure
        reservationsData = data.data;
        console.log('Using data.data array:', reservationsData.length, 'items');
      } else if (Array.isArray(data)) {
        // Direct array response
        reservationsData = data;
        console.log('Using data array:', reservationsData.length, 'items');
      } else if (data && Array.isArray(data.reservations)) {
        // data.reservations structure
        reservationsData = data.reservations;
        console.log('Using data.reservations array:', reservationsData.length, 'items');
      } else {
        console.log('Unknown response structure:', typeof data, data);
      }

      console.log('Final reservations data:', reservationsData);
      setReservations(reservationsData);
      
    } catch (error) {
      console.error('Error fetching reservations:', error);
      setError(error.message || 'Failed to load reservations');
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filterReservations = (reservations) => {
    if (!Array.isArray(reservations)) return [];
    
    const now = new Date();
    
    switch (filter) {
      case 'upcoming':
        return reservations.filter(r => 
          r.check_in_date && 
          new Date(r.check_in_date) > now && 
          r.status && 
          r.status.toLowerCase() !== 'cancelled'
        );
      case 'past':
        return reservations.filter(r => 
          r.check_out_date && 
          new Date(r.check_out_date) < now
        );
      case 'cancelled':
        return reservations.filter(r => 
          r.status && 
          r.status.toLowerCase() === 'cancelled'
        );
      default:
        return reservations;
    }
  };

  const cancelReservation = async (reservationId) => {
    if (!confirm('Are you sure you want to cancel this reservation?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${LARAVEL_API_URL}/api/reservations/${reservationId}/cancel`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        fetchReservations();
        alert('Reservation cancelled successfully');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to cancel reservation');
      }
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      alert(error.message || 'Failed to cancel reservation');
    }
  };

  // Helper function to get first image
  const getFirstImage = (images) => {
    try {
      // If images is already an array, use it directly
      if (Array.isArray(images)) {
        return images[0];
      }
      
      // If images is a string, try to parse it as JSON
      if (typeof images === 'string') {
        const parsed = JSON.parse(images);
        if (Array.isArray(parsed)) {
          return parsed[0];
        }
      }
      
      return null;
    } catch (e) {
      console.error('Error parsing images:', e);
      return null;
    }
  };

  const filteredReservations = filterReservations(reservations);

  if (loading) return (
    <Loading/>
  );

  if (error) return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Reservations</h3>
        <p className="text-red-700 mb-4">{error}</p>
        
        {/* Debug Information */}
        <div className="bg-red-100 p-3 rounded mt-4 text-sm">
          <h4 className="font-semibold mb-2">Debug Information:</h4>
          <p><strong>API URL:</strong> {debugInfo.apiUrl}</p>
          <p><strong>Has Token:</strong> {debugInfo.hasToken ? 'Yes' : 'No'}</p>
          <p><strong>Response Status:</strong> {debugInfo.responseStatus || 'No response'}</p>
          {debugInfo.rawResponse && (
            <details className="mt-2">
              <summary className="cursor-pointer font-semibold">Raw API Response</summary>
              <pre className="mt-2 text-xs overflow-auto">
                {JSON.stringify(debugInfo.rawResponse, null, 2)}
              </pre>
            </details>
          )}
        </div>
        
        <button 
          onClick={fetchReservations}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Success Message */}
      {showSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <div className="bg-green-500 rounded-full p-1 mr-3">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <p className="text-green-800 font-semibold">
              Payment successful! Your reservation has been confirmed.
            </p>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Reservations</h1>
        <Link 
          href="/hotels"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Book New Hotel
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        {[
          { key: 'all', label: `All (${filterReservations(reservations).length})` },
          { key: 'upcoming', label: `Upcoming (${filterReservations(reservations).filter(r => 
            r.check_in_date && 
            new Date(r.check_in_date) > new Date() && 
            r.status && 
            r.status.toLowerCase() !== 'cancelled'
          ).length})` },
          { key: 'past', label: `Past (${filterReservations(reservations).filter(r => 
            r.check_out_date && 
            new Date(r.check_out_date) < new Date()
          ).length})` },
          { key: 'cancelled', label: `Cancelled (${filterReservations(reservations).filter(r => 
            r.status && 
            r.status.toLowerCase() === 'cancelled'
          ).length})` }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              filter === tab.key
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Reservations List */}
      {filteredReservations.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-50 rounded-lg p-8">
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              {filter === 'all' ? 'No reservations found' : `No ${filter} reservations`}
            </h3>
            <p className="text-gray-500 mb-4">
              {reservations.length === 0 
                ? "You haven't made any hotel reservations yet."
                : `You have ${reservations.length} total reservations, but none match the ${filter} filter.`
              }
            </p>
            <Link 
              href="/hotels"
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            >
              Browse Hotels
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredReservations.map(reservation => {
            const firstImage = getFirstImage(reservation.hotel?.images);
            
            return (
              <div key={reservation.id} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                {/* Header Section with Hotel Image */}
                <div className="relative">
                  {firstImage && (
                    <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 relative overflow-hidden">
                      <img 
                        src={firstImage} 
                        alt={reservation.hotel.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold shadow-lg ${getStatusColor(reservation.status)}`}>
                      {reservation.status?.toUpperCase() || 'UNKNOWN STATUS'}
                    </span>
                  </div>

                  {/* Hotel Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6 text-white">
                    <h3 className="text-2xl font-bold mb-1">{reservation.hotel?.name || 'Unknown Hotel'}</h3>
                    <div className="flex items-center text-sm opacity-90">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      {reservation.hotel?.city || ''}, {reservation.hotel?.state || ''}
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6">
                  {/* Reservation Code */}
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Confirmation Code</p>
                    <p className="font-mono text-lg font-semibold text-gray-800">
                      {reservation.reservation_code || 'N/A'}
                    </p>
                  </div>

                  {/* Date and Price Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                      <div className="flex items-center mb-2">
                        <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-sm font-medium text-blue-800">Check-in</p>
                      </div>
                      <p className="font-bold text-blue-900 text-lg">
                        {reservation.check_in_date ? new Date(reservation.check_in_date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        }) : 'N/A'}
                      </p>
                    </div>
                    
                    <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-400">
                      <div className="flex items-center mb-2">
                        <svg className="w-5 h-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-sm font-medium text-purple-800">Check-out</p>
                      </div>
                      <p className="font-bold text-purple-900 text-lg">
                        {reservation.check_out_date ? new Date(reservation.check_out_date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        }) : 'N/A'}
                      </p>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                      <div className="flex items-center mb-2">
                        <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                        <p className="text-sm font-medium text-green-800">Total Amount</p>
                      </div>
                      <p className="font-bold text-green-900 text-xl">
                        ${reservation.total_amount || 'N/A'}
                      </p>
                    </div>
                  </div>

                  {/* Room and Guest Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-start p-4 bg-gray-50 rounded-lg">
                      <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Room Details</p>
                        <p className="font-semibold text-gray-800">
                          {reservation.room?.room_type?.name || 'Unknown Room Type'}
                        </p>
                        <p className="text-sm text-gray-600">
                          Room {reservation.room?.room_number || 'N/A'} • {reservation.nights || 1} night{(reservation.nights || 1) > 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start p-4 bg-gray-50 rounded-lg">
                      <div className="bg-orange-100 p-2 rounded-lg mr-3">
                        <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Guest Information</p>
                        <p className="font-semibold text-gray-800">
                          {reservation.adults || 0} Adult{(reservation.adults || 0) !== 1 ? 's' : ''}
                          {(reservation.children || 0) > 0 && `, ${reservation.children} Child${reservation.children !== 1 ? 'ren' : ''}`}
                        </p>
                        <p className="text-sm text-gray-600">
                          Payment: ${reservation.paid_amount || '0.00'} paid, ${reservation.pending_amount || '0.00'} pending
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Special Requests */}
                  {reservation.special_requests && (
                    <div className="mb-4 p-4 bg-amber-50 border-l-4 border-amber-400 rounded-lg">
                      <p className="text-sm font-medium text-amber-800 mb-1">Special Requests</p>
                      <p className="text-sm text-amber-700">{reservation.special_requests}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                    <Link 
                      href={`/reservations/${reservation.id}`}
                      className="flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View Details
                    </Link>
                    
                    {reservation.status && 
                     reservation.status.toLowerCase() === 'confirmed' && 
                     reservation.check_in_date && 
                     new Date(reservation.check_in_date) > new Date() && (
                      <button 
                        onClick={() => cancelReservation(reservation.id)}
                        className="flex items-center bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Cancel Reservation
                      </button>
                    )}

                    {reservation.status && reservation.status.toLowerCase() === 'confirmed' && (
                      <button 
                        onClick={() => window.open(`/reservations/${reservation.id}?print=true`, '_blank')}
                        className="flex items-center bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        Print
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}