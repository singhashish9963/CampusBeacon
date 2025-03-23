import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Rocket,
  Search,
  Plus,
  Loader,
  Camera,
  Map,
  Phone,
  Tag,
  Filter,
  SortAsc,
  AlertCircle,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchLostItems,
  addLostItem,
  clearLostAndFoundError,
} from "../../slices/lostAndFoundSlice";
import LostItemCard from "../../components/LostItemCard";

const LostAndFound = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.lostAndFound);
  const { user } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState("browse");
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [notification, setNotification] = useState(null);

  const [listingItem, setListingItem] = useState({
    item_name: "",
    description: "",
    location_found: "",
    owner_contact: "",
    category: "",
    image: null,
  });

  useEffect(() => {
    if (activeTab === "browse") {
      dispatch(fetchLostItems());
    }
  }, [activeTab, dispatch]);

  useEffect(() => {
    if (error) {
      setNotification({
        type: "error",
        message: error,
      });
      dispatch(clearLostAndFoundError());
    }
  }, [error, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setListingItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showNotification("Image size should be less than 5MB", "error");
        return;
      }
      setListingItem((prev) => ({ ...prev, image: file }));
    }
  };

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(listingItem).forEach((key) => {
        formData.append(key, listingItem[key]);
      });

      await dispatch(addLostItem(formData)).unwrap();
      setActiveTab("browse");
      setNotification({
        type: "success",
        message: "Item reported successfully!",
      });
    } catch (err) {
      setNotification({
        type: "error",
        message: err.message || "Error reporting item",
      });
    }
  };

  const filteredAndSortedItems = React.useMemo(() => {
    let result = items.filter((item) => {
      const matchesSearch = item.item_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory = !category || item.category === category;
      return matchesSearch && matchesCategory;
    });

    // Sort items by creation date
    switch (sortBy) {
      case "newest":
        return result.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      case "oldest":
        return result.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
      default:
        return result;
    }
  }, [items, searchTerm, category, sortBy]);

  const categories = [
    "Electronics",
    "Documents",
    "Accessories",
    "Books",
    "Cards",
    "Others",
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-black to-purple-900">
        <div className="flex flex-col items-center space-y-4">
          <Loader className="animate-spin text-white" size={48} />
          <p className="text-white text-lg">Loading items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-black to-purple-900 text-white">
      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
              notification.type === "error" ? "bg-red-500" : "bg-green-500"
            }`}
          >
            <div className="flex items-center space-x-2">
              <AlertCircle size={20} />
              <span>{notification.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto p-4 md:p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0"
        >
          <div className="flex items-center space-x-4">
            <Rocket className="text-yellow-400 animate-pulse" size={48} />
            <h1 className="text-4xl font-bold tracking-wide bg-gradient-to-r from-yellow-400 to-purple-400 bg-clip-text text-transparent">
              Lost &amp; Found
            </h1>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-full flex p-1">
            <button
              onClick={() => setActiveTab("browse")}
              className={`px-6 py-2 rounded-full transition-all duration-300 ${
                activeTab === "browse"
                  ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-black shadow-lg"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Browse Items
            </button>
            <button
              onClick={() => setActiveTab("found")}
              className={`px-6 py-2 rounded-full transition-all duration-300 ${
                activeTab === "found"
                  ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-black shadow-lg"
                  : "text-gray-300 hover:text-white"
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
              {/* Search and Filters */}
              <motion.div
                className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 mb-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search lost items..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full p-3 pl-10 bg-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 transition-all"
                    />
                  </div>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <Filter size={20} />
                    <span>Filters</span>
                  </button>
                </div>

                {/* Expandable Filters */}
                <AnimatePresence>
                  {showFilters && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="p-3 bg-gray-700/50 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 transition-all"
                        >
                          <option value="">All Categories</option>
                          {categories.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="p-3 bg-gray-700/50 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 transition-all"
                        >
                          <option value="newest">Newest First</option>
                          <option value="oldest">Oldest First</option>
                        </select>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Items Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedItems.length > 0 ? (
                  filteredAndSortedItems.map((item) => (
                    <LostItemCard
                      key={item.id}
                      item={item}
                      isOwner={user?.id === item.userId}
                    />
                  ))
                ) : (
                  <motion.div
                    className="col-span-full text-center py-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="flex flex-col items-center space-y-4">
                      <Search size={48} className="text-gray-400" />
                      <p className="text-gray-400 text-lg">No items found</p>
                    </div>
                  </motion.div>
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
                onSubmit={handleSubmit}
                className="bg-gray-800/30 backdrop-blur-sm p-8 rounded-xl shadow-xl max-w-2xl w-full border border-white/10"
              >
                <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-yellow-400 to-purple-400 bg-clip-text text-transparent">
                  Report Found Item
                </h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      Item Name *
                    </label>
                    <input
                      type="text"
                      name="item_name"
                      value={listingItem.item_name}
                      onChange={handleInputChange}
                      className="w-full p-3 bg-gray-700/50 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={listingItem.category}
                      onChange={handleInputChange}
                      className="w-full p-3 bg-gray-700/50 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 transition-all"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={listingItem.description}
                      onChange={handleInputChange}
                      className="w-full p-3 bg-gray-700/50 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 transition-all"
                      rows="4"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      Location Found *
                    </label>
                    <div className="relative">
                      <Map
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={20}
                      />
                      <input
                        type="text"
                        name="location_found"
                        value={listingItem.location_found}
                        onChange={handleInputChange}
                        className="w-full p-3 pl-10 bg-gray-700/50 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      Contact Number *
                    </label>
                    <div className="relative">
                      <Phone
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={20}
                      />
                      <input
                        type="tel"
                        name="owner_contact"
                        value={listingItem.owner_contact}
                        onChange={handleInputChange}
                        className="w-full p-3 pl-10 bg-gray-700/50 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">
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
                      className="flex items-center justify-center w-full p-4 bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-600/50 transition-all group border-2 border-dashed border-gray-600 hover:border-yellow-500"
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <Camera
                          className="text-gray-400 group-hover:text-yellow-500 transition-colors"
                          size={24}
                        />
                        <span className="text-gray-400 group-hover:text-yellow-500 transition-colors">
                          {listingItem.image ? "Change Image" : "Upload Image"}
                        </span>
                        <span className="text-xs text-gray-500">
                          Max size: 5MB
                        </span>
                      </div>
                    </label>
                    <AnimatePresence>
                      {listingItem.image && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4"
                        >
                          <div className="relative group">
                            <img
                              src={URL.createObjectURL(listingItem.image)}
                              alt="Preview"
                              className="h-48 w-full object-cover rounded-lg"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                              <button
                                type="button"
                                onClick={() =>
                                  setListingItem((prev) => ({
                                    ...prev,
                                    image: null,
                                  }))
                                }
                                className="text-white hover:text-red-400 transition-colors"
                              >
                                Remove Image
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black p-4 rounded-lg font-medium shadow-lg hover:shadow-yellow-500/20 transition-all duration-300"
                  >
                    Submit Found Item
                  </motion.button>

                  <p className="text-sm text-gray-400 text-center mt-4">
                    Please ensure all information is accurate before submitting.
                    Your contact information will be visible to others.
                  </p>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Action Button for Mobile */}
      {activeTab === "browse" && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setActiveTab("found")}
          className="fixed bottom-6 right-6 md:hidden p-4 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black shadow-lg hover:shadow-yellow-500/20 transition-all"
        >
          <Plus size={24} />
        </motion.button>
      )}

      {/* Back to Top Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 left-6 p-3 rounded-full bg-gray-800/50 backdrop-blur-sm text-white shadow-lg hover:bg-gray-700/50 transition-all"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </motion.button>
    </div>
  );
};

export default LostAndFound;
