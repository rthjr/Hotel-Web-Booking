import React from "react";
import ButtonWrapper from "@components/motion/ButtonWrapper";

const reservations = [
  {
    roomId: 1,
    image:
      "https://images.unsplash.com/photo-1613545325278-f24b0cae1224?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
    pricePerNight: "$120",
    maxOccupancy: "4 Guests",
    available: "Yes",
    roomType: "Deluxe Room",
    bedType: "King Bed",
    amenities: "WiFi, TV, Air Conditioning",
  },
  {
    roomId: 2,
    image:
      "https://images.unsplash.com/photo-1600607688857-1f8144b1b9b2?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
    pricePerNight: "$90",
    maxOccupancy: "2 Guests",
    available: "No",
    roomType: "Standard Room",
    bedType: "Queen Bed",
    amenities: "WiFi, TV",
  },
  {
    roomId: 3,
    image:
      "https://images.unsplash.com/photo-1618221195710-3b1b3aa1e5cb?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
    pricePerNight: "$150",
    maxOccupancy: "5 Guests",
    available: "Yes",
    roomType: "Suite",
    bedType: "King Bed + Sofa Bed",
    amenities: "WiFi, TV, Kitchenette, Balcony",
  }
];

const ReservationCard = ({ reservation }) => {
  return (
    <div className="bg-gray-100 rounded-lg p-4 shadow-md">
      <img
        alt="Room Image"
        src={reservation.image}
        className="h-56 w-full rounded-md object-cover"
      />
      <div className="mt-2 flex flex-col gap-4">
        <p className="text-sm text-gray-500">Price: {reservation.pricePerNight} / night</p>
        <p className="font-medium">Room Type: {reservation.roomType}</p>
        <div className="mt-4 text-xs grid grid-cols-2 gap-4">
          <p className="text-gray-500">
            Max Occupancy: <span className="font-medium">{reservation.maxOccupancy}</span>
          </p>
          <p className="text-gray-500">
            Available: <span className="font-medium">{reservation.available}</span>
          </p>
          <p className="text-gray-500">
            Bed Type: <span className="font-medium">{reservation.bedType}</span>
          </p>
          <p className="text-gray-500">
            Amenities: <span className="font-medium">{reservation.amenities}</span>
          </p>
        </div>
        <ButtonWrapper/>
      </div>
    </div>
  );
};

const ReservationList = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {reservations.map((reservation) => (
          <ReservationCard key={reservation.roomId} reservation={reservation} />
        ))}
      </div>
    </div>
  );
};

export default ReservationList;
