import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Book, Hash, Star, Edit } from "lucide-react";
import Profile from "../components/ProfilePage/profileCard";
import Achievements from "../components/ProfilePage/achievements";
import { useProfile } from "../contexts/profileContext";
import LoadingScreen from "../components/LoadingScreen";

const ProfilePage = () => {
  const { user, loading, error, updateUser, getUser } = useProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: user?.name || "Name",
    email: user?.email || "Email",
    branch: user?.branch || "Branch",
    registration_number: user?.registration_number || "Registration Number",
    semester: user?.semester || "Semester",
    graduation_year: user?.graduation_year || "2025",
  });


  useEffect(() => {
    if (user) {
      setUserData({
        name: user.name || "Name",
        email: user.email || "Email",
        branch: user.branch || "Branch",
        registration_number: user.registration_number || "Registration Number",
        semester: user.semester || "Semester",
        graduation_year: user.graduation_year || "2025",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      await updateUser({
        name: userData.name.trim() === "" ? user?.name : userData.name,
        branch: userData.branch.trim() === "" ? user?.branch : userData.branch,
        graduation_year:
          userData.graduation_year === ""
            ? user?.graduation_year
            : userData.graduation_year,
        registration_number:
          userData.registration_number &&
          userData.registration_number.trim() === ""
            ? user?.registration_number
            : userData.registration_number,
        semester:
          userData.semester.trim() === "" ? user?.semester : userData.semester,
      });
      await getUser();
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }

  const stats = [
    { label: "Attendance", value: "87%", icon: Calendar },
    { label: "Semester", value: userData.semester, icon: Book },
    { label: "Semester Credits", value: "21", icon: Star },
    { label: "Registration", value: userData.registration_number, icon: Hash },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-950 via-violet-900 to-fuchsia-800 py-20 px-4 overflow-hidden">
      <motion.div
        className="max-w-6xl mx-auto bg-black/30 backdrop-blur-xl rounded-2xl p-12 relative"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute top-4 right-4">
          <motion.button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg"
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
            <div className="flex justify-between items-start mb-8">
              <div className="w-full">
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={userData.name}
                    onChange={handleChange}
                    className="text-4xl font-bold text-white mb-2 bg-transparent border-b border-purple-400 focus:outline-none w-full"
                  />
                ) : (
                  <h1 className="text-5xl font-bold text-white mb-2">
                    {userData.name}
                  </h1>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      name="branch"
                      value={userData.branch}
                      onChange={handleChange}
                      placeholder="Branch"
                      className="bg-transparent border-b border-purple-400 focus:outline-none"
                    />
                    <input
                      type="text"
                      name="graduation_year"
                      value={userData.graduation_year}
                      onChange={handleChange}
                      placeholder="Graduation Year"
                      className="bg-transparent border-b border-purple-400 focus:outline-none"
                    />
                  </>
                ) : (
                  <>
                    <Profile vals={userData.branch} header="Branch" />
                    <Profile
                      vals={userData.graduation_year}
                      header="Graduation Year"
                    />
                  </>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
              {stats.map((stat) => (
                <motion.div
                  key={stat.label}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/5 rounded-xl p-6 text-center relative group w-60"
                >
                  <stat.icon className="w-6 h-6 text-purple-400 mx-auto mb-3" />
                  {stat.label !== "Semester Credits" &&
                  stat.label !== "Attendance" &&
                  isEditing ? (
                    <input
                      type="text"
                      name={
                        stat.label === "Registration"
                          ? "registration_number"
                          : "semester"
                      }
                      value={
                        userData[
                          stat.label === "Registration"
                            ? "registration_number"
                            : "semester"
                        ]
                      }
                      onChange={handleChange}
                      className="text-3xl font-bold text-purple-400 mb-2 bg-transparent border-b border-purple-400 focus:outline-none w-full text-center"
                    />
                  ) : (
                    <p className="text-3xl font-bold text-purple-400 mb-2">
                      {stat.value}
                    </p>
                  )}
                  <p className="text-gray-400">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {isEditing && (
              <div className="mt-6 flex justify-end">
                <motion.button
                  onClick={handleSubmit}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg"
                  whileHover={{ scale: 1.05 }}
                >
                  Save Changes
                </motion.button>
              </div>
            )}

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
