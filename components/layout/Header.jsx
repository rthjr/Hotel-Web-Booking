"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button, LoginButton } from "./Button"; // Ensure these are correctly defined
import Image from "next/image"; // Corrected import
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const Header = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      setIsLogin(true);
    } else if (status === "unauthenticated") {
      setIsLogin(false);
    }
  }, [status]);

  const handleRoom = () => {
    router.push("/HotelCards/Rooms");
  };

  return (
    <div className="sticky top-0">
      <div className="flex justify-between items-center p-4">
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
        </ul>

        {isLogin ? (
          <Button param="Book Now" Rooms={handleRoom} style="rounded-xl" />
        ) : (
          <LoginButton />
        )}
      </div>
    </div>
  );
};

export default Header;
