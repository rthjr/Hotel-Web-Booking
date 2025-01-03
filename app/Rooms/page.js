import React from 'react'
import HotelCard from '@/components/Card/HotelCard'
import Header from '@components/layout/Header'

const page = () => {
    return (
        <div className='w-full h-full'>
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
                <div className='w-10/12'>
                    {/* Footer */}
                </div>
            </div>
        </div>
    )
}

export default page