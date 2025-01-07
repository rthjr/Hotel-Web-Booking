import React from 'react'
import HotelCard from '@/components/Card/HotelCard'
import Header from '@components/layout/Header'
import Footer from '@components/layout/Footer'

const page = () => {
    return (
        <div className='w-full h-full flex flex-col gap-8'>
            <div className='w-full flex justify-center items-center shadow-2xl'>
                <div className='w-10/12'>
                    {/* Header */}
                    <Header />

                    {/* banner */}

                </div>
            </div>

            <div className='w-full flex justify-center items-center'>
                <div className='w-10/12'>
                    {/* Banner */}
                </div>
            </div>

            <div className='w-full flex justify-center items-center'>
                <div className='w-10/12'>
                    {/* Hotel Catd */}
                    <HotelCard />
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

export default page