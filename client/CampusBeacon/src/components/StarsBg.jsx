import React, { useState } from "react";
import { motion } from "framer-motion";

const StarsBg = ({ delay }) => {
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




const StarryBackground = () => {
  const starCount = 100; 
  const delayIncrement = 0.05;

  return (
    <div className="bg-black min-h-screen text-white relative">
      <div className="relative w-full h-screen overflow-hidden bg-black">
        {[...Array(starCount)].map((_, index) => (
          <StarsBg key={index} delay={index * delayIncrement} />
        ))}
      </div>
    </div>
  );
};

export default StarryBackground;
