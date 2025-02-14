import React from "react";
import { motion } from "framer-motion";

const BackgroundAnimation = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 50,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute inset-0 bg-[url('data:image/svg+xml,...')] opacity-10"
      />
    </div>
  );
};

export default BackgroundAnimation;
