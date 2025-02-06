import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import ButtonColourfull from "../components/ButtonColourfull.jsx";

const LoginSignup = () => {
  const {
    handleSubmit,
    handleForgetPassword,
    isAuthenticated,
    error: authError,
    welcomeMessage,
  } = useAuth();

  const [isSignUp, setIsSignUp] = useState(false);
  const [authMode, setAuthMode] = useState("default");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (welcomeMessage && isAuthenticated) {
      const timer = setTimeout(() => {
        navigate("/");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [welcomeMessage, isAuthenticated, navigate]);

  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  const handleFormSubmit = async (e, type) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (type === "forgotPassword") {
        const email = e.target.email.value;
        await handleForgetPassword(email);
        setAuthMode("default");
      } else {
        const response = await handleSubmit(e, type);
        if (response?.success) {
          console.log("Authentication successful");
        } else {
          throw new Error(response?.message || "Authentication failed");
        }
      }
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const AuthForm = ({ type }) => (
    <form onSubmit={(e) => handleFormSubmit(e, type)} className="space-y-6">
      <input
        type="email"
        name="email"
        placeholder="Enter your email"
        className="w-full p-4 bg-white/5 rounded-lg text-white border border-white/10 focus:outline-none focus:border-purple-500 transition-all"
        required
      />
      {type !== "forgotPassword" && (
        <input
          type="password"
          name="password"
          placeholder="Enter password"
          className="w-full p-4 bg-white/5 rounded-lg text-white border border-white/10 focus:outline-none focus:border-purple-500 transition-all"
          required
        />
      )}
      <ButtonColourfull
        text={
          type === "signUp"
            ? "Create Account"
            : type === "signIn"
            ? "Sign In"
            : "Send Reset Link"
        }
        type="submit"
        disabled={isLoading}
      />
    </form>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        {authMode === "default" ? (
          <motion.div
            key="default"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="mt-30 mb-30 relative w-full max-w-[900px] md:h-[600px] h-[1000px] rounded-2xl overflow-hidden md:flex shadow-2xl"
            style={{
              background: "rgba(0, 0, 0, 0.7)",
              backdropFilter: "blur(10px)",
            }}
          >
            {/* Sliding Panel */}
            <motion.div
              animate={{ x: isSignUp ? "100%" : "0%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute top-0 left-0 w-1/2 h-full bg-cover bg-center z-10 hidden md:block"
              style={{
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

            {/* Sign Up Form */}
            <div className="md:w-1/2 pt-10 pr-10 pl-10 pb-25 border-b border-purple-500 rounded-lg md:border-hidden ">
              <h2 className="text-3xl font-bold text-white mb-8">
                Create New Account
              </h2>
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-500 mb-4 bg-red-500/10 p-3 rounded-[100px]"
                >
                  {error}
                </motion.div>
              )}
              <AuthForm type={isSignUp ? "signUp" : "signIn"} />
            </div>

            {/* Sign In Form */}
            <div className="md:w-1/2 pt-25 pr-10 pl-10 pb-10 border-t border-purple-500 rounded-lg md:border-hidden ">
              <h2 className="text-3xl font-bold text-white mb-8">
                Welcome Back!
              </h2>
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-500 mb-4 bg-red-500/10 p-3 rounded-lg"
                >
                  {error}
                </motion.div>
              )}
              <AuthForm type="signIn" />
              <button
                className="mt-4 text-purple-400 hover:text-purple-300 transition-colors"
                onClick={() => {
                  setAuthMode("forgotPassword");
                  setError(null);
                }}
              >
                Forgot Password?
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={authMode}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="p-8 bg-white/10 backdrop-blur-10 rounded-2xl shadow-2xl w-full max-w-[400px]"
          >
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Forgot Password
            </h2>
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 mb-4 bg-red-500/10 p-3 rounded-lg"
              >
                {error}
              </motion.div>
            )}
            <AuthForm type="forgotPassword" />
            <button
              className="mt-4 text-purple-400 hover:text-purple-300 transition-colors w-full text-center"
              onClick={() => {
                setAuthMode("default");
                setError(null);
              }}
            >
              Back to Login
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Welcome Message Overlay */}
      <AnimatePresence>
        {welcomeMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-white text-4xl md:text-6xl font-bold text-center p-8 rounded-lg"
            >
              {welcomeMessage}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoginSignup;
