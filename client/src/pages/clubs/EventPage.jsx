import React, { useState, useEffect, Suspense } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import { fetchEventById } from "../../slices/eventSlice"; // Adjust path if needed
import supabase from "../../config/chatConfig/supabaseClient"; // <--- IMPORT SUPABASE CLIENT
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
  FiMessageSquare, // Icon for chat toggle
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

// --- Lazy-loaded Components ---
const ImageGallery = React.lazy(
  () => import("../../components/Club/ImageGallery") // Adjust path if needed
);
const CoordinatorList = React.lazy(
  () => import("../../components/Club/CoordinatorList") // Adjust path if needed
);
const LazyChatApp = React.lazy(
  () => import("../chat/ChatApp") // <--- ADJUST THIS PATH TO YOUR ChatApp.js
);

// --- Helper Functions ---
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

// --- Loading / Fallback Components ---
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

const CoordinatorLoadingFallback = () => (
  <div className="h-40 rounded-2xl bg-gray-800/50 animate-pulse flex items-center justify-center">
    <FiLoader className="text-gray-500 text-3xl animate-spin" />
    <span className="ml-3 text-gray-400">Loading Coordinators...</span>
  </div>
);

const ChatLoadingFallback = () => (
  <div className="flex items-center justify-center h-64 bg-gray-800/50 rounded-lg border border-indigo-500/20">
    <FiLoader className="animate-spin text-cyan-300 mr-3" size={24} />
    <span className="text-gray-400 font-medium">Loading Event Chat...</span>
  </div>
);

// --- Video Slider Component ---
const VideoSlider = ({ videos = [], className = "" }) => {
  const [current, setCurrent] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  // Ensure videos is an array and filter out empty/invalid entries
  const validVideos = (Array.isArray(videos) ? videos : [])
    .map((v) => (typeof v === "string" ? v.trim() : null))
    .filter(Boolean);

  const videoCount = validVideos.length;

  if (videoCount === 0) {
    return null; // Or optionally return a placeholder message
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
      <AnimatePresence initial={false} custom={current} mode="wait">
        <motion.div
          className="relative w-full aspect-video"
          key={current} // Use current index as key
          custom={current > (current - 1 + videoCount) % videoCount ? 1 : -1} // Direction logic
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={transitionConfig}
        >
          <video
            src={validVideos[current]}
            controls
            className="w-full h-full object-cover"
            playsInline // Important for mobile playback
            key={validVideos[current]} // Add key to video element too for reliable replace
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
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

      {/* Dots Indicator */}
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

// --- Main Event Page Component ---
const EventPage = () => {
  const { id: eventIdParam } = useParams();
  const dispatch = useDispatch();
  const {
    currentEvent,
    loading: eventLoading,
    error: eventError,
  } = useSelector((state) => state.events);
  const { user: authUser } = useSelector((state) => state.auth);
  const isAdmin = useSelector(
    (state) => state.auth?.user?.roles?.includes("admin") || false
  );

  // UI Interaction States
  const [isInterested, setIsInterested] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [showChat, setShowChat] = useState(false);

  // ** OPTION 2 STATES **
  const [eventChatIntegerId, setEventChatIntegerId] = useState(null); // State for the integer channel ID
  const [chatIdLoading, setChatIdLoading] = useState(true); // Loading state for the chat channel ID
  const [chatIdError, setChatIdError] = useState(null); // Error state for chat channel ID fetch/create

  // Scroll animation hooks
  const { scrollYProgress } = useScroll();
  const headerOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const blurIntensity = useTransform(scrollYProgress, [0, 0.15], [0, 8]);
  const yPos = useTransform(scrollYProgress, [0, 0.15], [0, -60]);

  // Fetch event data
  useEffect(() => {
    if (eventIdParam) {
      dispatch(fetchEventById(eventIdParam));
      // Reset chat state when event ID changes
      setEventChatIntegerId(null);
      setChatIdLoading(true);
      setChatIdError(null);
      setShowChat(false); // Optionally close chat on navigation
    }
    window.scrollTo(0, 0);
  }, [dispatch, eventIdParam]);

  // ** OPTION 2 EFFECT: Get or Create Event Channel ID **
  useEffect(() => {
    // Run only if: event data is loaded, matches the param, user is logged in, and chat ID isn't loaded/errored yet.
    if (
      currentEvent &&
      currentEvent.id === parseInt(eventIdParam) &&
      authUser && // Only need chat ID if user is logged in
      !eventChatIntegerId &&
      chatIdLoading &&
      !chatIdError
    ) {
      const eventId = currentEvent.id;
      // Define a consistent name convention for the event channel
      const potentialChannelName = `Event: ${currentEvent.name} (ID: ${eventId})`;

      const getOrCreateEventChannel = async () => {
        console.log(
          `Attempting to find/create channel for event ID: ${eventId}`
        );
        try {
          // 1. Try to find the channel by event_id
          let { data: existingChannel, error: findError } = await supabase
            .from("Channels")
            .select("id")
            .eq("event_id", eventId) // <-- Lookup by event_id
            .maybeSingle(); // Still expect 0 or 1

          if (findError) {
            console.error("Error finding channel by event_id:", findError);
            setChatIdError("Database error checking for chat channel.");
            toast.error("Failed to initialize event chat.");
            return;
          }

          if (existingChannel) {
            // 2a. Channel found
            console.log(
              `Found existing channel ID by event_id: ${existingChannel.id}`
            );
            setEventChatIntegerId(existingChannel.id);
          } else {
            // 2b. Channel not found - create it
            console.log(
              "Channel not found by event_id, creating new channel..."
            );
            const potentialChannelName = `Event: ${currentEvent.name} (ID: ${eventId})`; // Still useful for display name
            const { data: newChannel, error: createError } = await supabase
              .from("Channels")
              .insert({
                name: potentialChannelName,
                event_id: eventId, // <-- INSERT the event_id
                // Add other fields as needed
              })
              .select("id")
              .single();

            if (createError) {
              // Handle potential unique constraint violation if race condition occurs
              if (createError.code === "23505") {
                // Unique violation code
                console.warn(
                  "Race condition likely: Channel possibly created by another request. Re-querying..."
                );
                // Re-query immediately
                let { data: raceChannel, error: raceError } = await supabase
                  .from("Channels")
                  .select("id")
                  .eq("event_id", eventId)
                  .single(); // Use single() now, it *must* exist

                if (raceError) {
                  console.error(
                    "Error re-querying after race condition:",
                    raceError
                  );
                  setChatIdError("Chat initialization conflict.");
                  toast.error("Chat initialization conflict. Please reload.");
                } else if (raceChannel) {
                  setEventChatIntegerId(raceChannel.id);
                  console.log(
                    `Found channel ID after race condition: ${raceChannel.id}`
                  );
                }
              } else {
                console.error("Error creating channel:", createError);
                setChatIdError("Failed to create chat channel for this event.");
                toast.error("Could not create event chat.");
              }
            } else if (newChannel) {
              console.log(
                `Successfully created new channel ID: ${newChannel.id}`
              );
              setEventChatIntegerId(newChannel.id);
            } else {
              console.error("Channel creation did not return an ID.");
              setChatIdError("Channel creation failed unexpectedly.");
              toast.error("Chat initialization failed.");
            }
          }
        } catch (err) {
          console.error("Unexpected error in getOrCreateEventChannel:", err);
          setChatIdError("An unexpected error occurred.");
          toast.error("Chat initialization error.");
        } finally {
          setChatIdLoading(false);
        }
      };

      getOrCreateEventChannel();
    } else if (!authUser && chatIdLoading) {
      // If user is not logged in, finish loading state for chat ID immediately
      setChatIdLoading(false);
    }
    // Dependency array
  }, [
    currentEvent,
    eventIdParam,
    authUser,
    eventChatIntegerId,
    chatIdLoading,
    chatIdError,
  ]);

  // --- Combined Loading State ---
  // Show main loading screen if event data is loading
  if (
    eventLoading ||
    !currentEvent ||
    currentEvent.id !== parseInt(eventIdParam)
  ) {
    return <LoadingState />;
  }
  // Note: Chat ID loading is handled within the chat section button/display

  // --- Error States ---
  if (eventError) {
    // Display event loading error
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
          <p className="text-red-200/80 mb-6">
            {typeof eventError === "string"
              ? eventError
              : "Could not load event details."}
          </p>
          <div className="flex gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (eventIdParam) dispatch(fetchEventById(eventIdParam));
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

  // --- Event Data Not Found State --- (Should be covered by loading/error check above, but kept for safety)
  if (
    !eventLoading &&
    (!currentEvent || currentEvent.id !== parseInt(eventIdParam))
  ) {
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
            We couldn't find the event you're looking for (ID: {eventIdParam}).
            It might have been removed or the link is invalid.
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

  // --- Destructure Valid Event Data --- (Safe now)
  const {
    id: eventId,
    name = "Event Name Not Available",
    description = "No description provided.",
    date,
    location = "Location not specified",
    images = [],
    videos = [],
    social_media_links: socialLinks = [],
    coordinators: coordinators = [], // Use Capital C if that's how Sequelize includes it
    club_id,
    Club: eventClub,
    category = "Event",
  } = currentEvent;

  // --- Format Date/Time ---
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
      }
    } catch (error) {
      console.error("Error parsing date:", error);
    }
  }

  // --- Event Handlers ---
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
    // TODO: Add actual API call to backend to save interest status
  };

  const handleBookmarkToggle = () => {
    setBookmarked(!bookmarked);
    toast.success(bookmarked ? "Removed from bookmarks" : "Event bookmarked!", {
      icon: bookmarked ? "❌" : "🔖",
      position: "bottom-center",
      style: { borderRadius: "10px", background: "#333", color: "#fff" },
    });
    // TODO: Add actual API call to backend to save bookmark status
  };

  // --- Derived Data ---
  const descriptionParagraphs = description
    ? description.split("\n").filter((p) => p.trim().length > 0)
    : [];

  // --- Render JSX ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#080E20] via-[#14152E] to-[#070A17] text-white overflow-x-hidden">
      {/* --- Hero Section --- */}
      <div className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        {/* Background Layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/50 via-purple-900/40 to-blue-900/30 z-10"></div>
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48cmVjdCB4PSIzMCIgeT0iMzAiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9zdmc+')]"></div>
        {images && images.length > 0 && (
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-t from-[#080E20] via-[#080e20cc] to-[#080e2066] z-10"></div>
            <img
              src={images[0]} // Use first image as background
              alt={`${name} background`}
              className="w-full h-full object-cover object-center opacity-50"
              loading="lazy" // Add lazy loading
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
            <span className="text-sm font-semibold tracking-wide uppercase">
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
              <FiCalendar className="text-cyan-300" />
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

          {/* Action Buttons (Interest, Bookmark, Share) */}
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
              disabled={!authUser} // Disable if not logged in
              title={!authUser ? "Log in to mark interest" : ""}
            >
              <FiHeart className={isInterested ? "fill-white" : ""} />
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
              disabled={!authUser} // Disable if not logged in
              title={!authUser ? "Log in to bookmark" : ""}
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
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-indigo-700/20 blur-3xl animate-pulse-slow -z-10"></div>
        <div className="absolute bottom-1/3 right-1/3 w-48 h-48 rounded-full bg-cyan-700/20 blur-3xl animate-pulse-slow animation-delay-1000 -z-10"></div>
      </div>
      {/* --- Main Content Area --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 -mt-16 md:-mt-24 relative z-30">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* --- Left/Main Column --- */}
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
                <div className="text-gray-300 text-base md:text-lg leading-relaxed space-y-4 prose prose-invert max-w-none prose-p:my-3 prose-headings:text-indigo-300">
                  {descriptionParagraphs.map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 italic">
                  {" "}
                  No description available for this event.{" "}
                </p>
              )}
            </motion.section>

            {/* Media Galleries Section (Images & Videos) */}
            <Suspense
              fallback={
                <div className="h-64 rounded-2xl bg-gray-800/50 animate-pulse flex items-center justify-center">
                  <FiLoader className="text-gray-500 text-3xl animate-spin" />
                  <span className="ml-3 text-gray-400">Loading Media...</span>
                </div>
              }
            >
              {/* Image Gallery */}
              {Array.isArray(images) && images.filter(Boolean).length > 0 && (
                <motion.section
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-blue-400 inline-block mb-6">
                    Event Gallery
                  </h2>
                  <ImageGallery images={images.filter(Boolean)} />
                </motion.section>
              )}

              {/* Video Gallery */}
              {Array.isArray(videos) &&
                videos.filter((v) => typeof v === "string" && v.trim()).length >
                  0 && (
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
                    <VideoSlider
                      videos={videos.filter(
                        (v) => typeof v === "string" && v.trim()
                      )}
                    />
                  </motion.section>
                )}
            </Suspense>

            {/* ========== EVENT CHAT SECTION (Option 2 Implementation) ========== */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-gradient-to-br from-gray-900/80 to-indigo-900/20 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-indigo-500/20 shadow-xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-300 to-cyan-400 inline-block">
                  Event Discussion
                </h2>
                {/* --- Chat Toggle Button Logic --- */}
                {
                  authUser ? (
                    chatIdLoading ? (
                      // Loading state
                      <button
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-700/60 text-gray-400 text-sm font-medium cursor-wait"
                        disabled
                      >
                        <FiLoader className="animate-spin" size={16} />
                        Chat Loading...
                      </button>
                    ) : chatIdError ? (
                      // Error state
                      <div
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-900/50 text-red-300 text-sm font-medium"
                        title={chatIdError}
                      >
                        <FiAlertCircle size={16} />
                        Chat Unavailable
                      </div>
                    ) : eventChatIntegerId ? (
                      // Success: Show toggle button
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowChat(!showChat)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600/50 hover:bg-indigo-600/80 text-white text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                        aria-expanded={showChat}
                        aria-controls="event-chat-container"
                      >
                        <FiMessageSquare size={16} />
                        {showChat ? "Hide Chat" : "Show Chat"}
                      </motion.button>
                    ) : (
                      // Fallback if ID somehow null after loading without error
                      <div className="text-gray-500 text-sm italic">
                        Chat Init Failed
                      </div>
                    )
                  ) : null /* Don't show button if user not logged in */
                }
              </div>

              {/* Prompt for non-logged-in users */}
              {!authUser && (
                <div className="text-center text-gray-400 italic py-6 border-t border-gray-700/50 mt-4">
                  Please{" "}
                  <Link
                    to="/login"
                    className="text-cyan-400 hover:underline font-medium"
                  >
                    {" "}
                    log in{" "}
                  </Link>{" "}
                  or{" "}
                  <Link
                    to="/signup"
                    className="text-cyan-400 hover:underline font-medium"
                  >
                    {" "}
                    sign up{" "}
                  </Link>{" "}
                  to join the discussion!
                </div>
              )}

              {/* Chat Component Area (Animated & Conditional) */}
              <AnimatePresence>
                {/* Render only if: user logged in, chat shown, AND integer ID is available and no error */}
                {authUser && showChat && eventChatIntegerId && !chatIdError && (
                  <motion.div
                    id="event-chat-container"
                    initial={{ height: 0, opacity: 0, marginTop: 0 }}
                    animate={{
                      height: "auto",
                      opacity: 1,
                      marginTop: "1.5rem",
                    }}
                    exit={{ height: 0, opacity: 0, marginTop: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="overflow-hidden" // Crucial for height animation
                  >
                    <Suspense fallback={<ChatLoadingFallback />}>
                      {/* Container with defined height for ChatApp */}
                      <div style={{ height: "60vh", minHeight: "400px" }}>
                        <LazyChatApp
                          // Use the INTEGER ID as the key and channelId prop
                          key={eventChatIntegerId}
                          channelId={eventChatIntegerId}
                          // Construct channel name for display in ChatApp header
                          channelName={`Event: ${name}`} // Keep name descriptive
                          darkMode={true} // Assuming dark theme
                          isAdmin={isAdmin} // Pass admin status
                          // authUser is obtained internally by ChatApp via Redux
                        />
                      </div>
                    </Suspense>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.section>
            {/* ========== END EVENT CHAT SECTION ========== */}
          </div>{" "}
          {/* End Left/Main Column */}
          {/* --- Right/Sidebar Column --- */}
          <div className="space-y-8 lg:sticky lg:top-24 lg:self-start">
            {" "}
            {/* Adjust top offset if needed */}
            {/* Event Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-gray-900/90 to-indigo-900/20 backdrop-blur-md rounded-2xl p-6 border border-indigo-500/20 shadow-xl"
            >
              <h3 className="text-xl font-semibold text-white mb-5 border-b border-indigo-800/50 pb-3">
                Event Details
              </h3>
              <div className="space-y-4">
                {/* Date */}
                <div className="flex items-start gap-3">
                  <div className="bg-indigo-600/30 p-2.5 rounded-lg shrink-0 mt-0.5">
                    <FiCalendar className="text-cyan-300 text-lg" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm font-medium">Date</p>
                    <p className="text-white font-medium">{formattedDate}</p>
                  </div>
                </div>
                {/* Time */}
                <div className="flex items-start gap-3">
                  <div className="bg-indigo-600/30 p-2.5 rounded-lg shrink-0 mt-0.5">
                    <FiClock className="text-cyan-300 text-lg" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm font-medium">Time</p>
                    <p className="text-white font-medium">{formattedTime}</p>
                  </div>
                </div>
                {/* Location */}
                <div className="flex items-start gap-3">
                  <div className="bg-indigo-600/30 p-2.5 rounded-lg shrink-0 mt-0.5">
                    <FiMapPin className="text-cyan-300 text-lg" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm font-medium">
                      Location
                    </p>
                    <p className="text-white font-medium">{location}</p>
                  </div>
                </div>
                {/* Coordinators Count */}
                {Array.isArray(coordinators) && coordinators.length > 0 && (
                  <div className="flex items-start gap-3">
                    <div className="bg-indigo-600/30 p-2.5 rounded-lg shrink-0 mt-0.5">
                      <FiUser className="text-cyan-300 text-lg" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm font-medium">
                        Coordinators
                      </p>
                      <p className="text-white font-medium">
                        {coordinators.length} Contact
                        {coordinators.length > 1 ? "s" : ""} Available
                      </p>
                    </div>
                  </div>
                )}
              </div>
              {/* Action Buttons (Register/Share) */}
              <div className="mt-6 pt-5 border-t border-indigo-800/50 space-y-3">
                {/* Placeholder for Registration Button - Implement actual logic later */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-xl text-white font-semibold tracking-wide shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500/50 disabled:opacity-60 disabled:cursor-not-allowed"
                  // onClick={() => {/* TODO: Add Registration Logic/Link */}}
                  disabled // Remove or enable based on registration status/logic
                  title="Registration details not available"
                >
                  Registration Info {/* Placeholder Text */}
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
            {Array.isArray(socialLinks) &&
              socialLinks.filter(Boolean).length > 0 && (
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
                    {socialLinks.filter(Boolean).map((link, index) => {
                      const { Icon, colorClass } = getSocialDetails(link);
                      return (
                        <motion.a
                          key={index}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ y: -3, scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`p-3 bg-gray-800/70 hover:bg-gray-700/90 rounded-lg ${colorClass} transition-all duration-200 ease-in-out shadow-md hover:shadow-lg`}
                          aria-label={`Visit social media page`}
                        >
                          <Icon size={22} />
                        </motion.a>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            {/* Coordinators List Section */}
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
                {Array.isArray(coordinators) && coordinators.length > 0 ? (
                  <CoordinatorList
                    coordinators={coordinators}
                    isAdmin={isAdmin} // Pass admin status if needed inside CoordinatorList
                    showTitleSection={false} // Hide internal title
                    simpleCard={true} // Use compact card style
                    gridClass="grid-cols-1 gap-4" // Ensure single column layout
                  />
                ) : (
                  <p className="text-gray-400 text-sm italic py-4 text-center">
                    Coordinator information not available.
                  </p>
                )}
              </Suspense>
            </motion.div>
           
            
          </div>{" "}
          {/* End Right/Sidebar Column */}
        </div>{" "}
        {/* End Grid */}
        {/* --- Back Button --- */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <Link to="/events">
            {" "}
            {/* Adjust link if your events list is elsewhere */}
            <motion.button
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 rounded-xl text-white font-medium flex items-center justify-center gap-2 mx-auto shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-gray-500/50"
            >
              <FiArrowLeft /> <span>Back to All Events</span>
            </motion.button>
          </Link>
        </motion.div>
      </div>{" "}
      {/* End Main Content Area (-mt container) */}
    </div> // End Root Div
  );
};

export default EventPage;
