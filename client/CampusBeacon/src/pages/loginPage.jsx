import React, { useState } from "react";
import { motion } from "framer-motion";
import ButtonColourfull from "../components/ButtonColourfull.jsx";

function LoginSignup() {
  const [isSignUp, setIsSignUP] = useState(false);

  const handleSignUP = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
  };

  return (
    // Outer Box of the login signup page
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }} // Corrected typo here
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-[900px] h-[600px] rounded-2xl overflow-hidden flex"
        style={{
          background: "rgba(0,0,0,0.7)",
          backdropFilter: "blur(10px)",
        }}
      >
        {/* Sliding Overlay over the page */}
        <motion.div
          animate={{ x: isSignUp ? "100%" : "0%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="absolute top-0 left-0 w-1/2 h-full bg-cover bg-center z-10"
          style={{
            boxShadow: "0 0 50px rgba(139,92,246,0.5)",
            background: "rgba(153,113,248,0.7)",
          }}
        >
          <div className="w-full h-full bg-purple-900/50 backdrop-blur-sm flex flex-col items-center justify-center p-8">
            <h2 className="text-4xl font-bold text-white mb-2">
              {isSignUp ? "Welcome Back!" : "New Here?"}
            </h2>
            <p className="text-white text-center mb-7 text-xl">
              {isSignUp
                ? "Already have an account? Sign in to continue"
                : "Sign up and discover a great amount of new opportunities!"}
            </p>
            <button
              onClick={() => setIsSignUP(!isSignUp)}
              className="px-7 py-3 border-2 border-white text-white rounded-full hover:bg-white hover:text-purple-900 transition-all mb-2"
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </div>
        </motion.div>

        {/* Left side - Sign Up page */}
        <div className="w-1/2 p-12">
          <h2 className="text-white text-3xl font-bold mb-7">Create Account</h2>
          <form onSubmit={handleSignUP} className="space-y-6">
            <motion.div whileTap={{ scale: 0.98 }}>
              {" "}
              {/* Corrected tag here */}
              <input
                type="email"
                name="email"
                placeholder="Enter your college email id"
                className="mt-4 w-full p-4 text-2xl bg-purple-500/15 rounded-lg text-white border border-white/11 focus-outline-none focus:border-purple-500 transition-all"
                required // Added required attribute
              />
            </motion.div>
            <motion.div whileTap={{ scale: 0.98 }}>
              <input
                type="password"
                name="password"
                placeholder="Create a password"
                className="w-full mt-7 p-4 text-2xl bg-purple-500/15 rounded-lg text-white"
                required
              />
            </motion.div>
            <ButtonColourfull
              text="Sign Up"
              type="submit"
              textsize="text-xl"
              buttonsize="w-full p-4" // Adjusted className
              className="w-full p-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:opacity-90 transition-all"
            />
          </form>
        </div>

        {/* Right side - Log In Page */}
        <div className="w-1/2 p-12">
          {" "}
          {/* Adjusted padding for consistency */}
          <h2 className="text-white text-5xl font-bold mb-7 mt-5">
            Welcome Back
          </h2>
          <form onSubmit={handleSignUP} className="space-y-6">
            <motion.div whileTap={{ scale: 0.98 }}>
              {" "}
              {/* Corrected tag here */}
              <input
                type="email"
                name="email"
                placeholder="Enter your college email id"
                className="w-full mt-4 p-4 text-2xl bg-purple-500/15 rounded-lg text-white border border-white/11 focus-outline-none focus:border-purple-500 transition-all"
                required // Added required attribute
              />
            </motion.div>
            <motion.div whileTap={{ scale: 0.98 }}>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                className="w-full mt-7 p-4 text-2xl bg-purple-500/15 rounded-lg text-white"
                required
              />
            </motion.div>
            <ButtonColourfull
              text="Sign In"
              type="submit"
              textsize="text-xl"
              buttonsize="w-full p-4" // Adjusted className
              className="w-full p-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:opacity-90 transition-all"
            />
          </form>
        </div>
      </motion.div>
    </div>
  );
}
export default LoginSignup;
