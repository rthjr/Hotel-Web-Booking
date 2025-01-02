import React from "react";

// export const Button = ({param}) => {
//   return (
//     <button className='p-2 bg-buttonColor text-white'>{param}</button>
//   )
// }

export const Button = ({ param }) => {
  return (
    <button
      className="group relative inline-block text-sm font-medium text-textColor focus:outline-none focus:ring active:text-textColor"
    >
      <span className="absolute inset-0 translate-x-0 translate-y-0 bg-textColor transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5"></span>

      <span className="relative block border border-current bg-white p-2">
        {" "}
        {param}{" "}
      </span>
    </button>
  );
};
