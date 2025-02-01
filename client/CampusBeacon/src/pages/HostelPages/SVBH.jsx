import React from "react";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const menu = {
  Monday: {
    Breakfast: "Aalo Paratha, Aachar, Sauce, Chai, Bread, Jam, Banana, Sprouts",
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
    Breakfast: "Vada, Sambar, Nariya Chutni, Milk, Bread, Jam, Banana, Sprouts",
    Lunch: "Malai Kofta, Arhar Dal, Rice, Roti, Salad",
    Snacks: "Burger, Sauce, Hot Coffee",
    Dinner: "Mushroom, Dal Makhani, Roti, Rice, Ice Cream, Salad",
  },
  Saturday: {
    Breakfast: "Samosa, Chola, Milk, Bread, Jam, Banana, Sprouts",
    Lunch: "Shahi Paneer, Mix Dal, Rice, Roti, Gulab Jamun, Salad",
    Snacks: "—Break—",
    Dinner: "Veg Biryani/Pulao, Boondi Raita, Chutni",
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

const hostelOfficials = {
  0: {
    designation: "Hostel President",
    name: "Mr. Ayush Kunwar Singh",
    phone: "884077607",
    email: "aks23ks@gmail.com",
  },
  1: {
    designation: "All Floor Representative (Electrical Maintenance)",
    name: "Mr. Vishal Singh",
    phone: "9685140993",
    email: "vishalsingh9144247902@gmail.com",
  },
  2: {
    designation: "All Floor Representative (Civil Maintenance)",
    name: "Mr. Aishvary Dwivedi",
    phone: "9166514968",
    email: "aishvarydwivedi8@gmail.com",
  },
  3: {
    designation:
      "OverAll Floor Representative (Lift Maintenance & Water Supply Maintenance)",
    name: "Mr. Mahendra Kumar",
    phone: "7742876688",
    email: "mjrandha@gmail.com",
  },
  4: {
    designation: "1st Floor Representative",
    name: "Mr. Iswar Kumavat",
    phone: "637581855",
    email: "aatmaram1435@gmail.com",
  },
  5: {
    designation: "2nd Floor Representative",
    name: "Mr. Nakul Bansal",
    phone: "7225991488",
    email: "nakulbansal2103@gmail.com",
  },
  6: {
    designation: "3rd Floor Representative",
    name: "Mr. Krishna Yadav",
    phone: "8290649988",
    email: "krishna20246084@mnnit.ac.in",
  },
  7: {
    designation: "4th Floor Representative",
    name: "Mr. Hemant Pal",
    phone: "9555623647",
    email: "hemantpal2529@gmail.com",
  },
  8: {
    designation: "5th Floor Representative",
    name: "Mr. Aishvary Singh",
    phone: "9819667631",
    email: "singhsumit4@gmail.com",
  },
  9: {
    designation: "6th Floor Representative",
    name: "Mr. Pratham Jain",
    phone: "743300295",
    email: "theprathamjain@gmail.com",
  },
  10: {
    designation: "7th Floor Representative",
    name: "Mr. Garvit Jain",
    phone: "79761687270",
    email: "jaingarvit862@gmail.com",
  },
  11: {
    designation: "Mess Manager I",
    name: "Mr. Kaushal Yadav",
    phone: "8852010214",
    email: "kaushal.20241313@mnnit.ac.in",
  },
  12: {
    designation: "Mess Manager II",
    name: "Mr. Shivam Verma",
    phone: "7983684607",
    email: "rohitash12909@gmail.com",
  },
  13: {
    designation: "Mess Manager III",
    name: "Mr. Sujal Jain",
    phone: "7067002427",
    email: "jainsujal431@gmail.com",
  },
  14: {
    designation: "Mess Manager IV",
    name: "Mr. Anmol Saxena",
    phone: "6395140791",
    email: "anmolsken2025@gmail.com",
  },
};
