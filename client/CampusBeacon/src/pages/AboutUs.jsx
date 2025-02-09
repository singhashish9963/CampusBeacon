import React, { useMemo } from "react";
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
} from "lucide-react";

const AboutUs = () => {
  const teamMembers = useMemo(
    () => [
      {
        name: "Ayush Jaudan",
        role: "Co-Founder & Lead Developer",
        image: "src/assets/images/jadaun.jpeg",
        bio: "Full-stack developer passionate about creating innovative solutions",
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
        bio: "UX enthusiast with a keen eye for design and user experience",
        skills: ["UI/UX", "Figma", "React", "TailwindCSS"],
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
        icon: <Rocket className="w-8 h-8 text-blue-400" />,
        title: "Innovation",
        description:
          "Pushing boundaries to create cutting-edge campus solutions",
      },
      {
        icon: <Heart className="w-8 h-8 text-pink-400" />,
        title: "Community",
        description: "Fostering meaningful connections among students",
      },
      {
        icon: <Users className="w-8 h-8 text-green-400" />,
        title: "Collaboration",
        description: "Working together to enhance campus life",
      },
      {
        icon: <School className="w-8 h-8 text-yellow-400" />,
        title: "Excellence",
        description: "Striving for the highest quality in everything we do",
      },
    ],
    []
  );

  const stats = [
    { value: "2+", label: "Years Experience" },
    { value: "10+", label: "Projects Completed" },
    { value: "1000+", label: "Happy Users" },
    { value: "24/7", label: "Support" },
  ];

  const features = [
    { icon: <Target />, title: "Goal-Oriented" },
    { icon: <Shield />, title: "Secure" },
    { icon: <Code />, title: "Modern Tech" },
    { icon: <Coffee />, title: "Dedicated" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-purple-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/50 to-black/50" />
          {/* Add some animated particles or background elements */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-blue-500 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.2, 1, 0.2],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <Sparkles className="w-16 h-16 mx-auto text-blue-400" />
            </motion.div>
            <h1 className="text-6xl md:text-7xl font-bold mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                About CampusBeacon
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-200 max-w-3xl mx-auto font-mono">
              Illuminating campus life through technology and community
            </p>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20">
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
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-2">
                {stat.value}
              </div>
              <div className="text-blue-200 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Mission Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-32"
        >
          <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-xl rounded-2xl p-12 border border-blue-500/20 shadow-2xl">
            <h2 className="text-4xl font-bold text-white mb-8 flex items-center">
              <Target className="w-10 h-10 text-blue-400 mr-4" />
              Our Mission
            </h2>
            <p className="text-blue-100 text-xl leading-relaxed">
              CampusBeacon was born from a simple idea: to make campus life more
              connected, efficient, and enjoyable. We believe that technology
              can bridge gaps and create opportunities for meaningful
              interactions within the campus community.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="flex flex-col items-center p-4 bg-blue-900/20 rounded-xl border border-blue-500/10"
                >
                  <div className="text-blue-400 mb-2">{feature.icon}</div>
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
                transition={{ delay: index * 0.1 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                }}
                className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-xl rounded-xl p-8 border border-blue-500/20"
              >
                <div className="mb-6 transform transition-transform duration-300 group-hover:scale-110">
                  {value.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  {value.title}
                </h3>
                <p className="text-blue-100">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Team Section */}
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
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-75 group-hover:opacity-100 blur transition duration-1000 group-hover:duration-200" />
                    <img
                      src={member.image}
                      alt={member.name}
                      className="relative w-32 h-32 rounded-full object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-2 text-center md:text-left">
                      {member.name}
                    </h3>
                    <p className="text-blue-400 mb-4 text-center md:text-left">
                      {member.role}
                    </p>
                    <p className="text-blue-100 mb-6">{member.bio}</p>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {member.skills.map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className="px-3 py-1 text-sm bg-blue-900/30 text-blue-300 rounded-full border border-blue-500/20"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="flex justify-center md:justify-start space-x-4">
                      <a
                        href={member.social.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <Github className="w-5 h-5" />
                      </a>
                      <a
                        href={member.social.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <Linkedin className="w-5 h-5" />
                      </a>
                      <a
                        href={member.social.email}
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <Mail className="w-5 h-5" />
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
