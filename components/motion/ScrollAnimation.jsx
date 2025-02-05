"use client"

import { motion, useScroll, useSpring } from 'framer-motion';

const ScrollAnimation = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      style={{
        scaleX,
        height: '5px',
        backgroundColor: '#7C6A46',
        width: '100%',
        originX: 0
      }}
    />
  );
};

export default ScrollAnimation;
