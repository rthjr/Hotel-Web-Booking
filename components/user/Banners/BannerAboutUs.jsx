"use client"
import { HiArrowNarrowDown } from "@node_modules/react-icons/hi";
import React from "react";

const BannerAboutUs = () => {
  return (
    <div className=" w-full h-screen">
      <div>
        <div
          className=" absolute inset-0 w-full h-[100vh]"
          style={{
            backgroundImage:
              "url('https://watermark.lovepik.com/photo/20211122/large/lovepik-hotel-lobby-picture_500742423.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className=" h-full absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/60" />
          <div className="relative z-10 w-full h-full flex items-center justify-center">
            <div className="w-11/12 md:w-5/12 text-center flex flex-col justify-center items-center gap-6 animate-fade-in">
              <h1 className="text-3xl md:text-5xl font-extrabold text-white drop-shadow-lg">
                About Us
              </h1>
              <p className="text-white/90 text-base md:text-lg drop-shadow">
                The elegant luxury bedrooms in this gallery showcase custom
                interior designs & decorating ideas. View pictures and find your
                perfect luxury bedroom design.
              </p>
              <button className="mt-4 flex items-center gap-2 border-2 border-white text-white px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 shadow-lg">
                <span className="font-semibold">Scroll Down</span>
                <HiArrowNarrowDown className="animate-bounce" size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 1.2s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(40px);}
          to { opacity: 1; transform: translateY(0);}
        }
      `}</style>
    </div>
  );
};

export default BannerAboutUs;
