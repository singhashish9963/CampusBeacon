// ProfilePage.js
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Book, Hash, Star, Pencil } from "lucide-react";
import Profile from "../components/ProfilePage/profileCard";
import Achievements from "../components/ProfilePage/achievements";
import { useProfile } from "../contexts/profileContext"; // Adjust the path as needed

const ProfilePage = () => {
  // Get profile data and update function from our ProfileContext
  const { profile, updateProfile, loading, error } = useProfile();

  // Local state to control edit mode; you may expand this later for more fields
  const [isEditing, setIsEditing] = useState(false);
  const [localProfile, setLocalProfile] = useState(null);

  // When profile loads from context, initialize localProfile
  React.useEffect(() => {
    if (profile) {
      setLocalProfile(profile);
    }
  }, [profile]);

  // Handle form input changes during edit mode
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalProfile((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Example stats array based on the profile data
  const stats = [
    { label: "Attendance", value: "99%", icon: Calendar },
    { label: "Semester", value: localProfile?.semester || "", icon: Book },
    { label: "Semester Credits", value: "20", icon: Star }, // Example value for credits
    {
      label: "Registration",
      value: localProfile?.registrationNumber || "",
      icon: Hash,
    },
  ];

  // Handle saving the updates by calling the updateProfile function from context
  const handleSave = async () => {
    try {
      await updateProfile(localProfile);
      setIsEditing(false);
    } catch (err) {
      // You can implement additional error handling or toast messages here
      console.error(err);
    }
  };

  // When data is still loading from the API
  if (loading || !localProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  // Render error state if there is an error
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-950 via-violet-900 to-fuchsia-800 py-20 px-4 overflow-hidden">
      <motion.div
        className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2, type: "spring" }}
      />
      <motion.div
        className="hidden md:block absolute left-0 top-1/3 w-48 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50"
        initial={{ x: -200, opacity: 0 }}
        animate={{ x: 0, opacity: 0.33 }}
        transition={{ duration: 2 }}
      />
      <motion.div
        className="hidden md:block absolute right-0 top-1/3 w-48 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50"
        initial={{ x: 200, opacity: 0 }}
        animate={{ x: 0, opacity: 0.33 }}
        transition={{ duration: 2 }}
      />
      <motion.div
        className="max-w-6xl mx-auto bg-black/30 backdrop-blur-xl rounded-2xl p-12 relative"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="flex flex-col md:flex-row items-center md:items-start gap-12">
          <div className="flex-1 w-full">
            <div className="flex justify-between items-start mb-8">
              <div>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={localProfile.name}
                    onChange={handleChange}
                    className="text-4xl font-bold text-white mb-2 bg-transparent border-b border-purple-400 focus:outline-none"
                  />
                ) : (
                  <h1 className="text-5xl font-bold text-white mb-2">
                    {localProfile.name}
                  </h1>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Profile vals={localProfile.branch} header="Branch" />
                <Profile vals={localProfile.year} header="Year" />
                <Profile vals={localProfile.semester} header="Semester" />
              </div>
            </div>
            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
              {stats.map((stat) => (
                <motion.div
                  key={stat.label}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/5 rounded-xl p-6 text-center relative group w-60"
                >
                  <motion.button
                    className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                    whileHover={{ scale: 1.1 }}
                    // For example, if you want to toggle editing for a particular field
                    onClick={() => setIsEditing(true)}
                  >
                    <Pencil className="w-5 h-5 text-purple-400" />
                  </motion.button>
                  <stat.icon className="w-6 h-6 text-purple-400 mx-auto mb-3" />
                  <p className="text-3xl font-bold text-purple-400 mb-2">
                    {stat.value}
                  </p>
                  <p className="text-gray-400">{stat.label}</p>
                </motion.div>
              ))}
            </div>
            {/* Achievements Section */}
            <motion.div
              className="mt-12 border-t border-white/10 pt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-3xl font-bold text-white mb-6">
                Achievements
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Achievements.map((achievement) => (
                  <motion.div
                    key={achievement.title}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white/5 rounded-xl p-6 hover:bg-white/10 transition-all"
                  >
                    <achievement.icon className="w-8 h-8 text-purple-400 mb-4" />
                    <h3 className="text-xl font-semibold text-purple-400 mb-2">
                      {achievement.title}
                    </h3>
                    <p className="text-gray-400">{achievement.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            {/* Save Button when Editing */}
            {isEditing && (
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleSave}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
