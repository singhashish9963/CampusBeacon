import React, { useState } from "react";
import { motion } from "framer-motion";

const MNNITFactsGenerator = () => {
  const [currentFact, setCurrentFact] = useState(0);

  const facts = [
    {
      title: "Historical Legacy",
      fact: "MNNIT was established in 1961 as Motilal Nehru Regional Engineering College (MNREC) and achieved NIT status in 2002.",
      icon: "🏛️",
    },
    {
      title: "Campus Cosmos",
      fact: "MNNIT's sprawling 222-acre campus is one of the largest in Prayagraj, equivalent to launching 168 football fields into space!",
      icon: "🌍",
    },
    {
      title: "Tech Constellation",
      fact: "The Computer Centre has over 1000 computers, forming a digital constellation of knowledge.",
      icon: "💻",
    },
    {
      title: "Library Universe",
      fact: "The central library houses over 150,000 books, enough to build a tower higher than 50 space shuttles stacked on top of each other!",
      icon: "📚",
    },
    {
      title: "Research Nebula",
      fact: "MNNIT publishes hundreds of research papers annually, contributing to the galaxy of global knowledge.",
      icon: "🔬",
    },
    {
      title: "Sports Meteors",
      fact: "The annual sports meet 'Krida' is like a meteor shower of talent, featuring over 20 different sports events.",
      icon: "🏃",
    },
    {
      title: "Cultural Supernova",
      fact: "Culrav, the annual cultural festival, explodes with talent from over 100 colleges across India.",
      icon: "🎭",
    },
    {
      title: "Tech Orbit",
      fact: "Avishkar, MNNIT's technical festival, orbits around 50+ events and workshops.",
      icon: "🛠️",
    },
    {
      title: "Alumni Galaxies",
      fact: "MNNIT alumni have spread across the globe like stars, shining in companies like Google, Microsoft, and Apple.",
      icon: "👨‍🎓",
    },
    {
      title: "Green Planet",
      fact: "The campus houses over 10,000 trees, creating its own ecosystem like a self-sustaining space station.",
      icon: "🌳",
    },
  ];

  const generateNewFact = () => {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * facts.length);
    } while (newIndex === currentFact);
    setCurrentFact(newIndex);
  };

  return (
    <div className="min-h-screen bg-[#0B1026] text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-600">
            MNNIT Facts Explorer
          </h1>
          <p className="text-blue-400">
            Discover the Universe of MNNIT Allahabad
          </p>
        </motion.div>

        {/* Fact Card */}
        <motion.div
          key={currentFact}
          className="bg-gray-800/30 rounded-2xl p-6 md:p-8 border border-gray-700 mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center mb-4">
            <span className="text-4xl mr-4">{facts[currentFact].icon}</span>
            <h2 className="text-xl md:text-2xl font-bold text-purple-400">
              {facts[currentFact].title}
            </h2>
          </div>
          <p className="text-gray-300 text-lg leading-relaxed">
            {facts[currentFact].fact}
          </p>
        </motion.div>

        {/* Generate Button */}
        <div className="text-center">
          <motion.button
            onClick={generateNewFact}
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full font-bold text-lg
                     hover:from-purple-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-purple-500/25"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Generate New Fact 🚀
          </motion.button>
        </div>

        {/* Stats */}
        <motion.div
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-gray-800/30 rounded-lg p-4 text-center">
            <div className="text-2xl text-blue-400">1961</div>
            <div className="text-sm text-gray-400">Established</div>
          </div>
          <div className="bg-gray-800/30 rounded-lg p-4 text-center">
            <div className="text-2xl text-blue-400">222</div>
            <div className="text-sm text-gray-400">Acres</div>
          </div>
          <div className="bg-gray-800/30 rounded-lg p-4 text-center">
            <div className="text-2xl text-blue-400">6000+</div>
            <div className="text-sm text-gray-400">Students</div>
          </div>
          <div className="bg-gray-800/30 rounded-lg p-4 text-center">
            <div className="text-2xl text-blue-400">12</div>
            <div className="text-sm text-gray-400">Departments</div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          className="mt-12 text-center text-sm text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Current Explorer: {new Date().toISOString().split("T")[0]} • MNNIT
          Allahabad
        </motion.div>
      </div>
    </div>
  );
};

export default MNNITFactsGenerator;
