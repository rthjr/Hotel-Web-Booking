"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@components/user/layout/Button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContent } from "@Context/owner/context";
import { useHotelContext } from "@Context/owner/ChosseHotelContext";


const Header = () => {
    const router = useRouter();
   /*  const { data: session, status } = useSession(); */
    
    const [isLogin, setIsLogin] = useState(false);

    useEffect(() => {
        if (status === "authenticated") {
            setIsLogin(true);
        } else if (status === "unauthenticated") {
            setIsLogin(false);
        }
    }, [status]);

    const handleLogout = async () => {
        await signOut({ redirect: false }); 
        window.location.reload()
    };

    const handleContentChange = (content) => {
        setSelectedContent(content);
    };

    const handleReservationClick = () => {
        handleContentChange("Reservation"); // Set content to "Reservation"
        router.push("/ChooseHotel/Reservation"); // Navigate to the Reservation page
    };

    const handleReportClick = () => {
        handleContentChange("Report"); // Set content to "Report"
        router.push("/ChooseHotel/ReportData"); // Navigate to the Report page
    };

    const handleSwitchHotel = () => {
        router.push("/ChooseHotel")
    }

    return (
        <>
            {hotelId && (
                <div className="sticky top-0">
                    <div className="flex flex-col gap-8 items-center p-8 justify-start min-h-screen bg-gray-200">
                        <Link href="/">
                            <Image src="/logo/logo.png" alt="logo" width={150} height={150} />
                        </Link>
                        <ul className="flex gap-8 flex-col">
                            <div className="flex flex-col gap-4">
                                <span className="font-bold">Management</span>
                                <li
                                    className="text-black hover:text-textColor transition duration-300 delay-200 border-b-2 border-transparent hover:border-textColor"
                                    onClick={handleSwitchHotel}
                                >
                                    <Link href="#">Switch Hotel</Link>
                                </li>
                                <li
                                    className="text-black hover:text-textColor transition duration-300 delay-200 border-b-2 border-transparent hover:border-textColor"
                                    onClick={handleReservationClick} // Trigger action for Reservation
                                >
                                    <Link href="#">Reservation</Link>
                                </li>
                            </div>

                            <div className="flex flex-col gap-4">
                                <span className="font-bold">Dashboard</span>
                                <li
                                    className="text-black hover:text-textColor transition duration-300 delay-200 border-b-2 border-transparent hover:border-textColor"
                                    onClick={handleReportClick} 
                                >
                                    <Link href="#">Report</Link>
                                </li>
                            </div>

                            <div className="flex flex-col gap-4">
                                <span className="font-bold">Home Page</span>
                                <li
                                    className="text-black hover:text-textColor transition duration-300 delay-200 border-b-2 border-transparent hover:border-textColor"
                                >
                                    <Link href="/">Home</Link>
                                </li>
                            </div>
                        </ul>

                        <Button param="Log Out" style="rounded-xl" Rooms={handleLogout}/>
                    </div>
                </div>
            )}
        </>
    );
};

export default Header;
