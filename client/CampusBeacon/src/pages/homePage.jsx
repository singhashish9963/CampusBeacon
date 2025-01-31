import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ButtonColourfull from "../components/ButtonColourfull";
import FeatureCard from "../components/FeatureCard.jsx";
import QuickLinks from "../components/QuickLinks.jsx"
import EventsSection from "../components/EventsSection.jsx"
import { motion } from "framer-motion";
import { Mail,Users,Globe,HelpCircle,Database,Calendar } from "lucide-react";
import ImageSlider from "../components/ImageSlider.jsx";
import StarryBackground from "../components/StarsBg.jsx";
import Footer from "../components/Footer.jsx";


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
    <>

      <div className="fixed inset-0 z-0">
        <StarryBackground />
      </div>


      <div className="relative z-10 min-h-screen">

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


        <div className="min-h-screen flex items-center justify-center relative">
          <div className="text-center z-10 px-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-8xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500"
            >
              Welcome to CampusBeacon
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="font-mono text-2xl text-gray-300 max-w-2xl mx-auto"
            >
              A beacon that connects...
            </motion.p>
          </div>
        </div>
        <section className="min-h-screen relative z-10 py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <h2 className="text-5xl font-bold text-white mb-6"> Features</h2>
              <p className="text-xl text-gray-400">
                We offer various services
              </p>
            </motion.div>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-6 gap-12">
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
                href="/"
              />
              <FeatureCard
                icon={Globe}
                title="Buy & Sell"
                description="Campus marketplace for students to trade books and essentials"
                href="/"
              />
              <FeatureCard
                icon={Calendar}
                title="Attendance Manager"
                description="Track and manage your attendance across all subjects efficiently"
                href="/"
              />
              <FeatureCard
                icon={Database}
                title="Marks Predictor"
                description="Advanced analytics to predict and improve your academic performance"
                href="/"
              />
            </div>
          </div>
        </section>
        <section className="min-h-screen relative z-10 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <h2 className="text-5xl font-bold text-white mb-6"> QuickLinks</h2>
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
              className="text-center mb-16"
            >
              <h2 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent mb-8">
                Explore The Campus
              </h2>
              <p className="text-xl text-gray-400">Be the Moti</p>
            </motion.div>
            <ImageSlider />
          </div>
        </section>
        <EventsSection />
        <Footer />
      </div>
    </>
  );
}
export default HomePage;
