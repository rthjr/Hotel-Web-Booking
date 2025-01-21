import { Button } from '@components/layout/Button'
import Header from '@components/layout/Header'
import MenuFilter from '@components/layout/MenuFilter'
import React from 'react'
import Image from '@node_modules/next/image'
import { FacilitiesHotel } from '@data/HotelData'
import { RoomDetail } from '@data/HotelData'
import Footer from '@components/layout/Footer'

const Home = () => {
  return (

    // website
    <div className="flex flex-col gap-8 w-full h-full bg-gray-100">
      {/* Header */}
      <div className='w-full flex justify-center items-center shadow-2xl sticky top-0 z-10 bg-white'>
        <div className='w-10/12'>
          {/* Header */}
          <Header />
        </div>
      </div>

      <div className='w-full h-screen flex flex-col gap-8  pb-8'>

        {/* first */}
        <div className='flex justify-center items-center w-full'>
          <div className='w-10/12 flex justify-between h-[70vh]'>
            <div className='w-5/12 flex flex-col gap-8 justify-center h-full'>
              <h2 className='text-textColor text-3xl font-semibold'>Paradise View</h2>
              <h1 className='text-black text-5xl font-bold'>Hotel for every <br /> moment rich in <br /> emotion</h1>
              <p className='text-sm'>Every moment feels like the first time <br /> in paradise view </p>
              <div className='w-fit'> <Button param="Book Now" style="rounded-lg" /></div>
            </div>
            <div className='w-5/12 h-full lg:h-[80vh] relative'>
              <Image
                src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="banner"
                fill
                className='object-cover rounded-lg'
              />
            </div>
          </div>
        </div>
      </div>

      {/* menu filter */}
      <div className='lg:-mt-[19%] w-full flex justify-center items-center sticky top-24 z-20'>
        <div className='w-10/12'>
          {/* MenuFilter */}
          <div><MenuFilter /></div>
        </div>
      </div>

      {/* second */}
      {/* facility */}
      <div className='flex flex-col gap-8 w-full h-full justify-center items-center mt-12'>
        <div className='flex flex-col gap-4 justify-center items-center w-10/12'>
          <h2 className='text-2xl font-bold text-black'>Our Facilities</h2>
          <p className='text-black text-base'>We offer modern (5 star) hotel facilities for your comfort.</p>
        </div>

        <div className="w-10/12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-textColor">
          {FacilitiesHotel.map((fh) => (
            <div className="flex flex-col items-center justify-center gap-4 p-8 rounded-lg bg-white w-52 h-52 hover:bg-textColor hover:text-white transition-all" key={fh.id}>
              <span>{fh.icon}</span>
              <span>{fh.facility}</span>
            </div>
          ))}
        </div>
      </div>

      {/* third */}
      {/* banner */}
      <div className='flex flex-col gap-8 w-full h-full justify-center items-center py-4'
        style={{
          backgroundImage: "url('https://plus.unsplash.com/premium_photo-1681922761648-d5e2c3972982?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}>
        <div className='flex flex-col gap-8 justify-center items-center w-10/12 '
        >
          <div className='flex flex-col gap-4 justify-center items-center'>
            <h2 className='text-2xl font-bold text-white'>Luxurious Rooms</h2>
            <div className='border-t-2 border-t-white w-40 h-1'></div>
            <span className='text-sm text-white'>All room are design for you comfort</span>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-3 w-full h-full gap-4'>
            {RoomDetail.map((rd) => (
              <div className='flex flex-col gap-4 p-4 bg-white rounded-lg' key={rd.id}>
                <div className='relative aspect-square'> {/* Adjust aspect ratio as needed */}
                  <Image
                  
                    src={rd.img}
                    alt={rd.des} 
                    fill
                    className='object-cover rounded-lg z-8'
                    sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw' 
                  />
                  <div className='absolute bottom-0 w-fit h-fit right-6 p-4 bg-textColor text-white top-6 rounded-lg'>
                    {rd.available} Rooms available
                  </div>
                </div>
                <p>{rd.des}</p>
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* footer */}
      <div className="w-full h-full">
        <Footer />
      </div>
    </div>

    // mobile

  )
}

export default Home