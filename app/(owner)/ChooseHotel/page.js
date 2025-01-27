"use client"; // Ensures this component is rendered on the client side

import React from 'react';
import HotelCard from '@components/owner/component/Card/HotelCard';

const Page = () => {

  return (
    <div className= "lg:p-4 p-0">
      <HotelCard/>
    </div>
  );
};

export default Page;