import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiEdit,
  FiTrash2,
  FiCalendar,
  FiMapPin,
  FiPlus,
  FiLoader,
  FiClock,
  FiUsers,
  FiFilter,
  FiSearch,
  FiChevronDown,
  FiTag,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import {
  fetchEvents,
  deleteEvent,
  clearEventError,
} from "../../slices/eventSlice";

// Helper to format date
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (e) {
    console.error("Invalid date format:", dateString);
    return "Invalid Date";
  }
};

// Get time until event
const getTimeUntil = (dateString) => {
  if (!dateString) return null;

  try {
    const eventDate = new Date(dateString);
    const now = new Date();

    if (eventDate < now) return { text: "Past event", isPast: true };

    const diffTime = Math.abs(eventDate - now);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return { text: "Today!", isToday: true };
    if (diffDays === 1) return { text: "Tomorrow", isSoon: true };
    if (diffDays <= 7) return { text: `${diffDays} days away`, isSoon: true };

    return { text: `${diffDays} days away` };
  } catch (e) {
    return null;
  }
};

const EventList = ({ isAdmin, openModal, clubId, handleEventClick }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { events, loading, error } = useSelector((state) => state.events);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all"); // all, upcoming, past
  const [showFilters, setShowFilters] = useState(false);

  // Fetch events when component mounts or clubId changes
  useEffect(() => {
    if (clubId) {
      dispatch(fetchEvents(clubId));
    }

    return () => {
      if (error) {
        dispatch(clearEventError());
      }
    };
  }, [dispatch, clubId, error]);

  // Filter events based on search and filters
  useEffect(() => {
    if (!events) return;

    let result = [...events];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (event) =>
          event.name.toLowerCase().includes(term) ||
          (event.description &&
            event.description.toLowerCase().includes(term)) ||
          (event.location && event.location.toLowerCase().includes(term))
      );
    }

    // Apply type filter
    const now = new Date();
    switch (filterType) {
      case "upcoming":
        result = result.filter((event) => new Date(event.date) >= now);
        break;
      case "past":
        result = result.filter((event) => new Date(event.date) < now);
        break;
      default:
        // "all" - no filtering needed
        break;
    }

    // Sort by date (upcoming first)
    result.sort((a, b) => new Date(a.date) - new Date(b.date));

    setFilteredEvents(result);
  }, [events, searchTerm, filterType]);

  const handleDeleteEvent = (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      dispatch(deleteEvent(id))
        .unwrap()
        .catch((err) => {
          console.error("Failed to delete event:", err);
        });
    }
  };

  const onEventClick =
    handleEventClick ||
    ((eventId) => {
      console.log("Event card clicked, navigating to:", eventId);
      navigate(`/events/${eventId}`);
    });

  // Get upcoming event count
  const upcomingCount =
    events?.filter((event) => new Date(event.date) >= new Date()).length || 0;

  return (
    <section className="space-y-6">
      {/* Header with Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div>
          <h2 className="text-3xl md:text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 flex items-center">
            <FiCalendar className="mr-3 mb-1 inline-block" />
            Club Events
          </h2>
          {!loading && !error && (
            <div className="flex gap-3 mt-2 text-sm text-gray-400">
              <span className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-purple-400 mr-2"></span>
                {events.length} Total
              </span>
              <span className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-green-400 mr-2"></span>
                {upcomingCount} Upcoming
              </span>
            </div>
          )}
        </div>

        {isAdmin && (
          <button
            onClick={() => openModal("event", "create", { club_id: clubId })}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg text-sm transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            disabled={loading}
          >
            <FiPlus className="mr-1" /> Add Event
          </button>
        )}
      </div>

      {/* Search and Filters */}
      {!loading && !error && events.length > 0 && (
        <div className="bg-gray-800/40 rounded-lg p-4 border border-gray-700/60">
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            {/* Search */}
            <div className="relative flex-grow w-full md:w-auto">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-900/50 border border-gray-700 rounded-lg w-full pl-10 pr-4 py-2 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>

            <div className="flex gap-2 items-center w-full md:w-auto">
              {/* Filter Pills */}
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterType("all")}
                  className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                    filterType === "all"
                      ? "bg-purple-500/30 border-purple-500 text-purple-200"
                      : "border-gray-700 text-gray-400 hover:border-purple-500/50"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterType("upcoming")}
                  className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                    filterType === "upcoming"
                      ? "bg-green-500/20 border-green-500 text-green-200"
                      : "border-gray-700 text-gray-400 hover:border-green-500/50"
                  }`}
                >
                  Upcoming
                </button>
                <button
                  onClick={() => setFilterType("past")}
                  className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                    filterType === "past"
                      ? "bg-gray-600/30 border-gray-500 text-gray-300"
                      : "border-gray-700 text-gray-400 hover:border-gray-500/50"
                  }`}
                >
                  Past
                </button>
              </div>

              {/* Advanced Filters Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center text-xs text-gray-400 hover:text-purple-300 transition-colors"
              >
                <FiFilter className="mr-1" />
                <FiChevronDown
                  className={`ml-1 transition-transform duration-300 ${
                    showFilters ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Advanced Filters - Expandable */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-700/50">
                  {/* Additional filters would go here */}
                  <div className="text-xs text-gray-400">
                    More filtering options can be added here based on event
                    properties
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="flex flex-col items-center">
            <FiLoader className="animate-spin text-purple-400 text-4xl mb-3" />
            <span className="text-gray-400">Loading Events...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="text-center py-10 text-red-400 bg-red-900/20 rounded-lg border border-red-700 p-4">
          <p>Error loading events:</p>
          <p className="font-semibold">{error}</p>
          <button
            onClick={() => {
              if (clubId) dispatch(fetchEvents(clubId));
            }}
            className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Success State - Display Events */}
      {!loading && !error && (
        <>
          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredEvents.map((event, index) => {
                const timeUntil = getTimeUntil(event.date);

                return (
                  <motion.div
                    key={event.id}
                    className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700/60 shadow-lg hover:shadow-purple-500/20 hover:border-purple-600/70 transition-all duration-300 group relative cursor-pointer flex flex-col"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08 }}
                    onClick={() => onEventClick(event.id)}
                    layout
                    whileHover={{ y: -5 }}
                  >
                    {/* Status Badge */}
                    {timeUntil && (
                      <div
                        className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium z-10 ${
                          timeUntil.isPast
                            ? "bg-gray-700/80 text-gray-300"
                            : timeUntil.isToday
                            ? "bg-purple-600/90 text-white"
                            : timeUntil.isSoon
                            ? "bg-green-600/80 text-white"
                            : "bg-blue-600/80 text-white"
                        }`}
                      >
                        {timeUntil.text}
                      </div>
                    )}

                    {/* Admin Buttons */}
                    {isAdmin && (
                      <div className="absolute top-3 right-3 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openModal("event", "edit", event);
                          }}
                          className="p-1.5 bg-blue-600/90 hover:bg-blue-500 rounded-full text-white text-xs transform hover:scale-110 transition-transform shadow-lg"
                          aria-label="Edit Event"
                        >
                          <FiEdit size={14} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteEvent(event.id);
                            }}
                            className="p-1.5 bg-red-600/90 hover:bg-red-500 rounded-full text-white text-xs transform hover:scale-110 transition-transform shadow-lg"
                            aria-label="Delete Event"
                          >
                            <FiTrash2 size={14} />
                          </button>
                          </div>
                        )}

                        {/* Event Image with Gradient Overlay */}
                        <div className="h-48 w-full bg-gray-900/50 overflow-hidden relative">
                          <img
                          src={
                            Array.isArray(event.images) && event.images.length > 0
                            ? event.images[0]
                            : `https://source.unsplash.com/400x240/?event,${encodeURIComponent(
                              event.name
                              )}`
                          }
                          alt={`Image for ${event.name}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://picsum.photos/400/240?random=${event.id}`;
                          }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
                        </div>

                        {/* Event Info */}
                    <div className="p-5 flex-grow flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-1.5 truncate group-hover:text-purple-300 transition-colors">
                          {event.name}
                        </h3>
                        <p className="text-sm text-gray-400 mb-4 line-clamp-2 min-h-[2.5rem]">
                          {event.description || "No description available."}
                        </p>
                      </div>

                      {/* Event Meta Info */}
                      <div className="space-y-2">
                        <div className="flex items-center text-xs text-gray-400">
                          <FiCalendar
                            size={12}
                            className="mr-2 text-purple-400 flex-shrink-0"
                          />
                          <span>{formatDate(event.date)}</span>
                        </div>

                        {event.time && (
                          <div className="flex items-center text-xs text-gray-400">
                            <FiClock
                              size={12}
                              className="mr-2 text-purple-400 flex-shrink-0"
                            />
                            <span>{event.time}</span>
                          </div>
                        )}

                        <div className="flex items-center text-xs text-gray-400">
                          <FiMapPin
                            size={12}
                            className="mr-2 text-purple-400 flex-shrink-0"
                          />
                          <span className="truncate">
                            {event.location || "Location TBA"}
                          </span>
                        </div>

                        {event.attendees && (
                          <div className="flex items-center text-xs text-gray-400">
                            <FiUsers
                              size={12}
                              className="mr-2 text-purple-400 flex-shrink-0"
                            />
                            <span>
                              {typeof event.attendees === "number"
                                ? `${event.attendees} attending`
                                : event.attendees}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Tags/Categories */}
                      {event.tags && event.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-gray-700/50">
                          {event.tags.map((tag, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 bg-purple-900/30 text-purple-300 text-xs rounded-full flex items-center"
                            >
                              <FiTag size={8} className="mr-1" />
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Hover effect - Gradient Border */}
                    <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-purple-500/30 pointer-events-none transition-all duration-300"></div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center bg-gray-800/30 border border-gray-700/50 rounded-lg p-8 flex flex-col items-center"
            >
              {searchTerm || filterType !== "all" ? (
                <>
                  <FiFilter className="text-gray-500 text-4xl mb-3" />
                  <p className="text-gray-400">
                    No events match your current filters.
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setFilterType("all");
                    }}
                    className="mt-4 text-sm text-purple-400 hover:text-purple-300"
                  >
                    Clear all filters
                  </button>
                </>
              ) : (
                <>
                  <FiCalendar className="text-gray-500 text-4xl mb-3" />
                  <p className="text-gray-500 italic">
                    No events listed for this club yet.
                    {isAdmin && " Add one using the button above!"}
                  </p>
                </>
              )}
            </motion.div>
          )}
        </>
      )}
    </section>
  );
};

export default EventList;
