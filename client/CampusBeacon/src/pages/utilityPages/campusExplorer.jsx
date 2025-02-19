import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

const CampusExplorer = () => {
  const [gameState, setGameState] = useState({
    score: 0,
    energy: 100,
    inventory: [],
    discoveredLocations: [],
    currentTime: "2025-02-15 09:10:49",
    playerName: "ayush-jadaun",
    level: 1,
  });

  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({});
  const [isGameStarted, setIsGameStarted] = useState(false);

  const locations = [
    {
      id: 1,
      name: "MP Hall",
      description:
        "The legendary gathering place of MNNIT. Every brick here tells a story.",
      difficulty: "Easy",
      energyCost: 10,
      points: 100,
      item: "Ancient College ID",
      requiredLevel: 1,
      image: "🏛️",
      clues: [
        "Look behind the main stage",
        "Check the oldest notice board",
        "Search near the podium",
      ],
    },
    {
      id: 2,
      name: "GJLT",
      description:
        "The Great Lecture Theatre holds secrets of countless classes.",
      difficulty: "Medium",
      energyCost: 15,
      points: 150,
      item: "Professor's Notes",
      requiredLevel: 2,
      image: "🎭",
      clues: [
        "Count the steps to the top",
        "Inspect the back row",
        "Look under the oldest desk",
      ],
    },
    {
      id: 3,
      name: "Central Library",
      description: "A labyrinth of knowledge with hidden treasures.",
      difficulty: "Hard",
      energyCost: 20,
      points: 200,
      item: "Rare Manuscript",
      requiredLevel: 3,
      image: "📚",
      clues: [
        "Visit the restricted section",
        "Search the oldest bookshelf",
        "Check the librarian's desk",
      ],
    },
    // Add more locations as needed
  ];

  const exploreLocation = (location) => {
    if (gameState.energy < location.energyCost) {
      showNotification("Not enough energy! Rest to recover.");
      return;
    }

    const success = Math.random() > 0.3; // 70% success rate

    if (success) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      setGameState((prev) => ({
        ...prev,
        score: prev.score + location.points,
        energy: prev.energy - location.energyCost,
        inventory: [...prev.inventory, location.item],
        discoveredLocations: [...prev.discoveredLocations, location.id],
      }));

      setModalContent({
        title: "🎉 Discovery!",
        message: `You found ${location.item}!`,
        type: "success",
      });
    } else {
      setGameState((prev) => ({
        ...prev,
        energy: prev.energy - Math.floor(location.energyCost / 2),
      }));

      setModalContent({
        title: "❌ Search Failed",
        message: "Keep trying! Here's a new clue...",
        type: "error",
      });
    }
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B1026] to-[#1A1B35] text-white p-4 md:p-8">
      {/* Game Header */}
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            MNNIT Explorer
          </h1>
          <p className="text-blue-400 text-lg">
            Discover the Secrets of Campus
          </p>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          className="fixed top-4 right-4 bg-black/30 backdrop-blur-lg rounded-lg p-4 space-y-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center space-x-2">
            <span className="text-yellow-400">🏆</span>
            <span>{gameState.score} points</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-red-400">⚡</span>
            <div className="w-32 h-2 bg-gray-700 rounded-full">
              <div
                className="h-full bg-gradient-to-r from-red-500 to-green-500 rounded-full"
                style={{ width: `${gameState.energy}%` }}
              />
            </div>
          </div>
          <div className="text-sm text-gray-400">Level {gameState.level}</div>
        </motion.div>

        {/* Locations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {locations.map((location) => (
            <motion.div
              key={location.id}
              className={`relative bg-gray-800/30 rounded-xl p-6 border border-gray-700 hover:border-purple-500 transition-all
                ${
                  gameState.discoveredLocations.includes(location.id)
                    ? "opacity-75"
                    : ""
                }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="text-6xl mb-4">{location.image}</div>
              <h3 className="text-xl font-bold text-purple-400 mb-2">
                {location.name}
              </h3>
              <p className="text-gray-400 mb-4">{location.description}</p>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Difficulty:</span>
                  <span
                    className={`text-sm ${
                      location.difficulty === "Easy"
                        ? "text-green-400"
                        : location.difficulty === "Medium"
                        ? "text-yellow-400"
                        : "text-red-400"
                    }`}
                  >
                    {location.difficulty}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Energy Cost:</span>
                  <span className="text-sm text-blue-400">
                    ⚡ {location.energyCost}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Reward:</span>
                  <span className="text-sm text-yellow-400">
                    🏆 {location.points}
                  </span>
                </div>
              </div>

              <button
                onClick={() => exploreLocation(location)}
                disabled={gameState.energy < location.energyCost}
                className={`mt-4 w-full py-2 px-4 rounded-lg font-medium transition-all
                  ${
                    gameState.energy >= location.energyCost
                      ? "bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                      : "bg-gray-700 cursor-not-allowed"
                  }`}
              >
                {gameState.discoveredLocations.includes(location.id)
                  ? "Revisit Location"
                  : "Explore Location"}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Modal */}
        <AnimatePresence>
          {showModal && (
            <>
              <motion.div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowModal(false)}
              />
              <motion.div
                className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                         bg-gray-900 rounded-xl p-6 w-full max-w-md border border-gray-700"
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
                  className="w-full py-2 px-4 bg-gradient-to-r from-purple-500 to-blue-500 
                           hover:from-purple-600 hover:to-blue-600 rounded-lg font-medium"
                >
                  Continue Exploring
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Inventory Drawer */}
        <motion.div
          className="fixed bottom-4 left-4 bg-black/30 backdrop-blur-lg rounded-lg p-4 max-w-xs"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-sm font-medium text-gray-400 mb-2">Inventory</h3>
          <div className="flex flex-wrap gap-2">
            {gameState.inventory.map((item, index) => (
              <motion.div
                key={index}
                className="bg-gray-800 rounded px-2 py-1 text-sm"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                {item}
              </motion.div>
            ))}
            {gameState.inventory.length === 0 && (
              <span className="text-gray-500 text-sm">No items yet...</span>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CampusExplorer;
