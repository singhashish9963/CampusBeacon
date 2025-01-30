import React from "react";
import { motion } from "framer-motion";
import ButtonColourfull from "../components/ButtonColourfull.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";

function LoginSignup() {
  const {
    isSignUp,
    setIsSignUp,
    isForgetPassword,
    setIsForgetPassword,
    handleSubmit,
  } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-[900px] h-[600px] rounded-2xl overflow-hidden flex"
        style={{
          background: "rgba(0,0,0,0.7)",
          backdropFilter: "blur(10px)",
        }}
      >
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
                ? "Welcome Back!"
                : "New Here?"}
            </h2>
            <p className="text-white text-center mb-7 text-xl">
              {isForgetPassword
                ? "Enter your email to reset your password"
                : isSignUp
                ? "Already have an account? Sign in to continue"
                : "Sign up and discover a great amount of new opportunities!"}
            </p>
            <button
              onClick={() =>
                isForgetPassword
                  ? setIsForgetPassword(false)
                  : setIsSignUp(!isSignUp)
              }
              className="px-7 py-3 border-2 border-white text-white rounded-full hover:bg-white hover:text-purple-900 transition-all mb-2"
            >
              {isForgetPassword
                ? "Back to Sign In"
                : isSignUp
                ? "Sign In"
                : "Sign Up"}
            </button>
          </div>
        </motion.div>

        <div className="w-1/2 p-12">
          {isForgetPassword ? (
            <div>
              <h2 className="text-white text-3xl font-bold mb-7">
                Reset Password
              </h2>
              <form
                onSubmit={(e) => handleSubmit(e, "resetPassword")}
                className="space-y-6"
              >
                <motion.div whileTap={{ scale: 0.98 }}>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    className="mt-4 w-full p-4 text-2xl bg-purple-500/15 rounded-lg text-white border border-white/11 focus:outline-none focus:border-purple-500 transition-all"
                    required
                  />
                </motion.div>
                <motion.div whileTap={{ scale: 0.98 }}>
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter your new password"
                    className="mt-4 w-full p-4 text-2xl bg-purple-500/15 rounded-lg text-white border border-white/11 focus:outline-none focus:border-purple-500 transition-all"
                    required
                  />
                </motion.div>
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
            <div>
              <h2 className="text-white text-3xl font-bold mb-7">
                {isSignUp ? "Create Account" : "Sign In"}
              </h2>
              <form
                onSubmit={(e) =>
                  handleSubmit(e, isSignUp ? "signUp" : "signIn")
                }
                className="space-y-6"
              >
                <motion.div whileTap={{ scale: 0.98 }}>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    className="mt-4 w-full p-4 text-2xl bg-purple-500/15 rounded-lg text-white border border-white/11 focus:outline-none focus:border-purple-500 transition-all"
                    required
                  />
                </motion.div>
                <motion.div whileTap={{ scale: 0.98 }}>
                  <input
                    type="password"
                    name="password"
                    placeholder={
                      isSignUp ? "Create a password" : "Enter your password"
                    }
                    className="w-full mt-7 p-4 text-2xl bg-purple-500/15 rounded-lg text-white"
                    required
                  />
                </motion.div>
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
