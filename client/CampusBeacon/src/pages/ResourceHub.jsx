import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaBookReader } from "react-icons/fa";
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
  { id: "mech", name: "Mechanical", icon: "⚙️" },
  { id: "civil", name: "Civil", icon: "🏗️" },
  { id: "chem", name: "Chemical", icon: "🧪" },
  { id: "eee", name: "Electrical", icon: "🔌" },
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
  <div className="min-h-screen bg-gradient-to-br from-blue-950 via-black to-purple-900 p-8">
      <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-white mb-8 flex items-center"
        >
          <FaBookReader className="mr-3 " /> Academic Resources
        </motion.h1>

  </div>

);
};

export default ResourcesPage;