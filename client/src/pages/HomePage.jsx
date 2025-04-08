import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  Suspense,
} from "react";
import { motion } from "framer-motion";
import {
  Users, // Note: Users icon isn't used in featureCards, but kept import
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
import { HiAcademicCap } from "react-icons/hi";

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
      const scrollPosition = window.scrollY + 100; // Adjusted offset for better section detection
      let found = false;
      sections.forEach((section) => {
        if (!section) return;
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        // Check if the section is roughly in the middle of the viewport
        if (
          scrollPosition >= sectionTop &&
          scrollPosition < sectionTop + sectionHeight
        ) {
          // Prioritize setting active section only if it's different
          if (activeSection !== section.id) {
            setActiveSection(section.id);
          }
          found = true;
        }
      });
      // Fallback to 'home' if near the top and no other section matched
      if (!found && window.scrollY < 200 && activeSection !== "home") {
        setActiveSection("home");
      }
    }, 150), // Slightly increased debounce wait time
    [activeSection] // Added activeSection dependency to potentially avoid unnecessary updates if already set
  );

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const scrollToSection = useCallback((sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 0; // Adjust if you have a fixed navbar height
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      // Optionally update active section immediately for better UX
      setActiveSection(sectionId);
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
      {
        icon: HiAcademicCap,
        title: "Attendance Tracker",
        description: "Track your personal attendance here",
        gradient: "from-teal-500 via-emerald-500 to-green-500",
        href: "/attendance",
      },
    ],
    []
  );

  // Generic Suspense Fallback
  const SuspenseFallback = ({ height = "h-48" }) => (
    <div
      className={`w-full ${height} bg-gray-800/50 rounded-lg animate-pulse`}
    />
  );

  return (
    <>
      {/* Background Component */}
      <div className="fixed inset-0 -z-10">
        <Suspense fallback={<div className="w-full h-full bg-black/80" />}>
          <StarryBackground />
        </Suspense>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 min-h-screen pt-16 text-white">
        {" "}
        {/* Ensure base text color */}
        {/* Top Right Icons Container - Adjusted for Mobile */}
        <div
          className="fixed top-4 right-16 sm:right-4 z-50 flex items-center space-x-4"
          // Explanation:
          // - `right-16`: On small screens (default), position 4rem (16 * 0.25rem) from the right edge.
          //   This leaves space on the far right, presumably for a hamburger menu.
          // - `sm:right-4`: On 'sm' breakpoint and larger, revert to 1rem (4 * 0.25rem) from the right edge.
          // - `z-50`: Ensures it stays above most other content. Adjust if needed based on your navbar's z-index.
        >
          {isAuthenticated && <NotificationIcon />}
        </div>
        {/* Hero Section */}
        <section
          id="home"
          className="min-h-screen flex items-center justify-center relative py-20 sm:py-16" // Added more padding top/bottom
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
          {/* Optional: Add a subtle downward arrow or scroll indicator */}
        </section>
        {/* Features Section */}
        <section id="features" className="relative z-10 py-20 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }} // Reduced amount slightly
              transition={{ duration: 0.5 }}
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
              viewport={{ once: true, amount: 0.1 }} // Start animation sooner
              variants={{
                visible: { transition: { staggerChildren: 0.07 } }, // Faster stagger
                hidden: {},
              }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8"
            >
              {featureCards.map((card) => (
                <Suspense
                  key={card.href}
                  fallback={<SuspenseFallback height="h-48" />}
                >
                  {/* FeatureCard itself needs motion.div for individual animation */}
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                  >
                    <FeatureCard
                      icon={card.icon}
                      title={card.title}
                      description={card.description}
                      href={card.href}
                      gradient={card.gradient}
                    />
                  </motion.div>
                </Suspense>
              ))}
            </motion.div>
          </div>
        </section>
        {/* Quick Links Section */}
        <section
          id="quicklinks"
          className="relative z-10 py-20 sm:py-24 bg-black/20 backdrop-blur-sm"
        >
          {" "}
          {/* Added subtle background */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16 sm:mb-20"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
                Quick Links
              </h2>
              <p className="text-lg sm:text-xl text-gray-400 font-mono max-w-3xl mx-auto">
                Essential resources and information at your fingertips.
              </p>
            </motion.div>
            <Suspense fallback={<SuspenseFallback height="h-32" />}>
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
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5 }}
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
            <Suspense fallback={<SuspenseFallback height="h-64" />}>
              <ImageSlider />
            </Suspense>
          </div>
        </section>
        {/* Events Section */}
        <section
          id="events"
          className="relative z-10 py-20 sm:py-24 bg-black/20 backdrop-blur-sm"
        >
          {" "}
          {/* Added subtle background */}
          <Suspense fallback={<SuspenseFallback height="h-96" />}>
            {" "}
            {/* Increased fallback height */}
            <EventsSection />
          </Suspense>
        </section>
        {/* Chatbot Widget */}
        <div className="fixed bottom-6 right-6 z-50">
          <Suspense fallback={null}>
            {" "}
            {/* No visual fallback needed for chatbot usually */}
            <ChatbotWidget />
          </Suspense>
        </div>
      </div>
    </>
  );
};

// Use React.memo for performance optimization
export default React.memo(HomePage);
