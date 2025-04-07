import React, { useState, useEffect, Suspense } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import { fetchEventById } from "../../slices/eventSlice"; // Assuming correct path
import {
  FiCalendar,
  FiMapPin,
  FiShare2,
  FiLoader,
  FiAlertCircle,
  FiClock,
  FiUser,
  FiChevronLeft,
  FiChevronRight,
  FiArrowLeft,
  FiHeart,
  FiBookmark,
  FiMoreHorizontal,
  FiVideo,
} from "react-icons/fi";
import {
  FaInstagram,
  FaTwitter,
  FaFacebookF,
  FaLinkedinIn,
  FaYoutube,
  FaGlobe,
} from "react-icons/fa";
import toast from "react-hot-toast";

// Lazy-loaded components
const ImageGallery = React.lazy(() =>
  import("../../components/Club/ImageGallery")
); // Adjust path if needed
const CoordinatorList = React.lazy(() =>
  import("../../components/Club/CoordinatorList")
); // Adjust path if needed

// Helper function to determine social media icons
const getSocialDetails = (url) => {
  if (!url)
    return { Icon: FaGlobe, colorClass: "text-blue-400 hover:text-blue-300" };
  if (url.includes("instagram"))
    return {
      Icon: FaInstagram,
      colorClass: "text-pink-500 hover:text-pink-400",
    };
  if (url.includes("twitter"))
    return { Icon: FaTwitter, colorClass: "text-blue-400 hover:text-blue-300" };
  if (url.includes("facebook"))
    return {
      Icon: FaFacebookF,
      colorClass: "text-blue-600 hover:text-blue-500",
    };
  if (url.includes("linkedin"))
    return {
      Icon: FaLinkedinIn,
      colorClass: "text-blue-500 hover:text-blue-400",
    };
  if (url.includes("youtube"))
    return { Icon: FaYoutube, colorClass: "text-red-500 hover:text-red-400" };
  return { Icon: FaGlobe, colorClass: "text-teal-400 hover:text-teal-300" };
};

// Loading Component
const LoadingState = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0B1026] via-[#121638] to-[#1A1B35]">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center space-y-6"
    >
      <div className="relative">
        <div className="w-16 h-16 border-t-4 border-b-4 border-cyan-400 rounded-full animate-spin"></div>
        <div className="absolute top-0 left-0 w-16 h-16 border-l-4 border-r-4 border-t-4 border-orange-400 rounded-full animate-ping"></div>
      </div>
      <p className="text-cyan-300 text-xl font-medium">Loading Event Details</p>
      <div className="w-32 h-1 bg-gradient-to-r from-cyan-300 to-orange-400 rounded-full"></div>
    </motion.div>
  </div>
);

// VideoSlider Component
const VideoSlider = ({ videos = [], className = "" }) => {
  const [current, setCurrent] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const validVideos = (Array.isArray(videos) ? videos : [])
    .map((v) => (typeof v === "string" ? v.trim() : null))
    .filter(Boolean);

  const videoCount = validVideos.length;

  if (videoCount === 0) {
    return null;
  }

  const nextSlide = () => setCurrent((prev) => (prev + 1) % videoCount);
  const prevSlide = () =>
    setCurrent((prev) => (prev - 1 + videoCount) % videoCount);

  const variants = {
    enter: (direction) => ({ x: direction > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { zIndex: 1, x: 0, opacity: 1 },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
    }),
  };

  const transitionConfig = {
    x: { type: "spring", stiffness: 300, damping: 30 },
    opacity: { duration: 0.5 },
  };

  return (
    <motion.div
      className={`relative rounded-2xl overflow-hidden shadow-2xl border border-indigo-500/20 group bg-gradient-to-br from-gray-900 to-indigo-900/40 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          className="relative w-full aspect-video"
          key={validVideos[current]}
        >
          <motion.video
            src={validVideos[current]}
            controls
            className="w-full h-full object-cover"
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            custom={(current + 1) % videoCount > current ? 1 : -1}
            transition={transitionConfig}
            playsInline // Important for mobile playback
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        </motion.div>
      </AnimatePresence>

      {videoCount > 1 && (
        <>
          <motion.button
            onClick={prevSlide}
            className="absolute top-1/2 left-3 transform -translate-y-1/2 z-10 p-3 bg-black/30 backdrop-blur-md hover:bg-indigo-600 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: isHovering ? 0 : -10, opacity: isHovering ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            aria-label="Previous video"
          >
            <FiChevronLeft size={22} />
          </motion.button>
          <motion.button
            onClick={nextSlide}
            className="absolute top-1/2 right-3 transform -translate-y-1/2 z-10 p-3 bg-black/30 backdrop-blur-md hover:bg-indigo-600 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            initial={{ x: 10, opacity: 0 }}
            animate={{ x: isHovering ? 0 : 10, opacity: isHovering ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            aria-label="Next video"
          >
            <FiChevronRight size={22} />
          </motion.button>
        </>
      )}

      {videoCount > 1 && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center gap-1.5">
            {Array.from({ length: videoCount }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === current
                    ? "w-6 bg-indigo-500"
                    : "w-1.5 bg-white/60 hover:bg-white/80"
                }`}
                aria-label={`Go to video ${i + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

// Main Event Page Component
const EventPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentEvent, loading, error } = useSelector((state) => state.events);
  // Ensure auth state is correctly structured in your Redux store
  const isAdmin = useSelector(
    (state) => state.auth?.user?.isAdmin || state.auth?.isAdmin || false
  );
  const [isInterested, setIsInterested] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  // Scroll animation
  const { scrollYProgress } = useScroll();
  const headerOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const blurIntensity = useTransform(scrollYProgress, [0, 0.15], [0, 8]);
  const yPos = useTransform(scrollYProgress, [0, 0.15], [0, -60]);

  useEffect(() => {
    if (id) {
      // Clear previous event data before fetching new one (optional but good practice)
      // dispatch(clearCurrentEvent()); // Assuming you have such an action
      dispatch(fetchEventById(id));
    }
    window.scrollTo(0, 0); // Scroll to top on mount
  }, [dispatch, id]);

  // Loading State
  // Show loading if loading is true AND currentEvent is null or its id doesn't match
  if (loading && (!currentEvent || currentEvent.id !== parseInt(id))) {
    return <LoadingState />;
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0B1026] to-[#1A1B35] p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-8 bg-gradient-to-br from-red-900/20 to-red-800/30 backdrop-blur-md rounded-2xl border border-red-500/30 shadow-lg max-w-lg"
        >
          <FiAlertCircle className="text-6xl text-red-400 mx-auto mb-5" />
          <h2 className="text-2xl font-bold text-red-300 mb-3">
            Oops! Something Went Wrong
          </h2>
          {/* Display the actual error message */}
          <p className="text-red-200/80 mb-6">
            {typeof error === "string"
              ? error
              : "Could not load event details."}
          </p>
          <div className="flex gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (id) dispatch(fetchEventById(id));
              }}
              className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-lg font-semibold transition-colors shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500/50"
            >
              Try Again
            </motion.button>
            <Link to="/events">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2.5 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white rounded-lg font-semibold transition-colors shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-500/50"
              >
                Back to Events
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // Event Data Not Found State
  // This condition checks if loading is finished AND currentEvent is still null or doesn't match
  if (!loading && (!currentEvent || currentEvent.id !== parseInt(id))) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0B1026] to-[#1A1B35] p-6 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-lg p-8 bg-gradient-to-br from-gray-800/50 to-gray-900/70 backdrop-blur-md rounded-2xl border border-amber-500/20 shadow-xl"
        >
          <FiAlertCircle className="text-6xl text-amber-400 mx-auto mb-5" />
          <h1 className="text-3xl font-bold text-amber-100 mb-4">
            Event Not Found
          </h1>
          <p className="text-gray-300 mb-8">
            We couldn't find the event you're looking for (ID: {id}). It might
            have been removed or the link is invalid.
          </p>
          <Link to="/events">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white rounded-xl font-semibold transition-colors shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            >
              <FiArrowLeft className="inline mr-2" /> Explore Other Events
            </motion.button>
          </Link>
        </motion.div>
      </div>
    );
  }

  // Destructure event details (only if currentEvent is valid)
  const {
    name = "Event Name Not Available",
    description = "No description provided.",
    date, // Keep the raw date string
    location = "Location not specified",
    images = [],
    videos = [],
    social_media_links: socialLinks = [],
    // Ensure the backend sends coordinators under the key 'Coordinators' (capital C)
    // This matches the include alias Sequelize usually generates
    coordinators = [],
    club_id, // Assuming club_id is needed for admin links or context
    Club: eventClub, // Assuming backend sends associated club data like this
    category = "Event", // Default category
  } = currentEvent || {}; // Add default empty object fallback

  // Format Date and Time
  let formattedDate = "Date not specified";
  let formattedTime = "Time not specified";
  if (date) {
    try {
      const eventDateObj = new Date(date);
      if (!isNaN(eventDateObj.getTime())) {
        formattedDate = eventDateObj.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        formattedTime = eventDateObj.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });
      } else {
        console.warn("Invalid date format received:", date);
      }
    } catch (error) {
      console.error("Error parsing or formatting date:", error);
    }
  }

  // Share Functionality
  const handleShare = async () => {
    const shareData = {
      title: name,
      text: `Check out this event: ${name} on ${formattedDate} at ${formattedTime}!`,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast.success("Event shared successfully!");
      } else {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!", {
          icon: "📋",
          style: { borderRadius: "10px", background: "#333", color: "#fff" },
        });
      }
    } catch (err) {
      console.error("Sharing failed:", err);
      toast.error("Could not share event.");
    }
  };

  // Interest Toggle
  const handleInterestToggle = () => {
    setIsInterested(!isInterested);
    toast.success(
      isInterested ? "Removed from interested" : "Added to interested events!",
      {
        icon: isInterested ? "❌" : "❤️",
        position: "bottom-center",
        style: { borderRadius: "10px", background: "#333", color: "#fff" },
      }
    );
  };

  // Bookmark Toggle
  const handleBookmarkToggle = () => {
    setBookmarked(!bookmarked);
    toast.success(bookmarked ? "Removed from bookmarks" : "Event bookmarked!", {
      icon: bookmarked ? "❌" : "🔖",
      position: "bottom-center",
      style: { borderRadius: "10px", background: "#333", color: "#fff" },
    });
  };

  // Format Description
  const descriptionParagraphs = description
    ? description.split("\n").filter((p) => p.trim().length > 0)
    : [];

  // --- Fallback Coordinator Loading Component ---
  const CoordinatorLoadingFallback = () => (
    <div className="h-40 rounded-2xl bg-gray-800/50 animate-pulse flex items-center justify-center">
      <FiLoader className="text-gray-500 text-3xl animate-spin" />
      <span className="ml-3 text-gray-400">Loading Coordinators...</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#080E20] via-[#14152E] to-[#070A17] text-white overflow-hidden">
      {/* --- Hero Section --- */}
      <div className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        {/* Background Layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/50 via-purple-900/40 to-blue-900/30 z-10"></div>
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48cmVjdCB4PSIzMCIgeT0iMzAiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9zdmc+')]"></div>
        {images && images.length > 0 && (
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-t from-[#080E20] via-[#080e20cc] to-[#080e2066] z-10"></div>
            <img
              src={images[0]}
              alt={name}
              className="w-full h-full object-cover object-center opacity-50"
            />
          </div>
        )}

        {/* Header Content */}
        <motion.div
          style={{
            opacity: headerOpacity,
            y: yPos,
            filter: `blur(${blurIntensity}px)`,
          }}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4 md:px-8"
        >
          {/* Category Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-block px-4 py-1.5 rounded-full bg-indigo-600/80 backdrop-blur-md text-white mb-6 shadow-lg"
          >
            <span className="text-sm font-semibold tracking-wide">
              {category}
            </span>
          </motion.div>

          {/* Event Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-200 to-indigo-300 pb-2 leading-tight max-w-4xl"
          >
            {name}
          </motion.h1>

          {/* Date, Time & Location */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="flex flex-wrap items-center justify-center gap-4 md:gap-8 text-base md:text-lg text-gray-300 mb-8"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 bg-black/20 backdrop-blur-md px-4 py-2 rounded-full"
            >
              <FiCalendar className="text-cyan-300" />{" "}
              <span>{formattedDate}</span>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 bg-black/20 backdrop-blur-md px-4 py-2 rounded-full"
            >
              <FiClock className="text-cyan-300" /> <span>{formattedTime}</span>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 bg-black/20 backdrop-blur-md px-4 py-2 rounded-full"
            >
              <FiMapPin className="text-cyan-300" /> <span>{location}</span>
            </motion.div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="flex gap-3 mt-2"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleInterestToggle}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-white shadow-lg transition-all ${
                isInterested
                  ? "bg-pink-600 hover:bg-pink-700"
                  : "bg-gray-800/80 hover:bg-gray-700/80 backdrop-blur-md"
              }`}
            >
              <FiHeart className={isInterested ? "fill-white" : ""} />{" "}
              <span>{isInterested ? "Interested" : "I'm Interested"}</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBookmarkToggle}
              className={`p-2.5 rounded-full shadow-lg transition-all ${
                bookmarked
                  ? "bg-indigo-600 hover:bg-indigo-700"
                  : "bg-gray-800/80 hover:bg-gray-700/80 backdrop-blur-md"
              }`}
              aria-label={bookmarked ? "Remove bookmark" : "Bookmark event"}
            >
              <FiBookmark className={bookmarked ? "fill-white" : ""} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleShare}
              className="p-2.5 bg-gray-800/80 hover:bg-gray-700/80 backdrop-blur-md rounded-full transition-all shadow-lg"
              aria-label="Share event"
            >
              <FiShare2 />
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Decorative Circles */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-indigo-700/20 blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/3 right-1/3 w-48 h-48 rounded-full bg-cyan-700/20 blur-3xl animate-pulse-slow animation-delay-1000"></div>
      </div>

      {/* --- Main Content --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 -mt-16 md:-mt-24 relative z-30">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* --- Main Column --- */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description Section */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-gray-900/80 to-indigo-900/20 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-indigo-500/20 shadow-xl"
            >
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-indigo-300 inline-block mb-6">
                About the Event
              </h2>
              {descriptionParagraphs.length > 0 ? (
                <div className="text-gray-300 text-base md:text-lg leading-relaxed space-y-4">
                  {descriptionParagraphs.map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 italic">
                  No description available for this event.
                </p>
              )}
            </motion.section>

            {/* Media Galleries Section */}
            {/* Wrap gallery sections in a Suspense for lazy loading */}
            <Suspense
              fallback={
                <div className="h-64 rounded-2xl bg-gray-800/50 animate-pulse flex items-center justify-center">
                  <FiLoader className="text-gray-500 text-3xl animate-spin" />
                </div>
              }
            >
              {/* Image Gallery */}
              {images && images.length > 0 && (
                <motion.section
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="mt-8"
                >
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-blue-400 inline-block mb-6">
                    Event Gallery
                  </h2>
                  <ImageGallery images={images} />
                </motion.section>
              )}

              {/* Video Gallery */}
              {videos && videos.length > 0 && (
                <motion.section
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="mt-8"
                >
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-pink-400 inline-block mb-6">
                    Featured Videos
                  </h2>
                  <VideoSlider videos={videos} />
                </motion.section>
              )}
            </Suspense>
          </div>

          {/* --- Sidebar --- */}
          <div className="space-y-8 lg:sticky lg:top-4 lg:self-start">
            {" "}
            {/* Make sidebar sticky */}
            {/* Event Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-gray-900/90 to-indigo-900/20 backdrop-blur-md rounded-2xl p-6 border border-indigo-500/20 shadow-xl"
            >
              <h3 className="text-xl font-semibold text-white mb-4">
                Event Details
              </h3>
              <div className="space-y-4">
                {/* Date */}
                <div className="flex items-start gap-3">
                  <div className="bg-indigo-600/30 p-2.5 rounded-lg shrink-0">
                    <FiCalendar className="text-cyan-300 text-lg" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Date</p>
                    <p className="text-white font-medium">{formattedDate}</p>
                  </div>
                </div>
                {/* Time */}
                <div className="flex items-start gap-3">
                  <div className="bg-indigo-600/30 p-2.5 rounded-lg shrink-0">
                    <FiClock className="text-cyan-300 text-lg" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Time</p>
                    <p className="text-white font-medium">{formattedTime}</p>
                  </div>
                </div>
                {/* Location */}
                <div className="flex items-start gap-3">
                  <div className="bg-indigo-600/30 p-2.5 rounded-lg shrink-0">
                    <FiMapPin className="text-cyan-300 text-lg" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Location</p>
                    <p className="text-white font-medium">{location}</p>
                  </div>
                </div>
                {/* Coordinators Count */}
                {/* Check if Coordinators is an array before accessing length */}
                {Array.isArray(coordinators) && coordinators.length > 0 && (
                  <div className="flex items-start gap-3">
                    <div className="bg-indigo-600/30 p-2.5 rounded-lg shrink-0">
                      <FiUser className="text-cyan-300 text-lg" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Coordinators</p>
                      <p className="text-white font-medium">
                        {coordinators.length} Available
                      </p>
                    </div>
                  </div>
                )}
              </div>
              {/* Action Buttons */}
              <div className="mt-6 space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-xl text-white font-medium shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  // onClick={() => {/* Add Registration Logic */}}
                >
                  Register Now {/* Placeholder */}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleShare}
                  className="w-full py-3 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 rounded-xl text-white font-medium flex items-center justify-center gap-2 shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-gray-500/50"
                >
                  <FiShare2 /> <span>Share Event</span>
                </motion.button>
              </div>
            </motion.div>
            {/* Social Media Links */}
            {socialLinks && socialLinks.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-gradient-to-br from-gray-900/90 to-indigo-900/20 backdrop-blur-md rounded-2xl p-6 border border-indigo-500/20 shadow-xl"
              >
                <h3 className="text-xl font-semibold text-white mb-4">
                  Connect With Us
                </h3>
                <div className="flex flex-wrap gap-3">
                  {socialLinks.map((link, index) => {
                    const { Icon, colorClass } = getSocialDetails(link);
                    return (
                      <motion.a
                        key={index}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={`p-3 bg-gray-800 rounded-lg ${colorClass} transition-all hover:shadow-lg`}
                        aria-label={`Visit our social media profile`}
                      >
                        <Icon size={22} />
                      </motion.a>
                    );
                  })}
                </div>
              </motion.div>
            )}
            {/* --- Coordinators List Section --- */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gradient-to-br from-gray-900/90 to-indigo-900/20 backdrop-blur-md rounded-2xl p-6 border border-indigo-500/20 shadow-xl"
            >
              <h3 className="text-xl font-semibold text-white mb-4">
                Event Coordinators
              </h3>
              <Suspense fallback={<CoordinatorLoadingFallback />}>
                {/* Check if Coordinators is an array and has items */}
                {Array.isArray(coordinators) && coordinators.length > 0 ? (
                  <CoordinatorList
                    coordinators={coordinators} // Pass the fetched data
                    isAdmin={isAdmin} // Pass admin status (controls edit/delete visibility if enabled in CoordinatorList)
                    showTitleSection={false} // Don't show the "Meet the Team" title
                    simpleCard={true} // Use the simpler card layout for sidebar
                    gridClass="grid-cols-1 gap-4" // Single column layout for sidebar
                    // openModal={/* Optional: Pass function if edit/delete needed directly here */}
                  />
                ) : (
                  // Display message if no coordinators are assigned
                  <p className="text-gray-400 text-sm italic">
                    No coordinators assigned to this event.
                  </p>
                )}
              </Suspense>
            </motion.div>
            {/* --- End Coordinators List Section --- */}
            {/* Admin Actions */}
            {isAdmin && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-gradient-to-br from-gray-900/90 to-red-900/20 backdrop-blur-md rounded-2xl p-6 border border-red-500/20 shadow-xl"
              >
                <h3 className="text-xl font-semibold text-white mb-4">
                  Admin Actions
                </h3>
                <div className="space-y-3">
                  {/* Ensure the edit link uses the correct event ID */}
                  <Link to={`/admin/events/edit/${id}`}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 rounded-xl text-white font-medium shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                    >
                      Edit Event
                    </motion.button>
                  </Link>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    // onClick={handleDelete} // TODO: Implement delete confirmation
                    className="w-full py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-xl text-white font-medium shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-red-500/50"
                  >
                    Delete Event {/* TODO: Add confirmation */}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* --- Back Button --- */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <Link to="/events">
            {" "}
            {/* Link back to the main events list */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 rounded-xl text-white font-medium flex items-center justify-center gap-2 mx-auto shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-gray-500/50"
            >
              <FiArrowLeft /> <span>Back to Events</span>
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default EventPage;
