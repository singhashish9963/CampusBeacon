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
    // Outter Box of the login signup page
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black flex items-center justify-center">
      <motion.div
        inital={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 0.8 }}
        className="relative w-[1100px] h-[750px] rounded-2xl overflow-hidden flex"
        style={{
          background: "rgba(0,0,0,0.7)",
          backdropFilter: "blur(50px)",
        }}
      >
        {/* Sliding Overlay over the page */}
        <motion.div
          animate={{ x: isSignUp ? "100%" : "0%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="absolute top-0 left-0 w-1/2 h-full bg-cover bg-center z-10"
          style={{
            boxShadow: "0 0 50px rgba(139,92,246,0.5)",
            background: "rgba(153,113,248,0.5)",
          }}
        >
          <div className="w-full h-full bg-purple-900/50 backdrop-blur-sm flex flex-col items-center justify-center p-11">
            <h2 className="text-4xl font-bold text-white mb-2">
              {isSignUp ? "Welcome Back!" : "New Here?"}
            </h2>
            <p className="text-white text-center mb-7 text-xl">
              {isSignUp
                ? "Already have an account? Sign in to continue"
                : "Sign up to start a new journey"}
            </p>
            <button
              onClick={() => setIsSignUP(!isSignUp)}
              className="px-7 py-3 text-xl border-5 border-white text-white rounded-full hover:bg-white hover:text-purple-900 transition-all mb-2"
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </div>
        </motion.div>

        {/* Left side - Sign Up page */}

        <div className="w-1/2 p-15">
          <h2 className="text-white text-5xl font-bold mb-7 mt-5">
            Create Account
          </h2>
          <form onSubmit={handleSignUP} className="space-y-6">
            <motion.dv whileTap={{ scale: 0.98 }}>
              <input
                type="email"
                name="email"
                placeholder="Enter your college email id"
                className="mt-4 w-full p-4 text-2xl bg-purple-500/15 rounded-lg text-white border border-white/11 focus-outline-none focus:border-purple-500 transition-all"
              />
            </motion.dv>
            <motion.div whileTap={{ scale: 0.98 }}>
              <input
                type="password"
                name="password"
                placeholder="Create a password"
                className="w-full mt-7 p-4 text-2xl bg-purple-500/15 rounded-lg text-white"
              />
            </motion.div>
            <ButtonColourfull
              text="Sign Up"
              type="submit"
              textsize="text-xl"
              buttonsize="w-1/2 p-4 ml-20 mt-10"
            />
          </form>
        </div>
        {/* Right side - Log In Page */}

        <div className="w-1/2 p-15">
          <h2 className="text-white text-5xl font-bold mb-7 mt-5">
            Welcome Back
          </h2>
          <form onSubmit={handleSignUP} className="space-y-6">
            <motion.dv whileTap={{ scale: 0.98 }}>
              <input
                type="email"
                name="email"
                placeholder="Enter your college email id"
                className="w-full mt-4 p-4 text-2xl bg-purple-500/15 rounded-lg text-white border border-white/11 focus-outline-none focus:border-purple-500 transition-all"
              />
            </motion.dv>
            <motion.div whileTap={{ scale: 0.98 }}>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                className="w-full mt-7 p-4 text-2xl bg-purple-500/15 rounded-lg text-white"
              />
            </motion.div>
            <ButtonColourfull
              text="Sign In"
              type="submit"
              textsize="text-xl"
              buttonsize="w-1/2 p-4 ml-27 mt-10"
            />
          </form>
        </div>
      </motion.div>
    </div>
  );
}

export default LoginSignup;
