import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FiHome,
  FiBell,
  FiHome as FiBuilding,
  FiMenu,
  FiTruck,
  FiShoppingBag,
  FiLogOut,
} from "react-icons/fi";
import NotificationsAdmin from "../../components/admin/NotificationsAdmin";
import AdminDashboard from "../../components/admin/AdminDashboard";

// Placeholder components with improved styling
const HostelAdmin = () => (
  <div className="p-4 md:p-6 animate-fadeIn">
    <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600">
      Manage Hostels
    </h2>
    <div className="bg-gray-800 bg-opacity-50 p-4 md:p-8 rounded-xl shadow-lg border border-gray-700">
      <p className="text-gray-300">Hostel management interface coming soon.</p>
    </div>
  </div>
);

const MenuAdmin = () => (
  <div className="p-4 md:p-6 animate-fadeIn">
    <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600">
      Update Menus
    </h2>
    <div className="bg-gray-800 bg-opacity-50 p-4 md:p-8 rounded-xl shadow-lg border border-gray-700">
      <p className="text-gray-300">Menu management interface coming soon.</p>
    </div>
  </div>
);

const RidesAdmin = () => (
  <div className="p-4 md:p-6 animate-fadeIn">
    <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600">
      Manage Rides
    </h2>
    <div className="bg-gray-800 bg-opacity-50 p-4 md:p-8 rounded-xl shadow-lg border border-gray-700">
      <p className="text-gray-300">Ride management interface coming soon.</p>
    </div>
  </div>
);

const BuyAndSellAdmin = () => (
  <div className="p-4 md:p-6 animate-fadeIn">
    <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600">
      Manage Buy & Sell
    </h2>
    <div className="bg-gray-800 bg-opacity-50 p-4 md:p-8 rounded-xl shadow-lg border border-gray-700">
      <p className="text-gray-300">
        Buy & Sell management interface coming soon.
      </p>
    </div>
  </div>
);

const AdminPanel = () => {
  const [activePage, setActivePage] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // Set sidebar state based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Set initial state

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <AdminDashboard />;
      case "notifications":
        return <NotificationsAdmin />;
      case "hostels":
        return <HostelAdmin />;
      case "menus":
        return <MenuAdmin />;
      case "rides":
        return <RidesAdmin />;
      case "buysell":
        return <BuyAndSellAdmin />;
      default:
        return <AdminDashboard />;
    }
  };

  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <FiHome className="mr-3" size={20} />,
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: <FiBell className="mr-3" size={20} />,
    },
    {
      id: "hostels",
      label: "Hostels",
      icon: <FiBuilding className="mr-3" size={20} />,
    },
    {
      id: "menus",
      label: "Menus",
      icon: <FiMenu className="mr-3" size={20} />,
    },
    {
      id: "rides",
      label: "Rides",
      icon: <FiTruck className="mr-3" size={20} />,
    },
    {
      id: "buysell",
      label: "Buy & Sell",
      icon: <FiShoppingBag className="mr-3" size={20} />,
    },
  ];


  return (
    <div className="flex h-screen bg-gradient-to-b from-[#0B1026] to-[#1A1B35] text-white overflow-hidden">
      {/* Mobile menu toggle button - fixed position with better visibility */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-gray-800 p-2 rounded-md shadow-lg flex items-center justify-center"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label="Toggle menu"
      >
        {isSidebarOpen ? (
          <svg
            className="w-6 h-6 text-amber-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        ) : (
          <svg
            className="w-6 h-6 text-amber-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        )}
      </button>

      {/* Improved sidebar with better mobile handling */}
      <div
        className={`fixed inset-y-0 left-0 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out z-30 flex flex-col bg-gray-800 shadow-2xl ${
          isSidebarOpen ? "w-64" : "w-0 md:w-20"
        } md:relative`}
      >
        <div className="p-4 md:p-6 flex items-center justify-center">
          <h2
            className={`text-xl md:text-2xl font-bold mb-0 transition-opacity duration-300 ${
              !isSidebarOpen && "md:opacity-0 md:h-0 sm:h-0 "
            }`}
          >
            Admin Panel
          </h2>
          {!isSidebarOpen && (
            <div className="hidden md:block">
              <svg
                className="w-8 h-8 text-amber-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
          )}
        </div>

        <nav className="flex-grow overflow-y-auto px-2 md:px-4 py-2">
          <ul className="space-y-1 md:space-y-2">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => {
                    setActivePage(item.id);
                    if (window.innerWidth < 768) setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center text-left px-3 py-2 md:py-3 rounded-lg transition-all duration-200 ease-in-out ${
                    activePage === item.id
                      ? "bg-amber-500 text-gray-900 font-semibold shadow-md"
                      : "hover:bg-gray-700 hover:text-amber-400"
                  }`}
                >
                  <div className="flex items-center">
                    {item.icon}
                    <span
                      className={`whitespace-nowrap transition-opacity duration-300 ${
                        !isSidebarOpen && "md:hidden"
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Backdrop for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main content area with padding adjustment for mobile menu button */}
      <main
        className="flex-1 overflow-y-auto transition-all duration-300 pt-14 md:pt-0"
        key={activePage}
      >
        <div className="min-h-full">{renderPage()}</div>
      </main>
    </div>
  );
};

export default AdminPanel;
