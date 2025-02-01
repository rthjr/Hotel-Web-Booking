"use client";
import React from "react";
import { useRouter } from "@node_modules/next/navigation";
import Link from "next/link";

const RoomDetails = () => {
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };
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
            <ul className="flex w-full justify-evenly">
              <li className="flex-1 text-center py-4 text-gray-900  hover:border-b-2 hover:border-textColor hover:bg-bgNavColor  transition-colors duration-300">
                <Link href="#">
                  <span className="">Overview</span>
                </Link>
              </li>
              <li className="flex-1 text-center py-4 text-gray-900  hover:border-b-2 hover:border-textColor hover:bg-bgNavColor  transition-colors duration-300">
                <Link href="#">
                  <span>Info & prices</span>
                </Link>
              </li>
              <li className="flex-1 text-center py-4 text-gray-900  hover:border-b-2 hover:border-textColor hover:bg-bgNavColor  transition-colors duration-300">
                <Link href="#">
                  <span>Facilities</span>
                </Link>
              </li>
              <li className="flex-1 text-center py-4 text-gray-900  hover:border-b-2 hover:border-textColor hover:bg-bgNavColor  transition-colors duration-300">
                <Link href="#">
                  <span>House rules</span>
                </Link>
              </li>
              <li className="flex-1 text-center py-4 text-gray-900  hover:border-b-2 hover:border-textColor hover:bg-bgNavColor  transition-colors duration-300">
                <Link href="#">
                  <span>The fine print</span>
                </Link>
              </li>
              <li className="flex-1 text-center py-4 text-gray-900  hover:border-b-2 hover:border-textColor hover:bg-bgNavColor  transition-colors duration-300">
                <Link href="#">
                  <span>Guest reviews</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="flex flex-col gap-4 py-4">
            <div className="font-bold text-2xl">
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
                <button className=" bg-bgDarkColor hover:bg-buttonColor text-bgColor py-2 px-5 rounded-lg">
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
          <div
            className="w-3/12 h-full flex flex-col justify-center gap-4 pt-4"
          >
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
                  “The two receptionists were friendly and helpful at all times.
                  The hotel manager is, indeed, lucky to have them both in the
                  hotel's service. We...”
                </p>
              </div>
              <div className="text-lg font-semibold text-center text-green-600">
                Excellent Location!
              </div>
            </div>
            <div className="h-40 flex flex-col">
              <div className="flex justify-center items-center">
                <div>
                  {<iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d62565.16404994723!2d104.90470142800619!3d11.456613727772911!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3109599384325cdd%3A0xe25c308bc6822c0a!2sKrong%20Ta%20Khmau!5e0!3m2!1sen!2skh!4v1738388659069!5m2!1sen!2skh"
                    style={{ border: 0, width: "100%" }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-12/12 flex justify-between">
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
              <div className=" max-w-4xl mx-auto p-6">
                <h2 className="text-lg font-semibold mb-4">
                  Most popular facilities
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-4 text-green-600">
                  {/* <!-- Facility 1 --> */}
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">📶</span>
                    <span className="text-sm font-medium">Free WiFi</span>
                  </div>
                  {/* <!-- Facility 2 --> */}
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🚌</span>
                    <span className="text-sm font-medium">Airport shuttle</span>
                  </div>
                  {/* <!-- Facility 3 --> */}
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">👨‍👩‍👧</span>
                    <span className="text-sm font-medium">Family rooms</span>
                  </div>
                  {/* <!-- Facility 4 --> */}
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🚭</span>
                    <span className="text-sm font-medium">
                      Non-smoking rooms
                    </span>
                  </div>
                  {/* <!-- Facility 5 --> */}
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🪷</span>
                    <span className="text-sm font-medium">
                      Spa and wellness centre
                    </span>
                  </div>
                  {/* <!-- Facility 6 --> */}
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🍴</span>
                    <span className="text-sm font-medium">2 restaurants</span>
                  </div>
                  {/* <!-- Facility 7 --> */}
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🅿️</span>
                    <span className="text-sm font-medium">Free parking</span>
                  </div>
                  {/* <!-- Facility 8 --> */}
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🛎️</span>
                    <span className="text-sm font-medium">Room service</span>
                  </div>
                  {/* <!-- Facility 9 --> */}
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">☕</span>
                    <span className="text-sm font-medium">
                      Tea/coffee maker in all rooms
                    </span>
                  </div>
                  {/* <!-- Facility 10 --> */}
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🍳</span>
                    <span className="text-sm font-medium">Breakfast</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className=" w-4/12 max-w-sm mx-auto p-4">
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
      </div>
    </>
  );
};

export default RoomDetails;
