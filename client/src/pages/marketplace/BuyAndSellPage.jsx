import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Rocket,
  Search,
  Plus,
  Loader2,
  Package,
  Tag,
  Phone,
  Image as ImageIcon,
  Filter,
  SortAsc,
  AlertCircle,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ItemCard } from "../../components/features/marketplace";
import { useDispatch, useSelector } from "react-redux";
import {
  createItem,
  getAllItems,
  clearError,
  updateItem,
} from "../../slices/buyandsellSlice";

const Marketplace = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get state from Redux
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { items, loading, error } = useSelector((state) => state.buyAndSell);

  const [activeTab, setActiveTab] = useState("browse");
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [showFilters, setShowFilters] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editItemId, setEditItemId] = useState(null);

  const [listingItem, setListingItem] = useState({
    item_name: "",
    price: "",
    category: "",
    description: "",
    item_condition: "",
    owner_contact: "",
    image: null,
  });

  const categories = [
    "Electronics",
    "Furniture",
    "Clothing",
    "Accessories",
    "Cycle",
    "Books",
    "Sports",
    "Other",
  ];

  const conditions = [
    { value: "New", label: "New" },
    { value: "Like New", label: "Like New" },
    { value: "Good", label: "Good" },
    { value: "Fair", label: "Fair" },
    { value: "Poor", label: "Poor" },
  ];

  useEffect(() => {
    const fetchItems = async () => {
      try {
        if (!isAuthenticated) {
          navigate("/login", { state: { from: "/marketplace" } });
          return;
        }
        await dispatch(getAllItems());
      } catch (err) {
        showNotification(err.message, "error");
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
      dispatch(clearError());
    };
  }, [activeTab, isAuthenticated, navigate, dispatch]);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    // Clear any existing timeout
    if (window.notificationTimeout) {
      clearTimeout(window.notificationTimeout);
    }
    // Set a new timeout to clear the notification after 5 seconds
    window.notificationTimeout = setTimeout(() => setNotification(null), 5000);
  };

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

  const handleEditItem = (item) => {
    setIsEditMode(true);
    setEditItemId(item.id);
    setListingItem({
      item_name: item.item_name,
      price: item.price,
      category: item.category,
      description: item.description,
      item_condition: item.item_condition,
      owner_contact: item.owner_contact,
      image: null, // We can't set the file object directly, but we'll handle this in the UI
      image_url: item.image_url, // Keep track of the existing image URL
    });
    setActiveTab("sell");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Sanitize description to prevent SQL queries from displaying
      const sanitizedDescription = listingItem.description?.replace(
        /SELECT|INSERT|UPDATE|DELETE.*FROM/gi,
        "[removed]"
      );

      const formData = new FormData();
      Object.keys(listingItem).forEach((key) => {
        // Skip image_url when creating FormData
        if (key !== "image_url") {
          // Only append image if it exists (for edit mode, it might be null)
          if (key === "image" && listingItem[key] === null && isEditMode) {
            // Don't append null image in edit mode
          } else if (key === "description") {
            // Use sanitized description
            formData.append(key, sanitizedDescription || "");
          } else {
            formData.append(key, listingItem[key]);
          }
        }
      });

      if (isEditMode && editItemId) {
        await dispatch(updateItem({ id: editItemId, formData })).unwrap();
        showNotification("Item updated successfully!", "success");
      } else {
        await dispatch(createItem(formData)).unwrap();
        showNotification("Item listed successfully!", "success");
      }

      // Reset form and go back to browse
      setActiveTab("browse");
      setIsEditMode(false);
      setEditItemId(null);
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
      setNotification({
        type: "error",
        message:
          err.message ||
          (isEditMode ? "Error updating item" : "Error listing item"),
      });
    }
  };

  useEffect(() => {
    if (error) {
      setNotification({
        type: "error",
        message: error,
      });
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const filteredAndSortedItems = React.useMemo(() => {
    let filtered = items.filter((item) => {
      const matchesSearch =
        item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !category || item.category === category;
      const matchesPriceRange =
        (!priceRange.min || item.price >= Number(priceRange.min)) &&
        (!priceRange.max || item.price <= Number(priceRange.max));
      return matchesSearch && matchesCategory && matchesPriceRange;
    });

    // Sort items
    switch (sortBy) {
      case "newest":
        return filtered.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      case "oldest":
        return filtered.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
      case "priceLowToHigh":
        return filtered.sort((a, b) => a.price - b.price);
      case "priceHighToLow":
        return filtered.sort((a, b) => b.price - a.price);
      default:
        return filtered;
    }
  }, [items, searchTerm, category, priceRange, sortBy]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-black to-purple-900 text-white">
      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-2 ${
              notification.type === "error" ? "bg-red-500" : "bg-green-500"
            }`}
          >
            {notification.type === "error" ? (
              <AlertCircle size={20} />
            ) : (
              <Package size={20} />
            )}
            <span>{notification.message}</span>
            <button
              onClick={() => setNotification(null)}
              className="ml-2 hover:text-gray-200"
            >
              <X size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto p-4 md:p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap justify-between items-center mb-8"
        >
          <div className="flex items-center space-x-4">
            <Rocket className="text-yellow-400 animate-pulse" size={48} />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-purple-400 bg-clip-text text-transparent">
              College Marketplace
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
              onClick={() => setActiveTab("sell")}
              className={`px-6 py-2 rounded-full transition-all duration-300 ${
                activeTab === "sell"
                  ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-black shadow-lg"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Sell Item
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
                      placeholder="Search marketplace..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full p-3 bg-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 transition-all"
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
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
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
                          <option value="priceLowToHigh">
                            Price: Low to High
                          </option>
                          <option value="priceHighToLow">
                            Price: High to Low
                          </option>
                        </select>
                        <div className="flex space-x-2">
                          <input
                            type="number"
                            placeholder="Min Price"
                            value={priceRange.min}
                            onChange={(e) =>
                              setPriceRange((prev) => ({
                                ...prev,
                                min: e.target.value,
                              }))
                            }
                            className="w-1/2 p-3 bg-gray-700/50 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 transition-all"
                          />
                          <input
                            type="number"
                            placeholder="Max Price"
                            value={priceRange.max}
                            onChange={(e) =>
                              setPriceRange((prev) => ({
                                ...prev,
                                max: e.target.value,
                              }))
                            }
                            className="w-1/2 p-3 bg-gray-700/50 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 transition-all"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Items Grid */}
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="w-12 h-12 animate-spin text-yellow-500" />
                  <p className="mt-4 text-gray-400">Loading items...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8 text-red-500 bg-red-500/10 rounded-lg">
                  <AlertCircle className="mx-auto mb-2" size={32} />
                  {error}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                  {filteredAndSortedItems.length > 0 ? (
                    filteredAndSortedItems.map((item) => (
                      <ItemCard
                        key={item.id}
                        item={item}
                        onEdit={handleEditItem}
                      />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <Package
                        className="mx-auto mb-4 text-gray-400"
                        size={48}
                      />
                      <p className="text-gray-400 text-lg">No items found</p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="sell"
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
                  {isEditMode ? "Edit Your Item" : "List Your Item"}
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs md:text-sm font-medium mb-1 text-gray-300">
                        Price (₹) *
                      </label>
                      <div className="relative">
                        <Tag
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={16}
                        />
                        <input
                          type="number"
                          name="price"
                          value={listingItem.price}
                          onChange={handleInputChange}
                          className="w-full p-2 pl-9 text-sm bg-gray-700/50 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 transition-all"
                          required
                          min="0"
                          step="1"
                        />
                      </div>
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
                  </div>

                  <div>
                    <label className="block text-xs md:text-sm font-medium mb-1 text-gray-300">
                      Condition *
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                      {conditions.map(({ value, label }) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() =>
                            setListingItem((prev) => ({
                              ...prev,
                              item_condition: value,
                            }))
                          }
                          className={`p-2 rounded-lg text-xs transition-all ${
                            listingItem.item_condition === value
                              ? "bg-yellow-500 text-black"
                              : "bg-gray-700/50 text-gray-300 hover:bg-gray-700"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs md:text-sm font-medium mb-1 text-gray-300">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={listingItem.description}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full p-2 text-sm bg-gray-700/50 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 transition-all"
                      placeholder="Describe your item's features, condition, and any other relevant details..."
                      required
                    />
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
                        type="tel"
                        name="owner_contact"
                        value={listingItem.owner_contact}
                        onChange={handleInputChange}
                        pattern="[0-9]{10}"
                        className="w-full p-2 pl-9 text-sm bg-gray-700/50 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 transition-all"
                        placeholder="10-digit mobile number"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs md:text-sm font-medium mb-1 text-gray-300">
                      Item Image *
                    </label>
                    <div className="relative border-2 border-dashed border-gray-600 rounded-lg p-4 text-center hover:border-yellow-500 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        id="imageUpload"
                        required={!isEditMode && !listingItem.image}
                      />
                      <div className="flex flex-col items-center justify-center space-y-2">
                        {listingItem.image ? (
                          <div className="relative w-full">
                            <img
                              src={URL.createObjectURL(listingItem.image)}
                              alt="Preview"
                              className="w-full h-32 sm:h-48 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                document.getElementById("imageUpload").click()
                              }
                              className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center"
                            >
                              <span className="text-white text-sm">
                                Change Image
                              </span>
                            </button>
                          </div>
                        ) : isEditMode && listingItem.image_url ? (
                          <div className="relative w-full">
                            <img
                              src={listingItem.image_url}
                              alt="Current"
                              className="w-full h-32 sm:h-48 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                document.getElementById("imageUpload").click()
                              }
                              className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center"
                            >
                              <span className="text-white text-sm">
                                Change Image
                              </span>
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <ImageIcon
                              className="text-gray-400 mb-2"
                              size={24}
                            />
                            <p className="text-sm text-gray-400">
                              Click to upload (max 5MB)
                            </p>
                          </div>
                        )}
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
                          <Loader2 className="animate-spin mr-2" size={16} />
                          <span>
                            {isEditMode
                              ? "Updating Item..."
                              : "Listing Item..."}
                          </span>
                        </div>
                      ) : isEditMode ? (
                        "Update Item"
                      ) : (
                        "List Item for Sale"
                      )}
                    </button>
                  </div>

                  <p className="text-xs text-gray-400 text-center">
                    By listing an item, you agree to our marketplace guidelines
                    and terms of service.
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

export default Marketplace;
