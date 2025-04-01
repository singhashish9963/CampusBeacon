import React, { useState, useMemo } from "react";
import { HiDesktopComputer } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, MapPin, Users, ArrowRight } from "lucide-react";

const EventsSection = () => {
  const [activeClub, setActiveClub] = useState("ALL");

  const events = useMemo(
    () => [
      {
        id: "woc",
        title: "Weekend Of Code",
        date: "Jan-29th -- Feb-10th",
        time: "10:00 AM - 6:00 PM",
        location: "Computer Center",
        description:
          "Exclusive events for First Year and Second Year students focusing on collaborative coding challenges and learning.",
        club: "Coding Club",
        icon: HiDesktopComputer,
        gradient: "from-cyan-500 via-blue-500 to-purple-500",
        participants: "200+",
      },
      {
        id: "robo",
        title: "Robo Wars",
        date: "March 20",
        time: "2:00 PM - 8:00 PM",
        location: "Main Ground",
        description:
          "Build, battle, conquer! Witness epic robot battles in this thrilling competition.",
        club: "Robotics Club",
        icon: () => <span className="text-3xl md:text-4xl">🤖</span>,
        gradient: "from-green-500 via-emerald-500 to-teal-500",
        participants: "50+",
      },
      {
        id: "culrav",
        title: "Culrav & Avishkar",
        date: "November",
        time: "Full Days",
        location: "Various Venues",
        description:
          "The annual techno-cultural fest! A vibrant blend of music, dance, drama, tech innovations, and guest performances.",
        club: "Everyone",
        icon: () => <span className="text-3xl md:text-4xl">🎭</span>,
        gradient: "from-pink-500 via-rose-500 to-red-500",
        participants: "1000+",
      },
      {
        id: "cricket",
        title: "Cricket Tournament",
        date: "April 10-15",
        time: "9:00 AM - 5:00 PM",
        location: "Sports Ground",
        description:
          "Cheer for your favorite teams in the inter-college T20 cricket championship.",
        club: "Sports Club",
        icon: () => <span className="text-3xl md:text-4xl">🏏</span>,
        gradient: "from-amber-500 via-orange-500 to-red-500",
        participants: "150+",
      },
    ],
    []
  );

  const clubs = useMemo(
    () => ["ALL", "Coding Club", "Robotics Club", "Everyone", "Sports Club"],
    []
  );

  const filteredEvents = useMemo(
    () =>
      activeClub === "ALL"
        ? events
        : events.filter((event) => event.club === activeClub),
    [activeClub, events]
  );

  return (

    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden -z-10">
        <motion.div
          className="absolute -left-20 top-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            repeatType: "mirror",
          }}
        />
        <motion.div
          className="absolute right-0 bottom-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.3, 0.1] }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            repeatType: "mirror",
          }}
        />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent mb-6">
            Upcoming Events
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto py-2">
            Stay updated with the latest happenings and activities around the campus.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-12">
          {clubs.map((club) => (
            <motion.button
              key={club}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveClub(club)}
              className={`px-5 py-2 sm:px-6 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ease-out
                ${
                  activeClub === club
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30"
                    : "bg-gray-800/60 backdrop-blur-sm text-purple-300 hover:bg-gray-700/80 border border-white/10 hover:border-white/20"
                }
              `}
            >
              {club}
            </motion.button>
          ))}
        </div>

        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <AnimatePresence>
            {filteredEvents.map((event, index) => (
              <motion.div
                key={event.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="relative overflow-hidden rounded-2xl min-h-[450px] flex flex-col bg-gradient-to-b from-gray-900/80 to-black/80 backdrop-blur-lg border border-white/10 hover:border-white/20 transition-all duration-300 group"
              >
                <div
                  className={`absolute inset-0 opacity-0 group-hover:opacity-[0.07] bg-gradient-to-br ${event.gradient} transition-opacity duration-400`}
                />
                <div className="p-6 relative z-10 flex flex-col flex-grow">
                  <div
                    className={`text-3xl md:text-4xl mb-4 p-3 rounded-xl self-start inline-block bg-gradient-to-br ${event.gradient} text-white transition-transform duration-300 group-hover:scale-105`}
                  >
                    {<event.icon />}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-purple-300 transition-colors duration-300">
                    {event.title}
                  </h3>
                  <div className="space-y-1.5 mb-4 text-sm">
                    <div className="flex items-center text-gray-400">
                      <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center text-gray-400">
                      <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center text-gray-400">
                      <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center text-gray-400">
                      <Users className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>{event.participants} Participants</span>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-grow">
                    {event.description}
                  </p>
                  <div className="mt-auto pt-4 flex flex-col">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${event.gradient} bg-opacity-20 text-white/90 mb-4`}
                    >
                      {event.club}
                    </span>
                    <motion.button
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.03 }}
                      className="flex items-center justify-center w-full px-4 py-2 rounded-lg bg-white/5 group-hover:bg-white/10 text-purple-300 group-hover:text-white text-sm font-medium border border-white/10 group-hover:border-white/20 opacity-60 group-hover:opacity-100 transition-all duration-300"
                    >
                      Learn More
                      <ArrowRight className="w-4 h-4 ml-1.5" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>

)}
export default EventsSection;
