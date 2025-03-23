import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ImageSlider = () => {
  const clubs = [
    {
      title: "Computer Coding Club",
      description: "Explore the world of programming and development",
      icon: "💻",
      image: "src/assets/images/ccImage.png",
      gradient: "from-blue-500 via-indigo-500 to-purple-500",
      tags: ["Programming", "Development", "Tech"],
    },
    {
      title: "Robotics Club",
      description: "Build and program the future of automation",
      icon: "🤖",
      image: "src/assets/images/robotics.png",
      gradient: "from-cyan-500 via-teal-500 to-emerald-500",
      tags: ["Robotics", "AI", "Engineering"],
    },
    {
      title: "Core Dramatics",
      description: "Express creativity through art and performance",
      icon: "🎭",
      image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3",
      gradient: "from-rose-500 via-pink-500 to-purple-500",
      tags: ["Drama", "Arts", "Performance"],
    },
    {
      title: "Green Club",
      description: "Connect with nature and help save the environment",
      icon: "🌿",
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
      gradient: "from-green-500 via-emerald-500 to-teal-500",
      tags: ["Environment", "Nature", "Sustainability"],
    },
  ];

  const [currentClub, setCurrentClub] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = setInterval(() => {
      setCurrentClub((prev) => (prev + 1) % clubs.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const handlePrevious = () => {
    setIsAutoPlaying(false);
    setCurrentClub((prev) => (prev - 1 + clubs.length) % clubs.length);
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentClub((prev) => (prev + 1) % clubs.length);
  };

  return (
    <div className="relative w-full h-[600px] overflow-hidden rounded-3xl bg-gray-900 group">
      {/* Navigation Arrows */}
      <button
        onClick={handlePrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/50"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/50"
      >
        <ChevronRight size={24} />
      </button>

      {/* Club Images and Content */}
      <AnimatePresence mode="wait">
        {clubs.map(
          (club, index) =>
            index === currentClub && (
              <motion.div
                key={club.title}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7 }}
                className="absolute inset-0"
              >
                {/* Background Image */}
                <motion.img
                  src={club.image}
                  alt={club.title}
                  className="w-full h-full object-cover"
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 8 }}
                />

                {/* Gradient Overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80`}
                />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-12">
                  <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="max-w-3xl"
                  >
                    {/* Icon and Title */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className="text-6xl">{club.icon}</div>
                      <h3
                        className={`text-4xl font-bold bg-gradient-to-r ${club.gradient} bg-clip-text text-transparent`}
                      >
                        {club.title}
                      </h3>
                    </div>

                    {/* Description */}
                    <p className="text-xl text-gray-200 mb-6 font-light">
                      {club.description}
                    </p>

                    {/* Tags */}
                    <div className="flex gap-3">
                      {club.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`px-4 py-1.5 rounded-full bg-gradient-to-r ${club.gradient} text-white text-sm font-medium`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )
        )}
      </AnimatePresence>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800">
        <motion.div
          className={`h-full bg-gradient-to-r ${clubs[currentClub].gradient}`}
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 5, ease: "linear" }}
          key={currentClub}
        />
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-8 right-8 flex items-center gap-3">
        {clubs.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setIsAutoPlaying(false);
              setCurrentClub(index);
            }}
            className={`group relative`}
          >
            <div
              className={`
              w-3 h-3 rounded-full transition-all duration-300
              ${
                index === currentClub
                  ? `bg-gradient-to-r ${clubs[index].gradient} scale-125`
                  : "bg-white/50 hover:bg-white/75"
              }
            `}
            />
            <div
              className={`
              absolute -inset-2 rounded-full opacity-0 
              group-hover:opacity-25 transition-opacity
              bg-gradient-to-r ${clubs[index].gradient}
              blur
            `}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
