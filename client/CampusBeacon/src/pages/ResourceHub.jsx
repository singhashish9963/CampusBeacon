import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaBookReader } from "react-icons/fa";
import { ChevronRight } from "lucide-react";
import { Download, Link } from "lucide-react";
import { MdOutlineBookmarks } from "react-icons/md";
import { FaArrowLeft } from "react-icons/fa";

const ResourcesPage = () => {
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  {
    /* =================
        Dummy Data
    ==================
 */
  }
  const branches = [
    { id: "cse", name: "Computer Science", icon: "💻" },
    { id: "ece", name: "Electronics and Communicaton", icon: "⚡" },
    { id: "eee", name: "Electrical", icon: "🔌" },
    { id: "mech", name: "Mechanical", icon: "⚙️" },
    { id: "civil", name: "Civil", icon: "🏗️" },
    { id: "chem", name: "Chemical", icon: "🧪" },
    { id: "pie", name: "Production and Industrial", icon: "🏭" },
  ];
  const years = ["First Year", "Second Year", "Third Year", "Fourth Year"];
  const resources = {
    cse: {
      "First Year": [
        { name: "Programming Basics", link: "#", type: "PDF" },
        { name: "C Language Notes", link: "#", type: "PDF" },
        {
          name: "Artificial Intelligence and Machine Learning",
          link: "#",
          type: "Video",
        },
      ],
      "Second Year": [
        { name: "Data Structures Algorithm", link: "#", type: "PDF" },
        { name: "Discrete Mathematics", link: "#", type: "PDF" },
      ],
    },
    ece: {
      "First Year": [
        { name: "Basic Electronics", link: "#", type: "PDF" },
        { name: "Digital Electronics", link: "#", type: "PDF" },
      ],
      "Second Year": [
        { name: "Principle of Communtication", link: "#", type: "PDF" },
        { name: "CAD for Electronics", link: "#", type: "PDF" },
      ],
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-purple-900 p-8">
      <div className="container mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-white mb-8 flex items-center"
        >
          <FaBookReader className="mr-3 " /> Academic Resources
        </motion.h1>

        {!selectedBranch ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {branches.map((branch) => (
              <motion.div
                key={branch.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border-2 border-purple-500/50 cursor-pointer"
                onClick={() => setSelectedBranch(branch.id)}
              >
                <div className="text-4xl mb-4">{branch.icon}</div>
                <h2 className="text-xl font-bold text-white">{branch.name}</h2>
                <p className="text-purple-300 mt-2 flex items-center">
                  View Resources <ChevronRight className="ml-2" />
                </p>
              </motion.div>
            ))}
          </div>
        ) : !selectedYear ? (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <button
              onClick={() => setSelectedBranch(null)}
              className="text-fuchsia-400 hover:text-white mb-4 flex items-center"
            >
              <FaArrowLeft className="mr-2" /> Back to Branches
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {years.map((year) => (
                <motion.div
                  key={year}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border-2 border-purple-500/50 cursor-pointer"
                  onClick={() => setSelectedYear(year)}
                >
                  <MdOutlineBookmarks className="w-8 h-8 mb-4 text-purple-400" />
                  <h2 className="text-xl font-bold text-white">{year}</h2>
                  <p className="text-purple-300 mt-2 flex items-center">
                    View Resources <ChevronRight className="ml-2" />
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <button
              onClick={() => setSelectedYear(null)}
              className="text-fuchsia-400 hover:text-white mb-4 flex items-center"
            >
              <FaArrowLeft className="mr-2" /> Back to Years
            </button>
            <div className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border-2 border-purple-500/50">
              <h2 className="text-2xl font-bold text-white mb-6">
                {selectedYear} Resources
              </h2>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ResourcesPage;
