import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  handleSignIn,
  handleSignUp,
  handleForgetPassword,
  clearError,
  checkAuthStatus,
} from "../../slices/authSlice";
import { ButtonColourfull } from "../../components/common/buttons";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CustomEmailInput from "./customEmailInput";
import PasswordInput from "./password";
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
  const loginSuccessShown = useRef(false);
  const shouldRedirect = useRef(false);

  // Clear any existing errors when component mounts or auth mode changes
  useEffect(() => {
    setError(null);
    dispatch(clearError());
  }, [dispatch, authMode]);

  // Handle successful login toast
  useEffect(() => {
    if (isAuthenticated && !loading && !loginSuccessShown.current) {
      loginSuccessShown.current = true;
      shouldRedirect.current = true;
      toast.success("Welcome back!", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        closeButton: false
      });
    }
  }, [isAuthenticated, loading]);

  // Handle redirection after successful login
  useEffect(() => {
    if (isAuthenticated && !loading && shouldRedirect.current) {
      const timer = setTimeout(() => {
        navigate("/");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, loading, navigate]);

  useEffect(() => {
    if (authError && !loading) {
      setError(authError);
      toast.error(authError, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        closeButton: false
      });
      // Clear the error from Redux store
      dispatch(clearError());
    }
  }, [authError, loading, dispatch]);

  const handleFormSubmit = async (e, type) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    loginSuccessShown.current = false;
    shouldRedirect.current = false;

    const email = e.target.email.value;
    const password = e.target.password?.value;

    try {
      if (type === "login") {
        await dispatch(handleSignIn({ email, password })).unwrap();
        // After successful login, check auth status after a small delay
        setTimeout(() => {
          dispatch(checkAuthStatus());
        }, 100);
      } else if (type === "signup") {
        await dispatch(handleSignUp({ email, password })).unwrap();
        toast.success("Registration successful! Please check your email to verify your account.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          closeButton: false
        });
        setIsSignUp(false);
      } else if (type === "forgot") {
        await dispatch(handleForgetPassword(email)).unwrap();
        toast.success("Password reset instructions sent to your email!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          closeButton: false
        });
        setAuthMode("login");
      }
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const AuthForm = ({ type }) => (
    <form
      onSubmit={(e) => handleFormSubmit(e, type)}
      className="space-y-6"
      autoComplete="off"
    >
      <CustomEmailInput name="email" required autoComplete="new-email" />
      {type !== "forgot" && (
        <PasswordInput
          name="password"
          placeholder="Enter password"
          required
          autoComplete="new-password"
        />
      )}
      <ButtonColourfull
        text={
          type === "signup"
            ? "Create Account"
            : type === "login"
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
                    <AuthForm type="signup" />
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
                    <AuthForm type="login" />
                    <div className="mt-4 flex flex-col items-center space-y-3">
                      <button
                        className="text-purple-400 hover:text-purple-300 transition-colors"
                        onClick={() => {
                          setAuthMode("forgot");
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
              <AuthForm type="signup" />
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
              <AuthForm type="login" />
              <button
                className="mt-4 text-purple-400 hover:text-purple-300 transition-colors"
                onClick={() => {
                  setAuthMode("forgot");
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
            <AuthForm type="forgot" />
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
