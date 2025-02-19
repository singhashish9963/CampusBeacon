import React, { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Shield, Clock, Download, Mail } from "lucide-react";

const SettingsView = ({ subjects, setSubjects }) => {
  const [notificationSettings, setNotificationSettings] = useState({
    dailyReminders: true,
    achievementAlerts: true,
    lowAttendanceWarnings: true,
    emailNotifications: false,
  });

  const [backupFrequency, setBackupFrequency] = useState("weekly");

  const toggleSetting = (setting) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  return (
    <motion.div
      key="settings"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Notification Settings */}
      <div className="bg-gradient-to-br from-purple-900/50 to-fuchsia-900/50 rounded-xl border border-purple-500/30 p-6">
        <h3 className="text-white font-semibold mb-4">Notification Settings</h3>
        <div className="space-y-4">
          {[
            { key: "dailyReminders", label: "Daily Reminders", icon: Clock },
            {
              key: "achievementAlerts",
              label: "Achievement Alerts",
              icon: Bell,
            },
            {
              key: "lowAttendanceWarnings",
              label: "Low Attendance Warnings",
              icon: Shield,
            },
            {
              key: "emailNotifications",
              label: "Email Notifications",
              icon: Mail,
            },
          ].map(({ key, label, icon: Icon }) => (
            <div key={key} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Icon className="text-purple-400 w-5 h-5" />
                <span className="text-gray-300">{label}</span>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleSetting(key)}
                className={`w-12 h-6 ${
                  notificationSettings[key]
                    ? "bg-purple-500"
                    : "bg-purple-500/20"
                } rounded-full relative transition-colors duration-200`}
              >
                <motion.div
                  layout
                  className={`w-5 h-5 bg-white rounded-full absolute top-0.5 ${
                    notificationSettings[key] ? "right-0.5" : "left-0.5"
                  }`}
                />
              </motion.button>
            </div>
          ))}
        </div>
      </div>

      {/* Attendance Goals */}
      <div className="bg-gradient-to-br from-purple-900/50 to-fuchsia-900/50 rounded-xl border border-purple-500/30 p-6">
        <h3 className="text-white font-semibold mb-4">Attendance Goals</h3>
        <div className="space-y-4">
          {subjects.map((subject) => (
            <div key={subject.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{subject.icon}</span>
                <span className="text-gray-300">{subject.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={subject.goal}
                  onChange={(e) => {
                    const newVal = Math.min(
                      100,
                      Math.max(0, parseInt(e.target.value) || 0)
                    );
                    setSubjects((prev) =>
                      prev.map((s) =>
                        s.id === subject.id ? { ...s, goal: newVal } : s
                      )
                    );
                  }}
                  className="w-16 bg-purple-500/20 border border-purple-500/30 rounded px-2 py-1 text-white"
                />
                <span className="text-gray-400">%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-gradient-to-br from-purple-900/50 to-fuchsia-900/50 rounded-xl border border-purple-500/30 p-6">
        <h3 className="text-white font-semibold mb-4">Data Management</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Download className="text-purple-400 w-5 h-5" />
              <span className="text-gray-300">Backup Frequency</span>
            </div>
            <select
              value={backupFrequency}
              onChange={(e) => setBackupFrequency(e.target.value)}
              className="bg-purple-500/20 border border-purple-500/30 rounded px-3 py-1 text-white"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <div className="pt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition-colors"
            >
              Export Attendance Data
            </motion.button>
          </div>
        </div>
      </div>

      {/* Current Time and User Info */}
      <div className="text-center text-gray-400 text-sm mt-6">
        <p>Current Time (UTC): 2025-02-13 13:47:47</p>
        <p>User: ayush-jadaun</p>
      </div>
    </motion.div>
  );
};

export default SettingsView;
