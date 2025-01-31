import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Rocket } from "lucide-react";
const Marketplace = () => {
  const [activeTab, setActiveTab] = useState("browse");
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [listingItem, setListingItem] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    condition: "",
    contactNumber: "",
    image: null,
  });

  const [marketItems, setMarketItems] = useState([
    {
      id: 1,
      name: "Gaming Laptop",
      price: 799.99,
      category: "Electronics",
      description: "High-performance gaming laptop, 16GB RAM, RTX 3060",
      condition: "Like New",
      contactNumber: "555-1234",
      image: "/",
    },
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setListingItem((prev) => ({ ...prev, [name]: value }));
  };
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setListingItem((prev) => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const submitListing = (e) => {
    e.preventDefault();
    setMarketItems([...marketItems, { ...listingItem, id: Date.now() }]);
    setActiveTab("browse");
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-black to-purple-900 text-white">
      <div className="container mx-auto p-8">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-8"
        >
          <div className="flex items-center space-x-4">
            <Rocket className="text-yellow-400 animate-pulse" size={48} />
            <h1 className="text-4xl font-bold tracking-wide">
              College Marketplace
            </h1>
          </div>
          <div className="bg-gray-800 rounded-full">
            <button
              onClick={() => setActiveTab("browse")}
              className={`px-4 py-2 rounded-full ${
                activeTab === "browse" ? "bg-blue-600" : ""
              }`}
            >
              Browse Items
            </button>
            <button
              onClick={() => setActiveTab("sell")}
              className={`px-4 py-2 rounded-full ${
                activeTab === "sell" ? "bg-blue-600" : ""
              }`}
            >
              Sell Item
            </button>
          </div>
        </motion.div>
        <AnimatePresence mode="wait">
          {activeTab == "browse" && (
            <motion.div
              key="browse"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex space-x-4 mb-6">
                <div className="relative flex-grow">
                  <input
                    type="text"
                    placeholder="Search marketplace..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-3 pl-10 bg-gray-800 rounded-lg text-xl"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Marketplace;
