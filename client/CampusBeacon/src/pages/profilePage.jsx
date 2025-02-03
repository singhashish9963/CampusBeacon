import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Book, Hash, Star, Pencil } from "lucide-react";
import Profile from "../components/ProfilePage/profileCard"; //importing profile card
import Achievements from "../components/ProfilePage/achievements"; //importing dummy achievements
import { useProfile } from "../contexts/profileContext";

const ProfilePage = () => {
  const {
    user,
    loading,
    error,
    isEditing,
    setIsEditing,
    editProfile
  }=useProfile()
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      //If the user did not change the data return the previous data
      ...prevData,
      [name]: value,
    }));
  };
  const handleSubmit = async () => {
    try {
      await editProfile({
       
        name: userData.name,
        branch: userData.branch,
        graduation_year: userData.graduation_year, 
        registration_number: userData.registration_number,
        semester: userData.semester,
        hostel:userData.hostel,
      });
    } catch (err) {
      console.error("Error updating profile:", err);
    }
    const toggleEditMode = () => {
      setIsEditing(!isEditing);
    };
  };
  if(loading){
    return <div>Loading...</div>
  }
  if(error){
    return <div>Error: {error}</div>
  }

  {
    /*Use state for storing dummy user data to display */
  }
  const [userData, setUserData] = useState({
    name: "Ayush Agarwal",
    email: "ayush@mnnit.ac.in",
    phone: "+91 777 777 7777",
    branch: "Electronics and Communication",
    year: "1st Year",
    registrationNumber: "20244047",
    semester: "2nd Semester",
  });

  {
    /*Use state for storing dummy user stats to display */
  }
  const stats = [
    { label: "Attendance", value: "87%", icon: Calendar },
    { label: "Semester", value: userData.semester, icon: Book },
    { label: "Semester Credits", value: "21", icon: Star },
    { label: "Registration", value: userData.registrationNumber, icon: Hash },
  ];

  return (
    // Defining main div to return
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-950 via-violet-900 to-fuchsia-800 py-20 px-4 overflow-hidden">
      <motion.div
        className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2, type: "spring" }} //adding delay and spring effect for displaying the main div
      />
      {/* Defining more motion */}
      <motion.div
        className="hidden md:block absolute left-0 top-1/3 w-48 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50"
        initial={{ x: -200, opacity: 0 }}
        animate={{ x: 0, opacity: 0.33 }}
        transition={{ duration: 2 }}
      />
      <motion.div
        className="max-w-6xl mx-auto bg-black/30 backdrop-blur-xl rounded-2xl p-12 relative"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Profile Section */}
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
                  <h1 className="text-5xl font-bold text-white mb-2">
                    {" "}
                    {/*Displaying name*/}
                    {userData.name}
                  </h1>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {" "}
                {/*Defining grid on right of name */}
                <Profile vals={userData.branch} header="Branch" />
                <Profile vals={userData.year} header="Graduation Year " />
              </div>
            </div>

            {/* Stats Section */}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
              {" "}
              {/*Defining grid for stats section */}
              {stats.map((stat) => (
                <motion.div
                  key={stat.label}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/5 rounded-xl p-6 text-center relative group w-60"
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

            {/* Achievements Sections */}
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
                {" "}
                {/*Defining grid for achievements section */}
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
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
