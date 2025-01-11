import React from "react";
import Image from "@node_modules/next/image";

const BannerAboutUs = () => {
  return (
    <div className=" w-full relative h-screen">
      <div>
        <Image
          src="/image/BannerRoom.jpg"
          alt="banner"
          fill
          className="object-cover"
        />
        <div className="w-full h-screen grid place-items-center">
          <div className="relative w-full h-fit text-white flex justify-center items-center flex-col">
            <div className="w-5/12 text-center flex flex-col justify-center items-center gap-4 ">
              <h1 className="text-4xl font-bold">About us</h1>
              <p>
                The elegant luxury bedrooms in this gallery showcase custom
                interior designs & decorating ideas. View pictures and find your
                perfect luxury bedroom design.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerAboutUs;
