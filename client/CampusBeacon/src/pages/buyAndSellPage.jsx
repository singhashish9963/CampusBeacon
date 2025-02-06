import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Rocket, Search, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ItemCard from "../components/ItemCard";
import { useBuyAndSell } from "../contexts/buyandsellContext";
import { useAuth } from "../contexts/AuthContext";

const Marketplace = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { items, loading, error, createItem, getAllItems, clearError } =
    useBuyAndSell();

  const [activeTab, setActiveTab] = useState("browse");
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [listingItem, setListingItem] = useState({
    item_name: "",
    price: "",
    category: "",
    description: "",
    item_condition: "",
    owner_contact: "",
    image: null,
  });

  useEffect(() => {
    const fetchItems = async () => {
      try {
        if (!isAuthenticated) {
          navigate("/login", { state: { from: "/marketplace" } });
          return;
        }
        await getAllItems();
      } catch (err) {
        if (
          err.message.includes("unauthorized") ||
          err.message.includes("login")
        ) {
          navigate("/login", { state: { from: "/marketplace" } });
        }
      }
    };

    if (activeTab === "browse") {
      fetchItems();
    }
    return () => {
      clearError();
    };
  }, [activeTab, isAuthenticated, navigate, getAllItems, clearError]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setListingItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setListingItem((prev) => ({ ...prev, image: file }));
    }
  };

 const submitListing = async (e) => {
   e.preventDefault();
   try {
     const formData = new FormData();
     formData.append("item_name", listingItem.item_name);
     formData.append("price", listingItem.price);
     formData.append("category", listingItem.category);
     formData.append("description", listingItem.description);
     formData.append("item_condition", listingItem.item_condition);
     formData.append("owner_contact", listingItem.owner_contact);
     if (listingItem.image) {
       formData.append("image", listingItem.image);
     }

     await createItem(formData);
     setActiveTab("browse");
     setListingItem({
       item_name: "",
       price: "",
       category: "",
       description: "",
       item_condition: "",
       owner_contact: "",
       image: null,
     });
   } catch (err) {
     console.error("Error creating item:", err);
   }
 };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !category || item.category === category;
    return matchesSearch && matchesCategory;
  });

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
          <div className="bg-gray-800 rounded-full flex text-center">
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
                    className="w-full p-3 pl-10 bg-gray-800 rounded-lg text-xl"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="p-2 md:p-3 bg-gray-800 rounded-lg text-l md:text-xl"
                >
                  <option value="">All Categories</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Cycle">Cycle</option>
                </select>
              </div>

              {loading ? (
                <div className="text-center py-8">Loading...</div>
              ) : error ? (
                <div className="text-center py-8 text-red-500">{error}</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredItems.map((item) => (
                    <ItemCard key={item.id} item={item} />
                  ))}
                </div>
              )}
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
                  <div className="grid grid-cols-1 gap-4">
                    <input
                      type="text"
                      name="item_name"
                      value={listingItem.item_name}
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
                    <div className="grid grid-cols-2 gap-4">
                      <select
                        name="category"
                        value={listingItem.category}
                        onChange={handleInputChange}
                        className="bg-gray-700 p-2 md:p-3 rounded-lg"
                        required
                      >
                        <option value="">Select Category</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Furniture">Furniture</option>
                        <option value="Clothing">Clothing</option>
                        <option value="Accessories">Accessories</option>
                        <option value="Cycle">Cycle</option>
                      </select>
                      <select
                        name="item_condition"
                        value={listingItem.item_condition}
                        onChange={handleInputChange}
                        className="bg-gray-700 p-2 md:p-3 rounded-lg"
                        required
                      >
                        <option value="">Item Condition</option>
                        <option value="Good">Good</option>
                        <option value="Fair">Fair</option>
                        <option value="Poor">Poor</option>
                      </select>
                    </div>
                    <textarea
                      name="description"
                      value={listingItem.description}
                      onChange={handleInputChange}
                      placeholder="Item Description"
                      className="bg-gray-700 p-2 md:p-3 rounded-lg"
                      rows="4"
                      required
                    />
                    <input
                      type="tel"
                      name="owner_contact"
                      value={listingItem.owner_contact}
                      onChange={handleInputChange}
                      placeholder="Contact Number"
                      className="bg-gray-700 p-2 md:p-3 rounded-lg"
                      required
                    />
                    <div className="flex items-center space-x-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="imageUpload"
                        required
                      />
                      <label
                        htmlFor="imageUpload"
                        className="flex items-center bg-blue-600 p-2 md:p-3 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
                      >
                        <Plus className="mr-2" /> Upload Image
                      </label>
                      {listingItem.image && (
                        <span className="text-green-400">Image selected</span>
                      )}
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-yellow-500 text-black p-2 md:p-4 rounded-lg hover:bg-yellow-400 mt-4 md:mt-6 transition-colors"
                    disabled={loading}
                  >
                    {loading ? "Listing..." : "List Item"}
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
