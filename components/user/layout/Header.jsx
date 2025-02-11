"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button, LoginButton } from "./Button";
import Image from "next/image";
import { RxAvatar } from "react-icons/rx";
import { FiMenu, FiLogOut } from "react-icons/fi";
import { useAuth } from "@Context/AuthContext/AuthContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [actionMenuBar, setActionMenuBar] = useState("Home");
  const { isLogin, userName, isDropdownOpen, setIsDropdownOpen, handleLogout } =
    useAuth();
  const pathname = usePathname(); // Get current page path

  // Function to handle menu selection and persist it
  const handleMenuClick = (menuName) => {
    setActionMenuBar(menuName);
    localStorage.setItem("activeMenu", menuName);
  };

  // Load active menu from localStorage OR set it based on current route
  useEffect(() => {
    const storedMenu = localStorage.getItem("activeMenu");
    if (storedMenu) {
      setActionMenuBar(storedMenu);
    }

    // Update active menu based on the current path
    const currentMenu = menuItems.find((item) => item.path === pathname);
    if (currentMenu) {
      setActionMenuBar(currentMenu.name);
    }
  }, [pathname]); // Runs whenever the route changes

  // Menu items
  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Explore", path: "/Explore" },
    { name: "Hotel", path: "/HotelCards" },
    { name: "About", path: "/About" },
    { name: "Contact", path: "/Contact" },
    { name: "Room", path: "/Rooms" },
    { name: "Reservation", path: "/Reservation", requiresLogin: true },
    { name: "Management", path: "/ChooseHotel", requiresOwner: true },
  ];

  return (
    <div className="sticky top-0 bg-white">
      <div className="flex justify-between items-center py-4">
        <Link href="/">
          <Image src="/logo/logo.png" alt="logo" width={100} height={100} />
        </Link>

        {/* Hamburger Menu for Mobile */}
        <div className="lg:hidden flex items-center">
          <FiMenu size={30} onClick={() => setIsMenuOpen(!isMenuOpen)} />
        </div>

        {/* Navigation Menu */}
        <ul
          className={`lg:flex gap-8 ${
            isMenuOpen
              ? "flex flex-col absolute bg-white top-16 left-0 w-full p-4 z-10"
              : "hidden"
          } lg:static lg:flex-row`}
        >
          {menuItems.map((menu, index) => {
            if (menu.requiresLogin && !isLogin) return null;
            if (menu.requiresOwner && userName !== "owner") return null;
            return (
              <li
                key={index}
                className="text-black hover:text-textColor transition duration-300 delay-200"
              >
                <Link
                  href={menu.path}
                  onClick={() => handleMenuClick(menu.name)}
                  className={`border-b-2 border-transparent ${
                    actionMenuBar === menu.name
                      ? "border-textColor border-b-textColor border-b-2"
                      : "hover:border-textColor"
                  }`}
                >
                  {menu.name}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* User Authentication Section */}
        {isLogin ? (
          <div className="flex justify-between items-center gap-4 relative">
            {/* Avatar */}
            <div
              className="flex gap-2 justify-center items-center border-2 border-textColor text-textColor p-1 rounded-lg cursor-pointer"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <RxAvatar size={30} />
              <p>{userName}</p>
            </div>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute top-12 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-[1000]">
                <ul>
                  <li
                    className="flex items-center gap-2 px-4 py-2 cursor-pointer"
                    onClick={handleLogout}
                  >
                    <FiLogOut size={20} />
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
