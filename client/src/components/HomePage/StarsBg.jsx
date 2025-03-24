import React, { useMemo } from "react";
import { motion } from "framer-motion";

const Star = React.memo(({ delay, x, y, scale }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0, 1, 0],
        scale: [scale, scale * 1.2, scale],
      }}
      transition={{
        duration: 2,
        delay,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      }}
      className="absolute w-1 h-1 bg-white rounded-full"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        willChange: "transform, opacity",
      }}
    />
  );
});

const StarryBackground = () => {
  // Reduce star count based on device performance
  const starCount = window.matchMedia("(max-width: 768px)").matches ? 50 : 75;

  // Pre-calculate star positions
  const stars = useMemo(() => {
    return Array.from({ length: starCount }, (_, index) => ({
      id: index,
      x: Math.random() * 100,
      y: Math.random() * 100,
      scale: Math.random() * 0.5 + 0.5,
      delay: index * 0.05,
    }));
  }, [starCount]);

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  return (
    <div className="fixed inset-0 bg-black">
      <div className="relative w-full h-screen overflow-hidden">
        {!prefersReducedMotion &&
          stars.map(({ id, x, y, scale, delay }) => (
            <Star key={id} x={x} y={y} scale={scale} delay={delay} />
          ))}
      </div>
    </div>
  );
};

export default React.memo(StarryBackground);
