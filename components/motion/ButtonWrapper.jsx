"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

const ButtonWrapper = () => {
  return (
    <div className="flex items-center justify-center">
      <SpotlightButton />
    </div>
  );
};

const SpotlightButton = () => {
  const btnRef = useRef(null);
  const spanRef = useRef(null);

  useEffect(() => {
    let animationFrameId;

    const handleMouseMove = (e) => {
      if (!btnRef.current) return;
      
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => {
        const { width, left } = btnRef.current.getBoundingClientRect();
        const offsetX = e.clientX - left;
        const leftPercentage = `${(offsetX / width) * 100}%`;
        
        spanRef.current?.animate({ left: leftPercentage }, { duration: 250, fill: "forwards" });
      });
    };

    const handleMouseLeave = () => {
      spanRef.current?.animate({ left: "50%" }, { duration: 100, fill: "forwards" });
    };

    btnRef.current?.addEventListener("mousemove", handleMouseMove);
    btnRef.current?.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      btnRef.current?.removeEventListener("mousemove", handleMouseMove);
      btnRef.current?.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <motion.button
      whileTap={{ scale: 0.985 }}
      ref={btnRef}
      className="relative w-full max-w-xs overflow-hidden rounded-lg bg-textColor px-4 py-2 text-lg font-medium text-white"
    >
      <span className="pointer-events-none relative z-10 mix-blend-difference text-sm ">
        Detail
      </span>
      <span
        ref={spanRef}
        className="pointer-events-none absolute left-[50%] top-[50%] h-24 w-24 -translate-x-[50%] -translate-y-[50%] rounded-full bg-slate-100"
      />
    </motion.button>
  );
};

export default ButtonWrapper;
