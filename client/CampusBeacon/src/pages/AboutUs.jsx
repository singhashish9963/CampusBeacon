import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Rocket,
  Heart,
  Users,
  School,
  Code,
  Star,
  Github,
  Linkedin,
  Mail,
  Target,
  Shield,
  Award,
  Coffee,
  Sparkles,
  Trophy,
  Zap,
} from "lucide-react";

const AboutUs = () => {
  const [hoveringAchievement, setHoveringAchievement] = useState(null);

  const teamMembers = useMemo(
    () => [
      {
        name: "Ayush Jaudan",
        role: "Co-Founder & Lead Developer",
        image: "src/assets/images/jadaun.jpeg",
        bio: "Full-stack developer passionate about creating innovative solutions that push the boundaries of modern technology.",
        skills: ["React", "Node.js", "MongoDB", "AWS"],
        social: {
          github: "https://github.com/yourusername",
          linkedin: "https://linkedin.com/in/yourusername",
          email: "mailto:your@email.com",
        },
      },
      {
        name: "Ayush Agarwal",
        role: "Co-Founder & UX Designer/Developer",
        image: "src/assets/images/agarwal.jpeg",
        bio: "UX enthusiast with a keen eye for design and user experience, dedicated to crafting visually stunning and intuitive interfaces.",
        skills: ["UI/UX", "Figma", "React", "TailwindCSS"],
        social: {
          github: "https://github.com/yourusername",
          linkedin: "https://linkedin.com/in/yourusername",
          email: "mailto:your@email.com",
        },
      },
      {
        name: "Shreeya Shrivastava",
        role: "Backend Developer",
        image: "#",
        bio: "She will add her3e",
        skills: ["Add yourself"],
        social: {
          github: "https://github.com/yourusername",
          linkedin: "https://linkedin.com/in/yourusername",
          email: "mailto:your@email.com",
        },
      },
    ],
    []
  );

  const values = useMemo(
    () => [
      {
        icon: <Rocket className="w-10 h-10 text-blue-400" />,
        title: "Innovation",
        description:
          "Pushing boundaries to create cutting-edge campus solutions that transform the learning experience.",
      },
      {
        icon: <Heart className="w-10 h-10 text-pink-400" />,
        title: "Community",
        description:
          "Building bridges among students through shared passion and connectivity.",
      },
      {
        icon: <Users className="w-10 h-10 text-green-400" />,
        title: "Collaboration",
        description:
          "Working together to empower every voice in our campus community.",
      },
      {
        icon: <School className="w-10 h-10 text-yellow-400" />,
        title: "Excellence",
        description:
          "Striving for the highest quality and integrity in every project we undertake.",
      },
    ],
    []
  );

  const achievements = [
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "Best Campus Innovation 2024",
      description: "Awarded for revolutionary impact on student life",
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "5-Star User Rating",
      description: "Consistently rated 5 stars by our community",
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Tech Excellence",
      description: "Recognized for technical innovation",
    },
  ];

  const stats = [
    { value: "2+", label: "Years Experience" },
    { value: "10+", label: "Projects Completed" },
    { value: "1000+", label: "Happy Users" },
    { value: "24/7", label: "Support" },
  ];

  const features = [
    {
      icon: <Target className="w-8 h-8 text-blue-400" />,
      title: "Goal-Oriented",
    },
    { icon: <Shield className="w-8 h-8 text-green-400" />, title: "Secure" },
    {
      icon: <Code className="w-8 h-8 text-purple-400" />,
      title: "Modern Tech",
    },
    {
      icon: <Coffee className="w-8 h-8 text-yellow-400" />,
      title: "Dedicated",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-purple-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/60 via-black to-black/80" />
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-blue-500 opacity-30"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: 0.5,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 1, 0.3],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Enhanced Hero Section */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
              className="relative mb-8"
            >
              <Sparkles className="w-20 h-20 mx-auto text-blue-400" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute inset-0 w-24 h-24 mx-auto border-2 border-blue-500/30 rounded-full"
              />
            </motion.div>
            <h1 className="text-6xl md:text-7xl font-bold mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                About CampusBeacon
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-200 max-w-3xl mx-auto font-mono">
              Illuminating campus life through technology and community.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Interactive Achievements Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20"
        >
          {achievements.map((achievement, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              onHoverStart={() => setHoveringAchievement(index)}
              onHoverEnd={() => setHoveringAchievement(null)}
              className="bg-blue-900/30 backdrop-blur-xl rounded-xl p-6 border border-blue-500/20"
            >
              <motion.div
                animate={{
                  rotate: hoveringAchievement === index ? 360 : 0,
                }}
                transition={{ duration: 0.5 }}
                className="text-blue-400 mb-4"
              >
                {achievement.icon}
              </motion.div>
              <h3 className="text-xl font-bold text-white mb-2">
                {achievement.title}
              </h3>
              <p className="text-blue-200">{achievement.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-blue-900/30 backdrop-blur-xl rounded-xl p-8 border border-blue-500/20"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.2 }}
              className="text-center"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="text-3xl md:text-4xl font-bold text-blue-400 mb-2"
              >
                {stat.value}
              </motion.div>
              <div className="text-blue-200 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Mission Section with Interactive Features */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-32"
        >
          <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-xl rounded-2xl p-12 border border-blue-500/20 shadow-2xl">
            <motion.div
              initial={{ x: -20 }}
              whileInView={{ x: 0 }}
              className="flex items-center mb-8"
            >
              <Target className="w-10 h-10 text-blue-400 mr-4" />
              <h2 className="text-4xl font-bold text-white">Our Mission</h2>
            </motion.div>
            <p className="text-blue-100 text-xl leading-relaxed">
              CampusBeacon was born from a simple ideology—to enhance campus
              life by connecting students, streamlining communication, and
              fostering a vibrant community with technology at its core.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="flex flex-col items-center p-4 bg-blue-900/20 rounded-xl border border-blue-500/10"
                >
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="text-blue-400 mb-2"
                  >
                    {feature.icon}
                  </motion.div>
                  <div className="text-blue-100 font-medium">
                    {feature.title}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Values Section */}
        <div className="mb-32">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-16"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Our Core Values
            </span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                }}
                className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-xl rounded-xl p-8 border border-blue-500/20"
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="mb-6"
                >
                  {value.icon}
                </motion.div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  {value.title}
                </h3>
                <p className="text-blue-100">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Team Section with Enhanced Interactions */}
        <div>
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-16"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Meet Our Team
            </span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-xl rounded-xl p-8 border border-blue-500/20"
              >
                <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                  <motion.div
                    className="relative group"
                    whileHover={{
                      scale: 1.1,
                      rotate: 360,
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-75 group-hover:opacity-100 blur transition duration-1000 group-hover:duration-200" />
                    <img
                      src={member.image}
                      alt={member.name}
                      className="relative w-32 h-32 rounded-full object-cover"
                    />
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-2 text-center md:text-left">
                      {member.name}
                    </h3>
                    <p className="text-blue-400 mb-4 text-center md:text-left">
                      {member.role}
                    </p>
                    <p className="text-blue-100 mb-6 text-center md:text-left">
                      {member.bio}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-6 justify-center md:justify-start">
                      {member.skills.map((skill, idx) => (
                        <motion.span
                          key={idx}
                          whileHover={{ scale: 1.1 }}
                          className="px-3 py-1 text-sm bg-blue-900/30 text-blue-300 rounded-full border border-blue-500/20"
                        >
                          {skill}
                        </motion.span>
                      ))}
                    </div>
                    <div className="flex justify-center md:justify-start space-x-4">
                      <motion.a
                        href={member.social.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.2, y: -2 }}
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <Github className="w-5 h-5" />
                      </motion.a>
                      <motion.a
                        href={member.social.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.2, y: -2 }}
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <Linkedin className="w-5 h-5" />
                      </motion.a>
                      <motion.a
                        href={member.social.email}
                        whileHover={{ scale: 1.2, y: -2 }}
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <Mail className="w-5 h-5" />
                      </motion.a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Interactive Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-32 text-center"
        >
          <motion.div whileHover={{ scale: 1.05 }} className="inline-block">
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-white font-bold text-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <span className="flex items-center space-x-2">
                <Zap className="w-5 h-5" />
                <span>Join Our Community</span>
              </span>
            </motion.button>
          </motion.div>
          <p className="mt-4 text-blue-200">
            Be part of something extraordinary
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutUs;