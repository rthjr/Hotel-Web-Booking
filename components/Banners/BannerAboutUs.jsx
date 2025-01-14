import React from "react";
import Image from "@node_modules/next/image";

const BannerAboutUs = () => {
  return (
    <div className=" w-full h-screen">
      <div>
        <div
          className=" h-[100vh]"
          style={{
            backgroundImage:
              "url('https://wallpapers.com/images/hd/fancy-hotel-room-nemacolin-resort-5z2qflmeuynjm0ln.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="w-full h-screen bg-yellow-900 bg-opacity-30 flex justify-center items-center">
          <div className="flex flex-col justify-center items-center text-white">
            <div className="w-5/12 grid place-items-center">
            <h1 className="text-5xl font-bold">About Us</h1>
            <p className="mt-10">
              The elegant luxury bedrooms in this gallery showcase custom
              interior designs & decorating ideas. View pictures and find your
              perfect luxury bedroom design.
            </p>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default BannerAboutUs;
