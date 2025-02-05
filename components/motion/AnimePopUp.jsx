"use client"

import { motion } from 'framer-motion';

const AnimePopUp = ({ children, whileHover, whileTap, variants }) => {
  return (
    <motion.button
      whileHover={whileHover}
      whileTap={whileTap}
      variants={variants}
      className="your-button-class"
    >
      {children}
    </motion.button>
  );
};

export default AnimePopUp;
