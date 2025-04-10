import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { fetchEvents, clearEventError } from "../../slices/eventSlice"; // Assuming this path is correct
import {
  FiSearch,
  FiCalendar,
  FiClock,
  FiMapPin,
  FiFilter,
  FiX,
  FiArrowRight,
  FiAlertCircle,
  FiClipboard,
  FiChevronDown,
  FiHeart,
  FiBookmark,
  FiEye,
  FiUserCheck,
  FiHash,
} from "react-icons/fi";
import toast from "react-hot-toast";
import debounce from "lodash/debounce";

// Event Card Component
const EventCard = ({ event, index }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const clubName = event.club?.name || "Unknown Club";

  let formattedDate = "Date not specified";
  let formattedTime = "Time not specified";

  if (event.date) {
    try {
      const eventDateObj = new Date(event.date);
      if (!isNaN(eventDateObj.getTime())) {
        formattedDate = eventDateObj.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
        formattedTime = eventDateObj.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });
      }
    } catch (error) {
      console.error("Error parsing date:", error);
    }
  }

  const generateGradient = (name) => {
    if (!name) return "from-gray-900/70 via-gray-800/50 to-gray-700/60"; // Fallback gradient
    const hash = name.split("").reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);

    const gradientIndex = Math.abs(hash) % 8;
    const gradients = [
      "from-indigo-900/70 via-purple-900/50 to-blue-900/60",
      "from-cyan-900/70 via-blue-900/50 to-indigo-900/60",
      "from-violet-900/70 via-indigo-900/50 to-purple-900/60",
      "from-blue-900/70 via-indigo-900/50 to-violet-900/60",
      "from-purple-900/70 via-violet-900/50 to-indigo-900/60",
      "from-fuchsia-900/70 via-purple-900/50 to-violet-900/60",
      "from-indigo-900/70 via-blue-900/50 to-teal-900/60",
      "from-emerald-900/70 via-teal-900/50 to-cyan-900/60",
    ];

    return gradients[gradientIndex];
  };

  const gradient = generateGradient(event.name);

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: index * 0.08,
        ease: [0.43, 0.13, 0.23, 0.96],
      },
    },
    exit: { opacity: 0, y: 30, transition: { duration: 0.3 } },
  };

  const imageVariants = {
    hover: { scale: 1.05, transition: { duration: 0.3 } },
    initial: { scale: 1, transition: { duration: 0.3 } },
  };

  const overlayVariants = {
    hover: { opacity: 0.8, transition: { duration: 0.3 } },
    initial: { opacity: 0, transition: { duration: 0.3 } },
  };

  const handleCardClick = useCallback(() => {
    navigate(`/events/${event.id}`);
  }, [navigate, event.id]);

  const handleBookmarkToggle = useCallback((e) => {
    e.stopPropagation();
    toast.success("Event saved to bookmarks!", {
      icon: "🔖",
      style: { borderRadius: "10px", background: "#333", color: "#fff" },
    });
    // Add actual bookmark logic here
  }, []);

  const handleInterestToggle = useCallback((e) => {
    e.stopPropagation();
    toast.success("Added to interested events!", {
      icon: "❤️",
      style: { borderRadius: "10px", background: "#333", color: "#fff" },
    });
    // Add actual interest logic here
  }, []);

  return (
    <motion.div
      layout
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      whileHover={{ y: -5, transition: { duration: 0.3 } }}
      className="rounded-2xl overflow-hidden shadow-xl cursor-pointer group bg-gradient-to-br from-gray-900/90 to-indigo-900/20 backdrop-blur-md border border-indigo-500/20 hover:border-indigo-500/40 transition-all duration-300"
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-48 overflow-hidden">
        <div
          className={`absolute inset-0 z-10 bg-gradient-to-b ${gradient} opacity-60`}
        ></div>
        {event.images && event.images[0] ? (
          <motion.img
            src={event.images[0]}
            alt={event.name || "Event"}
            className="w-full h-full object-cover object-center"
            variants={imageVariants}
            animate={isHovered ? "hover" : "initial"}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-indigo-900 flex items-center justify-center">
            <FiCalendar className="text-5xl text-white/50" />
          </div>
        )}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-indigo-900 to-blue-900/80 flex items-center justify-center z-20"
          variants={overlayVariants}
          animate={isHovered ? "hover" : "initial"}
        >
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isHovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="text-white font-bold text-lg flex items-center gap-2"
          >
            <FiEye /> View Details
          </motion.span>
        </motion.div>
        <div className="absolute top-3 left-3 z-20 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full">
          <span className="text-xs font-semibold tracking-wide text-cyan-300">
            {clubName}
          </span>
        </div>
        {event.category && (
          <div className="absolute top-3 right-3 z-20 bg-indigo-600/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
            <span className="text-xs font-semibold tracking-wide text-white">
              {event.category}
            </span>
          </div>
        )}
        <div className="absolute bottom-3 left-3 z-20 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5">
          <FiCalendar className="text-cyan-300 text-xs" />
          <span className="text-xs font-medium text-white">
            {formattedDate}
          </span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-cyan-300 transition-colors duration-300">
          {event.name || "Untitled Event"}
        </h3>
        <p className="text-gray-300 text-sm line-clamp-2 mb-4 h-10">
          {event.description || "No description available."}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="flex items-center gap-1.5 bg-gray-800/60 px-2.5 py-1 rounded-full text-xs text-gray-300">
            <FiClock className="text-cyan-400" />
            <span>{formattedTime}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-gray-800/60 px-2.5 py-1 rounded-full text-xs text-gray-300">
            <FiMapPin className="text-cyan-400" />
            <span className="truncate max-w-[120px]">
              {event.location || "TBA"}
            </span>
          </div>
          {event.coordinators && event.coordinators.length > 0 && (
            <div className="flex items-center gap-1.5 bg-gray-800/60 px-2.5 py-1 rounded-full text-xs text-gray-300">
              <FiUserCheck className="text-cyan-400" />
              <span>
                {event.coordinators.length} Coordinator
                {event.coordinators.length !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-indigo-500/20">
          <Link
            to={`/events/${event.id}`}
            className="text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            See Details <FiArrowRight />
          </Link>
          <div className="flex gap-2">
            <button
              onClick={handleInterestToggle}
              className="p-1.5 rounded-full hover:bg-indigo-500/30 transition-colors"
              aria-label="Mark as interested"
            >
              <FiHeart className="text-lg text-pink-400 hover:text-pink-300" />
            </button>
            <button
              onClick={handleBookmarkToggle}
              className="p-1.5 rounded-full hover:bg-indigo-500/30 transition-colors"
              aria-label="Save to bookmarks"
            >
              <FiBookmark className="text-lg text-indigo-400 hover:text-indigo-300" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const EmptyState = React.memo(({ query }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center p-10 md:p-16 bg-gradient-to-br from-gray-900/50 to-indigo-900/10 backdrop-blur-md rounded-2xl border border-indigo-500/20 shadow-xl text-center my-10"
  >
    <div className="p-6 bg-indigo-500/10 rounded-full mb-6">
      <FiClipboard className="text-5xl text-indigo-300" />
    </div>
    <h3 className="text-2xl font-bold text-white mb-3">No Events Found</h3>
    {query ? (
      <p className="text-gray-400 max-w-md">
        We couldn't find any events matching "
        <span className="text-cyan-400">{query}</span>". Try adjusting your
        search or filters.
      </p>
    ) : (
      <p className="text-gray-400 max-w-md">
        There are currently no events matching your criteria. Check back later
        or explore clubs!
      </p>
    )}
  </motion.div>
));
EmptyState.displayName = "EmptyState"; // Add display name for React DevTools

const LoadingState = React.memo(() => (
  <div className="flex flex-col items-center justify-center p-10 md:p-16 my-10">
    <div className="relative mb-8">
      <div className="w-16 h-16 border-t-4 border-b-4 border-cyan-400 rounded-full animate-spin"></div>
      <div className="absolute top-0 left-0 w-16 h-16 border-l-4 border-r-4 border-t-4 border-orange-400 rounded-full animate-ping opacity-75"></div>
    </div>
    <h3 className="text-2xl font-bold text-cyan-300 mb-2">Loading Events</h3>
    <p className="text-gray-400">Hang tight! Fetching the latest events...</p>
  </div>
));
LoadingState.displayName = "LoadingState";

const ErrorState = React.memo(({ error, retry }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center p-10 md:p-16 bg-gradient-to-br from-red-900/20 to-red-800/10 backdrop-blur-md rounded-2xl border border-red-500/30 shadow-xl text-center my-10"
  >
    <div className="p-6 bg-red-500/10 rounded-full mb-6">
      <FiAlertCircle className="text-5xl text-red-400" />
    </div>
    <h3 className="text-2xl font-bold text-red-300 mb-3">
      Something Went Wrong
    </h3>
    <p className="text-gray-400 max-w-md mb-6">
      {typeof error === "string"
        ? error
        : "Could not load events. Please try again later."}
    </p>
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={retry}
      className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-lg font-semibold transition-colors shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500/50"
    >
      Try Again
    </motion.button>
  </motion.div>
));
ErrorState.displayName = "ErrorState";

// Main Events Page Component
const EventsPageAll = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { events = [], loading, error } = useSelector((state) => state.events); // Default to empty array
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState(() => ({
    club: searchParams.get("club") || "",
    category: searchParams.get("category") || "",
    upcoming: searchParams.get("upcoming") === "true",
    past: searchParams.get("past") === "true",
  }));

  const { scrollYProgress } = useScroll();
  const headerRef = useRef(null);

  useEffect(() => {
    dispatch(fetchEvents());
    return () => {
      dispatch(clearEventError());
    };
  }, [dispatch]);

  const debouncedSetSearchQuery = useMemo(
    () => debounce((value) => setSearchQuery(value), 300),
    []
  );

  const handleSearchInputChange = useCallback(
    (e) => {
      debouncedSetSearchQuery(e.target.value);
    },
    [debouncedSetSearchQuery]
  );

  const filteredEvents = useMemo(() => {
    let filtered = [...(events || [])]; // Ensure events is an array

    const query = searchQuery.toLowerCase().trim();
    if (query) {
      filtered = filtered.filter(
        (event) =>
          event.name?.toLowerCase().includes(query) ||
          event.description?.toLowerCase().includes(query) ||
          event.location?.toLowerCase().includes(query) ||
          event.Club?.name?.toLowerCase().includes(query) ||
          event.category?.toLowerCase().includes(query)
      );
    }

    if (appliedFilters.club) {
      filtered = filtered.filter(
        (event) => event.Club?.name === appliedFilters.club
      );
    }

    if (appliedFilters.category) {
      filtered = filtered.filter(
        (event) => event.category === appliedFilters.category
      );
    }

    const now = new Date();
    if (appliedFilters.upcoming && !appliedFilters.past) {
      filtered = filtered.filter((event) => {
        if (!event.date) return true;
        const eventDate = new Date(event.date);
        return !isNaN(eventDate.getTime()) && eventDate >= now;
      });
    } else if (appliedFilters.past && !appliedFilters.upcoming) {
      filtered = filtered.filter((event) => {
        if (!event.date) return false;
        const eventDate = new Date(event.date);
        return !isNaN(eventDate.getTime()) && eventDate < now;
      });
    }

    filtered.sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;

      if (!dateA && !dateB) return 0;
      if (!dateA) return 1;
      if (!dateB) return -1;

      return dateB - dateA; // Sort recent first
    });

    return filtered;
  }, [events, searchQuery, appliedFilters]);

  const uniqueClubs = useMemo(() => {
    return [
      ...new Set(events.map((event) => event.Club?.name).filter(Boolean)),
    ];
  }, [events]);

  const uniqueCategories = useMemo(() => {
    return [...new Set(events.map((event) => event.category).filter(Boolean))];
  }, [events]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (appliedFilters.club) params.set("club", appliedFilters.club);
    if (appliedFilters.category)
      params.set("category", appliedFilters.category);
    if (appliedFilters.upcoming) params.set("upcoming", "true");
    if (appliedFilters.past) params.set("past", "true");

    // Use replace: true to avoid polluting browser history during filtering
    setSearchParams(params, { replace: true });
  }, [searchQuery, appliedFilters, setSearchParams]);

  const handleFilterChange = useCallback((filterType, value) => {
    setAppliedFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setSearchQuery("");
    // Also clear the input field visually if controlled differently
    const searchInput = document.querySelector(
      'input[type="text"][placeholder*="Search events"]'
    );
    if (searchInput) searchInput.value = "";

    setAppliedFilters({
      club: "",
      category: "",
      upcoming: false,
      past: false,
    });
    setIsFilterOpen(false); // Close filter dropdown after clearing
  }, []);

  const handleRetry = useCallback(() => {
    dispatch(clearEventError());
    dispatch(fetchEvents());
  }, [dispatch]);

  const activeFilterCount = useMemo(() => {
    // Count search query as a filter if it exists
    const searchFilterCount = searchQuery ? 1 : 0;
    // Count other applied filters
    const otherFiltersCount = Object.values(appliedFilters).filter((value) =>
      typeof value === "boolean" ? value : Boolean(value)
    ).length;
    return searchFilterCount + otherFiltersCount;
  }, [searchQuery, appliedFilters]);

  const headerBgStyle = {
    backgroundPosition: `center ${scrollYProgress.get() * 100}px`,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#080E20] via-[#14152E] to-[#070A17] text-gray-100 overflow-x-hidden">
      <header
        ref={headerRef}
        className="relative h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden"
      >
        <div
          className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48cmVjdCB4PSIzMCIgeT0iMzAiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9zdmc+')]"
          style={headerBgStyle}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/50 via-purple-900/40 to-blue-900/30 z-10"></div>
        <div className="absolute inset-0 opacity-50 bg-gradient-to-br from-[#080E20] via-[#14152E] to-[#070A17]"></div>
        <div className="absolute top-1/4 left-1/3 w-64 h-64 rounded-full bg-indigo-700/20 blur-3xl animate-pulse-slow -z-10"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-cyan-700/20 blur-3xl animate-pulse-slow animation-delay-1000 -z-10"></div>

        <div className="relative z-20 text-center max-w-4xl px-4 md:px-8">
          <motion.h1
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 text-white leading-tight"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-indigo-300 to-purple-300">
              Discover Campus Events
            </span>
          </motion.h1>
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-8"
          >
            Find and join the most exciting events hosted by clubs across
            campus.
          </motion.p>
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
            className="max-w-lg mx-auto relative"
          >
            <input
              type="text"
              placeholder="Search events, clubs, or keywords..."
              defaultValue={searchQuery} // Use defaultValue for uncontrolled, or value + onChange for controlled with debounce
              onChange={handleSearchInputChange}
              className="w-full px-5 py-4 rounded-xl pl-12 bg-black/40 backdrop-blur-md border border-indigo-500/30 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent placeholder-gray-500"
            />
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-indigo-400 text-lg pointer-events-none" />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`p-2 rounded-lg ${
                  activeFilterCount > 0 ? "bg-indigo-600/80" : "bg-gray-700/80"
                } hover:bg-indigo-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-md flex items-center gap-1`}
                aria-expanded={isFilterOpen}
                aria-controls="filter-dropdown"
                aria-label="Toggle Filters"
              >
                <FiFilter className="text-white" />
                {activeFilterCount > 0 && (
                  <span className="bg-white text-indigo-700 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>
              {searchQuery && (
                <button
                  onClick={clearFilters} // Re-use clearFilters to clear search as well
                  className="p-2 rounded-lg bg-gray-700/80 hover:bg-gray-600/80 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500/50 backdrop-blur-md"
                  aria-label="Clear search and filters"
                >
                  <FiX className="text-white" />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </header>

      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            id="filter-dropdown"
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-4xl mx-auto px-4 overflow-hidden"
          >
            <div className="bg-gradient-to-br from-gray-900/90 to-indigo-900/40 backdrop-blur-md rounded-xl p-5 md:p-6 border border-indigo-500/30 shadow-xl mb-8 -mt-6 relative z-30">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">Filter Events</h3>
                {activeFilterCount > 0 &&
                  !searchQuery && ( // Show clear only if filters applied (excluding search)
                    <button
                      onClick={clearFilters}
                      className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors font-medium flex items-center gap-1.5"
                    >
                      <FiX size={14} /> Clear Filters
                    </button>
                  )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label
                    htmlFor="club-filter"
                    className="block text-gray-300 text-sm font-medium mb-2"
                  >
                    Club
                  </label>
                  <div className="relative">
                    <select
                      id="club-filter"
                      value={appliedFilters.club}
                      onChange={(e) =>
                        handleFilterChange("club", e.target.value)
                      }
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-lg py-2.5 pl-4 pr-10 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent"
                    >
                      <option value="">All Clubs</option>
                      {uniqueClubs.map((club) => (
                        <option key={club} value={club}>
                          {club}
                        </option>
                      ))}
                    </select>
                    <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="category-filter"
                    className="block text-gray-300 text-sm font-medium mb-2"
                  >
                    Category
                  </label>
                  <div className="relative">
                    <select
                      id="category-filter"
                      value={appliedFilters.category}
                      onChange={(e) =>
                        handleFilterChange("category", e.target.value)
                      }
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-lg py-2.5 pl-4 pr-10 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent"
                    >
                      <option value="">All Categories</option>
                      {uniqueCategories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Event Timing
                  </label>
                  <div className="flex gap-3">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={appliedFilters.upcoming}
                        onChange={(e) =>
                          handleFilterChange("upcoming", e.target.checked)
                        }
                        className="form-checkbox h-5 w-5 text-indigo-500 rounded border-gray-700 bg-gray-800/50 focus:ring-indigo-500/50 focus:ring-offset-0 cursor-pointer"
                      />
                      <span className="ml-2 text-white">Upcoming</span>
                    </label>
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={appliedFilters.past}
                        onChange={(e) =>
                          handleFilterChange("past", e.target.checked)
                        }
                        className="form-checkbox h-5 w-5 text-indigo-500 rounded border-gray-700 bg-gray-800/50 focus:ring-indigo-500/50 focus:ring-offset-0 cursor-pointer"
                      />
                      <span className="ml-2 text-white">Past</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-7xl mx-auto px-4 md:px-6 pb-20">
        {!loading && !error && filteredEvents.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 bg-gradient-to-r from-gray-900/80 to-indigo-900/30 backdrop-blur-md rounded-xl p-4 border border-indigo-500/20"
          >
            <div className="mb-3 sm:mb-0">
              <p className="text-gray-300">
                Showing{" "}
                <span className="font-bold text-white">
                  {filteredEvents.length}
                </span>{" "}
                {filteredEvents.length === 1 ? "event" : "events"}
                {(searchQuery || activeFilterCount > (searchQuery ? 1 : 0)) && (
                  <span> matching filters</span>
                )}
              </p>
            </div>
            <div className="flex items-center flex-wrap gap-2">
              {(searchQuery || activeFilterCount > (searchQuery ? 1 : 0)) && (
                <FiHash className="text-indigo-400 hidden sm:inline-block" />
              )}
              {searchQuery && (
                <span className="px-2 py-1 text-xs bg-indigo-900/60 text-indigo-300 rounded-full border border-indigo-500/30 flex items-center gap-1">
                  Search:{" "}
                  <span className="font-medium truncate max-w-[100px]">
                    {searchQuery}
                  </span>
                </span>
              )}
              {appliedFilters.club && (
                <span className="px-2 py-1 text-xs bg-cyan-900/60 text-cyan-300 rounded-full border border-cyan-500/30">
                  {appliedFilters.club}
                </span>
              )}
              {appliedFilters.category && (
                <span className="px-2 py-1 text-xs bg-purple-900/60 text-purple-300 rounded-full border border-purple-500/30">
                  {appliedFilters.category}
                </span>
              )}
              {appliedFilters.upcoming && (
                <span className="px-2 py-1 text-xs bg-green-900/60 text-green-300 rounded-full border border-green-500/30">
                  Upcoming
                </span>
              )}
              {appliedFilters.past && (
                <span className="px-2 py-1 text-xs bg-orange-900/60 text-orange-300 rounded-full border border-orange-500/30">
                  Past
                </span>
              )}
            </div>
          </motion.div>
        )}

        <div>
          {loading && <LoadingState />}
          {!loading && error && (
            <ErrorState error={error} retry={handleRetry} />
          )}
          {!loading && !error && filteredEvents.length === 0 && (
            <EmptyState query={searchQuery} />
          )}
          {!loading && !error && filteredEvents.length > 0 && (
            <motion.div
              layout // Animate layout changes when filters are applied/removed
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            >
              <AnimatePresence mode="sync">
                {filteredEvents.map((event, index) => (
                  <EventCard
                    key={event.id || index}
                    event={event}
                    index={index}
                  /> // Use index as fallback key if id is missing
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>

        {/* Simple Load More Placeholder - Implement actual pagination logic if needed */}
        {!loading &&
          !error &&
          events.length > filteredEvents.length &&
          filteredEvents.length > 9 && (
            <div className="mt-12 flex justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white rounded-lg font-semibold transition-colors shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                // onClick={handleLoadMore} // Add handler for pagination
              >
                Load More Events (Example)
              </motion.button>
            </div>
          )}
      </main>

      <div className="max-w-7xl mx-auto px-4 md:px-6 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gradient-to-br from-indigo-900/40 via-purple-900/30 to-blue-900/40 backdrop-blur-md rounded-2xl p-8 md:p-10 border border-indigo-500/20 shadow-xl text-center"
        >
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Explore More Opportunities
            </h2>
            <p className="text-gray-300 mb-8">
              Stay connected with campus life. Explore different clubs or check
              back soon for new event postings.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/clubs")}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-500 hover:to-purple-600 text-white rounded-lg font-semibold transition-colors shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              >
                Explore Clubs
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EventsPageAll;
