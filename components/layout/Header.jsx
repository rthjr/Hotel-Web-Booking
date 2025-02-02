
"use client"

import React from "react";
import Link from "next/link";
import { Button ,LoginButton} from "@components/user/layout/Button";
import Image from "@node_modules/next/image";
import { useRouter } from "@node_modules/next/navigation";

const Header = () => {

  const router = useRouter();

  const handleRoom = () => {
    router.push("/HotelCards/Rooms");
  }
  return (
  <div className="sticky top-0">
    <div className="flex justify-between items-center p-4 ">
      <Link href="#">
        <Image 
          src="/logo/logo.png"
          alt="logo"
          width={100}
          height={100}
        />
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

      {/* login */}
      <Button param = "Book Now" Rooms={handleRoom} style="rounded-xl"/>

      <LoginButton/>
    </div>
  </div>  
  );
};

export default Header;
