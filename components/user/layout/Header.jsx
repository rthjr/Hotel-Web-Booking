"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button, LoginButton } from "./Button";
import Image from "next/image"; // Corrected import
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react"; // Import signOut
import { RxAvatar } from "react-icons/rx";

const Header = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLogin, setIsLogin] = useState(false);
  const [userName, setUserName] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); 

  useEffect(() => {
    if (status === "authenticated") {
      setIsLogin(true);
      if (session?.user) {
        setUserName(session.user.lastName || "");
      }
    } else if (status === "unauthenticated") {
      setIsLogin(false);
      setUserName("");
    }
  }, [status, session]);

  // Handle logout
  const handleLogout = async () => {
    await signOut({ redirect: false }); // Sign out without redirect
    router.push("/"); // Redirect to home page after logout
  };

  return (
    <div className="sticky top-0">
      <div className="flex justify-between items-center py-4">
        <Link href="#">
          <Image src="/logo/logo.png" alt="logo" width={100} height={100} />
        </Link>
        <ul className="flex gap-8">
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
          <li>
            {
              userName === "owner" &&  (
                <Link href="/ChooseHotel">Management</Link>
              )
            }
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
                    className="px-4 py-2 cursor-pointer"
                    onClick={handleLogout}
                  >
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