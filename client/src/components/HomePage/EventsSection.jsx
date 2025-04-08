import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  MapPin,
  ArrowRight,
  Loader2,
  AlertTriangle,
  Atom,
  Palette,
  Mic,
  Gamepad2,
  HeartHandshake,
  GraduationCap,
  Bike,
  Coffee,
  Music,
  Film,
  BookOpen,
  Camera,
  PenTool,
  Globe,
  Rocket,
  Puzzle,
  Target,
  Dumbbell,
  Heart,
  Zap,
  Laptop,
  Layers,
} from "lucide-react";
import { fetchClubs } from "../../slices/clubSlice";
import { fetchEvents } from "../../slices/eventSlice";

// --- Format date and time ---
const formatEventDateTime = (isoDate) => {
  if (!isoDate) return { date: "Date TBD", time: "Time TBD" };
  try {
    const dateObj = new Date(isoDate);
    if (isNaN(dateObj.getTime())) throw new Error("Invalid Date");

    const formattedDate = dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const formattedTime = dateObj.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return { date: formattedDate, time: formattedTime };
  } catch (error) {
    console.error("Error formatting date:", error);
    return { date: "Invalid Date", time: "Invalid Time" };
  }
};

// --- Collection of icons for random assignment ---
const ICONS = [
  Atom,
  Palette,
  Mic,
  Gamepad2,
  HeartHandshake,
  GraduationCap,
  Bike,
  Coffee,
  Music,
  Film,
  BookOpen,
  Camera,
  PenTool,
  Globe,
  Rocket,
  Puzzle,
  Target,
  Dumbbell,
  Heart,
  Zap,
  Laptop,
  Layers,
];

// --- Collection of gradients for random assignment ---
const GRADIENTS = [
  "from-purple-500 via-pink-500 to-red-500",
  "from-blue-500 via-cyan-500 to-teal-500",
  "from-green-500 via-emerald-500 to-teal-500",
  "from-amber-500 via-orange-500 to-red-500",
  "from-indigo-500 via-purple-500 to-pink-500",
  "from-rose-500 via-pink-500 to-purple-500",
  "from-teal-500 via-cyan-500 to-blue-500",
  "from-sky-500 via-blue-500 to-indigo-500",
  "from-violet-500 via-purple-500 to-fuchsia-500",
  "from-lime-500 via-green-500 to-emerald-500",
  "from-red-500 via-rose-500 to-pink-500",
];

// --- Get deterministic style based on event ID ---
// Memoize styles using a cache to prevent recalculations
const styleCache = new Map();

const getEventStyle = (eventId, clubName = "", category = "") => {
  const cacheKey = `${eventId}-${clubName}-${category}`;

  if (styleCache.has(cacheKey)) {
    return styleCache.get(cacheKey);
  }

  // Create a hash from the event ID string
  const hashCode = (str) => {
    let hash = 0;
    for (let i = 0; i < str?.length || 0; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  };

  const idHash = hashCode(eventId?.toString() || Math.random().toString());
  const clubHash = hashCode(clubName || category || Math.random().toString());

  // Select based on hashes
  const iconIndex = idHash % ICONS.length;
  const gradientIndex = clubHash % GRADIENTS.length;

  // Handle special cases
  const lowerClubName = clubName?.toLowerCase() || "";
  const lowerCategory = category?.toLowerCase() || "";

  let result;
  if (lowerClubName.includes("coding") || lowerCategory === "tech") {
    result = { Icon: Laptop, gradient: GRADIENTS[2] };
  } else if (lowerClubName.includes("robotic")) {
    result = { Icon: Atom, gradient: GRADIENTS[0] };
  } else if (lowerClubName.includes("sports")) {
    result = { Icon: Dumbbell, gradient: GRADIENTS[3] };
  } else {
    // Default to the deterministic selection
    result = {
      Icon: ICONS[iconIndex],
      gradient: GRADIENTS[gradientIndex],
    };
  }

  // Cache the result
  styleCache.set(cacheKey, result);
  return result;
};

const EventsSection = () => {
  const [activeClub, setActiveClub] = useState("ALL");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // --- Redux selectors ---
  const {
    clubs: fetchedClubData,
    loading: clubsLoading,
    error: clubsError,
  } = useSelector((state) => state.clubs);

  const {
    events: fetchedEventsData,
    loading: eventsLoading,
    error: eventsError,
  } = useSelector((state) => state.events);

  // --- Memoized club filter list ---
  const clubNamesForFilter = useMemo(() => {
    if (!fetchedClubData?.length) return ["ALL"];
    const names = fetchedClubData.map((club) => club.name) || [];
    const uniqueNames = [...new Set(names)];
    return ["ALL", ...uniqueNames.sort()];
  }, [fetchedClubData]);

  // --- Memoized filtered events ---
  const filteredEvents = useMemo(() => {
    if (!fetchedEventsData) return [];
    if (activeClub === "ALL") return fetchedEventsData;

    return fetchedEventsData.filter((event) => {
      const club = fetchedClubData?.find((c) => c.id === event.club_id);
      return club?.name === activeClub;
    });
  }, [fetchedEventsData, activeClub, fetchedClubData]);

  // --- Fetch clubs data ---
  useEffect(() => {
    if (!fetchedClubData || fetchedClubData.length === 0) {
      dispatch(fetchClubs());
    }
  }, [dispatch, fetchedClubData]);

  // --- Debounce club filter changes ---
  const debouncedSetActiveClub = useCallback((clubName) => {
    setActiveClub(clubName);
  }, []);

  // --- Fetch events data based on filter ---
  useEffect(() => {
    let clubIdToFetch = null;
    if (activeClub !== "ALL" && fetchedClubData?.length > 0) {
      const selectedClub = fetchedClubData.find(
        (club) => club.name === activeClub
      );
      clubIdToFetch = selectedClub?.id;
    }
    dispatch(fetchEvents(clubIdToFetch));
  }, [dispatch, activeClub, fetchedClubData]);

  // --- Efficient event card renderer ---
  const renderEventCard = useCallback(
    (event) => {
      // Find the club name using club_id
      const club = fetchedClubData?.find((c) => c.id === event.club_id);
      const clubName = club?.name;

      // Get dynamic styles
      const { Icon, gradient } = getEventStyle(
        event.id,
        clubName,
        event.category
      );

      // Format date/time
      const { date: eventDate, time: eventTime } = formatEventDateTime(
        event.date
      );

      return (
        <div
          key={event.id}
          className="relative overflow-hidden rounded-2xl min-h-[400px] flex flex-col transition-all duration-300 ease-in-out group"
        >
          {/* Card Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/90 to-black/90 backdrop-blur-lg border border-white/10 group-hover:border-white/20 transition-all duration-300 rounded-2xl" />

          {/* Gradient Accent - reduced opacity and simplified animation */}
          <div
            className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br ${gradient} transition-opacity duration-300 rounded-2xl`}
          />

          {/* Reduced size of decorative accent */}
          <div
            className={`absolute -right-16 -top-16 w-32 h-32 rounded-full bg-gradient-to-br ${gradient} opacity-5 blur-xl group-hover:opacity-10 transition-opacity duration-300`}
          />

          <div className="p-6 relative z-10 flex flex-col flex-grow h-full">
            <div className="flex justify-between items-start mb-4">
              <div
                className={`text-3xl p-3 rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg shadow-black/20`}
              >
                <Icon className="w-6 h-6" />
              </div>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${gradient} bg-opacity-80 text-white/90`}
              >
                {clubName || "General"}
              </span>
            </div>

            <h3 className="text-xl font-semibold text-white mb-3">
              {event.name || "Untitled Event"}
            </h3>

            <div className="space-y-2 mb-4 text-sm">
              <div className="flex items-center text-gray-400">
                <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>{eventDate}</span>
              </div>
              <div className="flex items-center text-gray-400">
                <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>{eventTime}</span>
              </div>
              <div className="flex items-center text-gray-400">
                <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>{event.location || "Location TBD"}</span>
              </div>
            </div>

            <div className="relative">
              <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-grow">
                {event.description || "No description available."}
              </p>
              <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-black/90 to-transparent pointer-events-none" />
            </div>

            <div className="mt-auto pt-4">
              <button
                onClick={() => navigate(`/events/${event.id}`)}
                className={`flex items-center justify-center w-full px-4 py-2.5 rounded-lg bg-gradient-to-r ${gradient} text-white text-sm font-medium transition-all duration-300 shadow-md shadow-black/20`}
              >
                View Details
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </button>
            </div>
          </div>
        </div>
      );
    },
    [fetchedClubData, navigate]
  );

  return (
    <section className="py-20 relative overflow-hidden text-white">
      {/* Simplified background elements */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute -left-20 top-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-0 bottom-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 relative inline-block">
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-pink-300 bg-clip-text text-transparent">
              Upcoming Events
            </span>
            <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 to-pink-500 rounded-full" />
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto py-2">
            Explore exciting events organized by various clubs across the
            campus.
          </p>
        </div>

        {/* Club Filter Buttons */}
        <div className="mb-12 sticky top-0 z-20 py-3 backdrop-blur-md bg-black/30">
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 min-h-[44px] items-center">
            {clubsLoading && (
              <div className="flex items-center justify-center text-gray-500">
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                <span>Loading Filters...</span>
              </div>
            )}
            {clubsError && !clubsLoading && (
              <div className="flex items-center justify-center text-red-500">
                <AlertTriangle className="w-5 h-5 mr-2" />
                <span>Error loading filters</span>
              </div>
            )}
            {!clubsLoading &&
              !clubsError &&
              fetchedClubData &&
              clubNamesForFilter.map((clubName) => (
                <button
                  key={clubName}
                  onClick={() => debouncedSetActiveClub(clubName)}
                  className={`px-5 py-2 sm:px-6 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ease-in-out
                  ${
                    activeClub === clubName
                      ? "bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30"
                      : "bg-gray-800/60 backdrop-blur-sm text-purple-300 hover:bg-gray-700/80 border border-white/10 hover:border-white/20"
                  }
                `}
                >
                  {clubName}
                </button>
              ))}
          </div>
        </div>

        {/* Event Cards Grid with simple transition */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[300px]">
          {/* Loading State */}
          {eventsLoading && (
            <div className="md:col-span-2 lg:col-span-3 flex flex-col items-center justify-center text-gray-500 py-20 space-y-3">
              <div className="relative">
                <Loader2 className="w-10 h-10 animate-spin text-purple-400" />
              </div>
              <span>Loading Events...</span>
            </div>
          )}

          {/* Error State */}
          {eventsError && !eventsLoading && (
            <div className="md:col-span-2 lg:col-span-3 flex flex-col items-center justify-center text-red-500 py-20 space-y-3">
              <AlertTriangle className="w-10 h-10" />
              <span>Failed to load events. Please try again later.</span>
              <span className="text-xs text-red-400/70">
                (
                {typeof eventsError === "string" ? eventsError : "Server Error"}
                )
              </span>
            </div>
          )}

          {/* Display Events with smooth transitions */}
          {!eventsLoading &&
            !eventsError &&
            filteredEvents.map(renderEventCard)}

          {/* Empty State */}
          {!eventsLoading && !eventsError && filteredEvents.length === 0 && (
            <div className="md:col-span-2 lg:col-span-3 flex flex-col items-center justify-center py-20 text-gray-500">
              <Calendar className="w-16 h-16 mb-4 text-gray-600/50" />
              <p className="text-xl font-medium mb-2">No events found</p>
              <p className="text-gray-500 text-center max-w-md">
                {activeClub === "ALL"
                  ? "There are no upcoming events scheduled at this time."
                  : `No events found for "${activeClub}" club.`}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
