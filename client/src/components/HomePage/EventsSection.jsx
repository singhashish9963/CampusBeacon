import React, {
  useState,
  useMemo,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  MapPin,
  ArrowRight,
  Loader2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
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

const SCROLL_AMOUNT = 300;

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

const styleCache = new Map();
const getEventStyle = (eventId, clubName = "", category = "") => {
  const cacheKey = `${eventId}-${clubName}-${category}`;
  if (styleCache.has(cacheKey)) {
    return styleCache.get(cacheKey);
  }
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
  const iconIndex = idHash % ICONS.length;
  const gradientIndex = clubHash % GRADIENTS.length;
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
    result = {
      Icon: ICONS[iconIndex],
      gradient: GRADIENTS[gradientIndex],
    };
  }
  styleCache.set(cacheKey, result);
  return result;
};

const EventsSection = () => {
  const [activeClub, setActiveClub] = useState("ALL");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);

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

  const clubNamesForFilter = useMemo(() => {
    if (!fetchedClubData?.length) return ["ALL"];
    const names = fetchedClubData.map((club) => club.name) || [];
    const uniqueNames = [...new Set(names)];
    return ["ALL", ...uniqueNames.sort()];
  }, [fetchedClubData]);

  const filteredEventsByClub = useMemo(() => {
    if (!fetchedEventsData) return [];
    if (activeClub === "ALL") return fetchedEventsData;

    return fetchedEventsData.filter((event) => {
      const club = fetchedClubData?.find((c) => c.id === event.club_id);
      return club?.name === activeClub;
    });
  }, [fetchedEventsData, activeClub, fetchedClubData]);

  useEffect(() => {
    if (!fetchedClubData || fetchedClubData.length === 0) {
      dispatch(fetchClubs());
    }
  }, [dispatch, fetchedClubData]);

  useEffect(() => {
    let clubIdToFetch = null;
    if (activeClub !== "ALL" && fetchedClubData?.length > 0) {
      const selectedClub = fetchedClubData.find(
        (club) => club.name === activeClub
      );
      clubIdToFetch = selectedClub?.id;
      if (clubIdToFetch) {
        dispatch(fetchEvents(clubIdToFetch));
      } else if (!fetchedEventsData || fetchedEventsData.length === 0) {
        dispatch(fetchEvents());
      }
    } else if (
      !fetchedEventsData ||
      fetchedEventsData.length === 0 ||
      activeClub === "ALL"
    ) {
      dispatch(fetchEvents());
    }
  }, [dispatch, activeClub, fetchedClubData]);

  const renderEventCard = useCallback(
    (event) => {
      const club = fetchedClubData?.find((c) => c.id === event.club_id);
      const clubName = club?.name;
      const { Icon, gradient } = getEventStyle(
        event.id,
        clubName,
        event.category
      );
      const { date: eventDate, time: eventTime } = formatEventDateTime(
        event.date
      );

      return (
        <div
          key={event.id}
          className="relative overflow-hidden rounded-2xl min-h-[400px] flex-shrink-0 flex flex-col transition-all duration-300 ease-in-out group w-full sm:w-80 md:w-96"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/90 to-black/90 backdrop-blur-lg border border-white/10 group-hover:border-white/20 transition-all duration-300 rounded-2xl" />
          <div
            className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br ${gradient} transition-opacity duration-300 rounded-2xl`}
          />
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
            <h3 className="text-xl font-semibold text-white mb-3 line-clamp-2">
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
                <span className="line-clamp-1">
                  {event.location || "Location TBD"}
                </span>
              </div>
            </div>
            <div className="relative flex-grow">
              <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                {event.description || "No description available."}
              </p>
              <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-black/90 via-black/90 to-transparent pointer-events-none" />
            </div>
            <div className="mt-auto pt-4">
              <button
                onClick={() => navigate(`/events/${event.id}`)}
                className={`flex items-center justify-center w-full px-4 py-2.5 rounded-lg bg-gradient-to-r ${gradient} text-white text-sm font-medium transition-all duration-300 shadow-md shadow-black/20 hover:brightness-110`}
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

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -SCROLL_AMOUNT,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: SCROLL_AMOUNT,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-20 relative overflow-hidden text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 relative inline-block">
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-pink-300 bg-clip-text text-transparent">
              Upcoming Events
            </span>
            <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 to-pink-500 rounded-full" />
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto py-2">
            Explore exciting events organized by various clubs across the campus.
          </p>
        </div>

        <div className="mb-12 sticky top-0 z-20 py-3 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 backdrop-blur-md bg-black/60">
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 min-h-[44px] items-center max-w-7xl mx-auto">
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
                  onClick={() => setActiveClub(clubName)}
                  className={`px-5 py-2 sm:px-6 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ease-in-out whitespace-nowrap
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

        <div className="relative">
          {eventsLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 py-20 space-y-3 bg-black/30 backdrop-blur-sm z-10 rounded-2xl">
              <Loader2 className="w-10 h-10 animate-spin text-purple-400" />
              <span>Loading Events...</span>
            </div>
          )}

          {eventsError && !eventsLoading && (
            <div className="flex flex-col items-center justify-center text-red-500 py-20 space-y-3 text-center">
              <AlertTriangle className="w-10 h-10" />
              <span>Failed to load events. Please try again later.</span>
              <span className="text-xs text-red-400/70 max-w-md">
                (Error:{" "}
                {typeof eventsError === "string" ? eventsError : "Server Error"}
                )
              </span>
            </div>
          )}

          {!eventsLoading &&
            !eventsError &&
            filteredEventsByClub.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-gray-500 text-center">
                <Calendar className="w-16 h-16 mb-4 text-gray-600/50" />
                <p className="text-xl font-medium mb-2">No events found</p>
                <p className="text-gray-500 max-w-md">
                  {activeClub === "ALL"
                    ? "There are no upcoming events scheduled at this time."
                    : `No events currently scheduled for the "${activeClub}" club.`}
                </p>
              </div>
            )}

          {!eventsLoading &&
            !eventsError &&
            filteredEventsByClub.length > 0 && (
              <div className="relative">
                <button
                  onClick={scrollLeft}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 backdrop-blur-sm p-2 rounded-full text-white transition-all duration-300 shadow-lg shadow-black/20 -ml-4 sm:-ml-2 lg:ml-0"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div
                  ref={scrollContainerRef}
                  className="flex overflow-x-auto gap-6 pb-6 pt-2 snap-x snap-mandatory hide-scrollbar"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  {filteredEventsByClub.map((event) => (
                    <div key={event.id} className="snap-start">
                      {renderEventCard(event)}
                    </div>
                  ))}
                </div>

                <button
                  onClick={scrollRight}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 backdrop-blur-sm p-2 rounded-full text-white transition-all duration-300 shadow-lg shadow-black/20 -mr-4 sm:-mr-2 lg:mr-0"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-black/20 to-transparent pointer-events-none"></div>
                <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-black/20 to-transparent pointer-events-none"></div>
              </div>
            )}
        </div>

        <style jsx>{`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </div>
    </section>
  );
};

export default EventsSection;
