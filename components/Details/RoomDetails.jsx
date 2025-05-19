"use client";
import { useRouter } from "@node_modules/next/navigation";
import Link from "next/link";
import { HiWifi } from "react-icons/hi";
import { MdOutlineAirportShuttle } from "react-icons/md";
import { MdFamilyRestroom } from "react-icons/md";
import { TbSmokingNo } from "react-icons/tb";
import { PiFlowerLotusBold } from "react-icons/pi";
import { IoIosRestaurant } from "react-icons/io";
import { LuSquareParking } from "react-icons/lu";
import { MdOutlineRoomService } from "react-icons/md";
import { MdOutlineCoffeeMaker } from "react-icons/md";
import { MdOutlineFreeBreakfast } from "react-icons/md";
import React, { useState } from "react";
import DateRangePicker from "../components/DateRangePicker";
import GuestRoomSelector from "../components/GuestRoomSelector";
import ImageUpload from "@components/components/ImageUpload";
import VideoUpload from "@components/components/VideoUpload";

const RoomDetails = () => {
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [guests, setGuests] = useState(2);
  const [rooms, setRooms] = useState(1);
  return (
    <>
      <button
        className="flex items-center px-4 py-2 text-white  rounded-md bg-bgDarkColor hover:bg-buttonColor focus:outline-none focus:ring-2 focus:ring-blue-300"
        onClick={handleBack}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            d="M7.707 14.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L4.414 9H17a1 1 0 110 2H4.414l3.293 3.293a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
        </svg>
        Back
      </button>
      <div className="mx-auto">
        <div className="w-full">
          <div className="flex justify-center items-center py-4">
            <ul className="flex w-full justify-evenly ">
              <li className="flex-1 text-center py-4 text-gray-900 border-b-2 hover:border-b-2 hover:border-textColor hover:bg-bgNavColor  transition-colors duration-300">
                <Link href="#overview">
                  <span className="">Overview</span>
                </Link>
              </li>
              <li className="flex-1 text-center py-4 text-gray-900 border-b-2 hover:border-b-2 hover:border-textColor hover:bg-bgNavColor  transition-colors duration-300">
                <Link href="#info-prices">
                  <span>Info & prices</span>
                </Link>
              </li>
              <li className="flex-1 text-center py-4 text-gray-900 border-b-2 hover:border-b-2 hover:border-textColor hover:bg-bgNavColor  transition-colors duration-300">
                <Link href="#facilities">
                  <span>Facilities</span>
                </Link>
              </li>
              <li className="flex-1 text-center py-4 text-gray-900 border-b-2 hover:border-b-2 hover:border-textColor hover:bg-bgNavColor  transition-colors duration-300">
                <Link href="#house-rules">
                  <span>House rules</span>
                </Link>
              </li>
              <li className="flex-1 text-center py-4 text-gray-900 border-b-2 hover:border-b-2 hover:border-textColor hover:bg-bgNavColor  transition-colors duration-300">
                <Link href="#fine-print">
                  <span>The fine print</span>
                </Link>
              </li>
              <li className="flex-1 text-center py-4 text-gray-900 border-b-2 hover:border-b-2 hover:border-textColor hover:bg-bgNavColor  transition-colors duration-300">
                <Link href="#guest-reviews">
                  <span>Guest reviews</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="flex flex-col gap-4 py-4">
            <div id="#overview" className="font-bold text-2xl">
              <h2>Hotel 1</h2>
            </div>
            <div className="text-xl">
              <h3>
                <span className="font-bold">Room 1: </span>large double bed
              </h3>
            </div>
            <div>
              <p>
                97 Preah Sisowath Quay, Daun Penh, Phnom Penh, Cambodia -
                <Link
                  href="#"
                  className="text-bgDarkColor hover:text-textColor hover:opacity-70  hover:underline underline-offset-2"
                >
                  Excellent location - show map
                </Link>
              </p>
            </div>
          </div>
          <div>
            <div className="flex flex-col gap-6 py-4">
              <div>
                <button
                 onClick={() => router.push("/HotelCards/Rooms/RoomDetails/PaymentProcess")}
                 className=" bg-bgDarkColor hover:bg-buttonColor text-bgColor py-2 px-5 rounded-lg">
                  Reservation
                </button>
              </div>
              <div className="text-3xl flex justify-evenly">
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="none"
                      stroke="#857749"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4.318 6.318a4.5 4.5 0 0 0 0 6.364L12 20.364l7.682-7.682a4.5 4.5 0 0 0-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 0 0-6.364 0"
                    ></path>
                  </svg>
                </div>
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill="#857749"
                      d="M15 8a3 3 0 1 0-2.977-2.63l-4.94 2.47a3 3 0 1 0 0 4.319l4.94 2.47a3 3 0 1 0 .895-1.789l-4.94-2.47a3 3 0 0 0 0-.74l4.94-2.47C13.456 7.68 14.19 8 15 8"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-12/12 flex justify-between gap-4">
          <div className="w-9/12">
            <div className="grid grid-cols-5 gap-3 py-4">
              {/* <!-- Large Image on the Left --> */}
              <div className="col-span-3 row-span-2">
                <img
                  src="/image/HotelImage3.jpg"
                  alt="Main View"
                  className="w-full h-full object-cover rounded-lg shadow-lg"
                />
              </div>

              {/* <!-- Smaller Images on the Right --> */}
              <div className="col-span-2">
                <img
                  src="/image/HotelImage5.jpg"
                  alt="Top Right Large1"
                  className="w-full h-full object-cover rounded-lg shadow-lg"
                />
              </div>
              <div className="col-span-2">
                <img
                  src="/image/HotelImage6.jpg"
                  alt="Top Right Large2"
                  className="w-full h-full object-cover rounded-lg shadow-lg"
                />
              </div>
              <div className="col-span-1">
                <img
                  src="/image/HotelImage7.jpg"
                  alt="small Image Bottom"
                  className="w-full h-full object-cover rounded-lg shadow-lg"
                />
              </div>
              <div className="col-span-1">
                <img
                  src="/image/HotelImage8.jpg"
                  alt="small Image Bottom"
                  className="w-full h-full object-cover rounded-lg shadow-lg"
                />
              </div>
              <div className="col-span-1">
                <img
                  src="/image/HotelImage3.jpg"
                  alt="small Image Bottom"
                  className="w-full h-full object-cover rounded-lg shadow-lg"
                />
              </div>
              <div className="col-span-1">
                <img
                  src="/image/HotelImage10.jpg"
                  alt="small Image Bottom"
                  className="w-full h-full object-cover rounded-lg shadow-lg"
                />
              </div>
              <div className="col-span-1">
                <img
                  src="/image/HotelImage12.jpg"
                  alt="small Image Bottom"
                  className="w-full h-full object-cover rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
          <div className="w-3/12 h-full flex flex-col justify-center gap-4 pt-4">
            <div className="flex flex-col gap-6 border border-gray-350 rounded-lg p-6 shadow-lg bg-bgtextColor">
              <div className="flex justify-center items-center border-b border-gray-300 pb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  Most Popular Facilities
                </h3>
              </div>

              <div className="text-center">
                <h3 className=" text-gray-700">Guests Who Stayed Here Loved</h3>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <p className="text-gray-600 italic">
                  "The two receptionists were friendly and helpful at all times.
                  The hotel manager is, indeed, lucky to have them both in the
                  hotel's service. We..."
                </p>
              </div>
              <div className="text-lg font-semibold text-center text-green-600">
                Excellent Location!
              </div>
            </div>
            <div className="h-40 flex flex-col">
              <div className="flex justify-center items-center">
                <div>
                  {
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d62565.16404994723!2d104.90470142800619!3d11.456613727772911!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3109599384325cdd%3A0xe25c308bc6822c0a!2sKrong%20Ta%20Khmau!5e0!3m2!1sen!2skh!4v1738388659069!5m2!1sen!2skh"
                      style={{ border: 0, width: "100%" }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-12/12 flex justify-between border-b border-gray-300">
          <div className="w-8/12">
            <div className="flex flex-col gap-4 p-4">
              <div>
                <div className="mb-4 text-sm">
                  <p>
                    You might be eligible for a Genius discount at X One Hotel.
                    To check if a Genius discount is available for your selected
                    dates
                    <span className="text-bgDarkColor hover:text-textColor hover:opacity-70  hover:underline underline-offset-2">
                      <Link href="#"> sign in</Link>
                    </span>
                    .
                  </p>
                </div>
                <p className="mb-4 text-sm">
                  Genius discounts at this property are subject to book dates,
                  stay dates and other available deals.
                </p>
                <p className="mb-4 text-sm">
                  <span className="font-bold text-[#008234]">
                    Reliable info:
                  </span>{" "}
                  Guests say the description and photos for this property are
                  very accurate.
                </p>
                <p className="mb-4 text-sm">
                  Well situated in Phnom Penh, X One Hotel offers
                  air-conditioned rooms with free WiFi, free private parking and
                  room service. Featuring a 24-hour front desk, this property
                  also welcomes guests with a restaurant and a terrace. The
                  accommodation provides airport transfers, while a car rental
                  service is also available. The units at the hotel come with a
                  seating area, a flat-screen TV and a safety deposit box. With
                  a private bathroom equipped with a shower and free toiletries,
                  certain units at X One Hotel also have a city view. All guest
                  rooms will provide guests with a desk and a kettle. Guests at
                  the accommodation can enjoy an à la carte or an Asian
                  breakfast. Popular points of interest near X One Hotel include
                  Riverside Park, Wat Phnom and Sisowath Quay. Phnom Penh
                  International Airport is 9 km away.
                </p>
                <p className="mb-4 text-sm">
                  Couples particularly like the location — they rated it 9.6 for
                  a two-person trip.
                </p>
              </div>
            </div>
            <div>
              <div className=" max-w-4xl p-6">
                <h2 className="text-lg font-semibold mb-4">
                  Most popular facilities
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-4 text-green-600">
                  {/* <!-- Facility 1 --> */}
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">
                      <HiWifi />
                    </span>
                    <span className="text-sm font-medium">Free WiFi</span>
                  </div>
                  {/* <!-- Facility 2 --> */}
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">
                      <MdOutlineAirportShuttle />
                    </span>
                    <span className="text-sm font-medium">Airport shuttle</span>
                  </div>
                  {/* <!-- Facility 3 --> */}
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">
                      <MdFamilyRestroom />
                    </span>
                    <span className="text-sm font-medium">Family rooms</span>
                  </div>
                  {/* <!-- Facility 4 --> */}
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">
                      <TbSmokingNo />
                    </span>
                    <span className="text-sm font-medium">
                      Non-smoking rooms
                    </span>
                  </div>
                  {/* <!-- Facility 5 --> */}
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">
                      <PiFlowerLotusBold />
                    </span>
                    <span className="text-sm font-medium">
                      Spa and wellness centre
                    </span>
                  </div>
                  {/* <!-- Facility 6 --> */}
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">
                      <IoIosRestaurant />
                    </span>
                    <span className="text-sm font-medium">2 restaurants</span>
                  </div>
                  {/* <!-- Facility 7 --> */}
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">
                      <LuSquareParking />
                    </span>
                    <span className="text-sm font-medium">Free parking</span>
                  </div>
                  {/* <!-- Facility 8 --> */}
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">
                      <MdOutlineRoomService />
                    </span>
                    <span className="text-sm font-medium">Room service</span>
                  </div>
                  {/* <!-- Facility 9 --> */}
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">
                      <MdOutlineCoffeeMaker />
                    </span>
                    <span className="text-sm font-medium">
                      Tea/coffee maker in all rooms
                    </span>
                  </div>
                  {/* <!-- Facility 10 --> */}
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">
                      <MdOutlineFreeBreakfast />
                    </span>
                    <span className="text-sm font-medium">Breakfast</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className=" w-4/12 max-w-sm mx-auto p-4 ">
            <div className=" max-w-sm mx-auto p-4 bg-bgtextColor rounded-lg shadow-lg">
              <h2 className="text-lg font-semibold mb-4">
                Property highlights
              </h2>
              <div className="mb-4">
                <p className="flex items-start gap-2 text-sm">
                  <span className="text-xl text-blue-500">&#128205;</span>
                  Situated in the real heart of Phnom Penh, this hotel has an
                  excellent location score of 9.2
                </p>
              </div>
              <div className="mb-4">
                <h3 className="font-semibold text-base">Breakfast info</h3>
                <p>Asian</p>
              </div>
              <div className="mb-4 flex items-center gap-2 text-sm">
                <span className="text-2xl text-gray-600">&#127359;</span>
                <p>Free private parking available at the hotel</p>
              </div>
              <button className="w-full py-2 bg-bgDarkColor hover:bg-buttonColor text-white font-semibold rounded-lg">
                Reserve
              </button>
            </div>
          </div>
        </div>
        <div className=" mt-4 flex justify-between gap-4 py-4 border-2 rounded-xl p-4 bg-white">
          <div className="flex flex-col justify-evenly">
            <h2 className="text-2xl font-bold ">Sign in, save money</h2>
            <p>To see if you can save 10% or more at this property, sign in</p>
            <div className="flex items-center gap-6">
              <button className="border border-bgDarkColor py-1 px-3 rounded-md text-textColor hover:bg-bgNavColor  transition-colors duration-300">
                Sign in
              </button>
              <Link
                href="#"
                className="text-bgDarkColor hover:text-textColor hover:opacity-70  hover:underline underline-offset-2"
              >
                Create an accout
              </Link>
            </div>
          </div>
          <div>
            <img
              src="/image/savingGift.jpg"
              alt="gift"
              className="w-40 h-full object-cover"
            />
          </div>
        </div>
        <div id="#info-prices" className="mt-4 flex flex-col justify-center">
          <h2 className="text-3xl font-bold py-4">Availability</h2>
          <div className="flex max-w-[857px] gap-2 bg-amber-400  rounded-lg p-1 items-center">
            <DateRangePicker
              startDate={startDate}
              endDate={endDate}
              setStartDate={setStartDate}
              setEndDate={setEndDate}
            />
            <GuestRoomSelector
              guests={guests}
              setGuests={setGuests}
              rooms={rooms}
              setRooms={setRooms}
            />
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700">
              Search
            </button>
          </div>
        </div>
        <div className="mt-8 flex flex-col justify-center bg-[#9a8958]">
          <div className="overflow-x-auto">
            <table className="min-w-[900px] w-full border-separate border-spacing-1 border-[#7C6A46]">
              <thead>
                <tr className="bg-[#7C6A46] text-white text-left">
                  <th className="p-4 rounded-tl-sm rounded-bl-sm">Room type</th>
                  <th className="p-4">Number of guests</th>
                  <th className="p-4">Today's price</th>
                  <th className="p-4">Your choices</th>
                  <th className="p-4 rounded-tr-sm">Select rooms</th>
                </tr>
              </thead>
              <tbody>
                {/* Standard Queen */}
                <tr className="bg-white border-2 border-[#7C6A46] rounded-xl shadow-md">
                  <td className="p-4 align-top w-1/4 border-[#7C6A46] rounded-l-xl">
                    <div className="font-bold text-[#7C6A46] text-lg mb-1">
                      Standard Queen
                    </div>
                    <div className="flex items-center gap-2 text-gray-700 mb-1">
                      <span>1 large double bed</span>
                      <span className="text-xl">🛏️</span>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-2">
                      <span>24 m²</span>
                      <span>City view</span>
                      <span>Rooftop pool</span>
                      <span>Air conditioning</span>
                      <span>Private bathroom</span>
                      <span>Flat-screen TV</span>
                      <span>Minibar</span>
                      <span>Free WiFi</span>
                    </div>
                    <div className="text-red-600 font-semibold text-sm mt-2">
                      Only 2 rooms left on our site
                    </div>
                  </td>
                  <td className="p-4 align-top w-1/12">
                    <div className="flex items-center gap-1 text-lg">
                      <span>2</span>
                      <span className="text-xl">👤👤</span>
                    </div>
                  </td>
                  <td className="p-4 align-top w-1/6">
                    <div className="text-gray-400 line-through text-sm">
                      KHR 615,223
                    </div>
                    <div className="text-[#7C6A46] font-bold text-xl">
                      KHR 159,970
                    </div>
                    <div className="text-xs text-gray-500">
                      Includes taxes and charges
                    </div>
                    <div className="bg-[#F8F6F2] text-[#7C6A46] px-2 py-1 rounded text-xs font-semibold mt-2 w-fit border border-[#7C6A46]">
                      74% off
                    </div>
                    <div className="bg-[#7C6A46] text-white px-2 py-1 rounded text-xs font-semibold mt-1 w-fit">
                      Getaway Deal
                    </div>
                  </td>
                  <td className="p-4 align-top w-1/4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[#7C6A46] font-bold">✔</span>
                      <span className="font-semibold">Very good breakfast</span>
                      <span className="text-gray-500 text-xs">KHR 28,065</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#7C6A46] text-sm mb-1">
                      <span>✔</span>
                      <span>Free cancellation before 8 May 2025</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#7C6A46] text-sm mb-1">
                      <span>✔</span>
                      <span>No prepayment needed</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Total cost to cancel
                    </div>
                    <div className="text-xs text-[#1A237E] font-semibold">
                      Genius discount may be available
                    </div>
                  </td>
                  <td className="p-4 align-top w-1/12">
                    <select className="border border-[#7C6A46] rounded px-2 py-1">
                      <option>0</option>
                      <option>1</option>
                      <option>2</option>
                    </select>
                  </td>
                </tr>

                {/* Deluxe Twin */}
                <tr className="bg-white border-2 border-[#7C6A46] rounded-xl shadow-md">
                  <td className="p-4 align-top w-1/4 border-[#7C6A46] rounded-l-xl">
                    <div className="font-bold text-[#7C6A46] text-lg mb-1">
                      Deluxe Twin
                    </div>
                    <div className="flex items-center gap-2 text-gray-700 mb-1">
                      <span>2 single beds</span>
                      <span className="text-xl">🛏️🛏️</span>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-2">
                      <span>28 m²</span>
                      <span>Garden view</span>
                      <span>Balcony</span>
                      <span>Air conditioning</span>
                      <span>Private bathroom</span>
                      <span>Flat-screen TV</span>
                      <span>Free WiFi</span>
                    </div>
                    <div className="text-green-600 font-semibold text-sm mt-2">
                      Best seller
                    </div>
                  </td>
                  <td className="p-4 align-top w-1/12">
                    <div className="flex items-center gap-1 text-lg">
                      <span>2</span>
                      <span className="text-xl">👤👤</span>
                    </div>
                  </td>
                  <td className="p-4 align-top w-1/6">
                    <div className="text-gray-400 line-through text-sm">
                      KHR 500,000
                    </div>
                    <div className="text-[#7C6A46] font-bold text-xl">
                      KHR 320,000
                    </div>
                    <div className="text-xs text-gray-500">
                      Includes taxes and charges
                    </div>
                    <div className="bg-[#F8F6F2] text-[#7C6A46] px-2 py-1 rounded text-xs font-semibold mt-2 w-fit border border-[#7C6A46]">
                      36% off
                    </div>
                  </td>
                  <td className="p-4 align-top w-1/4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[#7C6A46] font-bold">✔</span>
                      <span className="font-semibold">Breakfast included</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#7C6A46] text-sm mb-1">
                      <span>✔</span>
                      <span>Free cancellation before 10 May 2025</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Pay at the property
                    </div>
                  </td>
                  <td className="p-4 align-top w-1/12">
                    <select className="border border-[#7C6A46] rounded px-2 py-1">
                      <option>0</option>
                      <option>1</option>
                      <option>2</option>
                    </select>
                  </td>
                </tr>

                {/* Family Suite */}
                <tr className="bg-white border-2 border-[#7C6A46] rounded-xl shadow-md">
                  <td className="p-4 align-top w-1/4 border-[#7C6A46] rounded-l-xl">
                    <div className="font-bold text-[#7C6A46] text-lg mb-1">
                      Family Suite
                    </div>
                    <div className="flex items-center gap-2 text-gray-700 mb-1">
                      <span>2 double beds & 1 sofa bed</span>
                      <span className="text-xl">🛏️🛏️🛋️</span>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-2">
                      <span>45 m²</span>
                      <span>Sea view</span>
                      <span>Balcony</span>
                      <span>Kitchenette</span>
                      <span>Private bathroom</span>
                      <span>Flat-screen TV</span>
                      <span>Minibar</span>
                      <span>Free WiFi</span>
                    </div>
                    <div className="text-[#1A237E] font-semibold text-sm mt-2">
                      Perfect for families
                    </div>
                  </td>
                  <td className="p-4 align-top w-1/12">
                    <div className="flex items-center gap-1 text-lg">
                      <span>5</span>
                      <span className="text-xl">👤👤👤👤👤</span>
                    </div>
                  </td>
                  <td className="p-4 align-top w-1/6">
                    <div className="text-gray-400 line-through text-sm">
                      KHR 1,200,000
                    </div>
                    <div className="text-[#7C6A46] font-bold text-xl">
                      KHR 950,000
                    </div>
                    <div className="text-xs text-gray-500">
                      Includes taxes and charges
                    </div>
                    <div className="bg-[#7C6A46] text-white px-2 py-1 rounded text-xs font-semibold mt-1 w-fit">
                      Family Deal
                    </div>
                  </td>
                  <td className="p-4 align-top w-1/4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[#7C6A46] font-bold">✔</span>
                      <span className="font-semibold">Breakfast included</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#7C6A46] text-sm mb-1">
                      <span>✔</span>
                      <span>Free cancellation before 12 May 2025</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#7C6A46] text-sm mb-1">
                      <span>✔</span>
                      <span>No prepayment needed</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Pay at the property
                    </div>
                  </td>
                  <td className="p-4 align-top w-1/12">
                    <select className="border border-[#7C6A46] rounded px-2 py-1">
                      <option>0</option>
                      <option>1</option>
                      <option>2</option>
                    </select>
                  </td>
                </tr>

                {/* Executive Suite */}
                <tr className="bg-white border-2 border-[#7C6A46] rounded-xl shadow-md">
                  <td className="p-4 align-top w-1/4 border-[#7C6A46] rounded-l-xl">
                    <div className="font-bold text-[#7C6A46] text-lg mb-1">
                      Executive Suite
                    </div>
                    <div className="flex items-center gap-2 text-gray-700 mb-1">
                      <span>1 king bed</span>
                      <span className="text-xl">🛏️</span>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-2">
                      <span>60 m²</span>
                      <span>City & river view</span>
                      <span>Private balcony</span>
                      <span>Jacuzzi</span>
                      <span>Private bathroom</span>
                      <span>Flat-screen TV</span>
                      <span>Minibar</span>
                      <span>Free WiFi</span>
                    </div>
                    <div className="text-[#7C6A46] font-semibold text-sm mt-2">
                      Exclusive offer
                    </div>
                  </td>
                  <td className="p-4 align-top w-1/12">
                    <div className="flex items-center gap-1 text-lg">
                      <span>2</span>
                      <span className="text-xl">👤👤</span>
                    </div>
                  </td>
                  <td className="p-4 align-top w-1/6">
                    <div className="text-gray-400 line-through text-sm">
                      KHR 2,000,000
                    </div>
                    <div className="text-[#7C6A46] font-bold text-xl">
                      KHR 1,500,000
                    </div>
                    <div className="text-xs text-gray-500">
                      Includes taxes and charges
                    </div>
                    <div className="bg-[#7C6A46] text-white px-2 py-1 rounded text-xs font-semibold mt-1 w-fit">
                      25% off
                    </div>
                  </td>
                  <td className="p-4 align-top w-1/4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[#7C6A46] font-bold">✔</span>
                      <span className="font-semibold">Breakfast included</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#7C6A46] text-sm mb-1">
                      <span>✔</span>
                      <span>Free cancellation before 15 May 2025</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Pay at the property
                    </div>
                  </td>
                  <td className="p-4 align-top w-1/12">
                    <select className="border border-[#7C6A46] rounded px-2 py-1">
                      <option>0</option>
                      <option>1</option>
                      <option>2</option>
                    </select>
                  </td>
                </tr>

                {/* Luxury Suite */}
                <tr className="bg-white border-2 border-[#7C6A46] rounded-xl shadow-md">
                  <td className="p-4 align-top w-1/4 border-[#7C6A46] rounded-l-xl">
                    <div className="font-bold text-[#7C6A46] text-lg mb-1">
                      Luxury Suite
                    </div>
                    <div className="flex items-center gap-2 text-gray-700 mb-1">
                      <span>1 king bed & 1 sofa bed</span>
                      <span className="text-xl">🛏️🛋️</span>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-2">
                      <span>75 m²</span>
                      <span>Panoramic view</span>
                      <span>Private terrace</span>
                      <span>Walk-in closet</span>
                      <span>Rain shower</span>
                      <span>Smart TV</span>
                      <span>Mini bar</span>
                      <span>Free WiFi</span>
                    </div>
                    <div className="text-[#7C6A46] font-semibold text-sm mt-2">
                      Premium experience
                    </div>
                  </td>
                  <td className="p-4 align-top w-1/12">
                    <div className="flex items-center gap-1 text-lg">
                      <span>3</span>
                      <span className="text-xl">👤👤👤</span>
                    </div>
                  </td>
                  <td className="p-4 align-top w-1/6">
                    <div className="text-gray-400 line-through text-sm">
                      KHR 2,500,000
                    </div>
                    <div className="text-[#7C6A46] font-bold text-xl">
                      KHR 1,800,000
                    </div>
                    <div className="text-xs text-gray-500">
                      Includes taxes and charges
                    </div>
                    <div className="bg-[#7C6A46] text-white px-2 py-1 rounded text-xs font-semibold mt-1 w-fit">
                      28% off
                    </div>
                  </td>
                  <td className="p-4 align-top w-1/4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[#7C6A46] font-bold">✔</span>
                      <span className="font-semibold">
                        Premium breakfast included
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[#7C6A46] text-sm mb-1">
                      <span>✔</span>
                      <span>Free cancellation before 20 May 2025</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#7C6A46] text-sm mb-1">
                      <span>✔</span>
                      <span>Complimentary airport transfer</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Pay at the property
                    </div>
                  </td>
                  <td className="p-4 align-top w-1/12">
                    <select className="border border-[#7C6A46] rounded px-2 py-1">
                      <option>0</option>
                      <option>1</option>
                      <option>2</option>
                    </select>
                  </td>
                </tr>

                {/* Presidential Suite */}
                <tr className="bg-white border-2 border-[#7C6A46] rounded-xl shadow-md">
                  <td className="p-4 align-top w-1/4 border-[#7C6A46] rounded-l-xl">
                    <div className="font-bold text-[#7C6A46] text-lg mb-1">
                      Presidential Suite
                    </div>
                    <div className="flex items-center gap-2 text-gray-700 mb-1">
                      <span>1 king bed & 2 sofa beds</span>
                      <span className="text-xl">🛏️🛋️🛋️</span>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-2">
                      <span>120 m²</span>
                      <span>360° city view</span>
                      <span>Private pool</span>
                      <span>Butler service</span>
                      <span>Private elevator</span>
                      <span>Home theater</span>
                      <span>Full bar</span>
                      <span>Free WiFi</span>
                    </div>
                    <div className="text-[#7C6A46] font-semibold text-sm mt-2">
                      Ultimate luxury
                    </div>
                  </td>
                  <td className="p-4 align-top w-1/12">
                    <div className="flex items-center gap-1 text-lg">
                      <span>4</span>
                      <span className="text-xl">👤👤👤👤</span>
                    </div>
                  </td>
                  <td className="p-4 align-top w-1/6">
                    <div className="text-gray-400 line-through text-sm">
                      KHR 4,000,000
                    </div>
                    <div className="text-[#7C6A46] font-bold text-xl">
                      KHR 3,200,000
                    </div>
                    <div className="text-xs text-gray-500">
                      Includes taxes and charges
                    </div>
                    <div className="bg-[#7C6A46] text-white px-2 py-1 rounded text-xs font-semibold mt-1 w-fit">
                      20% off
                    </div>
                  </td>
                  <td className="p-4 align-top w-1/4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[#7C6A46] font-bold">✔</span>
                      <span className="font-semibold">
                        All-inclusive package
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[#7C6A46] text-sm mb-1">
                      <span>✔</span>
                      <span>Free cancellation before 25 May 2025</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#7C6A46] text-sm mb-1">
                      <span>✔</span>
                      <span>Private chef available</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Pay at the property
                    </div>
                  </td>
                  <td className="p-4 align-top w-1/12">
                    <select className="border border-[#7C6A46] rounded px-2 py-1">
                      <option>0</option>
                      <option>1</option>
                      <option>2</option>
                    </select>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        {/* Hotel Surroundings Section */}
        <div className="bg-white mt-8 py-6 border-b border-t">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold mb-1">Hotel surroundings</h2>
              <div className="flex flex-wrap gap-4 items-center mt-5 text-sm">
                <span className="text-blue-700 bg-blue-50 px-2 py-1 rounded">
                  Guests loved walking around the neighbourhood!
                </span>
                <span className="text-blue-700 hover:underline cursor-pointer">
                  Excellent location - show map
                </span>
              </div>
            </div>
            <button className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow">
              See availability
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 text-sm">
            {/* What's nearby */}
            <div>
              <div className="font-semibold mb-2 flex items-center gap-2">
                <span>🏞️</span>What's nearby
              </div>
              <ul className="space-y-4">
                <li>
                  Riverside Park{" "}
                  <span className="float-right text-gray-500">600 m</span>
                </li>
                <li>
                  Vattanac Capital{" "}
                  <span className="float-right text-gray-500">1.2 km</span>
                </li>
                <li>
                  National Museum of Cambodia{" "}
                  <span className="float-right text-gray-500">1.4 km</span>
                </li>
                <li>
                  Royal Palace Phnom Penh{" "}
                  <span className="float-right text-gray-500">1.5 km</span>
                </li>
                <li>
                  Wat Botomvatey Playground{" "}
                  <span className="float-right text-gray-500">2 km</span>
                </li>
                <li>
                  Royal Palace Park{" "}
                  <span className="float-right text-gray-500">2 km</span>
                </li>
                <li>
                  Wat Botum Park{" "}
                  <span className="float-right text-gray-500">2.1 km</span>
                </li>
                <li>
                  Wat Botum Park{" "}
                  <span className="float-right text-gray-500">2.2 km</span>
                </li>
                <li>
                  Krom Ngoy Statue{" "}
                  <span className="float-right text-gray-500">2.3 km</span>
                </li>
                <li>
                  Cambodian Independence Monument{" "}
                  <span className="float-right text-gray-500">2.7 km</span>
                </li>
              </ul>
            </div>
            {/* Restaurants & cafes */}
            <div>
              <div className="font-semibold mb-2 flex items-center gap-2">
                <span>🍽️</span>Restaurants & cafes
              </div>
              <ul className="space-y-4">
                <li>
                  Cafe/bar - Bar Oz Riverside Guesthouse{" "}
                  <span className="float-right text-gray-500">100 m</span>
                </li>
                <li>
                  Cafe/bar - Khouly Cafe{" "}
                  <span className="float-right text-gray-500">400 m</span>
                </li>
                <li>
                  Cafe/bar - Merf Cafe{" "}
                  <span className="float-right text-gray-500">400 m</span>
                </li>
              </ul>
            </div>
            {/* Public transport */}
            <div>
              <div className="font-semibold mb-2 flex items-center gap-2">
                <span>🚌</span>Public transport
              </div>
              <ul className="space-y-4">
                <li>
                  Bus · Sorya Bus Station{" "}
                  <span className="float-right text-gray-500">1.6 km</span>
                </li>
                <li>
                  Train · Cambodia Railway Station{" "}
                  <span className="float-right text-gray-500">1.5 km</span>
                </li>
                <li>
                  Bus · Mekong Express Bus Station{" "}
                  <span className="float-right text-gray-500">2.2 km</span>
                </li>
                <li>
                  Train · Airport{" "}
                  <span className="float-right text-gray-500">10 km</span>
                </li>
              </ul>
            </div>
            {/* Top attractions */}
            <div>
              <div className="font-semibold mb-2 flex items-center gap-2">
                <span>⭐</span>Top attractions
              </div>
              <ul className="space-y-4">
                <li>
                  Samdech Hun Sen Park{" "}
                  <span className="float-right text-gray-500">2.7 km</span>
                </li>
                <li>
                  Sontepheap Garden{" "}
                  <span className="float-right text-gray-500">2.8 km</span>
                </li>
                <li>
                  Preah Sihanouk Garden{" "}
                  <span className="float-right text-gray-500">2.8 km</span>
                </li>
                <li>
                  Phnom Penh Tower{" "}
                  <span className="float-right text-gray-500">2.8 km</span>
                </li>
                <li>
                  Statue of King Father Norodom Sihanouk{" "}
                  <span className="float-right text-gray-500">2.9 km</span>
                </li>
                <li>
                  Moha Montrei Pagoda{" "}
                  <span className="float-right text-gray-500">3.6 km</span>
                </li>
                <li>
                  Tuol Sleng Genocide Museum{" "}
                  <span className="float-right text-gray-500">4.2 km</span>
                </li>
                <li>
                  Sovanna Phum Art Association & Art Gallery{" "}
                  <span className="float-right text-gray-500">6 km</span>
                </li>
                <li>
                  Killing Fields of Choeung Ek{" "}
                  <span className="float-right text-gray-500">13 km</span>
                </li>
              </ul>
            </div>
            {/* Closest airports */}
            <div>
              <div className="font-semibold mb-2 flex items-center gap-2">
                <span>✈️</span>Closest airports
              </div>
              <ul className="space-y-4">
                <li>
                  Phnom Penh International Airport{" "}
                  <span className="float-right text-gray-500">9 km</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:justify-between items-center mt-6 text-xs text-gray-500 gap-2">
            <span>
              Shortest estimated walking or driving distances displayed; actual
              distances may vary.
            </span>
            <span>
              Missing some information?{" "}
              <a href="#" className="text-blue-700 hover:underline">
                Yes
              </a>{" "}
              /{" "}
              <a href="#" className="text-blue-700 hover:underline">
                No
              </a>
            </span>
          </div>
        </div>
        <div>
          {/* Facilities Section */}
          <div className="mt-8 border-b">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <div id="facilities">
                <h2 className="text-2xl font-bold mb-1">
                  Facilities of M9 Kirirorm Hotel
                </h2>
                <div className="text-gray-600 mb-2">
                  Great facilities! Review score, 8.4
                </div>
              </div>
              <button className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow">
                See availability
              </button>
            </div>
            <div className=" max-w-4xl px-6 pb-6">
              <h2 className="text-lg font-semibold mb-4">
                Most popular facilities
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-4 text-green-600">
                {/* <!-- Facility 1 --> */}
                <div className="flex items-center gap-2">
                  <span className="text-2xl">
                    <HiWifi />
                  </span>
                  <span className="text-sm font-medium">Free WiFi</span>
                </div>
                {/* <!-- Facility 2 --> */}
                <div className="flex items-center gap-2">
                  <span className="text-2xl">
                    <MdOutlineAirportShuttle />
                  </span>
                  <span className="text-sm font-medium">Airport shuttle</span>
                </div>
                {/* <!-- Facility 3 --> */}
                <div className="flex items-center gap-2">
                  <span className="text-2xl">
                    <MdFamilyRestroom />
                  </span>
                  <span className="text-sm font-medium">Family rooms</span>
                </div>
                {/* <!-- Facility 4 --> */}
                <div className="flex items-center gap-2">
                  <span className="text-2xl">
                    <TbSmokingNo />
                  </span>
                  <span className="text-sm font-medium">Non-smoking rooms</span>
                </div>
                {/* <!-- Facility 5 --> */}
                <div className="flex items-center gap-2">
                  <span className="text-2xl">
                    <PiFlowerLotusBold />
                  </span>
                  <span className="text-sm font-medium">
                    Spa and wellness centre
                  </span>
                </div>
                {/* <!-- Facility 6 --> */}
                <div className="flex items-center gap-2">
                  <span className="text-2xl">
                    <IoIosRestaurant />
                  </span>
                  <span className="text-sm font-medium">2 restaurants</span>
                </div>
                {/* <!-- Facility 7 --> */}
                <div className="flex items-center gap-2">
                  <span className="text-2xl">
                    <LuSquareParking />
                  </span>
                  <span className="text-sm font-medium">Free parking</span>
                </div>
                {/* <!-- Facility 8 --> */}
                <div className="flex items-center gap-2">
                  <span className="text-2xl">
                    <MdOutlineRoomService />
                  </span>
                  <span className="text-sm font-medium">Room service</span>
                </div>
                {/* <!-- Facility 9 --> */}
                <div className="flex items-center gap-2">
                  <span className="text-2xl">
                    <MdOutlineCoffeeMaker />
                  </span>
                  <span className="text-sm font-medium">
                    Tea/coffee maker in all rooms
                  </span>
                </div>
                {/* <!-- Facility 10 --> */}
                <div className="flex items-center gap-2">
                  <span className="text-2xl">
                    <MdOutlineFreeBreakfast />
                  </span>
                  <span className="text-sm font-medium">Breakfast</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-sm">
              {/* Bathroom */}
              <div>
                <div className="font-semibold mb-4">Bathroom</div>
                <ul className="space-y-4 text-gray-700">
                  <li>Toilet paper</li>
                  <li>Towels</li>
                  <li>Towels/sheets (extra fee)</li>
                  <li>Additional toilet</li>
                  <li>Slippers</li>
                  <li>Private bathroom</li>
                  <li>Toilet</li>
                  <li>Free toiletries</li>
                  <li>Bathrobe</li>
                  <li>Hairdryer</li>
                  <li>Shower</li>
                </ul>
              </div>
              {/* Bedroom, View, Outdoors, Kitchen, Room Amenities */}
              <div>
                <div className="font-semibold mb-4">Bedroom</div>
                <ul className="space-y-4 text-gray-700">
                  <li>Linen</li>
                  <li>Wardrobe or closet</li>
                </ul>
                <div className="font-semibold mt-4 mb-4">View</div>
                <ul className="space-y-4 text-gray-700">
                  <li>View</li>
                </ul>
                <div className="font-semibold mt-4 mb-4">Outdoors</div>
                <ul className="space-y-4 text-gray-700">
                  <li>Outdoor dining area</li>
                  <li>Outdoor furniture</li>
                  <li>Terrace</li>
                  <li>Balcony</li>
                </ul>
                <div className="font-semibold mt-4 mb-4">Kitchen</div>
                <ul className="space-y-4 text-gray-700">
                  <li>Dining table</li>
                  <li>Tumble dryer</li>
                  <li>Electric kettle</li>
                  <li>Refrigerator</li>
                </ul>
                <div className="font-semibold mt-4 mb-4">Room Amenities</div>
                <ul className="space-y-4 text-gray-700">
                  <li>Socket near the bed</li>
                  <li>Clothes rack</li>
                </ul>
              </div>
              {/* Activities, Living Area, Media & Technology, Food & Drink, Internet, Parking, Reception services */}
              <div>
                <div className="font-semibold mb-4">Activities</div>
                <ul className="space-y-4 text-gray-700">
                  <li>
                    Tour or class about local culture{" "}
                    <span className="ml-1 text-xs bg-gray-100 px-2 py-0.5 rounded">
                      Additional charge
                    </span>
                  </li>
                  <li>
                    Happy hour{" "}
                    <span className="ml-1 text-xs bg-gray-100 px-2 py-0.5 rounded">
                      Additional charge
                    </span>
                  </li>
                  <li>
                    Bike tours{" "}
                    <span className="ml-1 text-xs bg-gray-100 px-2 py-0.5 rounded">
                      Additional charge
                    </span>
                  </li>
                  <li>Walking tours</li>
                </ul>
                <div className="font-semibold mt-4 mb-4">Living Area</div>
                <ul className="space-y-4 text-gray-700">
                  <li>Dining area</li>
                  <li>Seating Area</li>
                  <li>Desk</li>
                </ul>
                <div className="font-semibold mt-4 mb-4">
                  Media & Technology
                </div>
                <ul className="space-y-4 text-gray-700">
                  <li>Flat-screen TV</li>
                  <li>TV</li>
                </ul>
                <div className="font-semibold mt-4 mb-4">Food & Drink</div>
                <ul className="space-y-4 text-gray-700">
                  <li>Coffee house on site</li>
                  <li>
                    Wine/champagne{" "}
                    <span className="ml-1 text-xs bg-gray-100 px-2 py-0.5 rounded">
                      Additional charge
                    </span>
                  </li>
                  <li>Restaurant</li>
                  <li>Tea/Coffee maker</li>
                </ul>
                <div className="font-semibold mt-4 mb-4">Internet</div>
                <ul className="space-y-4 text-gray-700">
                  <li>WiFi is available in the rooms and is free of charge.</li>
                </ul>
                <div className="font-semibold mt-4 mb-4">Parking</div>
                <ul className="space-y-4 text-gray-700">
                  <li>
                    Free public parking is possible on site (reservation is not
                    needed).
                  </li>
                </ul>
                <div className="font-semibold mt-4 mb-4">
                  Reception services
                </div>
                <ul className="space-y-4 text-gray-700">
                  <li>Invoice provided</li>
                  <li>Concierge service</li>
                  <li>Luggage storage</li>
                  <li>Tour desk</li>
                  <li>24-hour front desk</li>
                </ul>
              </div>
              {/* Cleaning, Safety, General, Accessibility, Languages spoken */}
              <div>
                <div className="font-semibold mb-4">Cleaning services</div>
                <ul className="space-y-4 text-gray-700">
                  <li>Daily housekeeping</li>
                  <li>
                    Trouser press{" "}
                    <span className="ml-1 text-xs bg-gray-100 px-2 py-0.5 rounded">
                      Additional charge
                    </span>
                  </li>
                  <li>
                    Ironing service{" "}
                    <span className="ml-1 text-xs bg-gray-100 px-2 py-0.5 rounded">
                      Additional charge
                    </span>
                  </li>
                  <li>
                    Dry cleaning{" "}
                    <span className="ml-1 text-xs bg-gray-100 px-2 py-0.5 rounded">
                      Additional charge
                    </span>
                  </li>
                  <li>
                    Laundry{" "}
                    <span className="ml-1 text-xs bg-gray-100 px-2 py-0.5 rounded">
                      Additional charge
                    </span>
                  </li>
                </ul>
                <div className="font-semibold mt-4 mb-4">Safety & security</div>
                <ul className="space-y-4 text-gray-700">
                  <li>Fire extinguishers</li>
                  <li>CCTV outside property</li>
                  <li>CCTV in common areas</li>
                  <li>Smoke alarms</li>
                  <li>Security alarm</li>
                  <li>Key card access</li>
                  <li>Key access</li>
                  <li>24-hour security</li>
                  <li>Safety deposit box</li>
                </ul>
                <div className="font-semibold mt-4 mb-4">General</div>
                <ul className="space-y-4 text-gray-700">
                  <li>Minimarket on site</li>
                  <li>Designated smoking area</li>
                  <li>Air conditioning</li>
                  <li>Tile/marble floor</li>
                  <li>Car hire</li>
                  <li>Soundproof rooms</li>
                  <li>Lift</li>
                  <li>Family rooms</li>
                  <li>
                    Airport shuttle{" "}
                    <span className="ml-1 text-xs bg-gray-100 px-2 py-0.5 rounded">
                      Additional charge
                    </span>
                  </li>
                  <li>Non-smoking rooms</li>
                  <li>Room service</li>
                </ul>
                <div className="font-semibold mt-4 mb-4">Accessibility</div>
                <ul className="space-y-4 text-gray-700">
                  <li>Entire unit wheelchair accessible</li>
                </ul>
                <div className="font-semibold mt-4 mb-4">Languages spoken</div>
                <ul className="space-y-4 text-gray-700">
                  <li>English</li>
                  <li>Khmer</li>
                  <li>Chinese</li>
                </ul>
              </div>
            </div>
            <div className="flex flex-col md:flex-row md:justify-between items-center mt-6 text-xs text-gray-500 gap-2">
              <span></span>
              <span>
                Missing some information?{" "}
                <a href="#" className="text-blue-700 hover:underline">
                  Yes
                </a>{" "}
                /{" "}
                <a href="#" className="text-blue-700 hover:underline">
                  No
                </a>
              </span>
            </div>
          </div>
        </div>
        {/* House Rules Section */}
        <div id="house-rules" className="bg-white mt-8 p-6 border">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold mb-1">House rules</h2>
              <div className="text-gray-600 mb-2">
                Phnom Penh 51 Hotel & Residences takes special requests - add in
                the next step!
              </div>
            </div>
            <button className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow">
              See availability
            </button>
          </div>
          <div className="divide-y divide-gray-200">
            {/* Check-in */}
            <div className="flex items-start gap-4 py-4">
              <span className="text-xl mt-1">⏩</span>
              <div>
                <div className="font-semibold">Check-in</div>
                <div className="text-gray-700">Available 24 hours</div>
              </div>
            </div>
            {/* Check-out */}
            <div className="flex items-start gap-4 py-4">
              <span className="text-xl mt-1">⏪</span>
              <div>
                <div className="font-semibold">Check-out</div>
                <div className="text-gray-700">Available 24 hours</div>
              </div>
            </div>
            {/* Cancellation/prepayment */}
            <div className="flex items-start gap-4 py-4">
              <span className="text-xl mt-1">❗</span>
              <div>
                <div className="font-semibold">Cancellation / prepayment</div>
                <div className="text-gray-700">
                  Cancellation and prepayment policies vary according to
                  accommodation type. Please check what{" "}
                  <a href="#" className="text-blue-700 underline">
                    conditions
                  </a>{" "}
                  may apply to each option when making your selection.
                </div>
              </div>
            </div>
            {/* Children and beds */}
            <div className="flex items-start gap-4 py-4">
              <span className="text-xl mt-1">👶</span>
              <div className="w-full">
                <div className="font-semibold">Children and beds</div>
                <div className="flex flex-col md:flex-row md:gap-8 mt-2">
                  <div className="w-full md:w-1/2">
                    <div className="font-semibold mb-1">Child policies</div>
                    <div className="text-gray-700 mb-2">
                      Children of any age are welcome.
                      <br />
                      Children 13 years and above will be charged as adults at
                      this property.
                      <br />
                      <br />
                      To see correct prices and occupancy information, please
                      add the number of children in your group and their ages to
                      your search.
                    </div>
                  </div>
                  <div className="w-full md:w-1/2">
                    <div className="font-semibold mb-1">
                      Cot and extra bed policies
                    </div>
                    <div className="border rounded-lg overflow-hidden">
                      {/* 0-6 years */}
                      <div className="flex items-center border-b p-2 bg-gray-50">
                        <span className="text-lg mr-2">🧒</span>
                        <span className="font-semibold">0 - 6 years</span>
                      </div>
                      <div className="flex flex-col md:flex-row border-b">
                        <div className="flex-1 flex items-center gap-2 p-2 border-r">
                          <span className="text-base">🛏️</span>
                          <span>Extra bed upon request</span>
                        </div>
                        <div className="flex-1 flex items-center gap-2 p-2">
                          <span className="text-gray-700">
                            US$10 per child, per night
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col md:flex-row">
                        <div className="flex-1 flex items-center gap-2 p-2 border-r">
                          <span className="text-base">🛏️</span>
                          <span>Cot upon request</span>
                        </div>
                        <div className="flex-1 flex items-center gap-2 p-2">
                          <span className="text-green-700 font-semibold">
                            Free
                          </span>
                        </div>
                      </div>
                      {/* 7-12 years */}
                      <div className="flex items-center border-b p-2 bg-gray-50">
                        <span className="text-lg mr-2">🧒</span>
                        <span className="font-semibold">7 - 12 years</span>
                      </div>
                      <div className="flex flex-col md:flex-row border-b">
                        <div className="flex-1 flex items-center gap-2 p-2 border-r">
                          <span className="text-base">🛏️</span>
                          <span>Extra bed upon request</span>
                        </div>
                        <div className="flex-1 flex items-center gap-2 p-2">
                          <span className="text-gray-700">
                            US$10 per child, per night
                          </span>
                        </div>
                      </div>
                      {/* 13+ years */}
                      <div className="flex items-center border-b p-2 bg-gray-50">
                        <span className="text-lg mr-2">🧑</span>
                        <span className="font-semibold">13+ years</span>
                      </div>
                      <div className="flex flex-col md:flex-row">
                        <div className="flex-1 flex items-center gap-2 p-2 border-r">
                          <span className="text-base">🛏️</span>
                          <span>Extra bed upon request</span>
                        </div>
                        <div className="flex-1 flex items-center gap-2 p-2">
                          <span className="text-gray-700">
                            US$20 per person, per night
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      Prices for cots and extra beds are not included in the
                      total price, and will have to be paid for separately
                      during your stay.
                      <br />
                      The number of extra beds and cots allowed is dependent on
                      the option you choose. Please check your selected option
                      for more information.
                      <br />
                      All cots and extra beds are subject to availability.
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* No age restriction */}
            <div className="flex items-start gap-4 py-4">
              <span className="text-xl mt-1">🚫</span>
              <div>
                <div className="font-semibold">No age restriction</div>
                <div className="text-gray-700">
                  There is no age requirement for check-in
                </div>
              </div>
            </div>
            {/* Pets */}
            <div className="flex items-start gap-4 py-4">
              <span className="text-xl mt-1">🐾</span>
              <div>
                <div className="font-semibold">Pets</div>
                <div className="text-gray-700">Pets are not allowed.</div>
              </div>
            </div>
            {/* Accepted payment methods */}
            <div className="flex items-start gap-4 py-4">
              <span className="text-xl mt-1">💳</span>
              <div>
                <div className="font-semibold">Accepted payment methods</div>
                <div className="flex gap-2 mt-2">
                  <span className="inline-block bg-gray-100 px-3 py-1 rounded text-xs font-semibold border">
                    VISA
                  </span>
                  <span className="inline-block bg-gray-100 px-3 py-1 rounded text-xs font-semibold border">
                    MasterCard
                  </span>
                  <span className="inline-block bg-gray-100 px-3 py-1 rounded text-xs font-semibold border">
                    UnionPay
                  </span>
                  <span className="inline-block bg-gray-100 px-3 py-1 rounded text-xs font-semibold border">
                    Cash
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <h1>Upload Media</h1>
          <div>
            <h2>Upload Image</h2>
            <ImageUpload />
          </div>
          <div>
            <h2>Upload Video</h2>
            <VideoUpload />
          </div>
        </div>
      </div>
    </>
  );
};

export default RoomDetails;
