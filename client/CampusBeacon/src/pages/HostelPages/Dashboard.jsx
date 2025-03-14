import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Utensils, Phone, Mail, Bell, Wrench, Plus, Edit, Trash } from "lucide-react";
import { FaUsersGear } from "react-icons/fa6";
import {
  useMenu,
  useOfficial,
  useNotifications,
  useComplaints,
} from "../../contexts/hostelContext";

const DAYS = [
  { value: "Monday", label: "Monday" },
  { value: "Tuesday", label: "Tuesday" },
  { value: "Wednesday", label: "Wednesday" },
  { value: "Thursday", label: "Thursday" },
  { value: "Friday", label: "Friday" },
  { value: "Saturday", label: "Saturday" },
  { value: "Sunday", label: "Sunday" },
];
const MEALS = [
  { value: "breakfast", label: "Breakfast" },
  { value: "lunch", label: "Lunch" },
  { value: "snacks", label: "Snacks" },
  { value: "dinner", label: "Dinner" },
];

const Dashboard = ({ hostelId = 1 }) => {
  // Forms State
  const [officialForm, setOfficialForm] = useState({
    name: "",
    designation: "",
    phone: "",
    email: "",
  });

  const [notificationForm, setNotificationForm] = useState({
    message: "",
    type: "info",
  });

const [menuForm, setMenuForm] = useState({
  day: DAYS[0].value,
  meal: MEALS[0].value,
  items: "",
});

  const [complaintForm, setComplaintForm] = useState({
    type: "",
    description: "",
    studentName: "",
    studentEmail: "",
    dueDate: new Date().toISOString().split("T")[0],
  });

  // Editing States
  const [editingOfficial, setEditingOfficial] = useState(null);
  const [editingNotification, setEditingNotification] = useState(null);

  // Context Hooks
  const {
    officials,
    createOfficial,
    editOfficial,
    deleteOfficial,
    fetchAllOfficials,
  } = useOfficial();
  const {
    notifications,
    createNotification,
    updateNotification,
    deleteNotification,
    fetchNotifications,
  } = useNotifications();
  const {
    menus,
    createMenu,
    updateMenuMeal,
    deleteMenuMeal,
    fetchMenuByHostel,
  } = useMenu();
  const { createComplaint } = useComplaints();

  // Load Data
  useEffect(() => {
    fetchAllOfficials();
    fetchNotifications();
    fetchMenuByHostel(hostelId);
  }, [hostelId]);

  // Form Handlers
  const handleOfficialSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingOfficial) {
        await editOfficial(editingOfficial.id, {
          ...officialForm,
          hostel_id: hostelId,
        });
        setEditingOfficial(null);
      } else {
        await createOfficial({ ...officialForm, hostel_id: hostelId });
      }
      setOfficialForm({
        name: "",
        designation: "",
        phone: "",
        email: "",
      });
    } catch (error) {
      console.error("Error handling official:", error);
    }
  };

  const handleNotificationSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingNotification) {
        await updateNotification(editingNotification.id, {
          ...notificationForm,
          hostel_id: hostelId,
        });
        setEditingNotification(null);
      } else {
        await createNotification({ ...notificationForm, hostel_id: hostelId });
      }
      setNotificationForm({
        message: "",
        type: "info",
      });
    } catch (error) {
      console.error("Error handling notification:", error);
    }
  };

const handleMenuSubmit = async (e) => {
  e.preventDefault();
  try {
    const menuData = {
      hostel_id: hostelId,
      day: menuForm.day,
      [menuForm.meal]: menuForm.items,
    };
    await createMenu(menuData);
    setMenuForm({
      day: DAYS[0].value,
      meal: MEALS[0].value,
      items: "",
    });
  } catch (error) {
    console.error("Error handling menu:", error);
  }
};
  const handleComplaintSubmit = async (e) => {
    e.preventDefault();
    try {
      await createComplaint({
        ...complaintForm,
        hostel_id: hostelId,
      });
      setComplaintForm({
        type: "",
        description: "",
        studentName: "",
        studentEmail: "",
        dueDate: new Date().toISOString().split("T")[0],
      });
    } catch (error) {
      console.error("Error submitting complaint:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-black to-purple-900 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-white text-center mb-8">
          Hostel Dashboard
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Officials Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border border-purple-500/50"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <FaUsersGear className="mr-2" /> Officials Management
            </h2>

            <form onSubmit={handleOfficialSubmit} className="space-y-4 mb-6">
              <input
                type="text"
                value={officialForm.name}
                onChange={(e) =>
                  setOfficialForm({ ...officialForm, name: e.target.value })
                }
                placeholder="Name"
                className="w-full p-2 bg-black/30 rounded-lg text-white"
                required
              />
              <input
                type="text"
                value={officialForm.designation}
                onChange={(e) =>
                  setOfficialForm({
                    ...officialForm,
                    designation: e.target.value,
                  })
                }
                placeholder="Designation"
                className="w-full p-2 bg-black/30 rounded-lg text-white"
                required
              />
              <input
                type="tel"
                value={officialForm.phone}
                onChange={(e) =>
                  setOfficialForm({ ...officialForm, phone: e.target.value })
                }
                placeholder="Phone"
                className="w-full p-2 bg-black/30 rounded-lg text-white"
                required
              />
              <input
                type="email"
                value={officialForm.email}
                onChange={(e) =>
                  setOfficialForm({ ...officialForm, email: e.target.value })
                }
                placeholder="Email"
                className="w-full p-2 bg-black/30 rounded-lg text-white"
                required
              />
              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-lg transition-colors"
              >
                {editingOfficial ? "Update Official" : "Add Official"}
              </button>
            </form>

            <div className="space-y-4">
              {officials.map((official) => (
                <motion.div
                  key={official.id}
                  className="p-4 bg-black/30 rounded-lg border border-purple-500/30"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-white font-semibold">
                        {official.name}
                      </h3>
                      <p className="text-purple-300 text-sm">
                        {official.designation}
                      </p>
                      <p className="text-gray-400 text-sm">{official.phone}</p>
                      <p className="text-gray-400 text-sm">{official.email}</p>
                    </div>
                    <div className="space-x-2">
                      <button
                        onClick={() => {
                          setEditingOfficial(official);
                          setOfficialForm({
                            name: official.name,
                            designation: official.designation,
                            phone: official.phone,
                            email: official.email,
                          });
                        }}
                        className="text-blue-500 hover:text-blue-400"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => deleteOfficial(official.id)}
                        className="text-red-500 hover:text-red-400"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Notifications Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border border-purple-500/50"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Bell className="mr-2" /> Notifications Management
            </h2>

            <form
              onSubmit={handleNotificationSubmit}
              className="space-y-4 mb-6"
            >
              <textarea
                value={notificationForm.message}
                onChange={(e) =>
                  setNotificationForm({
                    ...notificationForm,
                    message: e.target.value,
                  })
                }
                placeholder="Notification Message"
                className="w-full p-2 bg-black/30 rounded-lg text-white h-24"
                required
              />
              <select
                value={notificationForm.type}
                onChange={(e) =>
                  setNotificationForm({
                    ...notificationForm,
                    type: e.target.value,
                  })
                }
                className="w-full p-2 bg-black/30 rounded-lg text-white"
              >
                <option value="info">Info</option>
                <option value="warning">Warning</option>
              </select>
              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-lg transition-colors"
              >
                {editingNotification
                  ? "Update Notification"
                  : "Add Notification"}
              </button>
            </form>

            <div className="space-y-4">
              {notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  className={`p-4 rounded-lg border ${
                    notification.type === "warning"
                      ? "bg-yellow-500/20 border-yellow-500"
                      : "bg-blue-500/20 border-blue-500"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <p className="text-white">{notification.message}</p>
                    <div className="space-x-2">
                      <button
                        onClick={() => {
                          setEditingNotification(notification);
                          setNotificationForm({
                            message: notification.message,
                            type: notification.type,
                          });
                        }}
                        className="text-blue-500 hover:text-blue-400"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="text-red-500 hover:text-red-400"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Menu Management */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border border-purple-500/50"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Utensils className="mr-2" /> Menu Management
            </h2>

            <form onSubmit={handleMenuSubmit} className="space-y-4">
              <select
                value={menuForm.day}
                onChange={(e) =>
                  setMenuForm({ ...menuForm, day: e.target.value })
                }
                className="w-full p-2 bg-black/30 rounded-lg text-white"
                required
              >
                {DAYS.map((day) => (
                  <option key={day.value} value={day.value}>
                    {day.label}
                  </option>
                ))}
              </select>

              <select
                value={menuForm.meal}
                onChange={(e) =>
                  setMenuForm({ ...menuForm, meal: e.target.value })
                }
                className="w-full p-2 bg-black/30 rounded-lg text-white"
                required
              >
                {MEALS.map((meal) => (
                  <option key={meal.value} value={meal.value}>
                    {meal.label}
                  </option>
                ))}
              </select>

              <textarea
                value={menuForm.items}
                onChange={(e) =>
                  setMenuForm({ ...menuForm, items: e.target.value })
                }
                placeholder="Menu Items (comma separated)"
                className="w-full p-2 bg-black/30 rounded-lg text-white h-24"
                required
              />

              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-lg transition-colors"
              >
                Add Menu
              </button>
            </form>

            {/* Display current menu if available */}
            {menus.length > 0 && (
              <div className="mt-6">
                <h3 className="text-white font-semibold mb-3">Current Menu</h3>
                <div className="space-y-2">
                  {menus.map((menu) => (
                    <div
                      key={menu.menu_id || menu.id}
                      className="p-3 bg-black/20 rounded-lg border border-purple-500/30"
                    >
                      <p className="text-purple-300 font-medium">{menu.day}</p>
                      {menu.breakfast && (
                        <p className="text-white text-sm">
                          Breakfast: {menu.breakfast}
                        </p>
                      )}
                      {menu.lunch && (
                        <p className="text-white text-sm">
                          Lunch: {menu.lunch}
                        </p>
                      )}
                      {menu.snacks && (
                        <p className="text-white text-sm">
                          Snacks: {menu.snacks}
                        </p>
                      )}
                      {menu.dinner && (
                        <p className="text-white text-sm">
                          Dinner: {menu.dinner}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
          {/* Complaints Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border border-purple-500/50"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Wrench className="mr-2" /> File Complaint
            </h2>

            <form onSubmit={handleComplaintSubmit} className="space-y-4">
              <input
                type="text"
                value={complaintForm.studentName}
                onChange={(e) =>
                  setComplaintForm({
                    ...complaintForm,
                    studentName: e.target.value,
                  })
                }
                placeholder="Your Name"
                className="w-full p-2 bg-black/30 rounded-lg text-white"
                required
              />
              <input
                type="email"
                value={complaintForm.studentEmail}
                onChange={(e) =>
                  setComplaintForm({
                    ...complaintForm,
                    studentEmail: e.target.value,
                  })
                }
                placeholder="Your Email"
                className="w-full p-2 bg-black/30 rounded-lg text-white"
                required
              />
              <select
                value={complaintForm.type}
                onChange={(e) =>
                  setComplaintForm({ ...complaintForm, type: e.target.value })
                }
                className="w-full p-2 bg-black/30 rounded-lg text-white"
                required
              >
                <option value="">Select Complaint Type</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Food">Food</option>
                <option value="Cleanliness">Cleanliness</option>
                <option value="Other">Other</option>
              </select>
              <textarea
                value={complaintForm.description}
                onChange={(e) =>
                  setComplaintForm({
                    ...complaintForm,
                    description: e.target.value,
                  })
                }
                placeholder="Complaint Description"
                className="w-full p-2 bg-black/30 rounded-lg text-white h-24"
                required
              />
              <input
                type="date"
                value={complaintForm.dueDate}
                onChange={(e) =>
                  setComplaintForm({
                    ...complaintForm,
                    dueDate: e.target.value,
                  })
                }
                min={new Date().toISOString().split("T")[0]}
                className="w-full p-2 bg-black/30 rounded-lg text-white"
                required
              />
              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-lg transition-colors"
              >
                Submit Complaint
              </button>
            </form>
          </motion.div>

          {/* Current Time and User Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border border-purple-500/50 lg:col-span-2"
          >
            <div className="flex justify-between items-center text-white">
              <div>
                <p className="text-sm opacity-70">Current User</p>
                <p className="text-lg font-semibold">ayush20244048</p>
              </div>
              <Clock />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// Clock Component for real-time updates
const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-right">
      <p className="text-sm opacity-70">Current Time (UTC)</p>
      <p className="text-lg font-semibold">
        {time.toISOString().split("T")[0]}{" "}
        {time.toISOString().split("T")[1].split(".")[0]}
      </p>
    </div>
  );
};

export default Dashboard;
                