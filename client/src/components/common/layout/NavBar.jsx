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
} from "react-icons/hi";
import { handleLogout } from "../../../slices/authSlice";
import { getAllHostels } from "../../../slices/hostelSlice";
import { Building } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

// DropdownMenu component to show dropdown options
const DropdownMenu = ({ title, options, dropdownKey, icon: Icon }) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const timeoutRef = useRef(null);

  const handleMouseEnter = (key) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(key);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 300);
  };

  return (
    <div
      onMouseEnter={() => handleMouseEnter(dropdownKey)}
      onMouseLeave={handleMouseLeave}
      className="relative"
    >
      <button className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors relative group">
        <Icon className="w-5 h-5" />
        <span>{title}</span>
        <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform" />
      </button>
      <AnimatePresence>
        {activeDropdown === dropdownKey && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full right-0 mt-2 w-64 bg-black/70 backdrop-blur-xl rounded-xl overflow-hidden border border-white/10 z-50"
          >
            {options.map((option) => (
              <Link
                key={option.name}
                to={option.path}
                className="block px-4 py-3 text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
              >
                <div className="font-medium">{option.name}</div>
                {option.description && (
                  <div className="text-sm text-gray-400">
                    {option.description}
                  </div>
                )}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

function NavBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { hostels } = useSelector((state) => state.hostel);
  const [showHostelMenu, setShowHostelMenu] = useState(false);

  // Get authentication state using authSlice from Redux
  const { isAuthenticated, loading, user, roles } = useSelector(
    (state) => state.auth
  );

  const [isVisible, setIsVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const showTimeoutRef = useRef(null);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Hostels", href: "/hostels" },
    { name: "Marketplace", href: "/marketplace" },
    { name: "Lost & Found", href: "/lost-found" },
    { name: "Resources", href: "/resource" },
    { name: "Eateries", href: "/eatries" },
    { name: "Ride Share", href: "/rides" },
    { name: "Contact", href: "/contact" },
  ];

  // Define main links based on authentication status
  const mainLinks = isAuthenticated
    ? [
        { name: "Home", path: "/", icon: HiHome },
        { name: "Lost & Found", path: "/lost-found", icon: HiSearch },
        { name: "Buy & Sell", path: "/marketplace", icon: HiShoppingBag },
        { name: "Profile", path: "/profile", icon: HiUser },
      ]
    : [{ name: "Home", path: "/", icon: HiHome }];

  const handleLogoutClick = async () => {
    try {
      await dispatch(handleLogout()).unwrap();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    dispatch(getAllHostels());
    return () => {
      if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
    };
  }, [dispatch]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* Desktop Trigger Area - visible on all screen sizes */}
      <div
        className="fixed top-0 left-0 w-full h-8 z-50"
        onMouseEnter={() => setIsVisible(true)}
      />

      {/* Mobile Menu Button - visible on all screen sizes */}
      <div className="fixed top-4 right-4 z-50 sm:hidden">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-full bg-purple-500/20 backdrop-blur-sm border border-purple-500/30"
        >
          <HiMenu className="w-6 h-6 text-white" />
        </motion.button>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 30 }}
            className="fixed inset-0 z-40 sm:hidden"
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-lg">
              <div className="flex flex-col h-full py-20 px-6 overflow-y-auto">
                {mainLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className="flex items-center space-x-4 px-4 py-4 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                  >
                    <link.icon className="w-6 h-6" />
                    <span>{link.name}</span>
                  </Link>
                ))}
                {isAuthenticated && hostels.length > 0 && (
                  <>
                    {/* Mobile Hostels Section - Dynamic from Redux */}
                    <div className="mt-4 border-t border-white/10 pt-4">
                      <div className="px-4 py-2 text-sm text-gray-400">
                        Hostels
                      </div>
                      {hostels.map((hostel) => (
                        <Link
                          key={hostel.hostel_id}
                          to={`/hostels/${hostel.hostel_id}`}
                          className="flex items-center space-x-4 px-4 py-4 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                        >
                          <HiOfficeBuilding className="w-6 h-6" />
                          <div>
                            <div>{hostel.hostel_name}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </>
                )}
                <div className="mt-auto">
                  {isAuthenticated ? (
                    <button
                      onClick={handleLogoutClick}
                      className="flex items-center space-x-4 w-full px-4 py-4 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors"
                    >
                      <HiLogout className="w-6 h-6" />
                      <span>Logout</span>
                    </button>
                  ) : (
                    <Link
                      to="/login"
                      className="flex items-center space-x-4 w-full px-4 py-4 text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 rounded-xl transition-colors"
                    >
                      <HiLogin className="w-6 h-6" />
                      <span>Login</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Navigation - now responsive for all screen sizes */}
      <AnimatePresence>
        {isVisible && (
          <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl mx-auto z-50 hidden sm:block"
            onMouseLeave={() => {
              showTimeoutRef.current = setTimeout(() => {
                setIsVisible(false);
              }, 300);
            }}
            onMouseEnter={() => {
              if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
            }}
          >
            <div className="relative rounded-2xl overflow-visible bg-black/30 backdrop-blur-xl border border-white/10 shadow-2xl shadow-purple-500/10">
              <div className="max-w-7xl mx-auto px-4 lg:px-6">
                <div className="flex items-center justify-between h-16">
                  <Link
                    to="/"
                    className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent"
                  >
                    CampusBeacon
                  </Link>
                  <div className="flex items-center space-x-4 md:space-x-8 text-sm md:text-base">
                    {mainLinks.map((link) => (
                      <Link
                        key={link.name}
                        to={link.path}
                        className="flex items-center space-x-1 md:space-x-2 text-gray-300 hover:text-white transition-colors relative group"
                      >
                        <link.icon className="w-4 h-4 md:w-5 md:h-5" />
                        <span>{link.name}</span>
                        <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform" />
                      </Link>
                    ))}
                    {isAuthenticated && hostels.length > 0 && (
                      <>
                        {/* Updated Hostel Dropdown - Dynamic from Redux */}
                        <div className="relative group">
                          <button
                            className="flex items-center space-x-1 md:space-x-2 text-gray-300 hover:text-white transition-colors relative group"
                            onMouseEnter={() => setShowHostelMenu(true)}
                          >
                            <Building className="w-4 h-4 md:w-5 md:h-5" />
                            <span>Hostels</span>
                            <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform" />
                          </button>

                          <div
                            className="absolute left-0 pt-2"
                            onMouseLeave={() => setShowHostelMenu(false)}
                          >
                            <AnimatePresence>
                              {showHostelMenu && (
                                <motion.div
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: 10 }}
                                  className="w-64 bg-black/70 backdrop-blur-xl rounded-xl overflow-hidden border border-white/10"
                                >
                                  {hostels.map((hostel) => (
                                    <Link
                                      key={hostel.hostel_id}
                                      to={`/hostels/${hostel.hostel_id}`}
                                      className="block px-4 py-3 text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                                    >
                                      <div className="font-medium">
                                        {hostel.hostel_name}
                                      </div>
                                    </Link>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </>
                    )}
                    {isAuthenticated ? (
                      <button
                        onClick={handleLogoutClick}
                        className="flex items-center space-x-1 md:space-x-2 text-gray-300 hover:text-white transition-colors relative group"
                      >
                        <HiLogout className="w-4 h-4 md:w-5 md:h-5" />
                        <span>Logout</span>
                        <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform" />
                      </button>
                    ) : (
                      <Link
                        to="/login"
                        className="flex items-center space-x-1 md:space-x-2 text-gray-300 hover:text-white transition-colors relative group"
                      >
                        <HiLogin className="w-4 h-4 md:w-5 md:h-5" />
                        <span>Login</span>
                        <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform" />
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
