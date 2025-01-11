import { ExploreDetail } from "@data/HotelData";
import Image from "@node_modules/next/image";
import React from "react";

const Explore = () => {
  return (
    <div className="w-full h-full flex flex-col gap-8">
      {ExploreDetail.map((explore) => (
        <div key={explore.id} className="w-full h-full flex flex-col justify-center items-center">
          <div  className="w-full h-[60vh] relative">
            <Image
              src={explore.image}
              alt="image"
              fill
              className="object-cover rounded-lg"
            />
          </div>
          <div className="rounded-lg shadow-lg relative bg-white bottom-20 z-9 w-8/12 flex flex-col  gap-8">
            <div className="h-4 bg-textColor rounded-t-lg
            "> </div>
            <div className="flex flex-col justify-center items-center text-center gap-8 mb-8">
              <span className="text-textColor text-2xl font-bold ">
                {explore.name}
              </span>
              <p>{explore.des}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Explore;
