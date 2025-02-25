"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button, LoginButton } from "@components/user/layout/Button";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter();
  const [activeLink, setActiveLink] = useState("");

  // Initialize state from localStorage on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedActiveLink = localStorage.getItem("activeLink");
      if (storedActiveLink) {
        setActiveLink(storedActiveLink);
      }
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("activeLink", activeLink);
    }
  }, [activeLink]);

  const handleRoom = () => {
    router.push("/HotelCards/Rooms");
  };

  const handleLinkClick = (href) => {
    setActiveLink(href);
  };

  const links = [
    { name: "Home", href: "/" },
    { name: "Explore", href: "/Explore" },
    { name: "Hotel", href: "/HotelCards" },
    { name: "About", href: "/About" },
    { name: "Contact", href: "/Contact" },
    { name: "Room", href: "/HotelCards/Rooms" },
  ];

  return (
    <div className="sticky top-0">
      <div className="flex justify-between items-center py-4">
        <Link href="#">
          <Image src="/logo/logo.png" alt="logo" width={100} height={100} />
        </Link>
        <ul className="flex gap-8">
          {links.map((link) => (
            <li
              key={link.name}
              className={`text-black hover:text-textColor transition duration-300 delay-150 border-b-2 border-transparent hover:border-textColor ${
                activeLink === link.href
                  ? "text-bgColorFooter border-bgColorFooter border-b-2 "
                  : ""
              }`}
            >
              <Link href={link.href} onClick={() => handleLinkClick(link.href)}>
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* login and button */}
        <Button param="Book Now" Rooms={handleRoom} style="rounded-xl" />
        <LoginButton />
      </div>
    </div>
  );
};

export default Header;