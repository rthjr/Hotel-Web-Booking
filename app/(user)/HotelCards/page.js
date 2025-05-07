"use client"
import React from 'react'
import HotelCard from '@components/user/Card/HotelCard'
import Header from '@components/user/layout/Header'
import Footer from '@components/user/layout/Footer'
import { useRouter } from "@node_modules/next/navigation";
import ScrollAnimation from '@components/motion/ScrollAnimation'
import BannerHotel from '@components/user/Banners/BannerHotel'

const Page = () => {
    const router = useRouter();
    const handleRoom = () => { router.push("/HotelCards/Rooms") }
    return (
        <div className='w-full h-full flex flex-col gap-8'>
            <div className='w-full flex flex-col justify-center items-center'>
                <div className='w-full flex flex-col justify-center items-center shadow-2xl'>
                    <div className='w-10/12'>
                        {/* Header */}
                        <Header />
                    </div>
                    <ScrollAnimation/>
                </div>
                <div className='w-full'>
                    <section className="w-full flex justify-center items-center">
                        <BannerHotel />
                    </section>
                </div>
            </div>

            <div className='w-full flex justify-center items-center'>
                <div className='w-10/12'>
                    {/* Hotel Catd */}
                    <HotelCard Rooms={handleRoom} />
                </div>
            </div>

            <div className='w-full flex justify-center items-center'>
                <div className='w-full'>
                    <Footer />
                </div>
            </div>
        </div>
    )
}

export default Page