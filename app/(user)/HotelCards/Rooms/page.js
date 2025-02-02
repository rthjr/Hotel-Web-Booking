"use client";
import React from "react";
import { useRouter } from "@node_modules/next/navigation";
import Footer from "@components/user/layout/Footer";
import Header from "@components/user/layout/Header";
import Rooms from "@components/user/Card/Rooms";
const page = () => {
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };
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
          <Rooms Rooms={handleBack} />
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

export default page;