import { NextResponse } from 'next/server';

const API_ENDPOINT = 'http://localhost:3002/hotels';

export async function PUT(req) {
    try {
        const { reservationId } = await req.json();

        if (!reservationId) {
            return NextResponse.json({ error: "Reservation ID is required" }, { status: 400 });
        }

        // Fetch all hotels
        const response = await fetch(API_ENDPOINT);
        if (!response.ok) {
            return NextResponse.json({ error: "Failed to fetch hotels" }, { status: 500 });
        }

        const hotels = await response.json();

        // Find the reservation
        let reservationFound = false;
        let updatedHotel = null;

        for (const hotel of hotels) {
            const reservationIndex = hotel.reservations.findIndex(
                (res) => res.id === reservationId
            );

            if (reservationIndex !== -1) {
                const reservation = hotel.reservations[reservationIndex];

                // Check if the status is "none"
                if (reservation.status === 'none') {
                    // Update the status to "paid"
                    hotel.reservations[reservationIndex].status = 'paid';
                    reservationFound = true;
                    updatedHotel = hotel;
                    break;
                } else {
                    return NextResponse.json(
                        { error: 'Reservation status is not "none"' },
                        { status: 400 }
                    );
                }
            }
        }

        if (!reservationFound) {
            return NextResponse.json(
                { error: 'Reservation not found' },
                { status: 404 }
            );
        }

        // Update the hotel data
        const updateResponse = await fetch(`${API_ENDPOINT}/${updatedHotel.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedHotel),
        });

        if (!updateResponse.ok) {
            return NextResponse.json(
                { error: 'Failed to update hotel data' },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { message: 'Reservation status updated to "paid"', hotel: updatedHotel },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: 'Invalid request', details: error.message },
            { status: 400 }
        );
    }
}