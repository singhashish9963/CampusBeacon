import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Book,
  Hash,
  Star,
  Edit,
  Home,
  Award,
  AlertCircle,
  Save,
  X,
  Check,
} from "lucide-react";
import Profile from "../../components/ProfilePage/profileCard";
import Achievements from "../../components/ProfilePage/achievements";
import LoadingScreen from "../../components/LoadingScreen";
import { useDispatch, useSelector } from "react-redux";
import {
  updateUser,
  setIsEditing,
  clearError,
  getUser,
} from "../../slices/profileSlice";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user, isEditing, loading, error } = useSelector(
    (state) => state.profile
  );
  const [notification, setNotification] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    branch: "",
    semester: "",
    graduation_year: 2025,
    hostel: "",
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

  const hostelOptions = [
    "SVBH",
    "DGJH",
    "Tilak",
    "Malviya",
    "Patel",
    "Tandon",
    "PG",
  ];

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      const newUserData = {
        name: user.name || "",
        email: user.email || "",
        branch: user.branch || "",
        semester: user.semester || "",
        graduation_year: user.graduation_year || 2025,
        hostel: user.hostel || "",
        attendance: "87%",
        semesterCredits: "21",
      };
      setUserData(newUserData);
      setOriginalData(newUserData);
    }
  }, [user]);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    setUserData(originalData);
    dispatch(setIsEditing(false));
  };

  const handleSubmit = async () => {
    try {
      const formData = {
        name: userData.name,
        branch: userData.branch,
        semester: userData.semester,
        hostel: userData.hostel,
      };

      await dispatch(updateUser(formData)).unwrap();
      dispatch(setIsEditing(false));
      showNotification("Profile updated successfully!");
      setOriginalData(userData);
    } catch (err) {
      showNotification("Error updating profile", "error");
      console.error("Error updating profile:", err);
    }
  };

  if (loading) return <LoadingScreen />;
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-violet-900 to-fuchsia-800">
        <div className="bg-red-500/10 text-red-500 p-4 rounded-lg flex items-center">
          <AlertCircle className="mr-2" />
          {error}
        </div>
      </div>
    );

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-violet-900 to-fuchsia-800">
        <div className="bg-red-500/10 text-red-500 p-4 rounded-lg flex items-center">
          <AlertCircle className="mr-2" />
          User not found.
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: "Attendance",
      value: userData.attendance,
      icon: Calendar,
      readonly: true,
      color: "text-green-400",
    },
    {
      label: "Semester",
      value: userData.semester,
      icon: Book,
      isSelect: true,
      color: "text-blue-400",
    },
    {
      label: "Semester Credits",
      value: userData.semesterCredits,
      icon: Star,
      readonly: true,
      color: "text-yellow-400",
    },
    {
      label: "Registration",
      value: user.registration_number,
      icon: Hash,
      name: "registration_number",
      readonly: true,
      color: "text-purple-400",
    },
    {
      label: "Hostel",
      value: userData.hostel,
      icon: Home,
      isSelect: true,
      options: hostelOptions,
      color: "text-pink-400",
    },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-950 via-violet-900 to-fuchsia-800 py-20 px-4 overflow-hidden">
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-2 ${
              notification.type === "error" ? "bg-red-500" : "bg-green-500"
            }`}
          >
            {notification.type === "error" ? (
              <AlertCircle size={20} className="text-white" />
            ) : (
              <Check size={20} className="text-white" />
            )}
            <span className="text-white">{notification.message}</span>
            <button
              onClick={() => setNotification(null)}
              className="ml-2 hover:text-gray-200"
            >
              <X size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="max-w-6xl mx-auto bg-black/30 backdrop-blur-xl rounded-2xl p-12 relative border border-white/10"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute top-4 right-4">
          <motion.button
            onClick={() =>
              isEditing ? handleCancel() : dispatch(setIsEditing(true))
            }
            className={`flex items-center gap-2 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-colors ${
              isEditing
                ? "bg-red-500 hover:bg-red-600 focus:ring-red-500"
                : "bg-purple-600 hover:bg-purple-700 focus:ring-purple-500"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isEditing ? (
              <>
                <X className="w-5 h-5" /> Cancel
              </>
            ) : (
              <>
                <Edit className="w-5 h-5" /> Edit Profile
              </>
            )}
          </motion.button>
        </div>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-12">
          <div className="flex-1 w-full">
            <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-8">
              <div className="w-full">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={userData.name}
                        onChange={handleChange}
                        placeholder="Your Name"
                        className="text-3xl font-bold text-white bg-transparent border-b-2 border-purple-400 focus:outline-none w-full placeholder-gray-500 transition-colors focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={userData.email}
                        disabled
                        className="w-full bg-gray-800/50 text-gray-400 rounded-lg p-5"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <h1 className="text-5xl pb-3 font-mono font-bold bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent mb-2">
                      {userData.name || "Name"}
                    </h1>
                    <p className="text-gray-400">{userData.email}</p>
                  </>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full md:w-auto">
                {isEditing ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Branch
                      </label>
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
                    </div>
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

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-12">
              {stats.map((stat) => (
                <motion.div
                  key={stat.label}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/5 rounded-xl p-6 text-center relative group hover:bg-white/10 transition-all border border-white/5"
                >
                  <stat.icon className={`w-6 h-6 ${stat.color} mx-auto mb-3`} />
                  {isEditing && !stat.readonly ? (
                    stat.isSelect ? (
                      <select
                        name={stat.name || stat.label.toLowerCase()}
                        value={userData[stat.name || stat.label.toLowerCase()]}
                        onChange={handleChange}
                        className="w-full bg-gray-800/50 text-white text-xl font-bold rounded-lg p-2 text-center focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="" className="bg-gray-800">
                          Select {stat.label}
                        </option>
                        {(stat.options || semesterOptions).map((option) => (
                          <option
                            key={option}
                            value={option}
                            className="bg-gray-800"
                          >
                            {option}
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
                    <p className={`${stat.color} text-xl font-bold mb-1`}>
                      {stat.value || stat.label}
                    </p>
                  )}
                  <p className="text-gray-400 mt-2">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {isEditing && (
              <motion.div
                className="mt-6 flex justify-end"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <motion.button
                  onClick={handleSubmit}
                  className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Save className="w-5 h-5" />
                  Save Changes
                </motion.button>
              </motion.div>
            )}

            <motion.div
              className="mt-12 border-t border-white/10 pt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent">
                  Achievements
                </h2>
                <Award className="text-purple-400 w-8 h-8" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Array.isArray(Achievements) ? (
                  Achievements.map((achievement) => (
                    <motion.div
                      key={achievement.title}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white/5 rounded-xl p-6 hover:bg-white/10 transition-all border border-white/5"
                    >
                      <achievement.icon className="w-8 h-8 text-purple-400 mb-4" />
                      <h3 className="text-xl font-semibold text-purple-400 mb-2">
                        {achievement.title}
                      </h3>
                      <p className="text-gray-400">{achievement.description}</p>
                      {achievement.date && (
                        <p className="text-sm text-gray-500 mt-2">
                          {new Date(achievement.date).toLocaleDateString()}
                        </p>
                      )}
                    </motion.div>
                  ))
                ) : (
                  <Achievements />
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-8 text-center text-sm text-gray-500"
            >
              Last updated: {new Date().toLocaleString()}
            </motion.div>
          </div>
        </div>

        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -left-1/4 -top-1/4 w-1/2 h-1/2 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute -right-1/4 -bottom-1/4 w-1/2 h-1/2 bg-blue-500/10 rounded-full blur-3xl" />
        </div>
      </motion.div>

      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 p-4 bg-gray-900/80 backdrop-blur-lg md:hidden"
          >
            <div className="flex gap-4">
              <motion.button
                onClick={handleCancel}
                className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white px-4 py-3 rounded-lg"
                whileTap={{ scale: 0.95 }}
              >
                <X className="w-5 h-5" />
                Cancel
              </motion.button>
              <motion.button
                onClick={handleSubmit}
                className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-3 rounded-lg"
                whileTap={{ scale: 0.95 }}
              >
                <Save className="w-5 h-5" />
                Save
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfilePage;
