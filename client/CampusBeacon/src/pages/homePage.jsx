import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users,
  Globe,
  Search,
  Coffee,
  ShoppingBag,
  Book,
  Car,
} from "lucide-react";
import ButtonColourfull from "../components/ButtonColourfull";
import FeatureCard from "../components/HomePage/FeatureCard.jsx";
import QuickLinks from "../components/HomePage/QuickLinks.jsx";
import EventsSection from "../components/HomePage/EventsSection.jsx";
import ImageSlider from "../components/HomePage/ImageSlider.jsx";
import StarryBackground from "../components/HomePage/StarsBg.jsx";
import ChatbotWidget from "../components/HomePage/ChatbotWidget.jsx";
import NotificationIcon from "../components/NotificationIcon";
import { useAuth } from "../contexts/AuthContext.jsx";

const HomePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Scroll spy and login status logic
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
    const handleScroll = () => {
      const sections = document.querySelectorAll("section[id]");
      const scrollPosition = window.scrollY + 100;
      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (
          scrollPosition >= sectionTop &&
          scrollPosition < sectionTop + sectionHeight
        ) {
          setActiveSection(section.id);
        }
      });
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  return (
    <>
      <div className="fixed inset-0">
        <StarryBackground />
      </div>
      <div className="relative z-10 min-h-screen pt-16">
        {/* Top Navigation with Notification Icon */}
        <div className="fixed top-4 right-4 z-50 flex items-center space-x-4">
          <NotificationIcon />
          {/* Other navigation/profile elements can go here */}
        </div>

        {/* Hero Section */}
        <section
          id="home"
          className="min-h-screen flex items-center justify-center relative"
        >
          <div className="text-center z-10 px-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500"
            >
              Welcome to CampusBeacon
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="font-mono text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto mb-12"
            >
              Your digital companion for campus life
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <ButtonColourfull
                text="Explore Features"
                type="button"
                buttonsize="px-8 py-3"
                textsize="text-lg"
                onClick={() => scrollToSection("features")}
              />
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="min-h-screen relative z-10 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Features
              </h2>
              <p className="text-xl text-gray-400 font-mono">
                Everything you need for a connected campus life
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
              <FeatureCard
                icon={Coffee}
                title="Eateries"
                description="Discover amazing places to eat around campus"
                href="/eatries"
                gradient="from-amber-500 via-orange-500 to-red-500"
              />
              <FeatureCard
                icon={Users}
                title="Hostel Management"
                description="Seamless hostel allocation and maintenance system"
                href="/hostel"
                gradient="from-blue-500 via-indigo-500 to-purple-500"
              />
              <FeatureCard
                icon={Search}
                title="Lost & Found"
                description="Connect with campus community to find lost items"
                href="/lost-found"
                gradient="from-green-500 via-teal-500 to-cyan-500"
              />
              <FeatureCard
                icon={ShoppingBag}
                title="Buy & Sell"
                description="Campus marketplace for books and essentials"
                href="/marketplace"
                gradient="from-pink-500 via-rose-500 to-red-500"
              />
              <FeatureCard
                icon={Book}
                title="Resource Hub"
                description="Access academic resources and track attendance"
                href="/resource"
                gradient="from-violet-500 via-purple-500 to-fuchsia-500"
              />
              <FeatureCard
                icon={Globe}
                title="Community"
                description="Connect with peers and join campus activities"
                href="/chat"
                gradient="from-cyan-500 via-blue-500 to-indigo-500"
              />
              <FeatureCard
                icon={Car}
                title="Ride Sharing"
                description="Share rides and save Price"
                href="/rides"
                gradient="from-amber-800 via-orange-700 to-orange-900"
              />
            </div>
          </div>
        </section>

        {/* Quick Links Section */}
        <section id="quicklinks" className="relative z-10 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Quick Links
              </h2>
              <p className="text-xl text-gray-400 font-mono">
                Essential resources at your fingertips
              </p>
            </motion.div>
            <QuickLinks />
          </div>
        </section>

        {/* Clubs Section */}
        <section id="clubs" className="min-h-screen relative z-10 py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent mb-8">
                Clubs and Activities
              </h2>
              <p className="text-xl text-gray-400 font-mono">
                Find your passion, join the community
              </p>
            </motion.div>
            <ImageSlider />
          </div>
        </section>

        {/* Events Section */}
        <section id="events">
          <EventsSection />
        </section>

        {/* Chatbot Widget */}
        <div className="fixed bottom-6 right-6 z-50">
          <ChatbotWidget />
        </div>

        {/* Scroll to top button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 left-6 z-50 p-3 rounded-full bg-purple-500/20 border border-purple-500/50 text-white hover:bg-purple-500/30 transition-colors"
        >
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            ↑
          </motion.div>
        </motion.button>
      </div>
    </>
  );
};

export default HomePage;
