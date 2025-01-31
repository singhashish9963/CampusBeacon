import React from "react";
import { motion } from "framer-motion";

const ProfilePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState({
    name: "Ayush Agarwal",
    email: "john@mnnit.ac.in",
    phone: "+91 888 888 8888",
    branch: "Computer Science",
    year: "3rd Year",
    registrationNumber: "20BCE10001",
    semester: "6th Semester",
  });

  const stats = [
    { label: "Attendance", value: "99%", icon: Calendar },
    { label: "Semester", value: userData.semester, icon: Book },
    { label: "Credits", value: userData.credits, icon: Star },
    { label: "Registration", value: userData.registrationNumber, icon: Hash },
  ];
    return (
        <div className="relative min-h-screen bg-gradient-to-br from-indigo-950 via-violet-900 to-fuchsia-800 py-20 px-4 overflow-hidden">
            <motion.div 
            className="absoulute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-40 amimate-pulse"
            initial={{scale:0}}
            animate={{scale:1}}
            transition={{duration:2, type:"spring"}}
            />
        </div>
  );
};

export default ProfilePage;
