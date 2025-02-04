"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button, LoginButton } from "./Button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { RxAvatar } from "react-icons/rx";
import { FiMenu } from "react-icons/fi"; // Hamburger icon
import { FiLogOut } from "react-icons/fi"; // Log-out icon
import { useAuth } from "@Context/AuthContext/AuthContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to toggle menu
  const { isLogin, userName, isDropdownOpen, setIsDropdownOpen, handleLogout } = useAuth();

  return (
    <div className="sticky top-0">
      <div className="flex justify-between items-center py-4">
        <Link href="#">
          <Image src="/logo/logo.png" alt="logo" width={100} height={100} />
        </Link>

        {/* Hamburger Icon for small devices */}
        <div className="lg:hidden flex items-center">
          <FiMenu size={30} onClick={() => setIsMenuOpen(!isMenuOpen)} />
        </div>

        <ul className={`lg:flex gap-8 ${isMenuOpen ? "flex flex-col absolute bg-white top-16 left-0 w-full p-4 z-10" : "hidden"} lg:static lg:flex-row`}>
          <li className="text-black hover:text-textColor transition duration-300 delay-200 border-b-2 border-transparent hover:border-textColor">
            <Link href="/">Home</Link>
          </li>
          <li className="text-black hover:text-textColor transition duration-300 delay-200 border-b-2 border-transparent hover:border-textColor">
            <Link href="/Explore">Explore</Link>
          </li>
          <li className="text-black hover:text-textColor transition duration-300 delay-200 border-b-2 border-transparent hover:border-textColor">
            <Link href="/HotelCards">Hotel</Link>
          </li>
          <li className="text-black hover:text-textColor transition duration-300 delay-200 border-b-2 border-transparent hover:border-textColor">
            <Link href="/About">About</Link>
          </li>
          <li className="text-black hover:text-textColor transition duration-300 delay-200 border-b-2 border-transparent hover:border-textColor">
            <Link href="/Contact">Contact</Link>
          </li>
          <li className="text-black hover:text-textColor transition duration-300 delay-200 border-b-2 border-transparent hover:border-textColor">
            <Link href="/HotelCards/Rooms">Room</Link>
          </li>
          {isLogin && (
            <li className="text-black hover:text-textColor transition duration-300 delay-200 border-b-2 border-transparent hover:border-textColor">
              <Link href="/Reservation">Reservation</Link>
            </li>
          )}
          <li>
            {userName === "owner" && (
              <Link href="/ChooseHotel">Management</Link>
            )}
          </li>
        </ul>

        {isLogin ? (
          <div className="flex justify-between items-center gap-4 relative">
            {/* Avatar with dropdown toggle */}
            <div
              className="flex gap-2 justify-center items-center border-2 border-textColor text-textColor p-1 rounded-lg cursor-pointer"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)} // Toggle dropdown
            >
              <RxAvatar size={30} />
              <p>{userName}</p>
            </div>

            {/* Dropdown menu */}
            {isDropdownOpen && (
              <div className="absolute top-12 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-[1000]">
                <ul>
                  <li
                    className="flex items-center gap-2 px-4 py-2 cursor-pointer"
                    onClick={handleLogout}
                  >
                    <FiLogOut size={20} /> {/* Log-out icon */}
                    Log out
                  </li>
                </ul>
              </div>
            )}
          </div>
        ) : (
          <LoginButton />
        )}
      </div>
    </div>
  );
};

export default Header;
