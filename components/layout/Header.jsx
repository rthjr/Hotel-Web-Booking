
"use client"

import React from "react";
import Link from "next/link";
import { Button } from "./Button";
import Image from "@node_modules/next/image";
import { useRouter } from "@node_modules/next/navigation";

const Header = () => {

  const router = useRouter();

  const handleRoom = () => {
    router.push("/Rooms");
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
          <Link href="/Rooms">Rooms</Link>
        </li>
        <li className="text-black hover:text-textColor transition duration-300 delay-200 border-b-2 border-transparent hover:border-textColor">
          <Link href="/About">About</Link>
        </li>
        <li className="text-black hover:text-textColor transition duration-300 delay-200 border-b-2 border-transparent hover:border-textColor">
          <Link href="/Contact">Contact</Link>
        </li>
      </ul>
      {/* login */}
      <Button param = "Book Now" handleRoom={handleRoom} style="rounded-xl"/>
    </div>
  </div>
  );
};

export default Header;
