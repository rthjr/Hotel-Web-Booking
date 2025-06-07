'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CancelReservationPage() {
  const LARAVEL_API_URL = process.env.NEXT_PUBLIC_LARAVEL_API_URL;
  const params = useParams();
  const router = useRouter();
  const reservationId = params.id;
  
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [refundInfo, setRefundInfo] = useState(null);

  useEffect(() => {
    fetchReservationDetails();
    fetchCancellationPolicy();
  }, [reservationId]);

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
      setReservation(data.data);
      
    } catch (error) {
      console.error('Error fetching reservation:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCancellationPolicy = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${LARAVEL_API_URL}/api/reservations/${reservationId}/cancellation-policy`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setRefundInfo(data.data);
      }
    } catch (error) {
      console.error('Error fetching cancellation policy:', error);
    }
  };

  const handleCancelReservation = async () => {
    if (!cancelReason.trim()) {
      setError('Please provide a reason for cancellation');
      return;
    }

    setCancelling(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${LARAVEL_API_URL}/api/reservations/${reservationId}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          reason: cancelReason,
          confirmed: true
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to cancel reservation');
      }

      // Redirect to reservations with success message
      router.push('/reservations?cancelled=true');

    } catch (error) {
      console.error('Error cancelling reservation:', error);
      setError(error.message);
    } finally {
      setCancelling(false);
    }
  };

  const getDaysUntilCheckIn = () => {
    if (!reservation?.check_in_date) return 0;
    
    const checkInDate = new Date(reservation.check_in_date);
    const today = new Date();
    const diffTime = checkInDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getRefundAmount = () => {
    if (!reservation || !refundInfo) return 0;
    
    const daysUntil = getDaysUntilCheckIn();
    const totalAmount = parseFloat(reservation.total_amount);
    
    // Example cancellation policy logic
    if (daysUntil >= 7) {
      return totalAmount * 0.9; // 90% refund
    } else if (daysUntil >= 3) {
      return totalAmount * 0.5; // 50% refund
    } else if (daysUntil >= 1) {
      return totalAmount * 0.25; // 25% refund
    } else {
      return 0; // No refund for same-day cancellation
    }
  };

  const getRefundPercentage = () => {
    if (!reservation) return 0;
    const refundAmount = getRefundAmount();
    const totalAmount = parseFloat(reservation.total_amount);
    return Math.round((refundAmount / totalAmount) * 100);
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

  // Check if reservation can be cancelled
  const canCancel = reservation.status === 'confirmed' && new Date(reservation.check_in_date) > new Date();
  
  if (!canCancel) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">Cannot Cancel Reservation</h3>
          <p className="text-yellow-700 mb-4">
            This reservation cannot be cancelled because it has already started or has been cancelled.
          </p>
          <Link href={`/reservations/${reservationId}`} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            View Reservation Details
          </Link>
        </div>
      </div>
    );
  }

  const daysUntilCheckIn = getDaysUntilCheckIn();
  const refundAmount = getRefundAmount();
  const refundPercentage = getRefundPercentage();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
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
        
        <h1 className="text-3xl font-bold text-gray-900">Cancel Reservation</h1>
        <p className="text-gray-600 mt-2">Confirmation Code: {reservation.reservation_code}</p>
      </div>

      {/* Error Message */}
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
        {/* Cancellation Form */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Cancellation Details</h2>
            
            {/* Refund Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">Refund Information</h3>
                  <p className="text-blue-800 text-sm mb-2">
                    Check-in is in {daysUntilCheckIn} day{daysUntilCheckIn !== 1 ? 's' : ''}
                  </p>
                  <div className="space-y-1 text-sm">
                    <p className="text-blue-800">
                      <span className="font-medium">Original Amount:</span> ${parseFloat(reservation.total_amount).toFixed(2)}
                    </p>
                    <p className="text-blue-800">
                      <span className="font-medium">Refund Amount:</span> ${refundAmount.toFixed(2)} ({refundPercentage}%)
                    </p>
                    <p className="text-blue-800">
                      <span className="font-medium">Processing Fee:</span> ${(parseFloat(reservation.total_amount) - refundAmount).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Cancellation Policy */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Cancellation Policy</h3>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <span>7+ days before check-in:</span>
                    <span className="font-medium">90% refund</span>
                  </div>
                  <div className="flex justify-between">
                    <span>3-6 days before check-in:</span>
                    <span className="font-medium">50% refund</span>
                  </div>
                  <div className="flex justify-between">
                    <span>1-2 days before check-in:</span>
                    <span className="font-medium">25% refund</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Same day cancellation:</span>
                    <span className="font-medium">No refund</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cancellation Reason */}
            <div className="mb-6">
              <label htmlFor="cancelReason" className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Cancellation *
              </label>
              <textarea
                id="cancelReason"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="4"
                placeholder="Please provide a reason for cancelling your reservation..."
                required
              />
            </div>

            {/* Important Notice */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 15.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div>
                  <h3 className="font-semibold text-yellow-900 mb-1">Important Notice</h3>
                  <p className="text-yellow-800 text-sm">
                    Once you cancel your reservation, this action cannot be undone. 
                    The refund will be processed within 5-7 business days to your original payment method.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleCancelReservation}
                disabled={cancelling || !cancelReason.trim()}
                className="flex-1 bg-red-600 text-white py-3 px-4 rounded-md font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cancelling ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Cancelling...
                  </div>
                ) : (
                  'Cancel Reservation'
                )}
              </button>
              
              <Link
                href={`/reservations/${reservationId}`}
                className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-md font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 text-center"
              >
                Keep Reservation
              </Link>
            </div>
          </div>
        </div>

        {/* Reservation Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Reservation Summary</h2>
            
            {/* Hotel Info */}
            <div className="mb-4">
              <h3 className="font-medium text-gray-900">{reservation.hotel?.name || 'Hotel Name'}</h3>
              <p className="text-sm text-gray-600">{reservation.hotel?.address || 'Hotel Address'}</p>
            </div>

            {/* Room Info */}
            <div className="mb-4">
              <h4 className="font-medium text-gray-800">{reservation.room?.name || 'Room Type'}</h4>
              <p className="text-sm text-gray-600">
                {reservation.guests || 1} guest{(reservation.guests || 1) !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Dates */}
            <div className="mb-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Check-in:</span>
                <span className="font-medium">
                  {new Date(reservation.check_in_date).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Check-out:</span>
                <span className="font-medium">
                  {new Date(reservation.check_out_date).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Nights:</span>
                <span className="font-medium">{reservation.nights || 1}</span>
              </div>
            </div>

            {/* Pricing */}
            <div className="border-t border-gray-200 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Room Rate:</span>
                <span>${parseFloat(reservation.room_rate || 0).toFixed(2)}</span>
              </div>
              {reservation.taxes && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Taxes & Fees:</span>
                  <span>${parseFloat(reservation.taxes).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold text-gray-900 pt-2 border-t border-gray-200">
                <span>Total Paid:</span>
                <span>${parseFloat(reservation.total_amount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-green-600">
                <span>Refund Amount:</span>
                <span>${refundAmount.toFixed(2)}</span>
              </div>
            </div>

            {/* Contact Info */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h4 className="font-medium text-gray-900 mb-2">Need Help?</h4>
              <p className="text-sm text-gray-600 mb-2">
                Contact our customer service team if you have questions about your cancellation.
              </p>
              <div className="space-y-1 text-sm">
                <p className="text-gray-600">Phone: 1-800-HOTEL-01</p>
                <p className="text-gray-600">Email: support@hotel.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}