import React from "react";
import { Button } from "../layout/Button";

const reservations = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1613545325278-f24b0cae1224?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
    hotelName: "Luxury Suites",
    checkIn: "2023-10-01",
    checkOut: "2023-10-05",
    roomType: "Deluxe Room",
    price: "$1,200",
    address: "123 Beachfront Avenue, Miami",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1600607688857-1f8144b1b9b2?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
    hotelName: "Mountain Retreat",
    checkIn: "2023-09-15",
    checkOut: "2023-09-18",
    roomType: "Suite",
    price: "$900",
    address: "456 Mountain Road, Aspen",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1618221195710-3b1b3aa1e5cb?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
    hotelName: "Cityscape Hotel",
    checkIn: "2023-08-20",
    checkOut: "2023-08-25",
    roomType: "Executive Room",
    price: "$1,500",
    address: "789 Downtown Street, New York",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1598228723793-52759bba239c?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
    hotelName: "Lakeside Inn",
    checkIn: "2023-07-10",
    checkOut: "2023-07-15",
    roomType: "Standard Room",
    price: "$800",
    address: "321 Lakeview Drive, Tahoe",
  },
  {
    id: 5,
    image:
      "https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
    hotelName: "Desert Oasis",
    checkIn: "2023-06-05",
    checkOut: "2023-06-10",
    roomType: "Villa",
    price: "$2,000",
    address: "654 Sand Dune Road, Palm Springs",
  },
];

const ReservationCard = ({ reservation }) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-md">
      <img
        alt="Hotel Image"
        src={reservation.image}
        className="h-56 w-full rounded-md object-cover"
      />
      <div className="mt-2  flex flex-col gap-4">
        <p className="text-sm text-gray-500">{reservation.hotelName}</p>
        <p className="font-medium">{reservation.address}</p>
        <div className="mt-4 text-xs grid grid-cols-2 gap-4">
          <p className="text-gray-500">
            Check-In: <span className="font-medium">{reservation.checkIn}</span>
          </p>
          <p className="text-gray-500">
            Check-Out:{" "}
            <span className="font-medium">{reservation.checkOut}</span>
          </p>
          <p className="text-gray-500">
            Room Type:{" "}
            <span className="font-medium">{reservation.roomType}</span>
          </p>
          <p className="text-gray-500">
            Total Price:{" "}
            <span className="font-medium">{reservation.price}</span>
          </p>
        </div>
        <Button param="Detail" />
      </div>
    </div>
  );
};

const ReservationHistory = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {reservations.map((reservation) => (
          <ReservationCard key={reservation.id} reservation={reservation} />
        ))}
      </div>
    </div>
  );
};

export default ReservationHistory;
