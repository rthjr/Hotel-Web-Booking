import { NextResponse } from 'next/server';

const API_ENDPOINT = 'http://localhost:3002/hotels';

export async function PUT(req) {
    try {
        const { id, reservation } = await req.json();

        const response = await fetch(`${API_ENDPOINT}/${id}`);
        if (!response.ok) {
            return NextResponse.json({ error: "Hotel not found" }, { status: 404 });
        }

        const hotel = await response.json();
        if (!hotel.reservations) hotel.reservations = [];
        hotel.reservations.push(reservation);

        const updateResponse = await fetch(`${API_ENDPOINT}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(hotel)
        });

        if (!updateResponse.ok) {
            return NextResponse.json({ error: "Failed to update hotel data" }, { status: 500 });
        }

        return NextResponse.json({ message: "Reservation added successfully", hotel }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
}
