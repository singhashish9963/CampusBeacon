import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Book, Hash, Star } from "lucide-react";
import Profile from "../components/ProfilePage/profileCard";

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

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-15">
                  {stats.map((stat) =>(
                    <motion.div 
                    key={stat.label}
                    whileHover={{scale:1.1}}
                    class
                    ></motion.div>

                  ))}
                )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
