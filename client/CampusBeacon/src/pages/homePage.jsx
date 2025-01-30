import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ButtonColourfull from "../components/ButtonColourfull";
import StarsBg from "../components/StarsBg";
import FeatureCard from "../components/FeatureCard.jsx";
import QuickLinks from "../components/QuickLinks.jsx"
import EventsSection from "../components/EventsSection.jsx"
import { motion } from "framer-motion";

const StarBg = ({ delay }) => {
  const [position] = useState({
    x: Math.random() * 100,
    y: Math.random() * 100,
    scale: Math.random() * 0.5 + 0.5,
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0, 1, 0],
        scale: [position.scale, position.scale * 1.2, position.scale],
      }}
      transition={{
        duration: 2,
        delay: delay,
        repeat: Infinity,
        repeatType: "reverse",
      }}
      className="absolute w-1 h-1 bg-white rounded-full"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
      }}
    />
  );
};

const HomePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(()=>{
    const token=localStorage.getItem("token");
    if(token){
      setIsLoggedIn(true);
    }
  },[]);

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate("/login");
  };



  return (
    <div className="bg-black min-h-[300vh] text-white relative">
      <div>
        {/* Fixed Logout/Login Button */}
        <div className="fixed top-6 right-6 z-50 flex items-center gap-4">
          {isLoggedIn ? (
            <ButtonColourfull
              text="Logout"
              type="button"
              buttonsize="px-6 py-2.5"
              textsize="text-base"
              onClick={handleLogout}
            />
          ) : (
            <ButtonColourfull
              text="Login / Sign Up"
              type="button"
              buttonsize="px-6 py-2.5"
              textsize="text-base"
              onClick={() => navigate("/login")}
            />
          )}
        </div>
      </div>
      <div className="min-h-screen flex items-center justify-center relative">
        <div className="text-center z-10 px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-7xl md:text-8xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500"
          >
            Welcome to CampusBeacon
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl text-gray-300 max-w-2xl mx-auto"
          >
            A beacon that connects
          </motion.p>
        </div>
      </div>
      <section className="mih-h-screen relative z-10 py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl font-bold text-white mb-6"> Features</h2>
            <p className="text-xl text-gray-400">
              Discover what makes us unique!
            </p>
          </motion.div>
          <div >

          </div>
        </div>
      </section>
    </div>
  );

}


export default HomePage;
