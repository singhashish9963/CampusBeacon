import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, MapPin, Phone, Star, X } from "lucide-react";
import { IoFastFoodOutline } from "react-icons/io5";

const StarRating = ({ rating, setRating }) => {
  return (
    <div className="flex space-x-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-8 h-8 cursor-pointer ${
            star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-400"
          }`}
          onClick={() => setRating(star)}
        />
      ))}
    </div>
  );
};

const CollegeEateries = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [ratingModal, setRatingModal] = useState(null);
  const [currentRating, setCurrentRating] = useState(0);

  const [eateries, setEateries] = useState([
    {
      id: 1,
      name: "S Nath Canteen",
      images: [],
      menuImage: "",
      location: "Yamuna Canteen",
      contact: "+91 98765-43210",
      openTime: "08:00 AM",
      closeTime: "10:00 PM",
      ratings: [],
      averageRating: 4.5,
      isOpen: false,
    },
    {
      id: 2,
      name: "Namastey Tech",
      images: [],
      menuImage: "",
      location: "Yamuna Canteen",
      contact: "+91 1234567890",
      openTime: "09:00 AM",
      closeTime: "06:00 PM",
      ratings: [],
      averageRating: 4.2,
      isOpen: false,
    },
  ]);

  const checkIsOpen = (openTime, closeTime) => {
    const parseTime = (timeStr) => {
      const [time, modifier] = timeStr.split(" ");
      let [hours, minutes] = time.split(":").map(Number);

      if (modifier === "PM" && hours !== 12) hours += 12;
      if (modifier === "AM" && hours === 12) hours = 0;

      return hours + minutes / 60;
    };

    const now = new Date();
    const currentHour = now.getHours() + now.getMinutes() / 60;

    return (
      currentHour >= parseTime(openTime) && currentHour <= parseTime(closeTime)
    );
  };

  const submitRating = (eateryId) => {
    setEateries((prev) =>
      prev.map((eatery) => {
        if (eatery.id === eateryId) {
          const newRatings = [...eatery.ratings, currentRating];
          const newAverage =
            newRatings.reduce((a, b) => a + b) / newRatings.length;
          return {
            ...eatery,
            ratings: newRatings,
            averageRating: Number(newAverage.toFixed(1)),
          };
        }
        return eatery;
      })
    );
    setRatingModal(null);
    setCurrentRating(0);
  };
  useEffect(() => {
    setEateries((prevEateries) =>
      prevEateries.map((eatery) => ({
        ...eatery,
        isOpen: checkIsOpen(eatery.openTime, eatery.closeTime),
      }))
    );
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-purple-900 p-8">
      <div className="container mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-white mb-8 flex items-center"
        >
          <IoFastFoodOutline className="mr-3" /> MNNIT Eateries
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {eateries.map((eatery) => (
            <motion.div
              key={eatery.id}
              whileHover={{ scale: 1.02 }}
              className="bg-black/40 backdrop-blur-lg rounded-xl overflow-hidden border-2 border-purple-500/50"
            >
              <div
                className="relative h-48"
                onClick={() => setSelectedImage(eatery.images)}
              >
                <img
                  src={eatery.images[0]}
                  alt={eatery.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-black/60 px-3 py-1 rounded-full flex items-center">
                  <Star className="w-7 h-7 text-yellow-400 mr-2" />
                  <span className="text-white text-xl">
                    {eatery.averageRating}
                  </span>
                </div>
                {eatery.isOpen && (
                  <div className="absolute top-4 left-4 bg-green-400/70 px-3 py-1 rounded-full">
                    <span className="text-white text-l">Open Now</span>
                  </div>
                )}
                {eatery.name == "Namastey Tech" && (
                  <div className="absolute top-15 left-4 bg-green-400/70 px-3 py-1 rounded-full">
                    <span className="text-white text-l">Pure Veg</span>
                  </div>
                )}
                {!eatery.isOpen && (
                  <div className="absolute top-4 left-4 bg-red-500/70 px-3 py-1 rounded-full">
                    <span className="text-white text-l">Closed Now</span>
                  </div>
                )}
              </div>

              <div className="p-6">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {eatery.name}
                </h2>

                <div className="space-y-2 mb-4">
                  <p className="text-gray-300 flex items-center">
                    <MapPin className="w-4 h-4 mr-2" /> {eatery.location}
                  </p>
                  <p className="text-gray-300 flex items-center">
                    <Clock className="w-4 h-4 mr-2" /> {eatery.openTime} -{" "}
                    {eatery.closeTime}
                  </p>
                  <p className="text-gray-300 flex items-center">
                    <Phone className="w-4 h-4 mr-2" /> {eatery.contact}
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setRatingModal(eatery.id)}
                  className="w-1/2 mt-2 bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-lg transition-colors"
                >
                  Rate
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
              onClick={() => setSelectedImage(null)}
            >
              <div className="relative max-w-4xl w-full">
                <button
                  className="absolute -top-12 right-0 text-white"
                  onClick={() => setSelectedImage(null)}
                >
                  <X className="w-8 h-8" />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {selectedImage.map((img, index) => (
                    <motion.img
                      key={index}
                      src={img}
                      alt="Canteen View"
                      className="w-full h-64 object-cover rounded-lg"
                      layoutId={`canteen-image-${index}`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
          {/*======================= 
                Pop up for menu
           =========================
           */}

          {selectedMenu && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
              onClick={() => setSelectedMenu(null)}
            >
              <div className="relative max-w-2xl w-full">
                <button
                  className="absolute -top-12 right-0 text-white"
                  onClick={() => setSelectedMenu(null)}
                >
                  <X className="w-8 h-8" />
                </button>
                <motion.img
                  src={selectedMenu}
                  alt="Menu"
                  className="w-full rounded-lg"
                  layoutId="menu-image"
                />
              </div>
            </motion.div>
          )}
          {/*======================= 
                Pop up for Rating 
           =========================
           */}
          {ratingModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="bg-gray-900 p-6 rounded-xl max-w-md w-full"
              >
                <h3 className="text-2xl font-bold text-white mb-4">
                  Rate {eateries.find((e) => e.id === ratingModal)?.name}
                </h3>
                <div className="flex justify-center mb-6">
                  <StarRating
                    rating={currentRating}
                    setRating={setCurrentRating}
                  />
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={() => submitRating(ratingModal)}
                    className="flex-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
                  >
                    Submit
                  </button>
                  <button
                    onClick={() => {
                      setRatingModal(null);
                      setCurrentRating(0);
                    }}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CollegeEateries;
