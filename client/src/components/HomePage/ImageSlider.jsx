import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
    title: "Dramatics Club",
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

const ClubContent = React.memo(({ club }) => (
  <div className="absolute inset-0 flex flex-col justify-end p-4 pb-16 sm:p-8 sm:pb-20 lg:p-12 lg:pb-24">
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="max-w-xs sm:max-w-md lg:max-w-3xl"
    >
      <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-4 lg:mb-6">
        <div className="text-4xl sm:text-5xl lg:text-6xl">{club.icon}</div>
        <h3
          className={`text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r ${club.gradient} bg-clip-text text-transparent`}
        >
          {club.title}
        </h3>
      </div>
      <p className="text-sm sm:text-base lg:text-lg text-gray-200 mb-4 sm:mb-6 font-light leading-relaxed">
        {club.description}
      </p>
      <div className="flex flex-wrap gap-2 sm:gap-3">
        {club.tags.map((tag) => (
          <span
            key={tag}
            className={`px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-gradient-to-r ${club.gradient} text-white text-xs sm:text-sm font-medium`}
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  </div>
));

ClubContent.displayName = "ClubContent";

const NavButton = React.memo(({ direction, onClick, children }) => (
  <button
    onClick={onClick}
    className={`absolute ${
      direction === "left" ? "left-2 sm:left-4" : "right-2 sm:right-4"
    } top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 text-white backdrop-blur-sm opacity-50 group-hover:opacity-100 md:opacity-0 transition-all hover:bg-black/50 focus:opacity-100`}
    aria-label={direction === "left" ? "Previous Club" : "Next Club"}
  >
    {children}
  </button>
));

NavButton.displayName = "NavButton";

const ImageSlider = () => {
  const [currentClub, setCurrentClub] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const handlePrevious = useCallback(() => {
    setIsAutoPlaying(false);
    setCurrentClub((prev) => (prev - 1 + clubs.length) % clubs.length);
  }, []);

  const handleNext = useCallback(() => {
    setIsAutoPlaying(false);
    setCurrentClub((prev) => (prev + 1) % clubs.length);
  }, []);

  const handleDotClick = useCallback((index) => {
    setIsAutoPlaying(false);
    setCurrentClub(index);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = setInterval(() => {
      setCurrentClub((prev) => (prev + 1) % clubs.length);
    }, 5000);

    return () => {
      clearInterval(timer);
    };
  }, [isAutoPlaying]);

  return (
    <div className="relative w-full h-[60vh] max-h-[450px] sm:h-[70vh] sm:max-h-[550px] lg:h-[600px] lg:max-h-none overflow-hidden rounded-2xl sm:rounded-3xl bg-gray-900 group">
      <NavButton direction="left" onClick={handlePrevious}>
        <ChevronLeft size={20} sm:size={24} />
      </NavButton>
      <NavButton direction="right" onClick={handleNext}>
        <ChevronRight size={20} sm:size={24} />
      </NavButton>

      <AnimatePresence mode="wait">
        {clubs.map(
          (club, index) =>
            index === currentClub && (
              <motion.div
                key={club.title + index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7 }}
                className="absolute inset-0"
                style={{ willChange: "opacity" }}
              >
                <motion.img
                  key={club.image}
                  src={club.image}
                  alt={club.title}
                  className="w-full h-full object-cover"
                  initial={{ scale: 1.05 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 8, ease: "easeOut" }}
                  loading="lazy"
                  style={{ willChange: "transform" }}
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-80`}
                />
                <ClubContent club={club} />
              </motion.div>
            )
        )}
      </AnimatePresence>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800/50 overflow-hidden">
        <AnimatePresence>
          {isAutoPlaying && (
            <motion.div
              className={`h-full bg-gradient-to-r ${clubs[currentClub].gradient}`}
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 5, ease: "linear" }}
              exit={{ opacity: 0 }}
              key={currentClub}
              style={{ willChange: "width" }}
            />
          )}
        </AnimatePresence>
      </div>

      <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 lg:bottom-8 lg:right-8 flex items-center gap-2 sm:gap-3 z-10">
        {clubs.map((club, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className="group relative p-1"
            aria-label={`Go to slide ${index + 1}: ${club.title}`}
          >
            <div
              className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-300 ${
                index === currentClub
                  ? `bg-white scale-125 ring-2 ring-white/50`
                  : "bg-white/40 hover:bg-white/70"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default React.memo(ImageSlider);
