import ScrollAnimation from '@components/motion/ScrollAnimation'
import BannerExplore from '@components/user/Banners/BannerExplore'
import Explore from '@components/user/Card/Explore'
import Footer from '@components/user/layout/Footer'
import Header from '@components/user/layout/Header'
import React from 'react'

const page = () => {
    return (
        <div className='flex flex-col w-full h-full'>

            <div className='w-full flex flex-col justify-center items-center shadow-2xl sticky top-0 z-10 bg-white'>
                <div className='w-10/12'>
                    {/* Header */}
                    <Header />
                </div>
            <ScrollAnimation/>
            </div>

            <div className="flex flex-col gap-8">


                <div>
                    <BannerExplore />
                </div>

                <div className='flex flex-col gap-8 justify-center items-center'>
                    <h2 className='text-3xl font-bold text-black'>Take a tour</h2>

                    {/* explore component */}
                    <div className='w-10/12'>
                        <Explore />
                    </div>
                </div>

                <div className="w-full h-full ">
                    <Footer />
                </div>

            </div>

        </div>
    )
}

export default page