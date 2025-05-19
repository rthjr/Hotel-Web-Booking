"use client"
import Image from "next/image";
import React, { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_LARAVEL_API_URL

const Explore = () => {
  const [exploreList, setExploreList] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/explore`)
      .then(res => res.json())
      .then(data => setExploreList(data.data || [])) // <-- Fix here
      .catch(err => console.error("Failed to fetch explore data:", err));
  }, []);

  return (
    <div className="w-full h-full flex flex-col gap-8">
      {exploreList.map((explore) => (
        <div key={explore.exploreId} className="w-full h-full flex flex-col justify-center items-center">
          <div className="w-full h-[60vh] relative">
            <Image
              src={explore.image}
              alt="image"
              fill
              className="object-cover rounded-lg"
            />
          </div>
          <div className="rounded-lg shadow-lg relative bg-white bottom-20 z-9 w-8/12 flex flex-col gap-4">
            <div className="h-4 bg-textColor rounded-t-lg"></div>
            <div className="flex flex-col justify-center items-center text-center gap-4 mb-8">
              <span className="text-textColor text-2xl font-bold ">
                {explore.name}
              </span>
              <p className="px-6 text-muted-foreground">{explore.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Explore;
