'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function BookingConfirmationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const reservationId = searchParams.get('reservation_id');
    if (reservationId) {
      fetchReservationDetails(reservationId);
    } else {
      router.push('/');
    }
  }, [searchParams, router]);

  const fetchReservationDetails = async (reservationId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/reservations/${reservationId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setReservation(data);
    } catch (error) {
      console.error('Error fetching reservation:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!reservation) return <div>Reservation not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Success Message */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <div className="flex items-center mb-4">
            <div className="bg-green-500 rounded-full p-2 mr-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-green-800">Booking Confirmed!</h1>
          </div>
          <p className="text-green-700 text-lg">
            Your reservation has been successfully created and payment has been processed.
          </p>
        </div>

        {/* Reservation Details */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-6">Reservation Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Booking Information</h3>
              <div className="space-y-2">
                <p><strong>Reservation Code:</strong> {reservation.reservation_code}</p>
                <p><strong>Status:</strong> 
                  <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                    {reservation.status}
                  </span>
                </p>
                <p><strong>Check-in:</strong> {new Date(reservation.check_in_date).toLocaleDateString()}</p>
                <p><strong>Check-out:</strong> {new Date(reservation.check_out_date).toLocaleDateString()}</p>
                <p><strong>Guests:</strong> {reservation.adults} Adults, {reservation.children} Children</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Hotel & Room</h3>
              <div className="space-y-2">
                <p><strong>Hotel:</strong> {reservation.hotel?.name}</p>
                <p><strong>Address:</strong> {reservation.hotel?.address}, {reservation.hotel?.city}</p>
                <p><strong>Room:</strong> {reservation.room?.room_number}</p>
                <p><strong>Room Type:</strong> {reservation.room?.room_type?.name}</p>
              </div>
            </div>
          </div>

          {reservation.special_requests && (
            <div className="mt-6 pt-6 border-t">
              <h3 className="text-lg font-semibold mb-2">Special Requests</h3>
              <p className="text-gray-600">{reservation.special_requests}</p>
            </div>
          )}
        </div>

        {/* Payment Summary */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Payment Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Room Rate (per night):</span>
              <span>${reservation.room_rate}</span>
            </div>
            <div className="flex justify-between">
              <span>Number of Nights:</span>
              <span>{Math.ceil((new Date(reservation.check_out_date) - new Date(reservation.check_in_date)) / (1000 * 60 * 60 * 24))}</span>
            </div>
            <div className="border-t pt-3 flex justify-between font-bold text-lg">
              <span>Total Amount:</span>
              <span className="text-green-600">${reservation.total_amount}</span>
            </div>
            <div className="text-sm text-gray-600">
              <p>Payment Status: 
                <span className="ml-1 font-semibold text-green-600">Paid</span>
              </p>
            </div>
          </div>
        </div>

        {/* Important Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-3 text-blue-800">Important Information</h3>
          <ul className="space-y-2 text-blue-700">
            <li>• Please arrive at the hotel after 3:00 PM for check-in</li>
            <li>• Check-out time is before 11:00 AM</li>
            <li>• Please bring a valid ID and your reservation code</li>
            <li>• Contact the hotel directly for any changes to your reservation</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link 
            href="/reservations"
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 text-center font-semibold"
          >
            View All Reservations
          </Link>
          <Link 
            href="/"
            className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 text-center font-semibold"
          >
            Back to Home
          </Link>
          <button 
            onClick={() => window.print()}
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 font-semibold"
          >
            Print Confirmation
          </button>
        </div>
      </div>
    </div>
  );
}