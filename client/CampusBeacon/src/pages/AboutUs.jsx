import React, { useMemo } from 'react';
import { motion } from "framer-motion";
import { Rocket, Heart, Users, School } from "lucide-react";

const AboutUs = () => {
  // Memoize static data
  const teamMembers = useMemo(() => [
    {
      name: "Ayush Jaudan",
      role: "Co-Founder & Lead Developer",
      image: "src/assets/images/jadaun.jpeg"
    },
    {
      name: "Ayush Agarwal",
      role: "Co-Founder & UX Designer/Developer",
      image: "src/assets/images/agarwal.jpeg"
    },
  ], []);

  const values = useMemo(() => [
    {
      icon: <Rocket className="w-8 h-8 text-blue-400" />,
      title: "Innovation",
      description: "Pushing boundaries to create cutting-edge campus solutions"
    },
    {
      icon: <Heart className="w-8 h-8 text-blue-400" />,
      title: "Community",
      description: "Fostering meaningful connections among students"
    },
    {
      icon: <Users className="w-8 h-8 text-blue-400" />,
      title: "Collaboration",
      description: "Working together to enhance campus life"
    },
    {
      icon: <School className="w-8 h-8 text-blue-400" />,
      title: "Excellence",
      description: "Striving for the highest quality in everything we do"
    }
  ], []);

  const SectionContainer = ({ children, className = "" }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`mb-20 ${className}`}
    >
      {children}
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 via-black to-purple-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-blue-500">
            About CampusBeacon
          </h1>
          <p className="text-xl text-blue-100 mx-auto font-mono">
            Illuminating campus life through technology and community
          </p>
        </motion.div>

        {/* Mission Section */}
        <div>
          <div className="bg-blue-900/30 backdrop-blur-sm rounded-lg p-8 border border-blue-800 hover:border-blue-700 transition-colors m-20">
            <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
            <p className="text-blue-100 text-lg leading-relaxed">
              CampusBeacon was born from a simple idea: to make campus life more connected, 
              efficient, and enjoyable. We believe that technology can bridge gaps and create 
              opportunities for meaningful interactions within the campus community.
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div>
          <h2 className="text-3xl font-bold text-white mb-12 text-center m-20">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7 m-20">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-blue-900/30 backdrop-blur-sm rounded-lg p-6 border border-blue-800 hover:border-blue-700 transition-colors"
              >
                <div className="mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{value.title}</h3>
                <p className="text-blue-100">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div>
          <h2 className="text-3xl font-bold text-white mb-12 text-center m-20">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-70 ml-30 mr-30">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-blue-900/30 backdrop-blur-sm rounded-lg p-10 border border-blue-800 hover:border-blue-700 transition-colors"
              > 
                <div className="relative">
                  <img
                    src={member.image}
                    className="w-25 h-25 rounded-full mx-auto mb-4 group-hover:scale-105 transition-transform"
                  />
                </div>
                <h3 className="text-xl font-bold text-white mt-5 mb-5 text-center">{member.name}</h3>
                <p className="text-blue-100 text-center">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AboutUs;