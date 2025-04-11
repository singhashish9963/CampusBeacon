// LostAndFound.jsx

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Rocket,
  Search,
  Plus,
  Loader2 as Loader, // Use Loader2 for consistency
  Camera,
  MapPin as Map, // Use MapPin for consistency
  Phone,
  Tag,
  Filter,
  SortAsc,
  AlertCircle,
  X,
  Image as ImageIcon, // Added for image preview
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchLostItems,
  addLostItem,
  updateLostItem, // Import updateLostItem
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

  // State for edit mode
  const [isEditMode, setIsEditMode] = useState(false);
  const [editItemId, setEditItemId] = useState(null);

  const [listingItem, setListingItem] = useState({
    item_name: "",
    description: "",
    location_found: "",
    owner_contact: "",
    category: "",
    image: null,
    image_url: null, // To store existing image URL during edit
  });

  const categories = [
    "Electronics",
    "Documents",
    "Keys",
    "Wallets/Purses",
    "Clothing",
    "Accessories",
    "Books/Notes",
    "Cards",
    "Other",
  ];

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
    const timer = setTimeout(() => {
      dispatch(clearLostAndFoundError());
      setNotification(null); 
    }, 2000);
    return () => clearTimeout(timer);
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
        // 5MB limit
        showNotification("Image size should be less than 5MB", "error");
        return;
      }
      // Create a preview URL for the newly selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setListingItem((prev) => ({
          ...prev,
          image: file,
          image_url: reader.result,
        })); // Set image_url for preview
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setListingItem((prev) => ({ ...prev, image: null, image_url: null }));
    // Reset the file input if needed
    const fileInput = document.getElementById("imageUpload");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    if (window.lafNotificationTimeout) {
      clearTimeout(window.lafNotificationTimeout);
    }
    window.lafNotificationTimeout = setTimeout(
      () => setNotification(null),
      4000
    );
  };

  // Function to handle editing an item
  const handleEditItem = (item) => {
    setIsEditMode(true);
    setEditItemId(item.id);
    setListingItem({
      item_name: item.item_name || "",
      description: item.description || "",
      location_found: item.location_found || "",
      owner_contact: item.owner_contact || "",
      category: item.category || "",
      image: null, // Reset image file input
      image_url: item.image_url || null, // Keep existing image URL for preview
    });
    setActiveTab("found"); // Switch to the form tab
  };

  const resetFormAndState = () => {
    setListingItem({
      item_name: "",
      description: "",
      location_found: "",
      owner_contact: "",
      category: "",
      image: null,
      image_url: null,
    });
    setIsEditMode(false);
    setEditItemId(null);
    // Reset file input
    const fileInput = document.getElementById("imageUpload");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic client-side validation example
    if (
      !listingItem.item_name ||
      !listingItem.category ||
      !listingItem.location_found ||
      !listingItem.owner_contact
    ) {
      showNotification("Please fill in all required fields.", "error");
      return;
    }
    if (!/^[6-9]\d{9}$/.test(listingItem.owner_contact)) {
      showNotification(
        "Please enter a valid 10-digit Indian mobile number.",
        "error"
      );
      return;
    }

    const formData = new FormData();
    // Append all fields except image_url
    Object.keys(listingItem).forEach((key) => {
      if (key !== "image_url") {
        // Only append image if it's a new file (not null)
        if (key === "image" && listingItem[key]) {
          formData.append(key, listingItem[key]);
        } else if (key !== "image") {
          // Append other fields, ensuring empty strings are sent if needed
          formData.append(key, listingItem[key] || "");
        }
      }
    });

    try {
      if (isEditMode && editItemId) {
        // Dispatch update action
        await dispatch(updateLostItem({ id: editItemId, formData })).unwrap();
        showNotification("Item updated successfully!", "success");
      } else {
        // Dispatch add action
        await dispatch(addLostItem(formData)).unwrap();
        showNotification("Item reported successfully!", "success");
      }
      resetFormAndState(); // Reset form and edit state
      setActiveTab("browse"); // Go back to browse tab
    } catch (err) {
      // Error message extraction improvement
      const errorMessage =
        err?.payload ||
        err.message ||
        (isEditMode ? "Error updating item" : "Error reporting item");
      showNotification(errorMessage, "error");
      // Do not switch tab or reset form on error
    }
  };

  const handleCancel = () => {
    resetFormAndState();
    setActiveTab("browse");
  };

  const filteredAndSortedItems = React.useMemo(() => {
    let result = items.filter((item) => {
      const lowerSearchTerm = searchTerm.toLowerCase();
      const matchesSearch =
        item.item_name?.toLowerCase().includes(lowerSearchTerm) ||
        item.description?.toLowerCase().includes(lowerSearchTerm) ||
        item.location_found?.toLowerCase().includes(lowerSearchTerm);
      const matchesCategory = !category || item.category === category;
      return matchesSearch && matchesCategory;
    });

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

  // Separate loading state for initial fetch vs form submission
  const initialLoading = loading && !items.length; // Loading only when items are empty
  const formSubmitting = loading && activeTab === "found"; // Loading only when submitting form

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-black to-purple-900">
        <div className="flex flex-col items-center space-y-4">
          <Loader className="animate-spin text-yellow-400" size={40} />
          <p className="text-white text-lg font-medium">
            Loading Lost Items...
          </p>
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
            className={`fixed top-4 right-4 z-[60] p-3 rounded-lg shadow-lg text-sm flex items-center space-x-2 ${
              notification.type === "error" ? "bg-red-500" : "bg-green-500"
            }`}
          >
            {notification.type === "error" ? (
              <AlertCircle size={18} />
            ) : (
              <Rocket size={18} />
            )}
            <span>{notification.message}</span>
            <button
              onClick={() => setNotification(null)}
              className="ml-auto p-1 rounded-full hover:bg-black/20"
            >
              <X size={16} />
            </button>
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
              Lost & Found
            </h1>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-full flex p-1">
            <button
              onClick={() => {
                setActiveTab("browse");
                resetFormAndState();
              }} // Reset form when switching tabs
              className={`px-3 py-1.5 md:px-5 md:py-2 rounded-full transition-all duration-300 text-sm md:text-base ${
                activeTab === "browse"
                  ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-black shadow-lg font-medium"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Browse Items
            </button>
            <button
              onClick={() => {
                setActiveTab("found");
                resetFormAndState();
              }} // Reset form when switching tabs
              className={`px-3 py-1.5 md:px-5 md:py-2 rounded-full transition-all duration-300 text-sm md:text-base ${
                activeTab === "found" && !isEditMode // Highlight only when adding, not editing
                  ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-black shadow-lg font-medium"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Report Item
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
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pl-1"
                      size={18}
                    />
                    <input
                      type="text"
                      placeholder="Search by item name, description, location..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full p-2.5 pl-10 text-sm md:text-base bg-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:outline-none transition-all"
                    />
                  </div>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center justify-center space-x-2 px-3 py-2 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors text-sm flex-shrink-0"
                  >
                    <Filter size={16} />
                    <span>Filters</span>
                    {showFilters ? <X size={14} className="ml-1" /> : null}
                  </button>
                </div>

                {/* Expandable Filters */}
                <AnimatePresence>
                  {showFilters && (
                    <motion.div
                      initial={{ height: 0, opacity: 0, marginTop: 0 }}
                      animate={{
                        height: "auto",
                        opacity: 1,
                        marginTop: "0.75rem",
                      }} // Adjust margin as needed
                      exit={{ height: 0, opacity: 0, marginTop: 0 }}
                      className="overflow-hidden"
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="p-2.5 text-sm bg-gray-700/50 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 focus:outline-none transition-all"
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
                          className="p-2.5 text-sm bg-gray-700/50 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 focus:outline-none transition-all"
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
              {error && !items.length ? ( // Show specific error if fetch failed and no items are present
                <motion.div
                  className="col-span-full text-center py-6 md:py-10 bg-red-900/20 rounded-lg border border-red-500/50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="flex flex-col items-center space-y-3">
                    <AlertCircle size={36} className="text-red-400" />
                    <p className="text-red-300 text-base font-medium">
                      Failed to load items
                    </p>
                    <p className="text-red-400 text-sm">{error}</p>
                    <button
                      onClick={() => dispatch(fetchLostItems())}
                      className="mt-2 px-4 py-1.5 bg-yellow-500 text-black rounded-md text-sm font-medium hover:bg-yellow-400 transition-colors"
                      disabled={loading}
                    >
                      {loading ? (
                        <Loader size={16} className="animate-spin" />
                      ) : (
                        "Retry"
                      )}
                    </button>
                  </div>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                  {filteredAndSortedItems.length > 0 ? (
                    filteredAndSortedItems.map((item) => (
                      <LostItemCard
                        key={item.id}
                        item={item}
                        onEdit={handleEditItem} // Pass the edit handler
                      />
                    ))
                  ) : (
                    <motion.div
                      className="col-span-full text-center py-6 md:py-10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="flex flex-col items-center space-y-3">
                        <Search size={36} className="text-gray-500" />
                        <p className="text-gray-400 text-base">
                          {searchTerm || category
                            ? "No items match your filters"
                            : "No items reported yet"}
                        </p>
                        {searchTerm || category ? (
                          <p className="text-sm text-gray-500">
                            Try adjusting your search or filters.
                          </p>
                        ) : null}
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
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
                  {isEditMode ? "Edit Reported Item" : "Report Found Item"}
                </h2>
                <div className="space-y-4">
                  {/* Item Name */}
                  <div>
                    <label className="block text-xs md:text-sm font-medium mb-1 text-gray-300">
                      Item Name *
                    </label>
                    <input
                      type="text"
                      name="item_name"
                      value={listingItem.item_name}
                      onChange={handleInputChange}
                      className="w-full p-2.5 text-sm bg-gray-700/50 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 focus:outline-none transition-all"
                      required
                      maxLength={100}
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-xs md:text-sm font-medium mb-1 text-gray-300">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={listingItem.category}
                      onChange={handleInputChange}
                      className="w-full p-2.5 text-sm bg-gray-700/50 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 focus:outline-none transition-all"
                      required
                    >
                      <option value="" disabled>
                        Select Category
                      </option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs md:text-sm font-medium mb-1 text-gray-300">
                      Description{" "}
                      <span className="text-gray-500">(Optional)</span>
                    </label>
                    <textarea
                      name="description"
                      value={listingItem.description}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full p-2.5 text-sm bg-gray-700/50 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 focus:outline-none transition-all"
                      placeholder="Add details like color, brand, specific marks..."
                      maxLength={500}
                    ></textarea>
                  </div>

                  {/* Location and Contact */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs md:text-sm font-medium mb-1 text-gray-300">
                        Location Found *
                      </label>
                      <div className="relative">
                        <Map
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={16}
                        />
                        <input
                          type="text"
                          name="location_found"
                          value={listingItem.location_found}
                          onChange={handleInputChange}
                          className="w-full p-2.5 pl-9 text-sm bg-gray-700/50 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 focus:outline-none transition-all"
                          placeholder="e.g., Library 2nd floor"
                          required
                          maxLength={150}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs md:text-sm font-medium mb-1 text-gray-300">
                        Contact Number *
                      </label>
                      <div className="relative">
                        <Phone
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={16}
                        />
                        <input
                          type="tel" // Use tel type
                          name="owner_contact"
                          value={listingItem.owner_contact}
                          onChange={handleInputChange}
                          pattern="[6-9]\d{9}" // Basic Indian mobile pattern
                          title="Please enter a valid 10-digit Indian mobile number"
                          className="w-full p-2.5 pl-9 text-sm bg-gray-700/50 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 focus:outline-none transition-all"
                          placeholder="10-digit mobile number"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="block text-xs md:text-sm font-medium mb-1 text-gray-300">
                      {isEditMode
                        ? "Replace Image (Optional)"
                        : "Upload Image (Optional)"}
                    </label>
                    <div className="relative border-2 border-dashed border-gray-600 rounded-lg p-4 text-center hover:border-yellow-500 transition-colors group">
                      <input
                        type="file"
                        accept="image/jpeg, image/png, image/webp"
                        onChange={handleImageUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        id="imageUpload"
                        // Make not required
                      />
                      <label htmlFor="imageUpload" className="cursor-pointer">
                        <div className="flex flex-col items-center justify-center space-y-2 min-h-[80px]">
                          {listingItem.image_url ? (
                            // Show preview (either existing or newly uploaded)
                            <div className="relative w-full max-w-[200px] mx-auto">
                              <img
                                src={listingItem.image_url}
                                alt="Item Preview"
                                className="w-full h-24 object-contain rounded-md bg-gray-900"
                              />
                              {/* Overlay to change/remove */}
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex flex-col items-center justify-center space-y-1">
                                <span className="text-white text-xs font-medium">
                                  Change Image
                                </span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    clearImage();
                                  }}
                                  className="text-red-400 hover:text-red-300 text-xs p-1 rounded bg-black/50 hover:bg-black/70"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          ) : (
                            // Placeholder
                            <>
                              <Camera className="text-gray-400" size={24} />
                              <p className="text-sm text-gray-400">
                                Click or drag to upload
                              </p>
                              <p className="text-xs text-gray-500">
                                JPG, PNG, WEBP (Max 5MB)
                              </p>
                            </>
                          )}
                        </div>
                      </label>
                    </div>
                    {listingItem.image && ( // Show filename if a new file is selected
                      <p className="text-xs text-gray-400 mt-1 text-center">
                        New file selected: {listingItem.image.name}
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-3 pt-2">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-4 py-2 text-sm rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={formSubmitting}
                      className="px-4 py-2 text-sm rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-semibold hover:shadow-lg hover:shadow-yellow-500/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
                    >
                      {formSubmitting ? (
                        <>
                          <Loader className="animate-spin mr-2" size={16} />
                          <span>
                            {isEditMode ? "Updating..." : "Submitting..."}
                          </span>
                        </>
                      ) : isEditMode ? (
                        "Update Item"
                      ) : (
                        "Submit Report"
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 text-center pt-1">
                    Please ensure all information is accurate before submitting.
                  </p>
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
