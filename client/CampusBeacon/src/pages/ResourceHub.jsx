import React, { useState } from "react";
import { motion } from "framer-motion";

const ResourcesPage = () => {
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
};

{/* =================
        Dummy Data
    ==================
 */}
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
      { name: "Python Tutorial", link: "#", type: "Video" },
    ],
    "Second Year": [
      { name: "Data Structures", link: "#", type: "PDF" },
      { name: "Algorithms", link: "#", type: "PDF" },
    ],
    // Add more years and resources
  },
  ece: {
    "First Year": [
      { name: "Circuit Theory", link: "#", type: "PDF" },
      { name: "Digital Electronics", link: "#", type: "PDF" },
    ],
    // Add more years and resources
  },
  // Add more branches
};
