import React from "react";

const BannerExplore = () => {
  return (
    <div className="relative w-full h-[500px] md:h-[700px] overflow-hidden shadow-lg">
      <video
        src="/video/ExplorBanner.mp4"
        type="video/mp4"
        autoPlay
        loop
        muted
        playsInline
        poster="/images/banner-fallback.jpg"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center">
        <div className="flex flex-col justify-center items-center text-white text-center px-4 md:px-0 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-7xl font-bold mb-6 tracking-tight [text-shadow:_2px_2px_4px_rgb(0_0_0_/_40%)] animate-fade-in">
            Welcome to Our Hotel
          </h1>
          <p className="text-lg md:text-xl mb-8 font-light tracking-wide [text-shadow:_1px_1px_2px_rgb(0_0_0_/_40%)] animate-fade-in-delay max-w-2xl">
            Experience luxury and comfort in our beautifully designed rooms and suites. 
            Discover the perfect blend of elegance and modern amenities.
          </p>
          <button className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-medium rounded-full hover:bg-white/20 transition-all duration-300 animate-fade-in-delay-2 border border-white/30">
            Explore Rooms
          </button>
        </div>
      </div>
    </div>
  );
};

export default BannerExplore;
