import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MNNITTimeCapsule = () => {
  const [currentUser] = useState("ayush-jadaun");
  const [currentTime] = useState("2025-02-15 09:14:35");
  const [message, setMessage] = useState("");
  const [selectedYear, setSelectedYear] = useState(2026);
  const [capsules, setCapsules] = useState([
    {
      id: 1,
      message:
        "To future CSE students: The best spot to study during exams is the reading room behind Computer Centre. It's always quiet and has perfect AC temperature!",
      author: "rahul_kumar",
      createdAt: "2024-12-15 14:30:00",
      unlockDate: "2026-01-01",
      likes: 42,
      location: "Computer Centre",
      mood: "studious",
    },
    {
      id: 2,
      message:
        "Pro tip: The canteen behind GJLT makes the best maggi at 2 AM during project submissions. Trust me, you'll need this info!",
      author: "priya_singh",
      createdAt: "2024-11-20 02:15:00",
      unlockDate: "2025-08-01",
      likes: 89,
      location: "GJLT Canteen",
      mood: "hungry",
    },
    {
      id: 3,
      message:
        "Found a secret spot for the best sunset view - go to the Civil Department's roof (carefully!). Perfect for photography and peace of mind.",
      author: "ayush-jadaun",
      createdAt: "2025-01-01 17:45:00",
      unlockDate: "2025-12-31",
      likes: 156,
      location: "Civil Department",
      mood: "peaceful",
    },
  ]);

  const moods = [
    "happy",
    "studious",
    "stressed",
    "excited",
    "nostalgic",
    "peaceful",
    "hungry",
  ];
  const locations = [
    "MP Hall",
    "GJLT",
    "Computer Centre",
    "Central Library",
    "Sports Ground",
    "Canteen",
    "Hostel",
    "Civil Department",
  ];

  const [selectedMood, setSelectedMood] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({});

  const createCapsule = () => {
    if (!message || !selectedLocation || !selectedMood) {
      setModalContent({
        title: "Missing Details",
        message: "Please fill in all the fields!",
        type: "error",
      });
      setShowModal(true);
      return;
    }

    const newCapsule = {
      id: capsules.length + 1,
      message,
      author: currentUser,
      createdAt: currentTime,
      unlockDate: `${selectedYear}-01-01`,
      likes: 0,
      location: selectedLocation,
      mood: selectedMood,
    };

    setCapsules([newCapsule, ...capsules]);
    setMessage("");
    setSelectedLocation("");
    setSelectedMood("");

    setModalContent({
      title: "Time Capsule Created!",
      message: "Your message has been sealed for future students!",
      type: "success",
    });
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B1026] to-[#1A1B35] text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600">
            MNNIT Time Capsule
          </h1>
          <p className="text-blue-400 text-lg">
            Leave Your Legacy for Future MNNITians
          </p>
        </motion.div>

        {/* Create Capsule Form */}
        <motion.div
          className="bg-gray-800/30 rounded-xl p-6 mb-8 border border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-2xl font-bold mb-6 text-amber-400">
            Create New Time Capsule
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 mb-2">Your Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share your wisdom, experiences, or secrets..."
                className="w-full bg-gray-900/50 rounded-lg p-4 text-white placeholder-gray-500 focus:ring-2 focus:ring-amber-500 border border-gray-700"
                rows="4"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-400 mb-2">Location</label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full bg-gray-900/50 rounded-lg p-3 text-white border border-gray-700"
                >
                  <option value="">Select Location</option>
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-400 mb-2">Mood</label>
                <select
                  value={selectedMood}
                  onChange={(e) => setSelectedMood(e.target.value)}
                  className="w-full bg-gray-900/50 rounded-lg p-3 text-white border border-gray-700"
                >
                  <option value="">Select Mood</option>
                  {moods.map((mood) => (
                    <option key={mood} value={mood}>
                      {mood}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-400 mb-2">Unlock Year</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full bg-gray-900/50 rounded-lg p-3 text-white border border-gray-700"
                >
                  {[2026, 2027, 2028, 2029, 2030].map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={createCapsule}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 rounded-lg font-medium transition-all"
            >
              Seal Time Capsule 🕰️
            </button>
          </div>
        </motion.div>

        {/* Capsules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {capsules.map((capsule, index) => (
            <motion.div
              key={capsule.id}
              className="bg-gray-800/30 rounded-xl p-6 border border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-amber-400 font-medium">
                    @{capsule.author}
                  </span>
                  <p className="text-sm text-gray-500">
                    Created: {new Date(capsule.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full text-sm">
                    Unlocks: {new Date(capsule.unlockDate).getFullYear()}
                  </span>
                </div>
              </div>

              <p className="text-gray-300 mb-4">{capsule.message}</p>

              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <span className="bg-gray-700 px-3 py-1 rounded-full text-sm">
                    📍 {capsule.location}
                  </span>
                  <span className="bg-gray-700 px-3 py-1 rounded-full text-sm">
                    😊 {capsule.mood}
                  </span>
                </div>
                <button className="flex items-center space-x-1 text-gray-400 hover:text-amber-400">
                  <span>❤️</span>
                  <span>{capsule.likes}</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Modal */}
        <AnimatePresence>
          {showModal && (
            <>
              <motion.div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowModal(false)}
              />
              <motion.div
                className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                         bg-gray-900 rounded-xl p-6 w-full max-w-md border border-gray-700 z-50"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <h2
                  className={`text-2xl font-bold mb-4 ${
                    modalContent.type === "success"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {modalContent.title}
                </h2>
                <p className="text-gray-300 mb-6">{modalContent.message}</p>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-full py-2 px-4 bg-gradient-to-r from-amber-500 to-orange-500 
                           hover:from-amber-600 hover:to-orange-600 rounded-lg font-medium"
                >
                  Close
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MNNITTimeCapsule;
