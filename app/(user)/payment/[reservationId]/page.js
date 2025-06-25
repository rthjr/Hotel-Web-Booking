'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CreditCard, Calendar, MapPin, User, Shield, CheckCircle, AlertCircle, Clock } from 'lucide-react';

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const LARAVEL_API_URL = process.env.NEXT_PUBLIC_LARAVEL_API_URL;
  
  const [reservation, setReservation] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState('payment'); // 'payment', 'processing', 'success'

  useEffect(() => {
    if (params.reservationId) {
      fetchReservation();
    }
  }, [params.reservationId]);

  const fetchReservation = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required. Please login.');
      }

      const response = await fetch(`${LARAVEL_API_URL}/api/reservations/${params.reservationId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.message || `HTTP ${response.status}: Failed to fetch reservation details`);
        } catch (parseError) {
          throw new Error(`HTTP ${response.status}: ${errorText || 'Failed to fetch reservation details'}`);
        }
      }

      const data = await response.json();
      const reservationData = data.data ? data.data : data;
      setReservation(reservationData);
    } catch (error) {
      console.error('Error fetching reservation:', error);
      setError(error.message || 'Failed to load reservation details');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

  const processPayment = async () => {
  setLoading(true);
  setError(null);
  setStep('processing');
  
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required. Please login.');
    }

    if (!reservation) {
      throw new Error('Reservation data not loaded');
    }

    console.log('=== PAYMENT DEBUG INFO ===');
    console.log('Reservation:', reservation);
    console.log('Reservation ID:', params.reservationId);
    console.log('Total Amount:', reservation.total_amount);

    // Create payment record
    const paymentPayload = {
      reservation_id: params.reservationId,
      amount: parseFloat(reservation.total_amount),
      currency: 'USD',
      payment_method: paymentMethod
    };

    console.log('Payment Payload:', paymentPayload);

    const paymentResponse = await fetch(`${LARAVEL_API_URL}/api/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(paymentPayload)
    });

    console.log('Payment Response Status:', paymentResponse.status);

    if (!paymentResponse.ok) {
      const errorText = await paymentResponse.text();
      console.error('Payment Response Error:', errorText);
      
      let errorMessage = `Payment failed (${paymentResponse.status})`;
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorMessage;
        
        // If there are validation errors, show them
        if (errorData.errors) {
          const validationErrors = Object.values(errorData.errors).flat();
          errorMessage = validationErrors.join(', ');
        }
      } catch (e) {
        errorMessage = errorText || errorMessage;
      }
      
      throw new Error(errorMessage);
    }

    const paymentData = await paymentResponse.json();
    console.log('Payment Response Data:', paymentData);
    
    // FIX: Access payment ID from the correct location
    const paymentId = paymentData.data?.id;
    console.log('Payment ID:', paymentId);
    
    if (!paymentId) {
      console.error('No payment ID found in response:', paymentData);
      throw new Error('Payment created but no payment ID returned');
    }

    // Simulate payment processing
    console.log('Simulating payment processing...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Complete the payment
    console.log('Completing payment with ID:', paymentId);
    const completeResponse = await fetch(`${LARAVEL_API_URL}/api/payments/${paymentId}/complete`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        gateway_response: { 
          status: 'success', 
          transaction_id: 'TXN-' + Date.now(),
          processed_at: new Date().toISOString()
        }
      })
    });

    console.log('Complete Response Status:', completeResponse.status);

    if (!completeResponse.ok) {
      const errorText = await completeResponse.text();
      console.error('Complete Response Error:', errorText);
      
      let errorMessage = `Payment completion failed (${completeResponse.status})`;
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        errorMessage = errorText || errorMessage;
      }
      
      throw new Error(errorMessage);
    }

    const completeData = await completeResponse.json();
    console.log('Complete Response Data:', completeData);

    console.log('✅ Payment completed successfully!');
    setStep('success');
    setTimeout(() => router.push('/reservations?success=true'), 3000);
    
  } catch (error) {
    console.error('❌ Payment Error:', error);
    setError(error.message || 'An error occurred during payment processing');
    setStep('payment');
  } finally {
    setLoading(false);
  }
};

  if (!reservation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-6"></div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Loading Reservation</h2>
            </>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
                <p className="text-red-800">{error}</p>
              </div>
            </div>
          ) : (
            <p>No reservation data available</p>
          )}
        </div>
      </div>
    );
  }

  if (step === 'processing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Processing Payment</h2>
          <p className="text-gray-600 mb-6">Please wait while we securely process your payment...</p>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <Shield className="w-4 h-4" />
            <span>256-bit SSL Encryption</span>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Payment Successful!</h2>
          <p className="text-gray-600 mb-6">Your reservation has been confirmed. You'll receive a confirmation email shortly.</p>
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-500 mb-1">Confirmation Code</p>
            <p className="text-lg font-bold text-gray-800">{reservation.reservation_code}</p>
          </div>
          <button 
            onClick={() => router.push('/reservations')}
            className="w-full bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors"
          >
            View Reservation Details
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Complete Your Booking</h1>
          <p className="text-gray-600">Secure payment powered by industry-leading encryption</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Reservation Summary Card */}
          <div className="bg-white rounded-3xl shadow-xl p-8 h-fit">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Booking Summary</h2>
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                Confirmed
              </div>
            </div>

            {/* Hotel Info */}
            <div className="border-b border-gray-100 pb-6 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{reservation.hotel?.name || 'N/A'}</h3>
              <div className="flex items-center text-gray-600 mb-2">
                <MapPin className="w-4 h-4 mr-2" />
                <span>Oceanfront Location</span>
              </div>
              <div className="flex items-center text-gray-600">
                <User className="w-4 h-4 mr-2" />
                <span>{reservation.guest_name || 'Guest'}</span>
              </div>
            </div>

            {/* Room Details */}
            <div className="border-b border-gray-100 pb-6 mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-semibold text-gray-800">Room {reservation.room?.room_number || 'N/A'}</h4>
                  <p className="text-gray-600 text-sm">{reservation.room?.type || 'Room'}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    {Math.ceil((new Date(reservation.check_out_date) - new Date(reservation.check_in_date)) / (1000 * 60 * 60 * 24))} nights
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center mb-2">
                    <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-500">Check-in</span>
                  </div>
                  <p className="font-semibold text-gray-800">{formatDate(reservation.check_in_date)}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center mb-2">
                    <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-500">Check-out</span>
                  </div>
                  <p className="font-semibold text-gray-800">{formatDate(reservation.check_out_date)}</p>
                </div>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Room rate ({Math.ceil((new Date(reservation.check_out_date) - new Date(reservation.check_in_date)) / (1000 * 60 * 60 * 24))} nights)</span>
                <span>${(parseFloat(reservation.total_amount) * 0.85).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Taxes & fees</span>
                <span>${(parseFloat(reservation.total_amount) * 0.15).toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-100 pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-800">Total</span>
                  <span className="text-2xl font-bold text-blue-600">${reservation.total_amount}</span>
                </div>
              </div>
            </div>

            {/* Security Badge */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-center">
                <Shield className="w-5 h-5 text-green-600 mr-3" />
                <div>
                  <p className="text-sm font-semibold text-green-800">Secure Payment</p>
                  <p className="text-xs text-green-600">Your payment information is encrypted and secure</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment Details</h2>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
                  <p className="text-red-800">{error}</p>
                </div>
              </div>
            )}

            {/* Payment Method Selection */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-4">Payment Method</label>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { id: 'credit_card', label: 'Credit Card', icon: CreditCard },
                  { id: 'debit_card', label: 'Debit Card', icon: CreditCard },
                  { id: 'paypal', label: 'PayPal', icon: CreditCard }
                ].map(({ id, label, icon: Icon }) => (
                  <label key={id} className="relative">
                    <input
                      type="radio"
                      name="payment"
                      value={id}
                      checked={paymentMethod === id}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="sr-only"
                    />
                    <div className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                      paymentMethod === id 
                        ? 'border-blue-500 bg-blue-50 shadow-md' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <div className="flex items-center">
                        <Icon className="w-5 h-5 text-gray-600 mr-3" />
                        <span className="font-medium text-gray-800">{label}</span>
                        {paymentMethod === id && (
                          <CheckCircle className="w-5 h-5 text-blue-500 ml-auto" />
                        )}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Payment Form */}
            <div className="space-y-6 mb-8">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Card Number</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:outline-none transition-colors"
                    disabled={loading}
                  />
                  <CreditCard className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:outline-none transition-colors"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">CVV</label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:outline-none transition-colors"
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Cardholder Name</label>
                <input
                  type="text"
                  placeholder="John Smith"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:outline-none transition-colors"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Terms */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <label className="flex items-start">
                <input type="checkbox" className="mt-1 mr-3" required />
                <span className="text-sm text-gray-600">
                  I agree to the <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and 
                  <a href="#" className="text-blue-600 hover:underline"> Privacy Policy</a>
                </span>
              </label>
            </div>

            {/* Payment Button */}
            <button
              onClick={processPayment}
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all transform ${
                loading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  Processing...
                </div>
              ) : (
                `Complete Payment - $${reservation.total_amount}`
              )}
            </button>

            {/* Security Footer */}
            <div className="flex items-center justify-center mt-6 text-sm text-gray-500">
              <Shield className="w-4 h-4 mr-2" />
              <span>Protected by 256-bit SSL encryption</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}