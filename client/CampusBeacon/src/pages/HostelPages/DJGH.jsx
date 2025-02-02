import React, { useState } from "react";
import { motion } from "framer-motion";
import { Utensils, Phone, Mail, Bell, Wrench } from "lucide-react";
import { FaUsersGear } from "react-icons/fa6";

const DJGH = () => {
  const [currentDay, setCurrentDay] = useState(new Date().getDay());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedComplaintType, setSelectedComplaintType] = useState("");
  const [complaintDescription, setComplaintDescription] = useState("");
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "Yoga classes will start from tomorrow, from 6:00am",
      type: "notice",
      timestamp: new Date(),
    },
    {
      id: 2,
      message: "Intime for girls has been updated to 9:00pm",
      type: "warning",
      timestamp: new Date(),
    },
  ]);

  const submitComplaint = () => {
    if (selectedComplaintType && complaintDescription) {
      const newNotification = {
        id: Date.now(),
        message: `New ${selectedComplaintType}: ${complaintDescription}`,
        type: "warning",
        timestamp: new Date(),
      };
      setNotifications([newNotification, ...notifications]);
      setSelectedComplaintType("");
      setComplaintDescription("");
    }
  };

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
        "Aalo/Gobi Paratha, Aachar, Ketchup, Chutney, Chai, Bread, Jam, Seasonal Fruit, Sprouts",
      Lunch: "Rajma, Sookha Tamatar Aalo, Rice, Roti, Raita, Salad",
      Snacks: "Aalo Samosa, Chola, Chai",
      Dinner:
        "Masoor/Khadi Moong Dal, PhoolGobi+Gajar+Matar, Rice, Onion, Milk, Bournvita, Khoya Barfi",
    },
    Tuesday: {
      Breakfast:
        "Aalo Paratha/(Sada Paratha+Aalo Bhujiya), Milk, Bread, Jam, Seasonal Fruit, Sprouts, Cornflakes",
      Lunch: "Khadi, Aalo Bhujiya, Tali Hui Mirchi, Rice, Roti, Salad",
      Snacks: "Chowmein, Tomato+Chili Sauce, Coffee",
      Dinner:
        "Aalo Kofta, Sukha Patta Gobi Aalo, Rice, Onion, Roti, Gajar/Lauki ka Halwa",
    },
    Wednesday: {
      Breakfast:
        "Matar ki Kachori, Aalo ki Sabzi, Ketchup, Milk, Bournvita, Bread, Jam, Seasonal Fruit, Sprouts",
      Lunch:
        "Sukhi Mooli ki Bhaji, Arhar/Chane ki Dal, Rice, Roti, Aachar, Salad",
      Snacks: "Papdi Chat (Matar/Chola+Chutney+Dahi+Pyaaz) / Bhejpuri, Chai",
      Dinner:
        "Kaale Chane, Aalo Tamatar ki Sabzi, Rice, Onion, Milk, Bournvita, Gulab Jamun, Parathe",
    },
    Thursday: {
      Breakfast:
        "Bread, Butter, Methi Puri, Jam, Chai, Sprouts, Aachar, Ketchup, Chutni, Seasonal Fruits, Milk, Bournvita",
      Lunch:
        "Kadhai Paneer ki Sabzi / Matha Aalo ki Sabzi, Roti, Salad, Chawal, Aachar",
      Snacks: "Pakode, Coffee",
      Dinner:
        "Arhar ki daal, Bati, Chokha, Rice, Onion, Mirch, Milk, Bournvita, Rasmalai / Rasgulla",
    },
    Friday: {
      Breakfast:
        "Paneer Paratha, Bread, Butter, Jam, Sprouts, Chai, Aachar, Ketchup, Chutni, Seasonal Fruit, Milk, Bournvita",
      Lunch: "Palak ki Dal, Gajar Matar Aalu ki Sabji, Roti Salad Aachar",
      Snacks: "Fry Maggi / French Fries, Chai",
      Dinner:
        "Kabuli Chane ke Chole, Aalo Gobi Matar, Jeera Rice, Onion, Milk, Bournvita, Khoya Barfi",
    },
    Saturday: {
      Breakfast:
        "Namkeen Jave, Jalebi, Ketchup, Chutney, Chai, Bread, Jam, Seasonal Fruit, Sprouts, Milk, Bournvita",
      Lunch:
        "Malai Dam Aalo, Methi Matar Aalo Gajar Ki Sabjhi, Rice, Roti, Salad",
      Snacks: "OFF",
      Dinner:
        "Arhar Dal, Kashmiri Pulao/Briyani/Kichdi, Hari Chutney, Frymes, Milk, Bournvita",
    },
    Sunday: {
      Breakfast:
        "Idli/Medu Vada, Sambhar, Ketchup, Chutney, Chai, Bread, Jam, Seasonal Fruit, Sprouts",
      Lunch:
        "Arhar ki Dal, Sookhe Matar Aalo ki Sabzi, Rice, Roti, Aachar, Salad, Chach",
      Snacks:
        "Gollgappa, Gollgappe ka Pani, Matar Chole, Chutney, Dahi, Onion, Coffee",
      Dinner:
        "Palak Paneer, Lobiya Wali Dal, Rice, Onion, Mirch, MotiChoor ke Ladoo",
    },
  };

  const complaintTypes = [
    "Maintenance Issue",
    "Food Complaint",
    "Cleanliness",
    "Infrastructure",
    "Other",
  ];

  const hostelOfficials = [
    {
      designation: "Hostel President",
      name: "Miss Abhiaasha Pandey",
      phone: "8888888888",
      email: "email@example.com",
    },
    {
      designation: "All Floor Representative (Electrical Maintenance)",
      name: "Miss Jhanvi Gupta",
      phone: "2222222222",
      email: "email@example.com",
    },
    {
      designation: "All Floor Representative (Civil Maintenance)",
      name: "Miss Ifa Khatoon",
      phone: "1111111111",
      email: "email@example.com",
    },
    {
      designation:
        "OverAll Floor Representative (Lift Maintenance & Water Supply Maintenance)",
      name: "Miss Akshita Yadav",
      phone: "1234567890",
      email: "email@example.com",
    },
  ];

  const getCurrentMeal = () => {
    const hour = currentTime.getHours();
    if (hour >= 6 && hour < 10) return "Breakfast";
    if (hour >= 12 && hour < 15) return "Lunch";
    if (hour >= 16 && hour < 19) return "Snacks";
    return "Dinner";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-black to-purple-900 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border border-purple-500/50"
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">


                <Utensils className="mr-2" /> Today's Mess Menu : DJGH

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
                    key={notif.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-4 rounded-lg border ${
                      notif.type === "warning"
                        ? "bg-yellow-500/20 border-yellow-500"
                        : "bg-blue-500/20 border-blue-500"
                    }`}
                  >
                    <p className="text-white">{notif.message}</p>
                    <p className="text-sm text-gray-400 mt-2">
                      {notif.timestamp.toLocaleTimeString()}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

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
                Submit
              </button>
            </motion.div>
          </div>

          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border border-purple-500/50"
            >
              <h2 className="text-white font-bold text-2xl mb-4 flex items-center">
                <FaUsersGear className="mr-2" /> DJGH Officials
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {hostelOfficials.map((official) => (
                  <motion.div
                    key={official.name}
                    whileHover={{ scale: 1.02 }}
                    className="p-4 bg-black/30 rounded-lg border border-purple-500/30"
                  >
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

export default DJGH;
