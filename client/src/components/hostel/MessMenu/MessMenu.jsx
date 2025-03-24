import React, { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  HiOutlineCalendar,
  HiPencil,
  HiTrash,
  HiViewList,
} from "react-icons/hi";
import {
  createMenu,
  updateMenuMeal,
  deleteMenuMeal,
} from "../../../slices/hostelSlice";

const MessMenu = ({ hostelId }) => {
  const dispatch = useDispatch();
  const { menus, loading, errors } = useSelector((state) => state.hostel);
  const { user, roles } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [editingDay, setEditingDay] = useState(null);
  const [showAllMenus, setShowAllMenus] = useState(false);
  const [formData, setFormData] = useState({
    day: "",
    breakfast: "",
    lunch: "",
    snacks: "",
    dinner: "",
  });

  const isAdmin = roles.includes("admin");
  const isHostelPresident = roles.includes("hostel_president");

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // Get today's menu
  const today = useMemo(() => {
    const dayIndex = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
    return days[dayIndex];
  }, []);

  // Filter menus based on showAllMenus flag
  const hostelMenus = useMemo(() => {
    const allMenus = menus[hostelId] || [];
    if (!showAllMenus) {
      return allMenus.filter((menu) => menu.day === today);
    }
    return allMenus;
  }, [menus, hostelId, showAllMenus, today]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.day) {
      console.error("Day is required");
      return;
    }
    try {
      await dispatch(
        createMenu({
          hostel_id: hostelId,
          ...formData,
        })
      ).unwrap();
      setFormData({
        day: "",
        breakfast: "",
        lunch: "",
        snacks: "",
        dinner: "",
      });
      setIsEditing(false);
      setEditingDay(null);
    } catch (error) {
      console.error("Error saving menu:", error);
    }
  };

  const handleEdit = (day) => {
    setEditingDay(day);
    const menu = (menus[hostelId] || []).find((m) => m.day === day);
    if (menu) {
      setFormData({
        day: menu.day,
        breakfast: menu.breakfast || "",
        lunch: menu.lunch || "",
        snacks: menu.snacks || "",
        dinner: menu.dinner || "",
      });
    }
    setIsEditing(true);
  };

  const handleUpdateMeal = async (day, meal, newValue) => {
    try {
      await dispatch(
        updateMenuMeal({
          hostelId,
          day,
          meal,
          data: { newMeal: newValue },
        })
      ).unwrap();
    } catch (error) {
      console.error("Error updating meal:", error);
    }
  };

  const handleDeleteMeal = async (day, meal) => {
    try {
      await dispatch(
        deleteMenuMeal({
          hostelId,
          day,
          meal,
        })
      ).unwrap();
    } catch (error) {
      console.error("Error deleting meal:", error);
    }
  };

  const handleCancel = () => {
    setFormData({
      day: "",
      breakfast: "",
      lunch: "",
      snacks: "",
      dinner: "",
    });
    setIsEditing(false);
    setEditingDay(null);
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-700 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black/30 backdrop-blur-xl rounded-xl p-6 border border-white/10"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <HiOutlineCalendar className="w-6 h-6 text-purple-400" />
          <h2 className="text-xl font-semibold text-white">
            {showAllMenus ? "Weekly Mess Menu" : "Today's Menu"}
          </h2>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowAllMenus(!showAllMenus)}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg transition-colors"
          >
            <HiViewList className="w-5 h-5" />
            <span>{showAllMenus ? "Show Today's Menu" : "View All Menus"}</span>
          </button>
          {(isAdmin || isHostelPresident) && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg transition-colors"
            >
              <HiOutlineCalendar className="w-5 h-5" />
              <span>Add Menu</span>
            </button>
          )}
        </div>
      </div>

      {(isAdmin || isHostelPresident) && (isEditing || editingDay) && (
        <form onSubmit={handleSubmit} className="mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Day
              </label>
              <select
                value={formData.day}
                onChange={(e) =>
                  setFormData({ ...formData, day: e.target.value })
                }
                className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              >
                <option value="">Select Day</option>
                {days.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Breakfast
              </label>
              <input
                type="text"
                value={formData.breakfast}
                onChange={(e) =>
                  setFormData({ ...formData, breakfast: e.target.value })
                }
                className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Lunch
              </label>
              <input
                type="text"
                value={formData.lunch}
                onChange={(e) =>
                  setFormData({ ...formData, lunch: e.target.value })
                }
                className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Snacks
              </label>
              <input
                type="text"
                value={formData.snacks}
                onChange={(e) =>
                  setFormData({ ...formData, snacks: e.target.value })
                }
                className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Dinner
              </label>
              <input
                type="text"
                value={formData.dinner}
                onChange={(e) =>
                  setFormData({ ...formData, dinner: e.target.value })
                }
                className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              {editingDay ? "Update Menu" : "Add Menu"}
            </button>
          </div>
        </form>
      )}

      {errors?.menu && (
        <div className="mb-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400">
          {errors.menu}
        </div>
      )}

      <div className="space-y-6">
        {!showAllMenus && hostelMenus.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-400">
              No menu available for today ({today})
            </p>
          </div>
        )}
        {showAllMenus && hostelMenus.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-400">No menus available for this week</p>
          </div>
        )}
        {hostelMenus.map((menu) => (
          <div
            key={menu.day}
            className="bg-black/20 rounded-lg p-4 border border-white/5"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-white">
                {menu.day}{" "}
                {!showAllMenus && (
                  <span className="text-purple-400">(Today)</span>
                )}
              </h3>
              {(isAdmin || isHostelPresident) && (
                <button
                  onClick={() => handleEdit(menu.day)}
                  className="text-purple-400 hover:text-purple-300"
                >
                  <HiPencil className="w-5 h-5" />
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {menu.breakfast && (
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-1">
                    Breakfast
                  </h4>
                  <p className="text-white">{menu.breakfast}</p>
                </div>
              )}
              {menu.lunch && (
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-1">
                    Lunch
                  </h4>
                  <p className="text-white">{menu.lunch}</p>
                </div>
              )}
              {menu.snacks && (
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-1">
                    Snacks
                  </h4>
                  <p className="text-white">{menu.snacks}</p>
                </div>
              )}
              {menu.dinner && (
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-1">
                    Dinner
                  </h4>
                  <p className="text-white">{menu.dinner}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default MessMenu;
