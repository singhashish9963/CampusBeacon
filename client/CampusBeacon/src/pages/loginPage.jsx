import React, { useState } from "react";
import { motion } from "framer-motion";
function LoginSignup() {
  const [isSignUp, setIsSignUP] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black flex items-center justify-center">
      <motion.div
        inital={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 0.8 }}
        className="relative w-[900px] h-[600px] rounded-2xl overflow-hidden flex"
        style={{
          background: "rgba(0,0,0,5)",
          backdropFilter: "blur(50px)",
        }}
      >
        <div className="w-full h-full bg-purple-900 backdrop-blur-sm flex flex-col items-center justify-center mb-11">
          <h2 className="text-3xl font-bold text-white mb-2">
            {isSignUp ? "Welcome Back" : "New Here?"}
          </h2>
          <p className="text-white text-center mb-7">
            {isSignUp
              ? "Already have an account? Sign in to continue"
              : "Sign up to start a new journey"}
          </p>
          <button
            onClick={() => setIsSignUP(!isSignUp)}
            className="px-8 py-3 border-5 border-white text-white rounded-full hover:bg-white hover:text-purple-900 transition-all mb-2"
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default LoginSignup;
