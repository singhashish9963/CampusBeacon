import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Book, Hash, Star, Pencil } from "lucide-react";
import Profile from "../components/ProfilePage/profileCard";
import Achievements from "../components/ProfilePage/achievements";
const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const [userData, setUserData] = useState({
    name: "Ayush Agarwal",
    email: "ayush@mnnit.ac.in",
    phone: "+91 777 777 7777",
    branch: "Electronics and Communication",
    year: "1st Year",
    registrationNumber: "20BCE10001",
    semester: "2nd Semester",
  });

  const stats = [
    { label: "Attendance", value: "99%", icon: Calendar },
    { label: "Semester", value: userData.semester, icon: Book },
    { label: "Credits", value: userData.credits, icon: Star },
    { label: "Registration", value: userData.registrationNumber, icon: Hash },
  ];
  return (
    // Backgorund
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-950 via-violet-900 to-fuchsia-800 py-20 px-4 overflow-hidden">
      <motion.div
        className="absoulute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-40 amimate-pulse"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2, type: "spring" }}
      />

      <motion.div
        className="hidden md:block absolute left-0 top-1/3 w-48 bg-pink-500 rounded-full mix-blend-multiply fliter blur-3xl opacity-50"
        initial={{ x: -200, opactity: 0 }}
        animate={{ x: 0, opacity: 0.33 }}
        transition={{ duration: 2 }}
      />

      <motion.div
        className="hidden md:block absolute left-0 top-1/3 w-48 bg-pink-500 rounded-full mix-blend-multiply fliter blur-3xl opacity-50"
        initial={{ x: 200, opactity: 0 }}
        animate={{ x: 0, opacity: 0.33 }}
        transition={{ duration: 2 }}
      />

      {/* Profile Header Section */}
      <motion.div
        className="max-w-6xl mx-auto bg-black/30 backdrop-blur-xl rounded-2xl p-12 relative"
        inital={{ opacity: 0, scale: 0.95 }}
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
                    value={userData.name}
                    onChange={handleChange}
                    className="text-4xl font-bold text-white mb-2 bg-transparent border-b border-purple-400 focus:outline-none"
                  />
                ) : (
                  <h1 className="text-4xl font-bold text-white mb-2">
                    {userData.name}
                  </h1>
                )}
                <p className="text-purple-300 text-lg">
                  {userData.registrationNumber || "Registration Number N/A"}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Profile Cards */}
                <Profile vals={userData.branch} header="Branch" />
                <Profile vals={userData.year} header="Year" />
                <Profile vals={userData.semester} header="Semester" />

                {/* Stats Section */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
                  {stats.map((stat) => (
                    <motion.div
                      key={stat.label}
                      whileHover={{ scale: 1.05 }}
                      className="bg-white/5 rounded-xl p-6 text-center relative group"
                    >
                      <motion.button
                        className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                        whileHover={{ scale: 1.1 }}
                        onClick={handleChange}
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
                        key={Achievements.title}
                        whileHover={{ scale: 1.02 }}
                        className="bg-white/5 rounded-xl p-6 hover:bg-white/10 transition-all"
                      >
                        <achievement.icon className="w-8 h-8 text-purple-400 mb-4" />
                        <h3 className="text-xl font-semibold text-purple-400 mb-2">
                          {achievement.title}
                        </h3>
                        <p className="text-gray-400">
                          {Achievements.description}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
