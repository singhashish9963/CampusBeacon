import React,{ useState, useMemo } from "react";
import { HiDesktopComputer } from "react-icons/hi";
import { motion } from "framer-motion";

const EventsSection = () => {
  const [activeClub, setActiveClub] = useState("ALL");

  const events = [
    {
      title: "Weekend Of Code",
      date: "Jan-29th -- Feb-10th",
      description: "Exclusive events for First Year and Second Year",
      club: "Coding Club",
      icon: HiDesktopComputer,
    },
    {
      title: "Robo Wars",
      date: "March 20",
      description: "Robot battle competition",
      club: "Robotics Club",
      icon: () => <>🤖</>, // Emoji as a component
    },
    {
      title: "Culrav and Avishkar",
      date: "November",
      description:
        "A night of music, dance and theatrical performances along with great innovation with tech",
      club: "Everyone",
      icon: () => <>🎭</>, // Emoji as a component
    },
    {
      title: "Cricket Tournament",
      date: "April 10-15",
      description: "Inter-college cricket matches",
      club: "Sports Club",
      icon: () => <>🏏</>, // Emoji as a component
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
    [activeClub, events]
  );

  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-bold text-center mb-20 bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent"
        >
          Club Events
        </motion.h2>
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {clubs.map((club) => (
            <motion.button
              key={club}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveClub(club)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeClub === club
                  ? "bg-purple-600 text-white"
                  : "bg-purple-200/10 text-purple-300 hover:bg-purple-200/20"
              }`}
            >
              {club}
            </motion.button>
          ))}
        </div>
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {filteredEvents.map((event, index) => (
            <motion.div
              key={event.title}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border-2 border-purple-500/20 hover:border-purple-500/50"
            >
              <div className="text-2xl md:text-4xl mb-4">{<event.icon />}</div>
              <h3 className="text-xl font-bold text-white mb-2">
                {event.title}
              </h3>
              <p className="text-purple-300 text-sm mb-2">{event.date}</p>
              <p className="text-gray-400 text-sm mb-3">{event.description}</p>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300">
                {event.club}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <motion.div
        className="absolute -left-20 top-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"
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
    </section>
  );
};

export default EventsSection;
