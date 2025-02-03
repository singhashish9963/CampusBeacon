import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Rocket, Search, Plus } from "lucide-react";
import ItemCard from "../components/ItemCard";

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
    contact: "",
    image: null,
  });

  const [marketItems, setMarketItems] = useState([
    {
      id: 1,
      name: "RGB Keyboard",
      price: 2000,
      category: "Electronics",
      description: "Portonics bluetooth backlit rgb mechanical keyboard",
      condition: "Like New",
      contact: "9026695299",
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
      <div className="container mx-auto p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap justify-between items-center mb-4 md:mb-8"
        >
          <div className="flex items-center space-x-2 md:space-x-4">
            <Rocket className="text-yellow-400 animate-pulse" size={48} />
            <h1 className="text-2xl md:text-4xl font-bold tracking-wide">
              College Marketplace
            </h1>
          </div>
          <div className="bg-gray-800 rounded-full flex space-x-2">
            <button
              onClick={() => setActiveTab("browse")}
              className={`px-2 py-2 md:px-4 md:py-2 rounded-full ${
                activeTab === "browse" ? "bg-blue-600" : ""
              }`}
            >
              Browse Items
            </button>
            <button
              onClick={() => setActiveTab("sell")}
              className={`px-2 py-2 md:px-4 md:py-2 rounded-full ${
                activeTab === "sell" ? "bg-blue-600" : ""
              }`}
            >
              Sell Item
            </button>
          </div>
        </motion.div>
        <AnimatePresence mode="wait">
          {activeTab === "browse" && (
            <motion.div
              key="browse"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 mb-4 md:mb-6">
                <div className="relative flex-grow">
                  <input
                    type="text"
                    placeholder="Search marketplace..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 md:p-3 pl-10 bg-gray-800 rounded-lg text-xl"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="p-2 md:p-3 bg-gray-800 rounded-lg"
                >
                  <option value="">All Categories</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Cycle">Cycle</option>
                </select>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {marketItems.map((item, id) => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>
            </motion.div>
          )}
          {activeTab === "sell" && (
            <motion.div
              key="sell"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center items-center"
            >
              <form
                onSubmit={submitListing}
                className="bg-gray-800 p-4 md:p-8 rounded-lg space-y-4 md:space-y-6 w-full max-w-lg shadow-2xl"
              >
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="name"
                      value={listingItem.name}
                      onChange={handleInputChange}
                      placeholder="Item Name"
                      className="bg-gray-700 p-2 md:p-3 rounded-lg"
                      required
                    />
                    <input
                      type="number"
                      name="price"
                      value={listingItem.price}
                      onChange={handleInputChange}
                      placeholder="Price"
                      className="bg-gray-700 p-2 md:p-3 rounded-lg"
                      required
                    />
                    <div className="grid grid-cols-2 gap-4 mt-4 md:mt-0">
                      <select
                        name="category"
                        value={listingItem.category}
                        onChange={handleInputChange}
                        className="bg-gray-700 p-2 md:p-3 rounded-lg"
                        required
                      >
                        <option value="">All Categories</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Furniture">Furniture</option>
                        <option value="Clothing">Clothing</option>
                        <option value="Accessories">Accessories</option>
                        <option value="Cycle">Cycle</option>
                      </select>
                      <select
                        name="condition"
                        value={listingItem.condition}
                        onChange={handleInputChange}
                        className="bg-gray-700 p-2 md:p-3 rounded-lg"
                        required
                      >
                        <option value="">Item Condition</option>
                        <option value="New">New</option>
                        <option value="Like New">Like New</option>
                        <option value="Good">Used/Fair</option>
                        <option value="Fair">Little Damaged</option>
                      </select>
                    </div>
                    <textarea
                      name="description"
                      value={listingItem.description}
                      onChange={handleInputChange}
                      placeholder="Item Description"
                      className="w-full bg-gray-700 p-2 md:p-3 rounded-lg mt-4"
                      rows="4"
                      required
                    />
                    <input
                      type="tel"
                      name="contact"
                      value={listingItem.contactNumber}
                      onChange={handleInputChange}
                      placeholder="Contact Number"
                      className="w-full bg-gray-700 p-2 md:p-3 rounded-lg mt-4"
                      required
                    />
                    <div className="flex items-center space-x-4 mt-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="imageUpload"
                      />
                      <label
                        htmlFor="imageUpload"
                        className="flex items-center bg-blue-600 p-2 md:p-3 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
                      >
                        <Plus className="mr-2" /> Upload Image
                      </label>
                      {listingItem.image && (
                        <img
                          src={listingItem.image}
                          alt="Preview"
                          className="h-24 w-24 object-cover rounded-lg"
                        />
                      )}
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-yellow-500 text-black p-2 md:p-4 rounded-lg hover:bg-yellow-400 mt-4 md:mt-6 transition-colors"
                  >
                    List Item
                  </button>
                </motion.div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Marketplace;
