import React, { useState, useMemo, useEffect, useCallback, useRef } from "react";
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
    console.error("Error formatting date:", isoDate, error);
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
  Calendar,
  MapPin,
  Clock,
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
  "from-cyan-500 via-blue-500 to-indigo-500",
  "from-fuchsia-500 via-pink-500 to-rose-500",
];

const styleCache = new Map();

const hashCode = (str) => {
  let hash = 0;
  if (!str || str.length === 0) return hash;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
};

const getEventStyle = (eventId, clubName = "", category = "") => {
  const cacheKey = `${eventId}-${clubName}-${category}`;
  if (styleCache.has(cacheKey)) {
    return styleCache.get(cacheKey);
  }

  const lowerClubName = clubName?.toLowerCase() || "";
  const lowerCategory = category?.toLowerCase() || "";
  let result;

  if (
    lowerClubName.includes("coding") ||
    lowerCategory === "tech" ||
    lowerClubName.includes("computer")
  ) {
    result = { Icon: Laptop, gradient: GRADIENTS[4] };
  } else if (lowerClubName.includes("robotic")) {
    result = { Icon: Atom, gradient: GRADIENTS[1] };
  } else if (lowerClubName.includes("sports") || lowerCategory === "sports") {
    result = { Icon: Dumbbell, gradient: GRADIENTS[3] };
  } else if (lowerClubName.includes("art") || lowerCategory === "art") {
    result = { Icon: Palette, gradient: GRADIENTS[5] };
  } else if (lowerClubName.includes("music") || lowerCategory === "music") {
    result = { Icon: Music, gradient: GRADIENTS[6] };
  } else {
    const idHash = hashCode(eventId?.toString() || Math.random().toString());
    const nameHash = hashCode(
      clubName || category || eventId?.toString() || Math.random().toString()
    );
    const iconIndex = idHash % ICONS.length;
    const gradientIndex = nameHash % GRADIENTS.length;
    result = { Icon: ICONS[iconIndex], gradient: GRADIENTS[gradientIndex] };
  }

  styleCache.set(cacheKey, result);
  return result;
};

const EventCard = React.memo(({ event, clubName, onNavigate }) => {
  const { id, name = "Untitled Event", description = "No description available.", location = "Location TBD", date: eventDate, category } = event || {};
  const { Icon, gradient } = useMemo(() => getEventStyle(id, clubName, category), [id, clubName, category]);
  const { date, time } = useMemo(() => formatEventDateTime(eventDate), [eventDate]);
  const handleCardClick = useCallback(() => {
    if (id && onNavigate) {
      onNavigate(`/events/${id}`);
    }
  }, [onNavigate, id]);

  if (!event) return null;

  const handleKeyPress = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleCardClick();
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="relative overflow-hidden rounded-2xl h-[420px] flex-shrink-0 flex flex-col transition-all duration-300 ease-in-out group w-full sm:w-80 md:w-[350px] border border-white/10 hover:border-white/20 bg-gradient-to-b from-gray-900/60 to-black/70 backdrop-blur-md shadow-lg hover:shadow-xl cursor-pointer"
      role="button"
      aria-label={`View details for event: ${name}`}
      tabIndex={0}
      onKeyDown={handleKeyPress}
    >
      <div className={`absolute inset-0 opacity-5 group-hover:opacity-10 bg-gradient-to-br ${gradient} transition-opacity duration-500 blur-2xl`} aria-hidden="true" />
      <div className={`absolute -right-10 -top-10 w-24 h-24 rounded-full bg-gradient-to-br ${gradient} opacity-10 blur-xl group-hover:opacity-15 group-hover:scale-110 transition-all duration-500`} aria-hidden="true" />
      <div className="p-6 relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start mb-4">
          <div className={`text-3xl p-3 rounded-xl bg-gradient-to-br ${gradient} text-white shadow-md shadow-black/30 transition-transform duration-300 group-hover:scale-105`}>
            <Icon className="w-6 h-6" />
          </div>
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${gradient} bg-opacity-80 text-white/95 shadow-sm`}>
            {clubName || "General"}
          </span>
        </div>
        <h3 className="text-xl font-semibold text-white mb-3 line-clamp-2 leading-snug group-hover:text-purple-300 transition-colors duration-200">
          {name}
        </h3>
        <div className="space-y-2 mb-4 text-sm text-gray-300/90">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2 flex-shrink-0 text-purple-300/80" />
            <span>{date}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2 flex-shrink-0 text-purple-300/80" />
            <span>{time}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2 flex-shrink-0 text-purple-300/80" />
            <span className="line-clamp-1">{location}</span>
          </div>
        </div>
        <div className="relative flex-grow mb-3 min-h-[60px]">
          <p className="text-gray-400 text-sm line-clamp-3">{description}</p>
          <div className="absolute bottom-0 left-0 right-0 h-5 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" aria-hidden="true" />
        </div>
        <div className="mt-auto pt-2">
          {category ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-900/40 text-purple-300 border border-purple-500/30 group-hover:bg-purple-900/60 transition-colors duration-200">
              <Tag className="w-3 h-3" />
              {category}
            </span>
          ) : (
            <div className="h-6" />
          )}
        </div>
      </div>
    </div>
  );
});

EventCard.displayName = "EventCard";

const EventsSection = () => {
  const [activeClub, setActiveClub] = useState("ALL");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);
  const transitionTimerRef = useRef(null);

  const {
    clubs: fetchedClubData = [],
    loading: clubsLoading,
    error: clubsError,
  } = useSelector((state) => state.clubs || {});

  const {
    events: fetchedEventsData = [],
    loading: eventsLoading,
    error: eventsError,
  } = useSelector((state) => state.events || {});

  const clubNamesForFilter = useMemo(() => {
    if (!fetchedClubData?.length) return ["ALL"];
    const names = fetchedClubData.map((club) => club.name).filter(Boolean);
    const uniqueNames = [...new Set(names)];
    return ["ALL", ...uniqueNames.sort((a, b) => a.localeCompare(b))];
  }, [fetchedClubData]);

  const filteredEventsByClub = useMemo(() => {
    if (isTransitioning || !fetchedEventsData || fetchedEventsData.length === 0)
      return [];
    const sortedEvents = [...fetchedEventsData].sort((a, b) => new Date(b.date) - new Date(a.date));
    if (activeClub === "ALL") {
      return sortedEvents;
    }
    const selectedClub = fetchedClubData?.find((club) => club.name === activeClub);
    if (!selectedClub) return [];
    return sortedEvents.filter((event) => event.club_id === selectedClub.id);
  }, [fetchedEventsData, activeClub, fetchedClubData, isTransitioning]);

  useEffect(() => {
    if (!fetchedClubData || fetchedClubData.length === 0) {
      dispatch(fetchClubs());
    }
    if (!fetchedEventsData || fetchedEventsData.length === 0) {
      dispatch(fetchEvents());
    }
  }, [dispatch, fetchedClubData, fetchedEventsData]);

  useEffect(() => {
    if (fetchedEventsData && fetchedEventsData.length > 0) {
      let clubIdToFetch = null;
      if (activeClub !== "ALL") {
        const selectedClub = fetchedClubData?.find((club) => club.name === activeClub);
        clubIdToFetch = selectedClub?.id;
      }
      dispatch(fetchEvents(clubIdToFetch));
    }
  }, [dispatch, activeClub, fetchedClubData]);

  useEffect(() => {
    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current);
    }
    if (!eventsLoading && isTransitioning) {
      transitionTimerRef.current = setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }
    return () => {
      if (transitionTimerRef.current) {
        clearTimeout(transitionTimerRef.current);
      }
    };
  }, [eventsLoading, isTransitioning]);

  const handleFilterClick = useCallback(
    (clubName) => {
      if (activeClub !== clubName) {
        setIsTransitioning(true);
        setActiveClub(clubName);
      }
    },
    [activeClub]
  );

  const scrollLeft = useCallback(() => {
    scrollContainerRef.current?.scrollBy({
      left: -SCROLL_AMOUNT,
      behavior: "smooth",
    });
  }, []);

  const scrollRight = useCallback(() => {
    scrollContainerRef.current?.scrollBy({
      left: SCROLL_AMOUNT,
      behavior: "smooth",
    });
  }, []);

  const handleNavigate = useCallback(
    (path) => {
      navigate(path);
    },
    [navigate]
  );

  const renderStatus = () => {
    if (eventsLoading && !isTransitioning && filteredEventsByClub.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center text-gray-400 py-20 space-y-3">
          <Loader2 className="w-10 h-10 animate-spin text-purple-400" />
          <span>Loading Events...</span>
        </div>
      );
    }
    if (eventsError && !eventsLoading && !isTransitioning) {
      const errorMessage =
        typeof eventsError === "string"
          ? eventsError
          : eventsError?.message || "An unknown error occurred";
      return (
        <div className="flex flex-col items-center justify-center text-red-400 py-20 space-y-3 text-center px-4">
          <AlertTriangle className="w-12 h-12" />
          <span className="font-semibold">Failed to load events</span>
          <span className="text-sm text-red-400/80 max-w-md">
            Error: {errorMessage}. Please try again later.
          </span>
        </div>
      );
    }
    if (!eventsLoading && !eventsError && !isTransitioning && filteredEventsByClub.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500 text-center px-4">
          <Calendar className="w-16 h-16 mb-4 text-gray-600/50" />
          <p className="text-xl font-medium mb-2">No Events Found</p>
          <p className="text-gray-400 max-w-md">
            {activeClub === "ALL"
              ? "There are no upcoming events scheduled right now."
              : `It looks like the "${activeClub}" club doesn't have any scheduled events.`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <section className="py-16 md:py-24 relative overflow-hidden text-white">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 relative inline-block tracking-tight">
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-pink-300 bg-clip-text text-transparent">
              Upcoming Events
            </span>
            <span className="absolute -bottom-2 left-1/4 right-1/4 h-1 bg-gradient-to-r from-violet-500 to-pink-500 rounded-full" />
          </h2>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto mt-4">
            Discover exciting activities and gatherings happening across campus.
          </p>
        </div>
        <div className="mb-10 md:mb-12 sticky top-16 sm:top-0 z-30 py-3 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 backdrop-blur-lg bg-black/40 border-b border-white/10">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 min-h-[44px] items-center max-w-screen-lg mx-auto">
            {clubsLoading && (
              <div className="flex items-center justify-center text-gray-400 text-sm">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                <span>Loading Filters...</span>
              </div>
            )}
            {clubsError && !clubsLoading && (
              <div className="flex items-center justify-center text-red-400 text-sm">
                <AlertTriangle className="w-4 h-4 mr-2" />
                <span>Error loading filters</span>
              </div>
            )}
            {!clubsLoading &&
              !clubsError &&
              fetchedClubData &&
              clubNamesForFilter.length > 1 &&
              clubNamesForFilter.map((clubName) => (
                <button
                  key={clubName}
                  onClick={() => handleFilterClick(clubName)}
                  disabled={isTransitioning}
                  className={`px-4 py-1.5 sm:px-5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ease-in-out whitespace-nowrap border disabled:opacity-50 disabled:cursor-not-allowed
                    ${
                      activeClub === clubName
                        ? "bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 text-white shadow-md border-transparent"
                        : "bg-black/30 text-purple-200/90 border-white/10 hover:bg-black/50 hover:text-white hover:border-white/20"
                    }`}
                  aria-pressed={activeClub === clubName}
                >
                  {clubName}
                </button>
              ))}
          </div>
        </div>
        <div className="relative min-h-[450px]">
          {isTransitioning && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-20 rounded-lg">
              <Loader2 className="w-10 h-10 animate-spin text-purple-400" />
              <span className="mt-3 text-gray-400">Loading Events...</span>
            </div>
          )}
          {!isTransitioning && renderStatus()}
          {!isTransitioning &&
            !eventsLoading &&
            !eventsError &&
            filteredEventsByClub.length > 0 && (
              <div className="relative group/carousel">
                <button
                  onClick={scrollLeft}
                  disabled={isTransitioning}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/80 backdrop-blur-sm p-2.5 rounded-full text-white transition-all duration-300 shadow-lg -ml-3 sm:-ml-4 opacity-0 group-hover/carousel:opacity-100 focus:opacity-100 disabled:opacity-0"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                <div
                  ref={scrollContainerRef}
                  className="flex overflow-x-auto gap-4 sm:gap-6 pb-6 pt-2 snap-x snap-mandatory hide-scrollbar px-1"
                >
                  {filteredEventsByClub.map((event) => {
                    const club = fetchedClubData?.find((c) => c.id === event.club_id);
                    const clubName = club?.name;
                    return (
                      <div key={event.id} className="snap-center flex-shrink-0">
                        <EventCard event={event} clubName={clubName} onNavigate={handleNavigate} />
                      </div>
                    );
                  })}
                </div>
                <button
                  onClick={scrollRight}
                  disabled={isTransitioning}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/80 backdrop-blur-sm p-2.5 rounded-full text-white transition-all duration-300 shadow-lg -mr-3 sm:-mr-4 opacity-0 group-hover/carousel:opacity-100 focus:opacity-100 disabled:opacity-0"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
            )}
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
