import React from 'react'

const BannerContact = () => {
  return (
    <div className=" w-full h-screen">
      <div>
        <div
          className=" h-[100vh]"
          style={{
            backgroundImage:
              "url('https://watermark.lovepik.com/photo/20211122/large/lovepik-hotel-lobby-picture_500742423.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="w-full h-screen bg-bgDarkColor bg-opacity-40 flex justify-center items-center">
          <div className="flex flex-col justify-center items-center text-white [text-shadow:_0_1px_0_rgb(0_0_0_/_60%)]">
            <div className="w-5/12 grid place-items-center">
            <h1 className="text-5xl font-bold ">Contact us</h1>
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
  )
}

export default BannerContact
