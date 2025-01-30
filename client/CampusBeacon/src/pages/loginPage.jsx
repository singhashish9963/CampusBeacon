import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const LoginSignup = () => {

  const {
    isSignUp,
    setIsSignUp,
    isForgetPassword,
    setIsForgetPassword,
    handleSubmit,
  } = useAuth();


  const [focusedInput, setFocusedInput] = useState(null);
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (welcomeMessage) {
      const timeout = setTimeout(() => {
        navigate("/home");
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [welcomeMessage, navigate]);

  const handleFormSubmit = async (e, actionType) => {
    e.preventDefault();
    setError(null); 
    try {

      await handleSubmit(e, actionType);
      if (actionType === "signIn") {
        setWelcomeMessage("Welcome Back!");
      } else if (actionType === "signUp") {
        setWelcomeMessage("Welcome to CampusBeacon: A beacon that connects");
      }
    } catch (err) {
      console.error("Form submission error:", err);
      setError(err.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-[900px] h-[600px] rounded-2xl overflow-hidden flex"
        style={{
          background: "rgba(0, 0, 0, 0.7)",
          backdropFilter: "blur(10px)",
        }}
      >
        {/* Sliding Overlay */}
        <motion.div
          animate={{ x: isSignUp ? "100%" : "0%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="absolute top-0 left-0 w-1/2 h-full bg-cover bg-center z-10"
          style={{
            backgroundImage: "url('/src/assets/space-overlay.jpg')",
            boxShadow: "0 0 50px rgba(139, 92, 246, 0.5)",
            backgroundColor: "rgba(139, 92, 246, 0.7)",
          }}
        >
          <div className="w-full h-full bg-purple-900/50 backdrop-blur-sm flex flex-col items-center justify-center p-8">
            <h2 className="text-4xl font-bold text-white mb-4">
              {isSignUp ? "Welcome Back!" : "New Here?"}
            </h2>
            <p className="text-white/80 text-center mb-8">
              {isSignUp
                ? "Already have an account? Sign in to continue your journey"
                : "Sign up and discover a great amount of new opportunities!"}
            </p>
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
              }}
              className="px-8 py-3 border-2 border-white text-white rounded-full hover:bg-white hover:text-purple-900 transition-all"
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </div>
        </motion.div>

        {/* Signup Form - Left Side */}
        <div className="w-1/2 p-12">
          <h2 className="text-3xl font-bold text-white mb-8">Create Account</h2>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          <form
            onSubmit={(e) => handleFormSubmit(e, "signUp")}
            className="space-y-6"
          >
            <motion.div
              whileTap={{ scale: 0.98 }}
              className={`relative ${
                focusedInput === "signupEmail" ? "ring-2 ring-purple-500" : ""
              }`}
            >
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="w-full p-4 bg-white/5 rounded-lg text-white border border-white/10 focus:outline-none focus:border-purple-500 transition-all"
                onFocus={() => setFocusedInput("signupEmail")}
                onBlur={() => setFocusedInput(null)}
                required
              />
            </motion.div>

            <motion.div
              whileTap={{ scale: 0.98 }}
              className={`relative ${
                focusedInput === "signupPassword"
                  ? "ring-2 ring-purple-500"
                  : ""
              }`}
            >
              <input
                type="password"
                name="password"
                placeholder="Create a password"
                className="w-full p-4 bg-white/5 rounded-lg text-white border border-white/10 focus:outline-none focus:border-purple-500 transition-all"
                onFocus={() => setFocusedInput("signupPassword")}
                onBlur={() => setFocusedInput(null)}
                required
              />
            </motion.div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              className="w-full p-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:opacity-90 transition-all"
            >
              Create Account
            </motion.button>
          </form>
        </div>

        {/* Login Form - Right Side */}
        <div className="w-1/2 p-12">
          <h2 className="text-3xl font-bold text-white mb-8">Welcome Back</h2>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          <form
            onSubmit={(e) => handleFormSubmit(e, "signIn")}
            className="space-y-6"
          >
            <motion.div
              whileTap={{ scale: 0.98 }}
              className={`relative ${
                focusedInput === "loginEmail" ? "ring-2 ring-purple-500" : ""
              }`}
            >
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="w-full p-4 bg-white/5 rounded-lg text-white border border-white/10 focus:outline-none focus:border-purple-500 transition-all"
                onFocus={() => setFocusedInput("loginEmail")}
                onBlur={() => setFocusedInput(null)}
                required
              />
            </motion.div>

            <motion.div
              whileTap={{ scale: 0.98 }}
              className={`relative ${
                focusedInput === "loginPassword" ? "ring-2 ring-purple-500" : ""
              }`}
            >
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                className="w-full p-4 bg-white/5 rounded-lg text-white border border-white/10 focus:outline-none focus:border-purple-500 transition-all"
                onFocus={() => setFocusedInput("loginPassword")}
                onBlur={() => setFocusedInput(null)}
                required
              />
            </motion.div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              className="w-full p-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:opacity-90 transition-all"
            >
              Sign In
            </motion.button>
          </form>
        </div>
      </motion.div>

      {welcomeMessage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center"
        >
          <motion.h1
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-white text-8xl font-bold"
          >
            {welcomeMessage}
          </motion.h1>
        </motion.div>
      )}
    </div>
  );
};

export default LoginSignup;
