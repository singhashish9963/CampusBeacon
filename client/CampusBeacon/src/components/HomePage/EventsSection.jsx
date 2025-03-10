
import React, { useState, useMemo } from "react";
import { HiDesktopComputer } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, MapPin, Users } from "lucide-react";

// IMPORTANT: To prevent extra scroll bars, add the following to your global CSS file:
// 
// html, body {
//   overflow-x: hidden;
// }

const EventsSection = () => {
  const [activeClub, setActiveClub] = useState("ALL");
  const [hoveredEvent, setHoveredEvent] = useState(null);

  const events = [
    {
      title: "Weekend Of Code",
      date: "Jan-29th -- Feb-10th",
      time: "10:00 AM - 6:00 PM",
      location: "Computer Center",
      description: "Exclusive events for First Year and Second Year",
      club: "Coding Club",
      icon: HiDesktopComputer,
      gradient: "from-cyan-500 via-blue-500 to-purple-500",
      participants: "200+",
    },
    {
      title: "Robo Wars",
      date: "March 20",
      time: "2:00 PM - 8:00 PM",
      location: "Main Ground",
      description: "Robot battle competition",
      club: "Robotics Club",
      icon: () => <>🤖</>,
      gradient: "from-green-500 via-emerald-500 to-teal-500",
      participants: "50+",
    },
    {
      title: "Culrav and Avishkar",
      date: "November",
      time: "6:00 PM - 10:00 PM",
      location: "MP Hall",
      description:
        "A night of music, dance and theatrical performances along with great innovation with tech",
      club: "Everyone",
      icon: () => <>🎭</>,
      gradient: "from-pink-500 via-rose-500 to-red-500",
      participants: "1000+",
    },
    {
      title: "Cricket Tournament",
      date: "April 10-15",
      time: "9:00 AM - 5:00 PM",
      location: "Sports Ground",
      description: "Inter-college cricket matches",
      club: "Sports Club",
      icon: () => <>🏏</>,
      gradient: "from-amber-500 via-orange-500 to-red-500",
      participants: "150+",
    },
  ];

  const clubs = [
    "ALL",
    "Coding Club",
    "Robotics Club",
    "Cultural Club",
    "Sports Club",
  ];

  const filteredEvents = useMemo(
    () =>
      activeClub === "ALL"
        ? events
        : events.filter((event) => event.club === activeClub),
    [activeClub]
  );

  return (
    <section className="py-20 relative overflow-hidden overflow-x-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -left-20 top-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute right-0 bottom-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent mb-6">
            Upcoming Events
          </h2>
          <p className="text-gray-400 text-lg font-mono">
            Join us for exciting events and activities
          </p>
        </motion.div>

        {/* Club Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {clubs.map((club) => (
            <motion.button
              key={club}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveClub(club)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all
                ${
                  activeClub === club
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25"
                    : "bg-purple-900/20 text-purple-300 hover:bg-purple-900/40 backdrop-blur-sm"
                }
              `}
            >
              {club}
            </motion.button>
          ))}
        </div>

        {/* Events Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <AnimatePresence>
            {filteredEvents.map((event, index) => (
              <motion.div
                key={event.title}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.1 }}
                onHoverStart={() => setHoveredEvent(event.title)}
                onHoverEnd={() => setHoveredEvent(null)}
                className={`
                  relative overflow-hidden rounded-2xl
                  bg-gradient-to-b from-gray-900/90 to-black/90
                  backdrop-blur-xl border border-white/10
                  hover:border-white/20 transition-all duration-300
                  group
                `}
              >
                {/* Gradient background */}
                <div
                  className={`
                    absolute inset-0 opacity-0 group-hover:opacity-10
                    bg-gradient-to-br ${event.gradient}
                    transition-opacity duration-300
                  `}
                />

                <div className="p-6 relative z-10">
                  {/* Icon */}
                  <motion.div
                    className={`
                      text-3xl md:text-4xl mb-4 p-3 rounded-xl
                      inline-block bg-gradient-to-br ${event.gradient}
                      group-hover:scale-110 transition-transform duration-300
                    `}
                  >
                    {<event.icon />}
                  </motion.div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-purple-300">
                    {event.title}
                  </h3>

                  {/* Event details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-400 text-sm">
                      <Calendar className="w-4 h-4 mr-2" />
                      {event.date}
                    </div>
                    <div className="flex items-center text-gray-400 text-sm">
                      <Clock className="w-4 h-4 mr-2" />
                      {event.time}
                    </div>
                    <div className="flex items-center text-gray-400 text-sm">
                      <MapPin className="w-4 h-4 mr-2" />
                      {event.location}
                    </div>
                    <div className="flex items-center text-gray-400 text-sm">
                      <Users className="w-4 h-4 mr-2" />
                      {event.participants} Participants
                    </div>
                  </div>

                  <p className="text-gray-400 text-sm mb-4">
                    {event.description}
                  </p>

                  {/* Club tag */}
                  <span
                    className={`
                      inline-block px-4 py-1.5 rounded-full text-xs font-medium
                      bg-gradient-to-r ${event.gradient} opacity-80
                      group-hover:opacity-100 transition-opacity
                    `}
                  >
                    {event.club}
                  </span>

                  {/* Hover effect button */}
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: hoveredEvent === event.title ? 1 : 0,
                      y: hoveredEvent === event.title ? 0 : 20,
                    }}
                    className={`
                      absolute bottom-6 right-6
                      px-4 py-2 rounded-lg
                      bg-gradient-to-r ${event.gradient}
                      text-white text-sm font-medium
                      opacity-0 group-hover:opacity-100
                      transition-all duration-300
                    `}
                  >
                    Learn More →
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default EventsSection;
