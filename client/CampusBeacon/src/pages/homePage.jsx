import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ButtonColourfull from "../components/ButtonColourfull";
import FeatureCard from "../components/HomePage/FeatureCard.jsx";
import QuickLinks from "../components/HomePage/QuickLinks.jsx"
import EventsSection from "../components/HomePage/EventsSection.jsx"
import { motion } from "framer-motion";
import { Mail,Users,Globe,HelpCircle,Database,Calendar } from "lucide-react";
import ImageSlider from "../components/HomePage/ImageSlider.jsx";
import StarryBackground from "../components/HomePage/StarsBg.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";

const HomePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { isAuthenticated, handleLogout, user, lastLoginTime } = useAuth();
  const navigate = useNavigate();

  useEffect(()=>{
    const token=localStorage.getItem("token");
    if(token){
      setIsLoggedIn(true);
    }
  },[]);
  
  const handleLogoutClick = async () => {
    await handleLogout();
    navigate("/login");
  };




  return (
    <>
      <div className="fixed inset-0">
        <StarryBackground />
      </div>

      <div className="relative z-10 min-h-screen">
        <div className="fixed top-6 right-6 z-50 flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <span className="text-white">
                {user?.email}
                {lastLoginTime && (
                  <small className="block text-gray-400">
                    Last login: {new Date(lastLoginTime).toLocaleString()}
                  </small>
                )}
              </span>
              <ButtonColourfull
                text="Logout"
                type="button"
                buttonsize="px-6 py-2.5"
                textsize="text-base"
                onClick={handleLogoutClick}
              />
            </div>
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
        <div className="min-h-screen flex items-center justify-center relative">
          <div className="text-center z-10 px-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-6xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500"
            >
              Welcome to CampusBeacon
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="font-mono text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto"
            >
              A beacon that connects...
            </motion.p>
          </div>
        </div>
        <section className="min-h-screen relative z-10 py-15">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                {" "}
                Features
              </h2>
              <p className="text-xl text-gray-400 font-mono">
                We offer various services
              </p>
            </motion.div>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-12 ">
              <FeatureCard
                icon={Mail}
                title="Eatries"
                description="Discover places to eat around campus"
                href="/"
              />
              <FeatureCard
                icon={Users}
                title="Hostel Management"
                description="Seamless hostel allocation and maintenance request system"
                href="/"
              />
              <FeatureCard
                icon={HelpCircle}
                title="Lost & Found"
                description="Connect with campus community to find lost items"
                href="/lost-found"
              />
              <FeatureCard
                icon={Globe}
                title="Buy & Sell"
                description="Campus marketplace for students to trade books and essentials"
                href="/marketplace"
              />
              <FeatureCard
                icon={Calendar}
                title="Attendance Manager"
                description="Track and manage your attendance across all subjects efficiently"
                href="/"
              />
              <FeatureCard
                icon={Globe}
                title="Community"
                description="Advanced analytics to predict and improve your academic performance"
                href="/Community"
              />
            </div>
          </div>
        </section>
        <section className="mb-30 relative z-10 py-15">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                {" "}
                Quick Links
              </h2>
              <p className="text-xl text-gray-400 font-mono">
                Quick accessible links
              </p>
            </motion.div>

            <QuickLinks />
          </div>
        </section>
        <section className="min-h-screen relative z-10 py-32 overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-15"
            >
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent mb-8">
                Clubs and Activities
              </h2>
              <p className="text-xl text-gray-400 font-mono">Be a Moti</p>
            </motion.div>
            <ImageSlider />
          </div>
        </section>
        <EventsSection />
      </div>
    </>
  );
}
export default HomePage;
