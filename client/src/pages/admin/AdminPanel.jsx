import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import NotificationsAdmin from "../../components/admin/NotificationsAdmin";

const Dashboard = () => (
  <div className="p-6">
    <h1 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600">
      Welcome, God Mode Activated
    </h1>
    <p className="text-lg text-blue-400">
      This is your admin dashboard where you can control every part of the site.
    </p>
  </div>
);

const HostelAdmin = () => (
  <div className="p-6">
    <h2 className="text-2xl font-bold mb-2">Manage Hostels</h2>
  </div>
);
const MenuAdmin = () => (
  <div className="p-6">
    <h2 className="text-2xl font-bold mb-2">Update Menus</h2>
  </div>
);
const RidesAdmin = () => (
  <div className="p-6">
    <h2 className="text-2xl font-bold mb-2">Manage Rides</h2>
  </div>
);
const BuyAndSellAdmin = () => (
  <div className="p-6">
    <h2 className="text-2xl font-bold mb-2">Manage Buy & Sell</h2>
  </div>
);

const AdminPanel = () => {
  const [activePage, setActivePage] = useState("dashboard");
  const navigate = useNavigate();

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <Dashboard />;
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
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-b from-[#0B1026] to-[#1A1B35] text-white">
      <aside className="w-64 bg-gray-800 p-6 flex flex-col">
        <h2 className="text-2xl font-bold mb-6 flex-shrink-0">
          Admin Panel
        </h2>
        <nav className="flex-grow overflow-y-auto">
          <ul className="space-y-4">
            <li>
              <button
                onClick={() => setActivePage("dashboard")}
                className={`w-full text-left px-3 py-2 rounded-md text-lg transition-colors duration-200 ease-in-out ${
                  activePage === "dashboard"
                    ? "bg-amber-500 text-gray-900 font-semibold"
                    : "hover:bg-gray-700 hover:text-amber-400"
                }`}
              >
                Dashboard
              </button>
            </li>
            <li>
              <button
                onClick={() => setActivePage("notifications")}
                className={`w-full text-left px-3 py-2 rounded-md text-lg transition-colors duration-200 ease-in-out ${
                  activePage === "notifications"
                    ? "bg-amber-500 text-gray-900 font-semibold"
                    : "hover:bg-gray-700 hover:text-amber-400"
                }`}
              >
                Notifications
              </button>
            </li>
            <li>
              <button
                onClick={() => setActivePage("hostels")}
                className={`w-full text-left px-3 py-2 rounded-md text-lg transition-colors duration-200 ease-in-out ${
                  activePage === "hostels"
                    ? "bg-amber-500 text-gray-900 font-semibold"
                    : "hover:bg-gray-700 hover:text-amber-400"
                }`}
              >
                Hostels
              </button>
            </li>
            <li>
              <button
                onClick={() => setActivePage("menus")}
                className={`w-full text-left px-3 py-2 rounded-md text-lg transition-colors duration-200 ease-in-out ${
                  activePage === "menus"
                    ? "bg-amber-500 text-gray-900 font-semibold"
                    : "hover:bg-gray-700 hover:text-amber-400"
                }`}
              >
                Menus
              </button>
            </li>
            <li>
              <button
                onClick={() => setActivePage("rides")}
                className={`w-full text-left px-3 py-2 rounded-md text-lg transition-colors duration-200 ease-in-out ${
                  activePage === "rides"
                    ? "bg-amber-500 text-gray-900 font-semibold"
                    : "hover:bg-gray-700 hover:text-amber-400"
                }`}
              >
                Rides
              </button>
            </li>
            <li>
              <button
                onClick={() => setActivePage("buysell")}
                className={`w-full text-left px-3 py-2 rounded-md text-lg transition-colors duration-200 ease-in-out ${
                  activePage === "buysell"
                    ? "bg-amber-500 text-gray-900 font-semibold"
                    : "hover:bg-gray-700 hover:text-amber-400"
                }`}
              >
                Buy & Sell
              </button>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto p-6" key={activePage}>
        {renderPage()}
      </main>
    </div>
  );
};

export default AdminPanel;
