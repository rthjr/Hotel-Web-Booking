import Image from "@node_modules/next/image";
import React from "react";

const AboutDetails = () => {
  return (
    <div className=" w-12/12 flex justify-between">
      <div className="w-6/12 flex flex-col justify-center items-center gap-4">
        <div className="relative  w-5/12 h-72">
          <Image
            src="/image/manager.jpg"
            alt="photo"
            layout="fill"
            objectFit="cover"
            className="object-cover w-full h-full"
            quality={100}
          />
        </div>
        <div>
          <h1>sdfdssd</h1>
        </div>
      </div>

      <div className="w-6/12  flex flex-col justify-center items-center gap-4 p-6">
        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. At inventore
          similique tempora minus quam cum obcaecati ullam recusandae voluptates
          ex nesciunt adipisci quis, quisquam iste eligendi voluptatum suscipit
          ipsam eaque!
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. At inventore
          similique tempora minus quam cum obcaecati ullam recusandae voluptates
          ex nesciunt adipisci quis, quisquam iste eligendi voluptatum suscipit
          ipsam eaque!
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. At inventore
          similique tempora minus quam cum obcaecati ullam recusandae voluptates
          ex nesciunt adipisci quis, quisquam iste eligendi voluptatum suscipit
          ipsam eaque!
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. At inventore
          similique tempora minus quam cum obcaecati ullam recusandae voluptates
          ex nesciunt adipisci quis, quisquam iste eligendi voluptatum suscipit
          ipsam eaque!
        </p>
      </div>
    </div>
  );
};

export default AboutDetails;
