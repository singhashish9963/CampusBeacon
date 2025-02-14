import React from "react";
import { motion } from "framer-motion";
import { LayoutDashboard, Calendar, Award, Settings } from "lucide-react";

const Navigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "calendar", label: "Calendar", icon: Calendar },
    { id: "achievements", label: "Achievements", icon: Award },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="flex justify-center mb-8">
      <div className="flex gap-2 p-1 bg-purple-900/30 rounded-lg backdrop-blur-sm">
        {tabs.map(({ id, label, icon: Icon }) => (
          <motion.button
            key={id}
            onClick={() => setActiveTab(id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
              activeTab === id
                ? "bg-purple-500 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default Navigation;
