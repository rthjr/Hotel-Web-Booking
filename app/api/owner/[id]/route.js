

import { NextResponse } from "next/server";

export async function DELETE(request, { params }) {
    const { id } = params; // Reservation ID

    try {
        console.log(`Deleting reservation with ID: ${id}`);

        // Fetch all hotels
        const response = await fetch("http://localhost:3002/hotels");
        if (!response.ok) {
            throw new Error("Failed to fetch hotels");
        }

        let hotels = await response.json();

        let hotelToUpdate = null;
        hotels = hotels.map(hotel => {
            if (hotel.reservations) {
                const filteredReservations = hotel.reservations.filter(reservation => reservation.id !== id);
                
                if (filteredReservations.length !== hotel.reservations.length) {
                    hotelToUpdate = { ...hotel, reservations: filteredReservations };
                    return hotelToUpdate;
                }
            }
            return hotel;
        });

        if (!hotelToUpdate) {
            console.error(`Reservation with ID ${id} not found`);
            return NextResponse.json({ message: "Reservation not found" }, { status: 404 });
        }

        console.log(`Updating hotel with ID: ${hotelToUpdate.id}`);

        const updateResponse = await fetch(`http://localhost:3002/hotels/${hotelToUpdate.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(hotelToUpdate),
        });

        if (!updateResponse.ok) {
            throw new Error("Failed to update hotel after deleting reservation");
        }

        console.log(`Reservation ${id} deleted successfully`);
        return NextResponse.json({ message: "Reservation deleted successfully" });
    } catch (error) {
        console.error("Error in DELETE API:", error.message);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
