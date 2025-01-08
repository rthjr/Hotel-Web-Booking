"use client";

import React from "react";
import { useRouter } from "@node_modules/next/navigation";
export const Button = ({ param, handleRoom, style }) => {
  return (
    <button
      className={` group relative inline-block text-sm font-medium text-textColor focus:outline-none focus:ring active:text-textColor`}
      onClick={handleRoom}
    >
      <span
        className={`${style} absolute inset-0 translate-x-0 translate-y-0 bg-textColor transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5`}
      ></span>

      <span
        className={`${style} relative block border border-current bg-white py-2 px-4`}
      >
        {" "}
        {param}{" "}
      </span>
    </button>
  );
};

export const LoginButton = () => {
  const router = useRouter();

  return (
    <div className="flex gap-8">
      {/* Base */}

      <button
        className="group relative inline-block text-sm font-medium text-textColor focus:outline-none focus:ring active:text-textColor"
        onClick={() => router.push("/login")}
      >
        <span className="absolute inset-0 translate-x-0.5 translate-y-0.5 bg-textColor transition-transform group-hover:translate-x-0 group-hover:translate-y-0"></span>

        <span className="relative block border border-current bg-white px-8 py-3">
          {" "}
          Login{" "}
        </span>
      </button>

      {/* Hover */}

      <button
        className="group relative inline-block text-sm font-medium text-textColor focus:outline-none focus:ring active:text-textColor"
        onClick={() => router.push("/signup")}
      >
        <span className="absolute inset-0 translate-x-0 translate-y-0 bg-textColor transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5"></span>

        <span className="relative block border border-current bg-white px-8 py-3">
          {" "}
          Sign Up{" "}
        </span>
      </button>
    </div>
  );
};
