import RoomDetails from '@components/Card/RoomDetails';
import Footer from '@components/layout/Footer'
import Header from '@components/layout/Header'
import React from 'react'

const page = () => {
  return (
    <div className="w-full flex flex-col justify-between gap-8 min-h-screen">
      <div className="w-full flex flex-col justify-center items-center">
        <div className="w-full flex justify-center items-center shadow-2xl">
          <div className="w-10/12">
            {/* Header */}
            <Header />
          </div>
        </div>

        <div className="w-full">
          <div className="w-full flex justify-center items-center">
            <div className="w-full">{/* Banner */}</div>
          </div>
        </div>
      </div>

      <div className="w-full flex justify-center items-center">
        <div className="w-10/12">
           <div>
              <RoomDetails/>
           </div>
        </div>
      </div>

      <div className="w-full flex justify-center items-center">
        <div className="w-full">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default page
