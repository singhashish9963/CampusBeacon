import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaBookReader, FaArrowLeft } from "react-icons/fa";
import { MdOutlineBookmarks } from "react-icons/md";
import {
  ChevronRight,
  Download,
  Link,
  Search,
  Book,
  FileText,
  Video,
  Calendar,
  Clock,
  Filter,
  Star,
} from "lucide-react";

const ResourcesPage = () => {
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedResourceType, setSelectedResourceType] = useState("all");

  const branches = [
    { id: "cse", name: "Computer Science", icon: "💻" },
    { id: "ece", name: "Electronics and Communication", icon: "⚡" },
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
        {
          id: 1,
          title: "Introduction to Programming",
          type: "pdf",
          description: "Basic concepts of C programming language",
          downloadUrl: "#",
          size: "2.5 MB",
          uploadDate: "2024-01-15",
          author: "Dr. Smith",
        },
        {
          id: 2,
          title: "Data Structures Fundamentals",
          type: "video",
          description: "Video lectures on arrays and linked lists",
          downloadUrl: "#",
          duration: "1h 30m",
          uploadDate: "2024-01-20",
          author: "Prof. Johnson",
        },
        // Add more resources
      ],
      // Add more years
    },
    // Add more branches
  };

  const resourceTypes = [
    { id: "all", label: "All", icon: FileText },
    { id: "pdf", label: "PDFs", icon: Book },
    { id: "video", label: "Videos", icon: Video },
  ];

  const getResourceIcon = (type) => {
    switch (type) {
      case "pdf":
        return <Book className="w-6 h-6 text-red-400" />;
      case "video":
        return <Video className="w-6 h-6 text-blue-400" />;
      default:
        return <FileText className="w-6 h-6 text-purple-400" />;
    }
  };

  const filteredResources = (branchId, year) => {
    if (!resources[branchId] || !resources[branchId][year]) return [];

    return resources[branchId][year].filter((resource) => {
      const matchesSearch =
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType =
        selectedResourceType === "all" ||
        resource.type === selectedResourceType;
      return matchesSearch && matchesType;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-purple-900 p-8">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <h1 className="text-4xl font-bold text-white flex items-center">
            <FaBookReader className="mr-3" /> Academic Resources
          </h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-black/40 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {!selectedBranch ? (
            <motion.div
              key="branches"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {branches.map((branch) => (
                <motion.div
                  key={branch.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border-2 border-purple-500/50 cursor-pointer hover:bg-purple-900/20 transition-colors"
                  onClick={() => setSelectedBranch(branch.id)}
                >
                  <div className="text-4xl mb-4">{branch.icon}</div>
                  <h2 className="text-xl font-bold text-white">
                    {branch.name}
                  </h2>
                  <p className="text-purple-300 mt-2 flex items-center">
                    View Resources <ChevronRight className="ml-2" />
                  </p>
                </motion.div>
              ))}
            </motion.div>
          ) : !selectedYear ? (
            <motion.div
              key="years"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <button
                onClick={() => setSelectedBranch(null)}
                className="text-fuchsia-400 hover:text-white mb-4 flex items-center transition-colors"
              >
                <FaArrowLeft className="mr-2" /> Back to Branches
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {years.map((year) => (
                  <motion.div
                    key={year}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border-2 border-purple-500/50 cursor-pointer hover:bg-purple-900/20 transition-colors"
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
              key="resources"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <button
                onClick={() => setSelectedYear(null)}
                className="text-fuchsia-400 hover:text-white mb-4 flex items-center transition-colors"
              >
                <FaArrowLeft className="mr-2" /> Back to Years
              </button>

              <div className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border-2 border-purple-500/50">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    {selectedYear} Resources
                  </h2>
                  <div className="flex space-x-2">
                    {resourceTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setSelectedResourceType(type.id)}
                        className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                          selectedResourceType === type.id
                            ? "bg-purple-500 text-white"
                            : "bg-black/30 text-gray-300 hover:bg-purple-500/30"
                        }`}
                      >
                        <type.icon className="w-4 h-4" />
                        <span>{type.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4">
                  {filteredResources(selectedBranch, selectedYear).map(
                    (resource) => (
                      <motion.div
                        key={resource.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-black/30 p-4 rounded-lg border border-purple-500/30 hover:border-purple-500/50 transition-all"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            {getResourceIcon(resource.type)}
                            <div>
                              <h3 className="text-lg font-semibold text-white">
                                {resource.title}
                              </h3>
                              <p className="text-gray-400 mt-1">
                                {resource.description}
                              </p>
                              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                <span className="flex items-center">
                                  <Calendar className="w-4 h-4 mr-1" />
                                  {resource.uploadDate}
                                </span>
                                <span className="flex items-center">
                                  <Clock className="w-4 h-4 mr-1" />
                                  {resource.type === "video"
                                    ? resource.duration
                                    : resource.size}
                                </span>
                                <span className="flex items-center">
                                  <Star className="w-4 h-4 mr-1" />
                                  {resource.author}
                                </span>
                              </div>
                            </div>
                          </div>
                          <motion.a
                            href={resource.downloadUrl}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors"
                          >
                            <Download className="w-4 h-4" />
                            <span>Download</span>
                          </motion.a>
                        </div>
                      </motion.div>
                    )
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ResourcesPage;
