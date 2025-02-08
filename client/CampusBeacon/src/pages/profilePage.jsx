import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Book, Hash, Star, Edit, Home } from "lucide-react";
import Profile from "../components/ProfilePage/profileCard";
import Achievements from "../components/ProfilePage/achievements";
import { useProfile } from "../contexts/profileContext";
import LoadingScreen from "../components/LoadingScreen";

const ProfilePage = () => {
  const { user, loading, error, updateUser } = useProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    branch: user?.branch || "",
    registration_number: user?.registration_number || "",
    semester: user?.semester || "",
    graduation_year: user?.graduation_year || 2025,
    hostel: user?.hostel || "",
    attendance: "87%",
    semesterCredits: "21",
  });

  const branchOptions = [
    "Electronics and Communication Engineering",
    "Computer Science Engineering",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
    "Engineering and Computational Mechanics",
    "Chemical Engineering",
    "Material Engineering",
    "Production and Industrial Engineering",
    "Biotechnology",
  ];

  const semesterOptions = [
    "First",
    "Second",
    "Third",
    "Fourth",
    "Fifth",
    "Sixth",
    "Seventh",
    "Eighth",
  ];

  useEffect(() => {
    if (user) {
      setUserData({
        name: user.name || "",
        email: user.email || "",
        branch: user.branch || "",
        registration_number: user.registration_number || "",
        semester: user.semester || "",
        graduation_year: user.graduation_year || 2025,
        hostel: user.hostel || "",
        attendance: "87%",
        semesterCredits: "21",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const formData = {
        name: userData.name || user?.name || "",
        branch: userData.branch || user?.branch || "",
        graduation_year:
          userData.graduation_year || user?.graduation_year || 2025,
        registration_number:
          userData.registration_number || user?.registration_number || "",
        semester: userData.semester || user?.semester || "",
        hostel: userData.hostel || user?.hostel || "",
      };

      console.log("Submitting Data:", formData);
      await updateUser(formData);
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  if (loading) return <LoadingScreen />;
  if (error) return <div>Error: {error}</div>;

  const stats = [
    {
      label: "Attendance",
      value: userData.attendance,
      icon: Calendar,
      readonly: true,
    },
    { label: "Semester", value: userData.semester, icon: Book, isSelect: true },
    {
      label: "Semester Credits",
      value: userData.semesterCredits,
      icon: Star,
      readonly: true,
    },
    {
      label: "Registration",
      value: userData.registration_number,
      icon: Hash,
      name: "registration_number", // use proper key name
    },
    { label: "Hostel", value: userData.hostel, icon: Home },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-950 via-violet-900 to-fuchsia-800 py-20 px-4 overflow-hidden">
      <motion.div
        className="max-w-6xl mx-auto bg-black/30 backdrop-blur-xl rounded-2xl p-12 relative"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Edit Button */}
        <div className="absolute top-4 right-4">
          <motion.button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
            whileHover={{ scale: 1.05 }}
          >
            {isEditing ? (
              "Cancel"
            ) : (
              <>
                <Edit className="w-5 h-5" /> Edit Profile
              </>
            )}
          </motion.button>
        </div>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-12">
          <div className="flex-1 w-full">
            {/* Name and Main Info */}
            <div className="flex justify-between items-start mb-8">
              <div className="w-full">
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={userData.name}
                    onChange={handleChange}
                    placeholder="Name"
                    className="text-4xl font-bold text-white mb-2 bg-transparent border-b-2 border-purple-400 focus:outline-none w-full placeholder-gray-500"
                  />
                ) : (
                  <h1 className="text-5xl font-bold text-white mb-2">
                    {userData.name || "Name"}
                  </h1>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {isEditing ? (
                  <>
                    <select
                      name="branch"
                      value={userData.branch}
                      onChange={handleChange}
                      className="w-full bg-gray-800/50 text-white rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="" className="bg-gray-800">
                        Select Branch
                      </option>
                      {branchOptions.map((branch) => (
                        <option
                          key={branch}
                          value={branch}
                          className="bg-gray-800"
                        >
                          {branch}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      name="graduation_year"
                      value={userData.graduation_year}
                      onChange={handleChange}
                      min="2024"
                      max="2030"
                      className="w-full bg-transparent text-white border border-purple-400 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </>
                ) : (
                  <>
                    <Profile
                      vals={userData.branch || "Branch"}
                      header="Branch"
                    />
                    <Profile
                      vals={userData.graduation_year || "Graduation Year"}
                      header="Graduation Year"
                    />
                  </>
                )}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-12">
              {stats.map((stat) => (
                <motion.div
                  key={stat.label}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/5 rounded-xl p-6 text-center relative group hover:bg-white/10 transition-all"
                >
                  <stat.icon className="w-6 h-6 text-purple-400 mx-auto mb-3" />
                  {isEditing && !stat.readonly ? (
                    stat.isSelect ? (
                      <select
                        name="semester"
                        value={userData.semester}
                        onChange={handleChange}
                        className="w-full bg-gray-800/50 text-white text-xl font-bold rounded-lg p-2 text-center focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="" className="bg-gray-800">
                          Select Semester
                        </option>
                        {semesterOptions.map((sem) => (
                          <option key={sem} value={sem} className="bg-gray-800">
                            {sem}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        name={stat.name || stat.label.toLowerCase()}
                        value={userData[stat.name || stat.label.toLowerCase()]}
                        onChange={handleChange}
                        placeholder={stat.label}
                        className="w-full bg-transparent text-center text-purple-400 text-xl font-bold border-b border-purple-400 focus:outline-none"
                      />
                    )
                  ) : (
                    <p className="text-purple-400 text-xl font-bold mb-1">
                      {stat.value || stat.label}
                    </p>
                  )}
                  <p className="text-gray-400 mt-2">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Save Button */}
            {isEditing && (
              <div className="mt-6 flex justify-end">
                <motion.button
                  onClick={handleSubmit}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                  whileHover={{ scale: 1.05 }}
                >
                  Save Changes
                </motion.button>
              </div>
            )}

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
                {Array.isArray(Achievements) ? (
                  Achievements.map((achievement) => (
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
                  ))
                ) : (
                  <Achievements />
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
