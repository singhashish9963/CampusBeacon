import React, { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import ButtonColourfull from "../components/ButtonColourfull";
import { useAuth } from "../contexts/AuthContext.jsx";

function LoginSignup() {
  const {
    isSignUp,
    setIsSignUp,
    isForgetPassword,
    setIsForgetPassword,
    handleSubmit,
  } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // Basic password validation
  const validatePassword = (password) => {
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }
    setError("");
    return true;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const password = e.target.password.value;
    if (isSignUp && !validatePassword(password)) {
      return;
    }
    handleSubmit(e, isSignUp ? "signUp" : "signIn");
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-[900px] h-[600px] rounded-2xl overflow-hidden flex shadow-xl"
        style={{
          background: "rgba(0,0,0,0.7)",
          backdropFilter: "blur(10px)",
        }}
      >
        {/* Sliding panel for Sign In / Sign Up */}
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
              {isForgetPassword
                ? "Reset Password"
                : isSignUp
                ? "New Here?"
                : "Welcome Back!"}
            </h2>
            <p className="text-white text-center mb-7 text-xl">
              {isForgetPassword
                ? "Enter your email to reset your password"
                : isSignUp
                ? "Sign up and discover a great amount of new opportunities!"
                : "Already have an account? Sign in to continue."}
            </p>
            <button
              onClick={() =>
                isForgetPassword
                  ? setIsForgetPassword(false)
                  : setIsSignUp(!isSignUp)
              }
              className="px-7 py-3 border-2 border-white text-white rounded-full hover:bg-white hover:text-purple-900 transition-all mb-2"
              aria-label={
                isForgetPassword
                  ? "Back to Sign In"
                  : isSignUp
                  ? "Switch to Sign In"
                  : "Switch to Sign Up"
              }
            >
              {isForgetPassword
                ? "Back to Sign In"
                : isSignUp
                ? "Sign In"
                : "Sign Up"}
            </button>
          </div>
        </motion.div>

        {/* Main form container */}
        <div className={`w-1/2 p-12 ${!isSignUp ? "ml-auto" : ""}`}>
          {isForgetPassword ? (
            /* Reset Password Form */
            <div>
              <h2 className="text-white text-3xl font-bold mb-7">
                Reset Password
              </h2>
              <form
                onSubmit={(e) => handleSubmit(e, "resetPassword")}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label htmlFor="reset-email" className="text-white text-sm">
                    Email Address
                  </label>
                  <motion.div whileTap={{ scale: 0.98 }}>
                    <input
                      id="reset-email"
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      className="w-full p-4 text-2xl bg-purple-500/15 rounded-lg text-white border border-white/11 focus:outline-none focus:border-purple-500 transition-all"
                      required
                      aria-label="Email address for password reset"
                    />
                  </motion.div>
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="reset-password"
                    className="text-white text-sm"
                  >
                    New Password
                  </label>
                  <motion.div whileTap={{ scale: 0.98 }} className="relative">
                    <input
                      id="reset-password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Enter your new password"
                      className="w-full p-4 text-2xl bg-purple-500/15 rounded-lg text-white border border-white/11 focus:outline-none focus:border-purple-500 transition-all"
                      required
                      aria-label="New password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                    </button>
                  </motion.div>
                </div>
                <ButtonColourfull
                  text="Reset Password"
                  type="submit"
                  textsize="text-xl"
                  buttonsize="w-full p-4"
                  className="w-full p-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:opacity-90 transition-all"
                />
              </form>
            </div>
          ) : (
            /* Sign In / Sign Up Form */
            <div>
              <h2 className="text-white text-3xl font-bold mb-7">
                {isSignUp ? "Create Account" : "Sign In"}
              </h2>
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-white text-sm">
                    Email Address
                  </label>
                  <motion.div whileTap={{ scale: 0.98 }}>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      className="w-full p-4 text-2xl bg-purple-500/15 rounded-lg text-white border border-white/11 focus:outline-none focus:border-purple-500 transition-all"
                      required
                      aria-label="Email address"
                    />
                  </motion.div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="password" className="text-white text-sm">
                    Password
                  </label>
                  <motion.div whileTap={{ scale: 0.98 }} className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder={
                        isSignUp ? "Create a password" : "Enter your password"
                      }
                      className="w-full p-4 text-2xl bg-purple-500/15 rounded-lg text-white border border-white/11 focus:outline-none focus:border-purple-500 transition-all"
                      required
                      aria-label="Password"
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                    </button>
                  </motion.div>
                  {error && (
                    <p className="text-red-400 text-sm mt-1" role="alert">
                      {error}
                    </p>
                  )}
                  {isSignUp && (
                    <p className="text-white/60 text-sm mt-1">
                      Password must be at least 8 characters long
                    </p>
                  )}
                </div>
                <ButtonColourfull
                  text={isSignUp ? "Sign Up" : "Sign In"}
                  type="submit"
                  textsize="text-xl"
                  buttonsize="w-full p-4"
                  className="w-full p-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:opacity-90 transition-all"
                />
              </form>
              {!isSignUp && (
                <button
                  onClick={() => setIsForgetPassword(true)}
                  className="mt-4 text-purple-300 hover:text-purple-500 transition-all"
                  aria-label="Reset forgotten password"
                >
                  Forgot Password?
                </button>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default LoginSignup;
