import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import IconHoverStyle from "./IconHoverStyle";

function NavBar() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const timeoutRef = useRef(null);
  const showTimeoutRef = useRef(null);

  const mainLinks = [
    { name: "Home", path: "/home" },
    { name: "Lost & Found", path: "/lost-found" },
    { name: "Buy & Sell", path: "/Marketplace" },
    { name: "Profile", path: "/profile" },
  ];

  const academicOptions = [
    { name: "Attendance Tracker", path: "/attendance" },
    { name: "Academic Performance", path: "/academics" },
  ];

  const hostelOptions = [
    { name: "SVBH", path: "/SVBH" },
    { name: "DGJH", path: "/DJGH" },
  ];

  const handleMouseEnter = (dropdown) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(dropdown);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 300);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <>
      {/* Hover detection area */}
      <div
        className="fixed top-0 left-0 w-full h-8 z-50"
        onMouseEnter={() => setIsVisible(true)}
      />

      {/* Navbar */}
      <AnimatePresence>
        {isVisible && (
          <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl mx-auto z-50"
            onMouseLeave={() => {
              showTimeoutRef.current = setTimeout(() => {
                setIsVisible(false);
                setActiveDropdown(null);
              }, 300);
            }}
            onMouseEnter={() => {
              if (showTimeoutRef.current) {
                clearTimeout(showTimeoutRef.current);
              }
            }}
          >
            <div className="relative rounded-2xl overflow-visible bg-black/30 backdrop-blur-xl border border-white/10 shadow-2xl shadow-purple-500/10">
              <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-center justify-between h-16">
                  <Link
                    to="/"
                    className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent"
                  >
                    CampusBeacon
                  </Link>

                  <div className="flex items-center space-x-8 text-l">
                    {mainLinks.map((link) => (
                      <Link
                        key={link.name}
                        to={link.path}
                        className="text-gray-300 hover:text-white transition-colors relative group"
                      >
                        {link.name}
                        <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform" />
                      </Link>
                    ))}

                    <div
                      onMouseEnter={() => handleMouseEnter("academics")}
                      onMouseLeave={handleMouseLeave}
                      className="relative"
                    >
                      <button className="text-gray-300 hover:text-white transition-colors">
                        Academics
                      </button>
                      <AnimatePresence>
                        {activeDropdown === "academics" && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute top-full right-0 mt-2 w-56 bg-black/70 backdrop-blur-xl rounded-xl overflow-hidden border border-white/10 z-50"
                          >
                            {academicOptions.map((option) => (
                              <Link
                                key={option.name}
                                to={option.path}
                                className="block px-4 py-3 text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                              >
                                {option.name}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div
                      onMouseEnter={() => handleMouseEnter("hostel")}
                      onMouseLeave={handleMouseLeave}
                      className="relative"
                    >
                      <button className="text-gray-300 hover:text-white transition-colors">
                        Hostel
                      </button>
                      <AnimatePresence>
                        {activeDropdown === "hostel" && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute top-full right-0 mt-2 w-56 bg-black/70 backdrop-blur-xl rounded-xl overflow-hidden border border-white/10 z-50"
                          >
                            {hostelOptions.map((option) => (
                              <Link
                                key={option.name}
                                to={option.path}
                                className="block px-4 py-3 text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                              >
                                {option.name}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}

export default NavBar;
