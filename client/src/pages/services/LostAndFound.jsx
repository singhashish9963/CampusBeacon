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
import { LostItemCard } from "../../components/features/marketplace";

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
          <Loader className="animate-spin text-white" size={36} />
          <p className="text-white text-base">Loading items...</p>
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
            className={`fixed top-4 right-4 z-50 p-3 rounded-lg shadow-lg text-sm ${
              notification.type === "error" ? "bg-red-500" : "bg-green-500"
            }`}
          >
            <div className="flex items-center space-x-2">
              <AlertCircle size={16} />
              <span>{notification.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-3 py-4 md:p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row justify-between items-center mb-4 md:mb-6 space-y-3 md:space-y-0"
        >
          <div className="flex items-center space-x-3">
            <Rocket className="text-yellow-400 animate-pulse" size={32} />
            <h1 className="text-2xl md:text-3xl font-bold tracking-wide bg-gradient-to-r from-yellow-400 to-purple-400 bg-clip-text text-transparent">
              Lost &amp; Found
            </h1>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-full flex p-1">
            <button
              onClick={() => setActiveTab("browse")}
              className={`px-3 py-1.5 md:px-5 md:py-2 rounded-full transition-all duration-300 text-sm md:text-base ${
                activeTab === "browse"
                  ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-black shadow-lg"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Browse Items
            </button>
            <button
              onClick={() => setActiveTab("found")}
              className={`px-3 py-1.5 md:px-5 md:py-2 rounded-full transition-all duration-300 text-sm md:text-base ${
                activeTab === "found"
                  ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-black shadow-lg"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Report Found/Lost
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
                className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-3 md:p-4 mb-4 md:mb-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      placeholder="Search lost items..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full p-2 pl-9 text-sm md:text-base bg-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 transition-all"
                    />
                  </div>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center justify-center space-x-2 px-3 py-2 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                  >
                    <Filter size={16} />
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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="p-2 text-sm bg-gray-700/50 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 transition-all"
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
                          className="p-2 text-sm bg-gray-700/50 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 transition-all"
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
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
                    className="col-span-full text-center py-6 md:py-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="flex flex-col items-center space-y-3">
                      <Search size={36} className="text-gray-400" />
                      <p className="text-gray-400 text-base">No items found</p>
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
                className="bg-gray-800/30 backdrop-blur-sm p-4 md:p-6 rounded-xl shadow-xl max-w-2xl w-full border border-white/10"
              >
                <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center bg-gradient-to-r from-yellow-400 to-purple-400 bg-clip-text text-transparent">
                  Report Found Item
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs md:text-sm font-medium mb-1 text-gray-300">
                      Item Name *
                    </label>
                    <input
                      type="text"
                      name="item_name"
                      value={listingItem.item_name}
                      onChange={handleInputChange}
                      className="w-full p-2 text-sm bg-gray-700/50 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs md:text-sm font-medium mb-1 text-gray-300">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={listingItem.category}
                      onChange={handleInputChange}
                      className="w-full p-2 text-sm bg-gray-700/50 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 transition-all"
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
                    <label className="block text-xs md:text-sm font-medium mb-1 text-gray-300">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={listingItem.description}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full p-2 text-sm bg-gray-700/50 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 transition-all"
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs md:text-sm font-medium mb-1 text-gray-300">
                        Location Found *
                      </label>
                      <div className="relative">
                        <Map className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <input
                          type="text"
                          name="location_found"
                          value={listingItem.location_found}
                          onChange={handleInputChange}
                          className="w-full p-2 pl-9 text-sm bg-gray-700/50 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 transition-all"
                          placeholder="e.g. Library, 2nd floor"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs md:text-sm font-medium mb-1 text-gray-300">
                        Contact Number *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <input
                          type="text"
                          name="owner_contact"
                          value={listingItem.owner_contact}
                          onChange={handleInputChange}
                          className="w-full p-2 pl-9 text-sm bg-gray-700/50 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 transition-all"
                          placeholder="Your contact number"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs md:text-sm font-medium mb-1 text-gray-300">
                      Upload Image
                    </label>
                    <div className="relative border-2 border-dashed border-gray-600 rounded-lg p-4 text-center hover:border-yellow-500 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <Camera className="text-gray-400" size={24} />
                        <p className="text-sm text-gray-400">
                          {listingItem.image
                            ? `Selected: ${listingItem.image.name}`
                            : "Click to upload (max 5MB)"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab("browse")}
                      className="px-4 py-2 text-sm rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 text-sm rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-medium hover:shadow-lg hover:shadow-yellow-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <Loader className="animate-spin mr-2" size={16} />
                          <span>Submitting...</span>
                        </div>
                      ) : (
                        "Submit Report"
                      )}
                    </button>
                  </div>
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
