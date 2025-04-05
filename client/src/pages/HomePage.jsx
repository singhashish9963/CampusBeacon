import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  Suspense,
} from "react";
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
import { ButtonColourfull } from "../components/common/buttons";
import { NotificationIcon } from "../components/features/notifications";
import { useSelector } from "react-redux";

// Lazy-loaded components with Suspense fallback wrappers
const FeatureCard = React.lazy(() =>
  import("../components/HomePage/FeatureCard")
);
const QuickLinks = React.lazy(() =>
  import("../components/HomePage/QuickLinks")
);
const EventsSection = React.lazy(() =>
  import("../components/HomePage/EventsSection")
);
const ImageSlider = React.lazy(() =>
  import("../components/HomePage/ImageSlider")
);
const StarryBackground = React.lazy(() =>
  import("../components/HomePage/StarsBg")
);
const ChatbotWidget = React.lazy(() =>
  import("../components/HomePage/ChatbotWidget")
);

// Debounce helper to optimize scroll handling
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const HomePage = () => {
  const [activeSection, setActiveSection] = useState("home");
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Scroll handler debounced to reduce re-renders
  const handleScroll = useCallback(
    debounce(() => {
      const sections = document.querySelectorAll("section[id]");
      const scrollPosition = window.scrollY + 100;
      let found = false;
      sections.forEach((section) => {
        if (!section) return;
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (
          scrollPosition >= sectionTop &&
          scrollPosition < sectionTop + sectionHeight
        ) {
          setActiveSection(section.id);
          found = true;
        }
      });
      if (!found && window.scrollY < 200) {
        setActiveSection("home");
      }
    }, 100),
    []
  );

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const scrollToSection = useCallback((sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 0; // Adjust if you have fixed navbar height etc.
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  }, []);

  // Memoized feature cards data
  const featureCards = useMemo(
    () => [
      {
        icon: Coffee,
        title: "Eateries",
        description: "Discover amazing places to eat around campus",
        href: "/eatries",
        gradient: "from-amber-500 via-orange-500 to-red-500",
      },
      {
        icon: Users,
        title: "Hostel Management",
        description: "Seamless hostel allocation and maintenance system",
        href: "/hostel",
        gradient: "from-blue-500 via-indigo-500 to-purple-500",
      },
      {
        icon: Search,
        title: "Lost & Found",
        description: "Connect with campus community to find lost items",
        href: "/lost-found",
        gradient: "from-green-500 via-teal-500 to-cyan-500",
      },
      {
        icon: ShoppingBag,
        title: "Buy & Sell",
        description: "Campus marketplace for books and essentials",
        href: "/marketplace",
        gradient: "from-pink-500 via-rose-500 to-red-500",
      },
      {
        icon: Book,
        title: "Resource Hub",
        description: "Access academic resources and track attendance",
        href: "/resource",
        gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
      },
      {
        icon: Globe,
        title: "Community Chat",
        description: "Connect with peers and join campus activities",
        href: "/chat",
        gradient: "from-cyan-500 via-blue-500 to-indigo-500",
      },
      {
        icon: Car,
        title: "Ride Sharing",
        description: "Share rides and save money",
        href: "/rides",
        gradient: "from-amber-800 via-orange-700 to-orange-900",
      },
    ],
    []
  );

  return (
    <>
      {/* Background Component */}
      <div className="fixed inset-0 -z-10">
        <Suspense fallback={<div className="w-full h-full bg-black/50" />}>
          <StarryBackground />
        </Suspense>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 min-h-screen pt-16">
        {/* Top Navigation with Notification Icon */}
        <div className="fixed top-4 right-4 z-50 flex items-center space-x-4">
          {isAuthenticated && <NotificationIcon />}
        </div>

        {/* Hero Section */}
        <section
          id="home"
          className="min-h-screen flex items-center justify-center relative py-16"
        >
          <div className="text-center z-10 px-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl md:text-7xl font-bold mb-6 sm:mb-8 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500"
            >
              Welcome to CampusBeacon
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-mono text-lg sm:text-xl md:text-2xl text-gray-300 max-w-xl sm:max-w-2xl mx-auto mb-10 sm:mb-12"
            >
              Your digital companion for navigating campus life seamlessly.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <ButtonColourfull
                text="Explore Features"
                type="button"
                buttonsize="px-6 py-2.5 sm:px-8 sm:py-3"
                textsize="text-base sm:text-lg"
                onClick={() => scrollToSection("features")}
              />
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="relative z-10 py-20 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              className="text-center mb-16 sm:mb-20"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
                Features
              </h2>
              <p className="text-lg sm:text-xl text-gray-400 font-mono max-w-3xl mx-auto">
                Everything you need for a connected and efficient campus
                experience.
              </p>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8"
            >
              {featureCards.map((card) => (
                <Suspense
                  key={card.href}
                  fallback={
                    <div className="h-48 w-full bg-gray-700 animate-pulse" />
                  }
                >
                  <FeatureCard
                    icon={card.icon}
                    title={card.title}
                    description={card.description}
                    href={card.href}
                    gradient={card.gradient}
                  />
                </Suspense>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Quick Links Section */}
        <section id="quicklinks" className="relative z-10 py-20 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              className="text-center mb-16 sm:mb-20"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
                Quick Links
              </h2>
              <p className="text-lg sm:text-xl text-gray-400 font-mono max-w-3xl mx-auto">
                Essential resources and information at your fingertips.
              </p>
            </motion.div>
            <Suspense
              fallback={
                <div className="h-32 w-full bg-gray-700 animate-pulse" />
              }
            >
              <QuickLinks />
            </Suspense>
          </div>
        </section>

        {/* Clubs Section */}
        <section
          id="clubs"
          className="relative z-10 py-20 sm:py-24 overflow-hidden"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              className="text-center mb-16 sm:mb-20"
            >
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent mb-4 sm:mb-6">
                Clubs and Activities
              </h2>
              <p className="text-lg sm:text-xl text-gray-400 font-mono max-w-3xl mx-auto">
                Find your passion, build connections, and join the vibrant
                campus community.
              </p>
            </motion.div>
            <Suspense
              fallback={
                <div className="h-64 w-full bg-gray-700 animate-pulse" />
              }
            >
              <ImageSlider />
            </Suspense>
          </div>
        </section>

        {/* Events Section */}
        <section id="events" className="relative z-10">
          <Suspense
            fallback={<div className="h-64 w-full bg-gray-700 animate-pulse" />}
          >
            <EventsSection />
          </Suspense>
        </section>
        {/* Chatbot Widget */}
        <div className="fixed bottom-6 right-6 z-50">
          <Suspense fallback={null}>
            <ChatbotWidget />
          </Suspense>
        </div>
      </div>
    </>
  );
};

export default React.memo(HomePage);
