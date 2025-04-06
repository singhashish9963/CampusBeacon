import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  HiHome,
  HiSearch,
  HiShoppingBag,
  HiUser,
  HiOfficeBuilding,
  HiLogout,
  HiLogin,
  HiMenu,
  HiAcademicCap, 
  HiClipboardList, 
} from "react-icons/hi";
import { HiChatBubbleLeftRight, HiTruck } from "react-icons/hi2";
import { X } from "lucide-react";
import { handleLogout } from "../../../slices/authSlice";
import { getAllHostels } from "../../../slices/hostelSlice";
import { Building } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";



function NavBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { hostels } = useSelector((state) => state.hostel);
  const [showHostelMenu, setShowHostelMenu] = useState(false);
  const [showAcademicsMenu, setShowAcademicsMenu] = useState(false); // State for new dropdown

  // Get authentication state using authSlice from Redux
  const { isAuthenticated, loading, user, roles } = useSelector(
    (state) => state.auth
  );

  const [isVisible, setIsVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const showTimeoutRef = useRef(null);
  const academicsTimeoutRef = useRef(null); // Timeout for academics dropdown
  const hostelTimeoutRef = useRef(null); // Timeout for hostel dropdown

  // --- Navigation Links ---

  // Main links shown when authenticated
  const mainLinks = isAuthenticated
    ? [
        { name: "Home", path: "/", icon: HiHome },
        { name: "Lost & Found", path: "/lost-found", icon: HiSearch },
        { name: "Market", path: "/marketplace", icon: HiShoppingBag },
        { name: "Rides", path: "/rides", icon: HiTruck },
        { name: "Chat", path: "/chat", icon: HiChatBubbleLeftRight },
        // { name: "Profile", path: "/profile", icon: HiUser }, // Profile moved to user dropdown/button
      ]
    : [{ name: "Home", path: "/", icon: HiHome }]; // Only Home when logged out

  // Define Academics dropdown options
  const academicsOptions = [
    { name: "Attendance Tracker", path: "/attendance", icon: HiClipboardList },
    // { name: "Grades", path: "/grades", icon: /* Add Icon */ }, // Future item
    // { name: "Course Resources", path: "/resources", icon: /* Add Icon */ }, // Future item
  ];

  // --- Handlers ---

  const handleLogoutClick = async () => {
    try {
      await dispatch(handleLogout()).unwrap();
      navigate("/login");
      setIsVisible(false); // Hide navbar on logout
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Function to handle mouse enter for dropdowns
  const handleMouseEnter = (setMenuState, timeoutRef) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setMenuState(true);
  };

  // Function to handle mouse leave for dropdowns
  const handleMouseLeave = (setMenuState, timeoutRef) => {
    timeoutRef.current = setTimeout(() => {
      setMenuState(false);
    }, 200); // Shorter delay might feel better
  };

  // --- Effects ---

  // Load hostels only after successful authentication
  useEffect(() => {
    if (isAuthenticated && !loading) {
      dispatch(getAllHostels());
    }
    // Cleanup all timeouts on unmount
    return () => {
      if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
      if (academicsTimeoutRef.current)
        clearTimeout(academicsTimeoutRef.current);
      if (hostelTimeoutRef.current) clearTimeout(hostelTimeoutRef.current);
    };
  }, [dispatch, isAuthenticated, loading]);

  // Close mobile menu on navigation
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // --- Render ---
  return (
    <>
      {/* Desktop Trigger Area */}
      <div
        className="fixed top-0 left-0 w-full h-8 z-[60]"
        onMouseEnter={() => setIsVisible(true)}
      />

      {/* Mobile Menu Button */}
      <div className="fixed top-4 right-4 z-[70] sm:hidden">
        {" "}
        {/* Highest z-index */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-full bg-purple-500/20 backdrop-blur-sm border border-purple-500/30 shadow-lg"
        >
          <HiMenu className="w-6 h-6 text-white" />
        </motion.button>
      </div>

      {/* --- Mobile Navigation --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 35 }}
            className="fixed inset-0 z-40 sm:hidden" // Lower z-index than button
          >
            <div
              className="absolute inset-0 bg-black/80 backdrop-blur-lg"
              onClick={() => setIsMobileMenuOpen(false)} // Close on overlay click
            />
            <div className="absolute right-0 top-0 h-full w-4/5 max-w-sm bg-gray-900/95 shadow-2xl">
              <div className="flex flex-col h-full py-16 px-4 overflow-y-auto">
                {/* Close button inside menu */}
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>

                {/* Profile Link */}
                {isAuthenticated && (
                  <Link
                    to="/profile"
                    className="flex items-center space-x-4 px-4 py-4 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors mb-4"
                  >
                    <HiUser className="w-6 h-6" />
                    <span>Profile</span>
                  </Link>
                )}

                {/* Main Links */}
                {mainLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className="flex items-center space-x-4 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                  >
                    <link.icon className="w-5 h-5" />
                    <span>{link.name}</span>
                  </Link>
                ))}

                {/* Academics Section (Mobile) */}
                {isAuthenticated && (
                  <div className="mt-4 border-t border-white/10 pt-4">
                    <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Academics
                    </div>
                    {academicsOptions.map((option) => (
                      <Link
                        key={option.name}
                        to={option.path}
                        className="flex items-center space-x-4 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                      >
                        <option.icon className="w-5 h-5" />
                        <span>{option.name}</span>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Hostels Section (Mobile) */}
                {isAuthenticated && hostels.length > 0 && (
                  <div className="mt-4 border-t border-white/10 pt-4">
                    <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hostels
                    </div>
                    {hostels.map((hostel) => (
                      <Link
                        key={hostel.hostel_id}
                        to={`/hostels/${hostel.hostel_id}`}
                        className="flex items-center space-x-4 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                      >
                        <HiOfficeBuilding className="w-5 h-5" />
                        <span>{hostel.hostel_name}</span>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Auth Actions (Bottom) */}
                <div className="mt-auto pt-6 border-t border-white/10">
                  {isAuthenticated ? (
                    <button
                      onClick={handleLogoutClick}
                      className="flex items-center space-x-4 w-full px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors"
                    >
                      <HiLogout className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  ) : (
                    <Link
                      to="/login"
                      className="flex items-center space-x-4 w-full px-4 py-3 text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 rounded-xl transition-colors"
                    >
                      <HiLogin className="w-5 h-5" />
                      <span>Login</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Desktop Navigation --- */}
      <AnimatePresence>
        {isVisible && (
          <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl mx-auto z-50 hidden sm:block" // z-index 50
            onMouseLeave={() => {
              // Clear any existing timeout first
              if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
              // Set timeout to hide the navbar
              showTimeoutRef.current = setTimeout(() => {
                // Only hide if no submenus are actively hovered
                if (!showHostelMenu && !showAcademicsMenu) {
                  setIsVisible(false);
                }
              }, 300); // Longer delay to allow moving to dropdowns
            }}
            onMouseEnter={() => {
              // Clear timeout when mouse re-enters the navbar itself
              if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
              setIsVisible(true); // Ensure it stays visible
            }}
          >
            <div className="relative rounded-2xl overflow-visible bg-black/30 backdrop-blur-xl border border-white/10 shadow-2xl shadow-purple-500/10">
              <div className="max-w-7xl mx-auto px-4 lg:px-6">
                <div className="flex items-center justify-between h-16">
                  {/* Logo */}
                  <Link
                    to="/"
                    className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent"
                  >
                    CampusBeacon
                  </Link>

                  {/* Desktop Links */}
                  <div className="flex items-center space-x-4 md:space-x-6 text-sm md:text-base">
                    {/* Main Links */}
                    {mainLinks.map((link) => (
                      <Link
                        key={link.name}
                        to={link.path}
                        className="flex items-center space-x-1 md:space-x-2 text-gray-300 hover:text-white transition-colors relative group"
                      >
                        <link.icon className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                        <span>{link.name}</span>
                        <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                      </Link>
                    ))}

                    {/* Academics Dropdown */}
                    {isAuthenticated && (
                      <div
                        className="relative"
                        onMouseEnter={() =>
                          handleMouseEnter(
                            setShowAcademicsMenu,
                            academicsTimeoutRef
                          )
                        }
                        onMouseLeave={() =>
                          handleMouseLeave(
                            setShowAcademicsMenu,
                            academicsTimeoutRef
                          )
                        }
                      >
                        <button className="flex items-center space-x-1 md:space-x-2 text-gray-300 hover:text-white transition-colors relative group">
                          <HiAcademicCap className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                          <span>Academics</span>
                          <span
                            className={`absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transition-transform duration-300 ${
                              showAcademicsMenu
                                ? "scale-x-100"
                                : "scale-x-0 group-hover:scale-x-100"
                            }`}
                          />
                        </button>
                        <AnimatePresence>
                          {showAcademicsMenu && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              className="absolute left-0 top-full mt-2 w-60 bg-black/70 backdrop-blur-xl rounded-xl overflow-hidden border border-white/10 shadow-lg z-10"
                            >
                              {academicsOptions.map((option) => (
                                <Link
                                  key={option.name}
                                  to={option.path}
                                  className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                                >
                                  <option.icon className="w-5 h-5 flex-shrink-0 opacity-80" />
                                  <span className="font-medium">
                                    {option.name}
                                  </span>
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}

                    {/* Hostels Dropdown */}
                    {isAuthenticated && hostels.length > 0 && (
                      <div
                        className="relative"
                        onMouseEnter={() =>
                          handleMouseEnter(setShowHostelMenu, hostelTimeoutRef)
                        }
                        onMouseLeave={() =>
                          handleMouseLeave(setShowHostelMenu, hostelTimeoutRef)
                        }
                      >
                        <button className="flex items-center space-x-1 md:space-x-2 text-gray-300 hover:text-white transition-colors relative group">
                          <Building className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                          <span>Hostels</span>
                          <span
                            className={`absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transition-transform duration-300 ${
                              showHostelMenu
                                ? "scale-x-100"
                                : "scale-x-0 group-hover:scale-x-100"
                            }`}
                          />
                        </button>
                        <AnimatePresence>
                          {showHostelMenu && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              className="absolute left-0 top-full mt-2 w-56 bg-black/70 backdrop-blur-xl rounded-xl overflow-hidden border border-white/10 shadow-lg z-10"
                            >
                              {hostels.map((hostel) => (
                                <Link
                                  key={hostel.hostel_id}
                                  to={`/hostels/${hostel.hostel_id}`}
                                  className="block px-4 py-3 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors font-medium"
                                >
                                  {hostel.hostel_name}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}

                    {/* Profile & Auth Buttons */}
                    {isAuthenticated ? (
                      <>
                        <Link
                          to="/profile"
                          className="flex items-center space-x-1 md:space-x-2 text-gray-300 hover:text-white transition-colors relative group"
                        >
                          <HiUser className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                          <span>Profile</span>
                          <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                        </Link>
                        <button
                          onClick={handleLogoutClick}
                          className="flex items-center space-x-1 md:space-x-2 text-gray-300 hover:text-white transition-colors relative group"
                        >
                          <HiLogout className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                          <span>Logout</span>
                          <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                        </button>
                      </>
                    ) : (
                      <Link
                        to="/login"
                        className="flex items-center space-x-1 md:space-x-2 text-gray-300 hover:text-white transition-colors relative group"
                      >
                        <HiLogin className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                        <span>Login</span>
                        <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                      </Link>
                    )}
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
