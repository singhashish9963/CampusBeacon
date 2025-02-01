import React, { useState } from "react";
import { motion } from "framer-motion";
import { Utensils, Phone, Mail, Bell, Wrench } from "lucide-react";
import { FaUsersGear } from "react-icons/fa6";
const SVBH = () => {
  const [currentDay, setCurrentDay] = useState(new Date().getDay());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedComplaintType, setSelectedComplaintType] = useState("");
  const [complaintDescription, setComplaintDescription] = useState("");

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
      name: "Mr. Ayush Kunwar Singh",
      phone: "884077607",
      email: "aks23ks@gmail.com",
    },
    {
      designation: "All Floor Representative (Electrical Maintenance)",
      name: "Mr. Vishal Singh",
      phone: "9685140993",
      email: "vishalsingh9144247902@gmail.com",
    },
    {
      designation: "All Floor Representative (Civil Maintenance)",
      name: "Mr. Aishvary Dwivedi",
      phone: "9166514968",
      email: "aishvarydwivedi8@gmail.com",
    },
    {
      designation:
        "OverAll Floor Representative (Lift Maintenance & Water Supply Maintenance)",
      name: "Mr. Mahendra Kumar",
      phone: "7742876688",
      email: "mjrandha@gmail.com",
    },
    {
      designation: "1st Floor Representative",
      name: "Mr. Iswar Kumavat",
      phone: "637581855",
      email: "aatmaram1435@gmail.com",
    },
    {
      designation: "2nd Floor Representative",
      name: "Mr. Nakul Bansal",
      phone: "7225991488",
      email: "nakulbansal2103@gmail.com",
    },
    {
      designation: "3rd Floor Representative",
      name: "Mr. Krishna Yadav",
      phone: "8290649988",
      email: "krishna20246084@mnnit.ac.in",
    },
    {
      designation: "4th Floor Representative",
      name: "Mr. Hemant Pal",
      phone: "9555623647",
      email: "hemantpal2529@gmail.com",
    },
    {
      designation: "5th Floor Representative",
      name: "Mr. Aishvary Singh",
      phone: "9819667631",
      email: "singhsumit4@gmail.com",
    },
    {
      designation: "6th Floor Representative",
      name: "Mr. Pratham Jain",
      phone: "743300295",
      email: "theprathamjain@gmail.com",
    },
    {
      designation: "7th Floor Representative",
      name: "Mr. Garvit Jain",
      phone: "79761687270",
      email: "jaingarvit862@gmail.com",
    },
    {
      designation: "Mess Manager I",
      name: "Mr. Kaushal Yadav",
      phone: "8852010214",
      email: "kaushal.20241313@mnnit.ac.in",
    },
    {
      designation: "Mess Manager II",
      name: "Mr. Shivam Verma",
      phone: "7983684607",
      email: "rohitash12909@gmail.com",
    },
    {
      designation: "Mess Manager III",
      name: "Mr. Sujal Jain",
      phone: "7067002427",
      email: "jainsujal431@gmail.com",
    },
    {
      designation: "Mess Manager IV",
      name: "Mr. Anmol Saxena",
      phone: "6395140791",
      email: "anmolsken2025@gmail.com",
    },
  ];

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message:
        "Due to the non-availability of supplies in Allahabad, the regular mess menu will not be followed for the next few days. The details of the next meal will be shared via notification.",
      type: "notice",
      timestamp: new Date(),
    },
    {
      id: 2,
      message:
        "At midnight, two students were discovered stealing carrots from the mess. If this behavior is repeated, they will face penalties.",
      type: "warning",
      timestamp: new Date(),
    },
  ]);

  const getCurrentMeal = () => {
    const hour = currentTime.getHours();
    if (hour >= 6 && hour < 10) return "breakfast";
    if (hour >= 12 && hour < 15) return "lunch";
    if (hour >= 16 && hour < 19) return "snacks";
    return "dinner";
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-black to-purple-900 p-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            {/* Mess Menu */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border-2 border-purple-500/50 mt-10"
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Utensils className="mr-2" /> Today's Mess Menu -> SVBH
                <span className="ml-4 text-lg text-purple-300">
                  {daysOfWeek[currentDay]}
                </span>
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-7">
                {menu[daysOfWeek[currentDay]] &&
                  Object.entries(menu[daysOfWeek[currentDay]]).map(
                    ([meal, items]) => (
                      <motion.div
                        key={meal}
                        whileHover={{ scale: 1.12 }}
                        className={`p-4 rounded-lg border ${
                          getCurrentMeal() === meal
                            ? "bg-purple-500/20 border-purple-500"
                            : "bg-black/30 border-white/10"
                        }`}
                      >
                        <h3 className="text-xl font-semibold text-white capitalize mb-3 ">
                          {meal}
                        </h3>
                        <ul className="space-y-2">
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

            {/* Notifications */}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border-2 border-purple-500/50"
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

            <div className="space-y-6">
              {/* Complaint Form */}

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border-2 border-purple-500/50"
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
            {/* Officials Section */}

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border-2 border-purple-500/50 w-386"
            >
              <h2 className="text-white font-bold text-2xl mb-4 flex items-center">
                <FaUsersGear className="mr-2" /> SVBH Officials
              </h2>
              <div className="space-y-4 grid grid-cols-1 lg:grid-cols-4 gap-7">
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

export default SVBH;
