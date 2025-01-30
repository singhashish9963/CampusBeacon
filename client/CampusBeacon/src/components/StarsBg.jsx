import React, { useState } from "react";
import { motion } from "framer-motion";

 const starBg = ({ delay }) => {
  const [position] = useState({
    x: Math.random() * 100,
    y: Math.random() * 100,
    scale: Math.random() * 0.5 + 0.5,
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0, 1, 0],
        scale: [position.scale, position.scale * 1.2, position.scale],
      }}
      transition={{
        duration: 2,
        delay: delay,
        repeat: Infinity,
        repeatType: "reverse",
      }}
      className="absolute w-1 h-1 bg-white rounded-full"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
      }}
    />
  );
};

export default starBg;