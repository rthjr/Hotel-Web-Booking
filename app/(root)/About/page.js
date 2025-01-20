import BannerAboutUs from '@components/Banners/BannerAboutUs'
import AboutDetails from '@components/layout/AboutDetails'
import Footer from '@components/layout/Footer'
import Header from '@components/layout/Header'
import React from 'react'

const page = () => {
  return (
    <div className='w-full h-full flex flex-col gap-8'>
           <div className='w-full flex flex-col justify-center items-center'>
                <div className='w-full flex justify-center items-center shadow-2xl'>
                        <div className='w-10/12'>
                            {/* Header */}
                            <Header/>
                        </div>
                    </div>

                    <div className='w-full'>
                        <div className='w-full flex justify-center items-center'>
                            <div className='w-full'>
                                {/* Banner */}
                                <BannerAboutUs />
                            </div>
                        </div>
                    </div>
           </div>

            <div className='w-full flex justify-center items-center'>
                <div className='w-10/12'>
                    <AboutDetails />
                </div>
            </div>

            <div className='w-full flex justify-center items-center'>
                <div className='w-full'>
                    <Footer/>
                </div>
            </div>
        </div>
  );
}

export default page
