import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Rocket,
  Heart,
  Users,
  School,
  Code,
  Star, // Can keep for user focus if applicable
  Github,
  Linkedin,
  Mail,
  Target,
  Shield,
  Award, // Keep for DevJam
  Coffee,
  Sparkles,
  Trophy, // Good for DevJam
  Zap,
  Lightbulb, // Added for Innovation
  MessageSquare, // Added for Communication Focus
} from "lucide-react";

// Placeholder Image (Replace with actual import if needed, or keep using src path)
// import jadaunImg from 'src/assets/images/jadaun.jpeg';
// import agarwalImg from 'src/assets/images/agarwal.jpeg';

const AboutUs = () => {
  const [hoveringAchievement, setHoveringAchievement] = useState(null);

  // --- TEAM MEMBERS ---
  // TODO: Replace placeholder links with your actual URLs!
  const teamMembers = useMemo(
    () => [
      {
        name: "Ayush Jadaun",
        role: "Co-Founder & Full Stack Developer",
        image: "src/assets/images/jadaun.jpeg", // Assuming this path is correct relative to public folder or handled by build tool
        bio: "Computer Science student at MNNIT Allahabad, passionate about building efficient backend systems and scalable web applications. Driving the technical architecture of CampusBeacon.",
        skills: ["Node.js", "React", "PostgreSQL", "Prisma", "Docker", "AWS"],
        social: {
          github: "https://github.com/ayush-jadaun", // Actual link
          linkedin: "https://www.linkedin.com/in/ayush-jadaun-677199311/", // Actual link
          email: "mailto:ayushjadaun6@gmail.com", // Actual link
        },
      },
      {
        name: "Ayush Agarwal",
        role: "Co-Founder & Full Stack Developer",
        image: "src/assets/images/agarwal.jpeg", // Assuming this path is correct
        bio: "Computer Science student at MNNIT Allahabad, focusing on creating intuitive user interfaces and seamless user experiences. Bringing the CampusBeacon vision to life visually.",
        skills: [
          "React",
          "TailwindCSS",
          "Framer Motion",
          "JavaScript",
          "UI/UX Principles",
        ],
        social: {
          github: "https://github.com/ayushagr101", // Actual link
          linkedin: "https://www.linkedin.com/in/ayush-agarwal-108127311/", // Actual link
          email: "mailto:ayush.agr160@gmail.com", // Actual link
        },
      },
    ],
    []
  );

  // --- CORE VALUES ---
  const values = useMemo(
    () => [
      {
        icon: <Lightbulb className="w-10 h-10 text-yellow-400" />, // Changed icon
        title: "Innovation",
        description:
          "Constantly exploring new ways technology can improve and simplify student life on campus.",
      },
      {
        icon: <Heart className="w-10 h-10 text-pink-400" />,
        title: "Community Focus",
        description:
          "Building a platform that connects students, fosters collaboration, and strengthens the campus spirit.",
      },
      {
        icon: <Users className="w-10 h-10 text-green-400" />,
        title: "Collaboration",
        description:
          "Working closely with students and campus groups to build features that truly matter.",
      },
      {
        icon: <Shield className="w-10 h-10 text-blue-400" />, // Changed icon
        title: "Reliability",
        description:
          "Striving to create a robust, secure, and dependable platform for the MNNIT community.",
      },
    ],
    []
  );

  // --- ACHIEVEMENTS --- (Updated)
  const achievements = [
    {
      icon: <Trophy className="w-8 h-8 text-amber-400" />,
      title: "DevJam 2nd Runner Up",
      description:
        "Recognized for CampusBeacon's potential and technical implementation in the MNNIT Hackathon.",
    },
    // Add other relevant recognitions if any (e.g., presentation, beta feedback)
    // {
    //   icon: <Star className="w-8 h-8 text-yellow-400" />,
    //   title: "Positive Beta Feedback",
    //   description: "Received encouraging feedback during initial testing phases.",
    // },
  ];

  // --- STATS --- (Simplified & Relevant)
  const stats = [
    // { value: "100+", label: "Beta Testers" }, // Example if applicable
    { value: "15+", label: "Core Features" },
    { value: "2", label: "Passionate Developers" },
    { value: "1", label: "Shared Vision" }, // More thematic
    // Consider adding Lines of Code if you like, but it's often debated metric
    // { value: "20k+", label: "Lines of Code" },
  ];

  // --- FEATURES/FOCUS --- (Slightly rephrased)
  const features = [
    {
      icon: <Target className="w-8 h-8 text-blue-400" />,
      title: "Student Needs", // Focus area
    },
    {
      icon: <MessageSquare className="w-8 h-8 text-green-400" />, // Changed icon
      title: "Connectivity", // Focus area
    },
    {
      icon: <Code className="w-8 h-8 text-purple-400" />,
      title: "Modern Tech", // How it's built
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-400" />, // Changed icon
      title: "Performance", // Quality attribute
    },
  ];

  // Framer Motion Variants
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-950 text-gray-200 relative overflow-hidden">
      {/* Animated Background (Subtler) */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black to-black/90" />
        {[...Array(15)].map(
          (
            _,
            i // Reduced number of particles
          ) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-blue-500/20" // Subtler color
              style={{
                width: `${Math.random() * 2 + 1}px`, // Smaller size
                height: `${Math.random() * 2 + 1}px`,
              }}
              initial={{
                x:
                  Math.random() *
                  (typeof window !== "undefined" ? window.innerWidth : 1000), // Window check for SSR
                y:
                  Math.random() *
                  (typeof window !== "undefined" ? window.innerHeight : 1000),
              }}
              animate={{
                x: `+=${Math.random() * 40 - 20}px`, // Slower, gentler movement
                y: `+=${Math.random() * 40 - 20}px`,
                opacity: [0, 0.5, 0], // Fade in/out
              }}
              transition={{
                duration: Math.random() * 10 + 10, // Slower duration
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
              }}
            />
          )
        )}
      </div>

      {/* Enhanced Hero Section */}
      <motion.div
        initial="initial"
        animate="animate"
        variants={fadeInUp}
        className="relative z-10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 sm:py-32 text-center">
          {" "}
          {/* Adjusted padding */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
            className="relative mb-6 inline-block" // Center icon better
          >
            <Sparkles className="w-16 h-16 sm:w-20 sm:h-20 text-blue-400" />
            {/* Removed rotating border for cleaner look */}
          </motion.div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-4 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400">
              About CampusBeacon
            </span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-blue-200/90 max-w-3xl mx-auto font-light">
            {" "}
            {/* Lighter font weight */}
            Connecting MNNIT Allahabad: Built by students, for students.
          </p>
        </div>
      </motion.div>

      {/* Achievements Section (Simplified if only one) */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 mb-20">
        {" "}
        {/* Adjusted max-width */}
        {achievements.length > 0 && (
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.3 }}
            // Adjusted grid: center single item, handle more later
            className={`grid grid-cols-1 ${
              achievements.length > 1
                ? "md:grid-cols-2"
                : "md:max-w-md md:mx-auto"
            } gap-6`}
          >
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{
                  y: -5,
                  scale: 1.03,
                  boxShadow: "0 10px 20px rgba(79, 70, 229, 0.2)",
                }} // Subtle indigo shadow
                onHoverStart={() => setHoveringAchievement(index)}
                onHoverEnd={() => setHoveringAchievement(null)}
                className="bg-gray-900/40 backdrop-blur-lg rounded-xl p-6 border border-blue-800/40 transition-all duration-200 cursor-default"
              >
                <motion.div
                  className="text-amber-400 mb-3 inline-block p-2 bg-gray-800/50 rounded-full" // Icon background
                  // Optional: Simple scale on hover
                  // animate={{ scale: hoveringAchievement === index ? 1.1 : 1 }}
                >
                  {achievement.icon}
                </motion.div>
                <h3 className="text-lg font-semibold text-white mb-1">
                  {achievement.title}
                </h3>
                <p className="text-sm text-blue-200/80">
                  {achievement.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Stats Section (Adjusted grid) */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        {stats.length > 0 && (
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.3 }}
            // Adjusted grid columns based on number of stats
            className={`grid grid-cols-2 ${
              stats.length >= 4 ? "md:grid-cols-4" : "md:grid-cols-3"
            } gap-6 bg-gray-900/40 backdrop-blur-lg rounded-xl p-6 sm:p-8 border border-blue-800/40`}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="text-center"
              >
                <motion.div
                  whileHover={{ scale: 1.05, color: "#60a5fa" }} // Hover effect for value
                  className="text-3xl md:text-4xl font-bold text-blue-400 mb-1 transition-colors"
                >
                  {stat.value}
                </motion.div>
                <div className="text-blue-200/80 text-xs sm:text-sm">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Mission Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <motion.div
          initial="initial"
          whileInView="animate"
          variants={fadeInUp}
          viewport={{ once: true, amount: 0.2 }}
          className="mb-20 sm:mb-24" // Adjusted margin
        >
          <div className="bg-gradient-to-br from-gray-900/50 to-blue-950/40 backdrop-blur-xl rounded-2xl p-8 sm:p-12 border border-blue-800/40 shadow-xl">
            <div className="flex items-center mb-6">
              <Target className="w-8 h-8 sm:w-10 sm:h-10 text-blue-400 mr-3 sm:mr-4 flex-shrink-0" />
              <h2 className="text-3xl sm:text-4xl font-bold text-white">
                Our Mission
              </h2>
            </div>
            <p className="text-blue-100/90 text-base sm:text-lg leading-relaxed mb-8">
              CampusBeacon aims to simplify and enrich the MNNIT student
              experience. We're building a unified platform to access
              information, connect with peers, discover opportunities, and
              navigate campus life more effectively – all developed with direct
              student input.
            </p>

            {/* Feature Highlights */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  whileHover={{
                    y: -3,
                    backgroundColor: "rgba(30, 41, 59, 0.5)",
                  }} // Use slate-800 color with alpha
                  className="flex flex-col items-center text-center p-4 bg-gray-800/30 rounded-lg border border-blue-800/30 transition-colors duration-200"
                >
                  <div
                    className="p-2 mb-2 rounded-full bg-gray-700/40" // Icon background
                  >
                    {feature.icon}
                  </div>
                  <div className="text-blue-100 text-sm font-medium">
                    {feature.title}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Values Section */}
        <div className="mb-20 sm:mb-24">
          <motion.h2
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.5 }}
            className="text-3xl sm:text-4xl font-bold text-center mb-12 sm:mb-16"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
              Our Core Values
            </span>
          </motion.h2>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
          >
            {values.map((value, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{
                  y: -5,
                  scale: 1.03,
                  boxShadow: "0 10px 20px rgba(0, 0, 0, 0.3)",
                }}
                className="bg-gray-900/40 backdrop-blur-lg rounded-xl p-6 sm:p-8 border border-blue-800/40 text-center sm:text-left" // Centered text on small screens
              >
                <div className="flex justify-center sm:justify-start mb-4">
                  <div className="p-3 rounded-full bg-gray-800/50 inline-block">
                    {" "}
                    {/* Icon background */}
                    {value.icon}
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-white mb-3">
                  {value.title}
                </h3>
                <p className="text-blue-100/80 text-sm sm:text-base">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Team Section */}
        <div>
          <motion.h2
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.5 }}
            className="text-3xl sm:text-4xl font-bold text-center mb-12 sm:mb-16"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
              Meet The Developers
            </span>
          </motion.h2>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12"
          >
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-gray-900/60 to-blue-950/50 backdrop-blur-xl rounded-xl p-6 sm:p-8 border border-blue-800/40 overflow-hidden" // Added overflow-hidden
              >
                <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-5 sm:space-y-0 sm:space-x-6">
                  {/* Image with subtle glow */}
                  <motion.div
                    className="relative group flex-shrink-0"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-50 group-hover:opacity-75 blur-md transition duration-300" />
                    <img
                      src={member.image} // Use the variable if imported, otherwise keep string path
                      alt={member.name}
                      className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-2 border-blue-700/50 shadow-lg" // Added border
                    />
                  </motion.div>
                  {/* Details */}
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">
                      {member.name}
                    </h3>
                    <p className="text-blue-400 text-sm mb-3">{member.role}</p>
                    <p className="text-blue-100/90 text-sm mb-4 leading-relaxed">
                      {member.bio}
                    </p>
                    {/* Skills */}
                    <div className="flex flex-wrap gap-1.5 mb-5 justify-center sm:justify-start">
                      {member.skills.map((skill, idx) => (
                        <motion.span
                          key={idx}
                          whileHover={{
                            y: -2,
                            backgroundColor: "rgba(59, 130, 246, 0.3)",
                          }} // blue-500 with alpha
                          className="px-2.5 py-0.5 text-xs bg-blue-900/40 text-blue-300 rounded-full border border-blue-700/30 cursor-default transition-colors"
                        >
                          {skill}
                        </motion.span>
                      ))}
                    </div>
                    {/* Social Links */}
                    <div className="flex justify-center sm:justify-start space-x-4">
                      <motion.a
                        href={member.social.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${member.name}'s Github Profile`}
                        whileHover={{ scale: 1.15, y: -2, color: "#ffffff" }}
                        className="text-blue-300 hover:text-white transition-colors"
                      >
                        <Github size={18} />
                      </motion.a>
                      <motion.a
                        href={member.social.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${member.name}'s LinkedIn Profile`}
                        whileHover={{ scale: 1.15, y: -2, color: "#ffffff" }}
                        className="text-blue-300 hover:text-white transition-colors"
                      >
                        <Linkedin size={18} />
                      </motion.a>
                      <motion.a
                        href={member.social.email}
                        aria-label={`Email ${member.name}`}
                        whileHover={{ scale: 1.15, y: -2, color: "#ffffff" }}
                        className="text-blue-300 hover:text-white transition-colors"
                      >
                        <Mail size={18} />
                      </motion.a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Call to Action */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.5 }}
          className="mt-24 sm:mt-32 text-center pb-20" // Added padding bottom
        >
          <motion.a
            href="/" // Link to the main app page or relevant section
            whileHover={{
              scale: 1.03,
              y: -2,
              boxShadow: "0 10px 25px rgba(79, 70, 229, 0.3)",
            }}
            whileTap={{ scale: 0.97 }}
            className="inline-block px-8 py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-full text-white font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <span className="flex items-center space-x-2">
              <Rocket size={20} />
              <span>Explore CampusBeacon</span>
            </span>
          </motion.a>
          <p className="mt-4 text-sm text-blue-200/80">
            Discover how we're simplifying campus life.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutUs;
