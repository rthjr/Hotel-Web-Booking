'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function ReservationDetailsPage() {
  const LARAVEL_API_URL = process.env.NEXT_PUBLIC_LARAVEL_API_URL;
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const reservationId = params.id;
  const isPrintMode = searchParams.get('print') === 'true';

  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (reservationId) {
      fetchReservationDetails();
    }
  }, [reservationId]);

  useEffect(() => {
    if (isPrintMode && reservation) {
      setTimeout(() => window.print(), 500);
    }
  }, [isPrintMode, reservation]);

  const fetchReservationDetails = async () => {
    try {
      setError(null);
      setLoading(true);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      if (!LARAVEL_API_URL) {
        throw new Error('API URL not configured');
      }

      const response = await fetch(`${LARAVEL_API_URL}/api/reservations/${reservationId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      setReservation(data.data || data);
    } catch (error) {
      setError(error.message || 'Failed to load reservation details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      confirmed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800'
    };
    return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateNights = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 1;
    const diffTime = Math.abs(new Date(checkOut) - new Date(checkIn));
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
  };

  const handleModifyReservation = () => {
    router.push(`/reservations/${reservationId}/modify`);
  };

  const handleCancelReservation = () => {
    router.push(`/reservations/${reservationId}/cancel`);
  };

  const canModifyOrCancel = (status) => {
    return ['confirmed', 'pending'].includes(status?.toLowerCase());
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p>Loading reservation details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Reservation</h3>
          <p className="text-red-700 mb-4">{error}</p>
          <div className="flex gap-3">
            <button 
              onClick={fetchReservationDetails} 
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Retry
            </button>
            <Link 
              href="/reservations" 
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
            >
              Back to Reservations
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h3 className="text-lg font-semibold text-gray-600 mb-2">Reservation Not Found</h3>
        <Link 
          href="/reservations" 
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Back to Reservations
        </Link>
      </div>
    );
  }

  const nights = calculateNights(reservation.check_in_date, reservation.check_out_date);

  return (
    <div className={`${isPrintMode ? 'print:p-0' : 'container mx-auto px-4 py-8'}`}>
      {/* Header */}
      {!isPrintMode && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="flex items-center gap-4">
            <Link 
              href="/reservations" 
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              ← Back to Reservations
            </Link>
            <h1 className="text-3xl font-bold">Reservation Details</h1>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => window.open(`/reservations/${reservationId}?print=true`, '_blank')}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
            >
              Print
            </button>
            {canModifyOrCancel(reservation.status) && (
              <>
                <button 
                  onClick={handleModifyReservation}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Modify
                </button>
                <button 
                  onClick={handleCancelReservation}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Print Header */}
      {isPrintMode && (
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Hotel Reservation Confirmation</h1>
          <p className="text-gray-600">Confirmation Code: {reservation.reservation_code}</p>
        </div>
      )}

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Confirmation Code */}
        <div className="bg-blue-600 text-white rounded-lg p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-bold mb-2">Confirmation Code</h2>
              <p className="text-2xl font-mono font-bold">{reservation.reservation_code}</p>
            </div>
            <div className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(reservation.status)}`}>
              {reservation.status?.toUpperCase() || 'UNKNOWN'}
            </div>
          </div>
        </div>

        {/* Hotel Info */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold mb-4">Hotel Information</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-lg">{reservation.hotel?.name || 'Unknown Hotel'}</h4>
              <p className="text-gray-600">{reservation.hotel?.address}</p>
              <p className="text-gray-600">{reservation.hotel?.city}, {reservation.hotel?.state}</p>
            </div>
            <div className="space-y-1">
              {reservation.hotel?.phone && (
                <p className="text-gray-700">
                  <span className="font-medium">Phone:</span> {reservation.hotel.phone}
                </p>
              )}
              {reservation.hotel?.email && (
                <p className="text-gray-700">
                  <span className="font-medium">Email:</span> {reservation.hotel.email}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Stay & Room Details */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-4">Stay Details</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 text-sm">Check-in</p>
                  <p className="font-semibold">{formatDate(reservation.check_in_date)}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Check-out</p>
                  <p className="font-semibold">{formatDate(reservation.check_out_date)}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 text-sm">Duration</p>
                  <p className="font-semibold">{nights} night{nights !== 1 ? 's' : ''}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Guests</p>
                  <p className="font-semibold">{reservation.adults || 0} Adult{(reservation.adults || 0) !== 1 ? 's' : ''}</p>
                  {reservation.children > 0 && (
                    <p className="text-sm text-gray-600">{reservation.children} Child{reservation.children !== 1 ? 'ren' : ''}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-4">Room Details</h3>
            <div className="space-y-4">
              <div>
                <p className="text-gray-600 text-sm">Room Type</p>
                <p className="font-semibold">{reservation.room?.room_type?.name || 'Unknown'}</p>
                {reservation.room?.room_type?.description && (
                  <p className="text-sm text-gray-600 mt-1">{reservation.room.room_type.description}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 text-sm">Room Number</p>
                  <p className="font-semibold">{reservation.room?.room_number || 'TBD'}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Floor</p>
                  <p className="font-semibold">{reservation.room?.floor || 'TBD'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Special Requests */}
        {reservation.special_requests && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-4">Special Requests</h3>
            <div className="bg-amber-50 border border-amber-200 rounded p-4">
              <p className="text-amber-800">{reservation.special_requests}</p>
            </div>
          </div>
        )}

        {/* Payment Info */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold mb-4">Payment Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded">
              <p className="text-blue-800 text-sm font-medium">Room Rate (per night)</p>
              <p className="text-2xl font-bold text-blue-900">${reservation.room_rate || '0.00'}</p>
            </div>
            <div className="bg-green-50 p-4 rounded">
              <p className="text-green-800 text-sm font-medium">Total Amount</p>
              <p className="text-2xl font-bold text-green-900">${reservation.total_amount || '0.00'}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded">
              <p className="text-purple-800 text-sm font-medium">Payment Status</p>
              <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mt-2 ${getStatusColor(reservation.payment_status)}`}>
                {reservation.payment_status?.toUpperCase() || 'UNKNOWN'}
              </div>
            </div>
          </div>
        </div>

        {/* Payment History */}
        {reservation.payments?.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-4">Payment History</h3>
            <div className="space-y-3">
              {reservation.payments.map((payment, index) => (
                <div key={payment.id || index} className="border rounded-lg p-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-2">
                    <span className="font-semibold">Payment #{index + 1}</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(payment.status)}`}>
                      {payment.status?.toUpperCase()}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Amount</p>
                      <p className="font-semibold">${payment.amount}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Method</p>
                      <p className="font-semibold capitalize">{payment.payment_method?.replace('_', ' ')}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Gateway</p>
                      <p className="font-semibold capitalize">{payment.gateway}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Date</p>
                      <p className="font-semibold">{new Date(payment.processed_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  {payment.gateway_response?.transaction_id && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-xs text-gray-500">
                        <span className="font-medium">Transaction ID:</span> {payment.gateway_response.transaction_id}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Additional Actions */}
        {!isPrintMode && (
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Need Help?</h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/reservations/history" 
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                View All Past Reservations →
              </Link>
              <Link 
                href="/contact" 
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                Contact Support →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}