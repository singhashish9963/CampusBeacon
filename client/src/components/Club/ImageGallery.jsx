// src/components/Shared/ImageGallery.js OR src/components/Club/ImageGallery.js

import React, {
  useState,
  Fragment,
  useEffect,
  useRef,
  useCallback,
} from "react"; 
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, Transition } from "@headlessui/react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiImage as FiImageIcon,
} from "react-icons/fi";

const SLIDE_DURATION = 3000; 

const ImageGallery = ({ images = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [direction, setDirection] = useState(0); 
  const [isHovering, setIsHovering] = useState(false); 

  const intervalRef = useRef(null); 

  // Filter out any potentially invalid entries
  const validImages = Array.isArray(images)
    ? images.filter((img) => typeof img === "string" && img.trim() !== "")
    : [];
  const imageCount = validImages.length;

  // --- Auto Sliding Logic ---


  const advanceSlide = useCallback(() => {
    setDirection(1); 
    setCurrentIndex((prevIndex) => (prevIndex + 1) % imageCount);
  }, [imageCount]); 

  
  useEffect(() => {
   
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

   
    if (imageCount > 1 && !isHovering) {
      intervalRef.current = setInterval(advanceSlide, SLIDE_DURATION);
    }


    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [imageCount, isHovering, advanceSlide]); 

  // --- Navigation Handlers ---
  const handleNext = (e) => {
    e.stopPropagation();
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % imageCount);

  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + imageCount) % imageCount);

  };

  const goToIndex = (index) => {
 
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
 
  };

  // --- Lightbox Handlers ---
  const openLightbox = (index) => {
    setIsHovering(true); 
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setIsHovering(false); 
  };

  const navigateLightbox = (direction) => {
    setLightboxIndex((prevIndex) =>
      direction === "next"
        ? (prevIndex + 1) % imageCount
        : (prevIndex - 1 + imageCount) % imageCount
    );
  };

  // --- Error Handling ---
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src =
      "https://via.placeholder.com/800x400/ef4444/ffffff?text=Image+Error";
  };

  // --- Render Logic ---

  if (imageCount === 0) {
    return (
      <div className="w-full h-64 md:h-80 lg:h-96 rounded-xl flex flex-col items-center justify-center bg-gray-800/70 border border-gray-700/50 text-gray-500 shadow-inner">
        <FiImageIcon size={48} className="mb-3 opacity-50" />
        <span className="text-sm font-medium">No Images Available</span>
      </div>
    );
  }

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
    }),
  };

  return (
    <>
      {/* Main Gallery Container - Added Hover Handlers */}
      <div
        className="relative w-full h-64 md:h-80 lg:h-96 rounded-xl overflow-hidden shadow-2xl border border-gray-700/50 group bg-gray-900"
        onMouseEnter={() => setIsHovering(true)} 
        onMouseLeave={() => setIsHovering(false)} 
      >

        <div className="absolute inset-0 w-full h-full">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.img
              key={currentIndex}
              src={validImages[currentIndex]}
              alt={`Club image ${currentIndex + 1}`}
              className="absolute inset-0 w-full h-full object-cover cursor-pointer"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 35 }, // Adjusted damping
                opacity: { duration: 0.3 },
              }}
              onClick={() => openLightbox(currentIndex)}
              onError={handleImageError}
              loading="lazy"
            />
          </AnimatePresence>
        </div>

        {/* Subtle overlay on hover */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          aria-hidden="true"
        />

        {/* Navigation Arrows */}
        {imageCount > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute top-1/2 left-2 md:left-3 transform -translate-y-1/2 z-10 p-2 bg-black/40 hover:bg-black/70 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label="Previous image"
            >
              <FiChevronLeft size={24} />
            </button>
            <button
              onClick={handleNext}
              className="absolute top-1/2 right-2 md:right-3 transform -translate-y-1/2 z-10 p-2 bg-black/40 hover:bg-black/70 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label="Next image"
            >
              <FiChevronRight size={24} />
            </button>
          </>
        )}

        {/* Indicator Dots */}
        {imageCount > 1 && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center space-x-2 z-10">
            {validImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentIndex === index
                    ? "bg-white scale-125 ring-1 ring-offset-1 ring-offset-black/30 ring-white/70" // Improved active dot
                    : "bg-white/50 hover:bg-white/80"
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>


      <Transition appear show={lightboxOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeLightbox}>
          {/* Backdrop */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
          </Transition.Child>

          {/* Modal Content */}
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-lg bg-gray-900/50 text-left align-middle shadow-xl transition-all relative border border-gray-700/50">
                  <button
                    onClick={closeLightbox}
                    className="absolute top-2 right-2 z-50 p-2 bg-black/50 hover:bg-black/80 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-white/70"
                    aria-label="Close lightbox"
                  >
                    {" "}
                    <FiX size={20} />{" "}
                  </button>
                  {imageCount > 1 && (
                    <>
                      <button
                        onClick={() => navigateLightbox("prev")}
                        className="absolute top-1/2 left-2 md:left-4 transform -translate-y-1/2 z-40 p-3 bg-black/40 hover:bg-black/70 rounded-full text-white transition-opacity duration-300 focus:outline-none focus:ring-2 focus:ring-white/50"
                        aria-label="Previous image"
                      >
                        {" "}
                        <FiChevronLeft size={28} />{" "}
                      </button>
                      <button
                        onClick={() => navigateLightbox("next")}
                        className="absolute top-1/2 right-2 md:right-4 transform -translate-y-1/2 z-40 p-3 bg-black/40 hover:bg-black/70 rounded-full text-white transition-opacity duration-300 focus:outline-none focus:ring-2 focus:ring-white/50"
                        aria-label="Next image"
                      >
                        {" "}
                        <FiChevronRight size={28} />{" "}
                      </button>
                    </>
                  )}
                  <div className="w-full aspect-video flex items-center justify-center p-1">
                    <AnimatePresence initial={false} mode="wait">
                      <motion.img
                        key={lightboxIndex}
                        src={validImages[lightboxIndex]}
                        alt={`Lightbox image ${lightboxIndex + 1}`}
                        className="max-w-full max-h-[85vh] object-contain rounded"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onError={handleImageError}
                      />
                    </AnimatePresence>
                  </div>
                  {imageCount > 1 && (
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                      {" "}
                      {lightboxIndex + 1} / {imageCount}{" "}
                    </div>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default ImageGallery;
