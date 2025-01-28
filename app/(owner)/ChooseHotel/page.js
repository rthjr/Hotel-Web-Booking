"use client"; // Ensures this component is rendered on the client side

import React from 'react';
import HotelCard from '@components/owner/component/Card/HotelCard';
import Topbar from '@components/owner/component/layout/Topbar';

const Page = () => {

  return (
    <div className= "lg:p-4 p-0 flex flex-col gap-8 place-items-center">
      <Topbar/>
      <HotelCard/>
    </div>
  );
};

export default Page;