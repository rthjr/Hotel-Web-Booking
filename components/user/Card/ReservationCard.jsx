import React from "react";
import { Button } from "../layout/Button";

const reservations = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1613545325278-f24b0cae1224?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
    price: "$240,000",
    address: "123 Wallaby Avenue, Park Road",
    parking: "2 spaces",
    bathroom: "2 rooms",
    bedroom: "4 rooms",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1600607688857-1f8144b1b9b2?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
    price: "$180,000",
    address: "456 Elm Street, Downtown",
    parking: "1 space",
    bathroom: "1 room",
    bedroom: "3 rooms",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1618221195710-3b1b3aa1e5cb?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
    price: "$300,000",
    address: "789 Maple Avenue, Uptown",
    parking: "2 spaces",
    bathroom: "2 rooms",
    bedroom: "5 rooms",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1598228723793-52759bba239c?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
    price: "$210,000",
    address: "321 Oak Street, Suburbia",
    parking: "2 spaces",
    bathroom: "2 rooms",
    bedroom: "3 rooms",
  },
  {
    id: 5,
    image:
      "https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
    price: "$275,000",
    address: "654 Pine Road, Cityscape",
    parking: "1 space",
    bathroom: "2 rooms",
    bedroom: "4 rooms",
  },
];

const ReservationCard = ({ reservation }) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-md">
      <img
        alt="Reservation Image"
        src={reservation.image}
        className="h-56 w-full rounded-md object-cover"
      />
      <div className="mt-2 flex flex-col gap-4">
        <p className="text-sm text-gray-500">{reservation.price}</p>
        <p className="font-medium">{reservation.address}</p>
        <div className="mt-4 text-xs grid grid-cols-2 gap-4">
          <p className="text-gray-500">
            Parking: <span className="font-medium">{reservation.parking}</span>
          </p>
          <p className="text-gray-500">
            Bathroom:{" "}
            <span className="font-medium">{reservation.bathroom}</span>
          </p>
          <p className="text-gray-500">
            Bedroom: <span className="font-medium">{reservation.bedroom}</span>
          </p>
        </div>
          <Button param="Detail" />
      </div>
    </div>
  );
};

const ReservationList = () => {
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

export default ReservationList;
