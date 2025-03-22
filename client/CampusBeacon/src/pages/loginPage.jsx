import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  handleSignIn,
  handleSignUp,
  handleForgetPassword,
  clearError,
} from "../slices/authSlice";
import ButtonColourfull from "../components/ButtonColourfull.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginSignup = () => {
  const dispatch = useDispatch();
  const {
    isAuthenticated,
    error: authError,
    loading,
  } = useSelector((state) => state.auth);
  const [isSignUp, setIsSignUp] = useState(false);
  const [authMode, setAuthMode] = useState("default");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      toast.success("Login successful!", {
        position: "top-right",
        autoClose: 2000,
      });

      const timer = setTimeout(() => {
        navigate("/");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (authError) {
      setError(authError);
      toast.error(authError, {
        position: "top-right",
        autoClose: 5000,
      });
    }
  }, [authError]);

  const handleFormSubmit = async (e, type) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const toastId = toast.info(`Processing ${type} request...`, {
      position: "top-right",
      autoClose: 2000,
    });

    try {
      let response;
      if (type === "forgotPassword") {
        const email = e.target.email.value;
        response = await dispatch(handleForgetPassword(email)).unwrap();
        if (response && response.success) {
          toast.info("Password reset link sent to your email", {
            position: "top-center",
            autoClose: 4000,
          });
          setAuthMode("default");
        }
      } else {
        const email = e.target.email.value;
        const password = e.target.password.value;
        if (type === "signUp") {
          response = await dispatch(handleSignUp({ email, password })).unwrap();
        } else {
          response = await dispatch(handleSignIn({ email, password })).unwrap();
        }
      }

      if (!response?.success) {
        throw new Error(response?.message || "Authentication failed");
      }
    } catch (err) {
      setError(err.message || "An error occurred");
      toast.error(err.message || "An error occurred", {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setIsLoading(false);
      toast.dismiss(toastId);
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
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        style={{ zIndex: 9999 }}
      />

      <AnimatePresence mode="wait">
        {authMode === "default" ? (
          <motion.div
            key="default"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="mt-30 mb-30 relative w-full max-w-[900px] md:h-[600px] h-auto rounded-2xl overflow-hidden md:flex shadow-2xl"
            style={{
              background: "rgba(0, 0, 0, 0.7)",
              backdropFilter: "blur(10px)",
            }}
          >
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
                    dispatch(clearError());
                  }}
                  className="px-8 py-3 border-2 border-white text-white rounded-full hover:bg-white hover:text-purple-900 transition-all"
                >
                  {isSignUp ? "Sign In" : "Sign Up"}
                </button>
              </div>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={isSignUp ? "signUp" : "signIn"}
                initial={{
                  rotateY: isSignUp ? -90 : 90,
                  opacity: 0,
                }}
                animate={{
                  rotateY: 0,
                  opacity: 1,
                }}
                exit={{
                  rotateY: isSignUp ? 90 : -90,
                  opacity: 0,
                }}
                transition={{
                  duration: 0.6,
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                }}
                className="w-full md:hidden perspective-1000"
                style={{
                  backfaceVisibility: "hidden",
                  transformStyle: "preserve-3d",
                }}
              >
                {isSignUp ? (
                  <div className="p-6 w-full">
                    <h2 className="text-3xl font-bold text-white mb-6 text-center">
                      Create New Account
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
                    <AuthForm type="signUp" />
                    <div className="mt-6 flex justify-center">
                      <button
                        onClick={() => {
                          setIsSignUp(false);
                          setError(null);
                          dispatch(clearError());
                        }}
                        className="text-purple-400 hover:text-purple-300 transition-colors"
                      >
                        Already have an account? Sign In
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 w-full">
                    <h2 className="text-3xl font-bold text-white mb-6 text-center">
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
                    <div className="mt-4 flex flex-col items-center space-y-3">
                      <button
                        className="text-purple-400 hover:text-purple-300 transition-colors"
                        onClick={() => {
                          setAuthMode("forgotPassword");
                          setError(null);
                          dispatch(clearError());
                        }}
                      >
                        Forgot Password?
                      </button>
                      <button
                        onClick={() => {
                          setIsSignUp(true);
                          setError(null);
                          dispatch(clearError());
                        }}
                        className="text-purple-400 hover:text-purple-300 transition-colors"
                      >
                        New here? Create Account
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="md:w-1/2 pt-10 pr-10 pl-10 pb-25 border-b border-purple-500 rounded-lg md:border-hidden hidden md:block">
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

            <div className="md:w-1/2 pt-25 pr-10 pl-10 pb-10 border-t border-purple-500 rounded-lg md:border-hidden hidden md:block">
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
                  dispatch(clearError());
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
                dispatch(clearError());
              }}
            >
              Back to Login
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoginSignup;
