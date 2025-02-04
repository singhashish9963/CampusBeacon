import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Rocket, Search, Plus, Loader } from "lucide-react";
import { useLostAndFound } from "../contexts/lostandfoundContext";
import { useAuth } from "../contexts/AuthContext";
import LostItemCard from "../components/LostItemCard";

const LostAndFound = () => {
  const { items, addItem, fetchItems, loading } = useLostAndFound();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("browse");
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [listingItem, setListingItem] = useState({
    item_name: "",
    description: "",
    location_found: "",
    owner_contact: "",
    image: null,
  });

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setListingItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) {
      console.error("Image size should be less than 5MB");
      return;
    }
    setListingItem((prev) => ({ ...prev, image: file }));
  };

  const submitListing = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("item_name", listingItem.item_name);
      formData.append("description", listingItem.description);
      formData.append("location_found", listingItem.location_found);
      formData.append("owner_contact", listingItem.owner_contact);
      if (listingItem.image) {
        formData.append("image", listingItem.image);
      }

      await addItem(formData);
      setActiveTab("browse");
      setListingItem({
        item_name: "",
        description: "",
        location_found: "",
        owner_contact: "",
        image: null,
      });
    } catch (error) {
      console.error("Failed to list item:", error);
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.item_name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory = !category || item.description === category;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-black to-purple-900">
        <Loader className="animate-spin text-white" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-black to-purple-900 text-white">
      <div className="container mx-auto p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap justify-between items-center mb-8"
        >
          <div className="flex items-center space-x-4">
            <Rocket className="text-yellow-400 animate-pulse" size={48} />
            <h1 className="text-4xl font-bold tracking-wide">Lost & Found</h1>
          </div>
          <div className="bg-gray-800 rounded-full flex">
            <button
              onClick={() => setActiveTab("browse")}
              className={`px-6 py-2 rounded-full transition-colors ${
                activeTab === "browse" ? "bg-blue-600" : ""
              }`}
            >
              Browse Items
            </button>
            <button
              onClick={() => setActiveTab("found")}
              className={`px-6 py-2 rounded-full transition-colors ${
                activeTab === "found" ? "bg-blue-600" : ""
              }`}
            >
              Report Found
            </button>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {activeTab === "browse" ? (
            <motion.div
              key="browse"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search lost items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-3 pl-10 bg-gray-800 rounded-lg text-white"
                  />
                </div>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="p-3 bg-gray-800 rounded-lg text-white"
                >
                  <option value="">All Categories</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Documents">Documents</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Others">Others</option>
                </select>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <LostItemCard
                      key={item.id}
                      item={item}
                      isOwner={user?.id === item.userId}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-10">
                    <p className="text-gray-400 text-lg">No items found</p>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="found"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center"
            >
              <form
                onSubmit={submitListing}
                className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-2xl w-full"
              >
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Item Name *
                    </label>
                    <input
                      type="text"
                      name="item_name"
                      value={listingItem.item_name}
                      onChange={handleInputChange}
                      className="w-full p-3 bg-gray-700 rounded-lg"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={listingItem.description}
                      onChange={handleInputChange}
                      className="w-full p-3 bg-gray-700 rounded-lg"
                      rows="4"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Location Found *
                    </label>
                    <input
                      type="text"
                      name="location_found"
                      value={listingItem.location_found}
                      onChange={handleInputChange}
                      className="w-full p-3 bg-gray-700 rounded-lg"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Contact Number *
                    </label>
                    <input
                      type="tel"
                      name="owner_contact"
                      value={listingItem.owner_contact}
                      onChange={handleInputChange}
                      className="w-full p-3 bg-gray-700 rounded-lg"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Item Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="imageUpload"
                    />
                    <label
                      htmlFor="imageUpload"
                      className="flex items-center justify-center w-full p-3 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors"
                    >
                      <Plus className="mr-2" />
                      Upload Image
                    </label>
                    {listingItem.image && (
                      <div className="mt-2">
                        <img
                          src={URL.createObjectURL(listingItem.image)}
                          alt="Preview"
                          className="h-32 w-32 object-cover rounded-lg"
                        />
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-yellow-500 text-black p-4 rounded-lg hover:bg-yellow-400 transition-colors font-medium"
                  >
                    Submit Found Item
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LostAndFound;
