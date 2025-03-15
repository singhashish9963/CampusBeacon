import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Utensils, Phone, Mail, Bell, Wrench } from "lucide-react";
import { FaUsersGear } from "react-icons/fa6";
import { useComplaints } from "../../contexts/hostelContext";
import { useOfficial } from "../../contexts/hostelContext";
import { useNotifications } from "../../contexts/hostelContext";

const SVBH = () => {
  // get current day and time
  const [currentDay, setCurrentDay] = useState(new Date().getDay());
  const [currentTime, setCurrentTime] = useState(new Date());

  // complaint local state (used for filing a complaint)
  const [selectedComplaintType, setSelectedComplaintType] = useState("");
  const [complaintDescription, setComplaintDescription] = useState("");
  const complaintTypes = [
    "Maintenance Issue",
    "Food Complaint",
    "Cleanliness",
    "Infrastructure",
    "Other",
  ];

  // Context hooks
  const { complaints, createComplaint, fetchAllComplaints } = useComplaints();
  const { officials, createOfficial, deleteOfficial, fetchAllOfficials } =
    useOfficial();
  const {
    notifications,
    createNotification,
    deleteNotification,
    fetchNotifications,
  } = useNotifications();

  // Dummy mess menu data (this might eventually come from your MenuContext)
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const menu = {
    Monday: {
      Breakfast:
        "Aalo Paratha, Aachar, Sauce, Chai, Bread, Jam, Banana, Sprouts",
      Lunch: "Dal Tadka, Aalo Gobi Rasedar, Rice, Roti, Raita, Salad",
      Snacks: "Chow Mein, Sauce, Hot Coffee",
      Dinner: "Aalo Soya Methi, Fry Arhar Dal, Rice, Roti, Sewain, Salad",
    },
    Tuesday: {
      Breakfast: "Pav Bhaji, Hot Coffee, Bread, Jam, Banana, Sprouts",
      Lunch: "Dal Makhani, Aalo Jeera, Rice, Roti, Raita, Salad",
      Snacks: "Vada Pav, Chai",
      Dinner: "Aalo Tamatar Rasedar, Methi Paratha, Rice, Custard, Salad",
    },
    Wednesday: {
      Breakfast:
        "Idli, Sambar, Nariya Chutni, Bournvita, Bread, Jam, Banana, Sprouts",
      Lunch: "Kali Masoor Dal, Mix Veg, Rice, Roti, Raita, Salad",
      Snacks: "Aalo Sandwich, Chai",
      Dinner: "Palak Paneer, Chana Dal, Roti, Rice, Gulab Jamun, Salad",
    },
    Thursday: {
      Breakfast: "Paneer Paratha, Milk, Bread, Jam, Banana, Sprouts",
      Lunch: "Khadi, Aalo Fry, Rice, Roti, Salad",
      Snacks: "Tikiyan, Chutni, Bournvita",
      Dinner: "Mix Dal, Aalo Gobhi, Roti, Rice, Custard, Salad",
    },
    Friday: {
      Breakfast:
        "Vada, Sambar, Nariya Chutni, Milk, Bread, Jam, Banana, Sprouts",
      Lunch: "Malai Kofta, Arhar Dal, Rice, Roti, Salad",
      Snacks: "Burger, Sauce, Hot Coffee",
      Dinner: "Mushroom, Dal Makhani, Roti, Rice, Ice Cream, Salad",
    },
    Saturday: {
      Breakfast: "Samosa, Chola, Milk, Bread, Jam, Banana, Sprouts",
      Lunch: "Shahi Paneer, Mix Dal, Rice, Roti, Gulab Jamun, Salad",
      Snacks: "—Break—",
      Dinner: "Veg Pulao, Boondi Raita, Papad, Chutni",
    },
    Sunday: {
      Breakfast:
        "Chana Masala, Poodi, Sooji Halwa, Milk, Bread, Jam, Banana, Sprouts",
      Lunch: "Chola, Bhatura, Rice, Roti, Dahi Vada, Salad",
      Snacks: "Pasta, Sauce, Chai",
      Dinner: "Litti Chokha, Arhar Dal, Rice, Kheer, Salad",
    },
  };

  const getCurrentMeal = () => {
    const hour = currentTime.getHours();
    if (hour >= 6 && hour < 11) return "Breakfast";
    if (hour >= 11 && hour < 16) return "Lunch";
    if (hour >= 16 && hour < 19) return "Snacks";
    return "Dinner";
  };

  // Handle filing a complaint using the ComplaintContext's method
  const submitComplaint = async () => {
    if (selectedComplaintType && complaintDescription) {
      try {
        const complaintData = {
          complaintType: selectedComplaintType,
          complaintDescription,
          // You can also attach additional info here if needed.
        };
        await createComplaint(complaintData);
        await createNotification({
          message: `New ${selectedComplaintType} complaint filed: ${complaintDescription}`,
          type: "warning",
        });
        setSelectedComplaintType("");
        setComplaintDescription("");
      } catch (error) {
        console.error("Failed to file complaint", error);
      }
    }
  };

  // Example handlers for Official CRUD
  const handleAddOfficial = async () => {
    const newOfficial = {
      designation: "New Official",
      name: "John Doe",
      phone: "1234567890",
      email: "johndoe@example.com",
    };
    try {
      await createOfficial(newOfficial);
    } catch (error) {
      console.error("Error adding official", error);
    }
  };

  const handleDeleteOfficial = async (id) => {
    try {
      await deleteOfficial(id);
    } catch (error) {
      console.error("Error deleting official", error);
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      await deleteNotification(id);
    } catch (error) {
      console.error("Error deleting notification", error);
    }
  };

  // Fetch context data on component mount
  useEffect(() => {
    fetchAllOfficials();
    fetchNotifications();
    fetchAllComplaints();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-black to-purple-900 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left side: Mess Menu, Notifications & Complaint */}
          <div className="lg:col-span-2 space-y-8">
            {/* Mess Menu Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border border-purple-500/50"
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Utensils className="mr-2" /> Today's Mess Menu : SVBH
                <span className="ml-4 text-lg text-purple-300">
                  {daysOfWeek[currentDay]}
                </span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {menu[daysOfWeek[currentDay]] &&
                  Object.entries(menu[daysOfWeek[currentDay]]).map(
                    ([meal, items]) => (
                      <motion.div
                        key={meal}
                        whileHover={{ scale: 1.05 }}
                        className={`p-4 rounded-lg border ${
                          getCurrentMeal() === meal
                            ? "bg-purple-500/20 border-purple-500"
                            : "bg-black/30 border-white/10"
                        }`}
                      >
                        <h3 className="text-xl font-semibold text-white capitalize mb-3">
                          {meal}
                        </h3>
                        <ul className="space-y-1">
                          {items.split(", ").map((item, index) => (
                            <li key={index} className="text-gray-300">
                              • {item}
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )
                  )}
              </div>
            </motion.div>

            {/* Notifications Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border border-purple-500/50"
            >
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <Bell className="mr-2" /> Notifications
              </h2>
              <div className="space-y-4">
                {notifications.map((notif) => (
                  <motion.div
                    key={notif.notification_id || notif.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-4 rounded-lg border ${
                      notif.type === "warning"
                        ? "bg-yellow-500/20 border-yellow-500"
                        : "bg-blue-500/20 border-blue-500"
                    } flex justify-between items-center`}
                  >
                    <div>
                      <p className="text-white">{notif.message}</p>
                      {notif.timestamp && (
                        <p className="text-sm text-gray-400 mt-2">
                          {new Date(notif.timestamp).toLocaleTimeString()}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() =>
                        handleDeleteNotification(
                          notif.notification_id || notif.id
                        )
                      }
                      className="text-red-500 hover:text-red-600"
                    >
                      Delete
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Complaint Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border border-purple-500/50"
            >
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <Wrench className="mr-2" /> File Complaint
              </h2>
              <select
                value={selectedComplaintType}
                onChange={(e) => setSelectedComplaintType(e.target.value)}
                className="w-full p-2 mb-4 bg-black/30 rounded-lg text-white"
              >
                <option value="">Select Type</option>
                {complaintTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <textarea
                value={complaintDescription}
                onChange={(e) => setComplaintDescription(e.target.value)}
                placeholder="Describe your complaint"
                className="w-full p-2 bg-black/30 rounded-lg text-white h-24 mb-4"
              />
              <button
                onClick={submitComplaint}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-lg transition-colors"
              >
                Submit Complaint
              </button>
            </motion.div>
          </div>

          {/* Right side: Officials and management buttons */}
          <div className="space-y-8">
            {/* Officials Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border border-purple-500/50"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-white font-bold text-2xl flex items-center">
                  <FaUsersGear className="mr-2" /> SVBH Officials
                </h2>
                <button
                  onClick={handleAddOfficial}
                  className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                {officials.map((official) => (
                  <motion.div
                    key={official.official_id || official.id}
                    whileHover={{ scale: 1.02 }}
                    className="p-4 bg-black/30 rounded-lg border border-purple-500/30 flex flex-col justify-between"
                  >
                    <div>
                      <h3 className="text-white font-semibold">
                        {official.name}
                      </h3>
                      <p className="text-purple-300 text-sm">
                        {official.designation}
                      </p>
                      <p className="text-gray-400 text-sm flex items-center mt-2">
                        <Phone className="mr-2 h-4 w-4" />
                        +91 {official.phone}
                      </p>
                      <p className="text-gray-400 text-sm flex items-center mt-1">
                        <Mail className="mr-2 h-4 w-4" /> {official.email}
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        handleDeleteOfficial(
                          official.official_id || official.id
                        )
                      }
                      className="mt-2 bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs transition-colors"
                    >
                      Remove
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SVBH;
