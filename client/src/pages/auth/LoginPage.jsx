import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"; // Removed shallowEqual if using individual selectors
import {
  handleSignIn,
  handleSignUp,
  handleForgetPassword,
  clearError,
  checkAuthStatus,
} from "../../slices/authSlice";
import { ButtonColourfull } from "../../components/common/buttons";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Ensure CSS is imported only once
import CustomEmailInput from "./customEmailInput";
import PasswordInput from "./password";

const LoginSignup = () => {
  const dispatch = useDispatch();
  // Use individual selectors for optimization
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const authError = useSelector((state) => state.auth.error);
  const loading = useSelector((state) => state.auth.loading);

  const [isSignUp, setIsSignUp] = useState(false);
  const [authMode, setAuthMode] = useState("default"); // 'default', 'forgot'

  const navigate = useNavigate();
  const loginSuccessShown = useRef(false);
  const redirectTimerRef = useRef(null);
  const toastIdRef = useRef(null);

  // Clear Redux error when component mounts or view changes
  useEffect(() => {
    dispatch(clearError());
    if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current);
    loginSuccessShown.current = false;
  }, [dispatch, authMode, isSignUp]);

  // --- Login Success Effect ---
  useEffect(() => {
    if (isAuthenticated && !loading && !loginSuccessShown.current) {
      loginSuccessShown.current = true;
      if (toastIdRef.current) toast.dismiss(toastIdRef.current);

      toastIdRef.current = toast.success("Welcome back!", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        closeButton: false,
        onClose: () => {
          toastIdRef.current = null;
        },
      });

      if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current);
      redirectTimerRef.current = setTimeout(() => {
        navigate("/");
        redirectTimerRef.current = null;
      }, 1800);

      return () => {
        // Cleanup timer on unmount or re-run
        if (redirectTimerRef.current) {
          clearTimeout(redirectTimerRef.current);
          redirectTimerRef.current = null;
        }
      };
    }
    if (!isAuthenticated) {
      loginSuccessShown.current = false;
      if (redirectTimerRef.current) {
        clearTimeout(redirectTimerRef.current);
        redirectTimerRef.current = null;
      }
    }
  }, [isAuthenticated, loading, navigate, dispatch]);

  // --- Auth Error Effect ---
  useEffect(() => {
    if (authError && !loading) {
      if (toastIdRef.current) toast.dismiss(toastIdRef.current);
      toastIdRef.current = toast.error(authError, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        closeButton: true,
        onClose: () => {
          toastIdRef.current = null;
        },
      });
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [authError, loading, dispatch]);

  // --- Form Submission Handler ---
  const handleFormSubmit = async (e, type) => {
    e.preventDefault();
    dispatch(clearError());
    if (toastIdRef.current) toast.dismiss(toastIdRef.current);
    loginSuccessShown.current = false;

    // Ensure you are accessing elements correctly (e.target.elements might be safer)
    const email = e.target.elements.email?.value;
    const password = e.target.elements.password?.value; // Use optional chaining

    if (!email) {
      console.error("Email field not found in form");
      toast.error("An error occurred. Could not find email field.");
      return;
    }
    if (type !== "forgot" && !password) {
      console.error("Password field not found in form");
      toast.error("An error occurred. Could not find password field.");
      return;
    }

    try {
      if (type === "login") {
        await dispatch(handleSignIn({ email, password })).unwrap();
        // Success handled by useEffect watching isAuthenticated
      } else if (type === "signup") {
        await dispatch(handleSignUp({ email, password })).unwrap();
        toastIdRef.current = toast.success(
          "Account created! Please check your email for verification.",
          {
            position: "top-right",
            autoClose: 5000,
            onClose: () => {
              toastIdRef.current = null;
            },
          }
        );
        setIsSignUp(false);
        setAuthMode("default");
      } else if (type === "forgot") {
        await dispatch(handleForgetPassword(email)).unwrap();
        toastIdRef.current = toast.success(
          "Reset link sent! Please check your email.",
          {
            position: "top-right",
            autoClose: 5000,
            onClose: () => {
              toastIdRef.current = null;
            },
          }
        );
        setAuthMode("default");
        setIsSignUp(false);
      }
    } catch (err) {
      console.error(`[${type}] Dispatch rejected:`, err);
      // Error toast handled by the useEffect watching authError
    }
  };

  // Reusable AuthForm component - PASSES UNIQUE IDs
  const AuthForm = ({ type }) => (
    <form onSubmit={(e) => handleFormSubmit(e, type)} className="space-y-6">
      <CustomEmailInput
        // *** PASS UNIQUE ID ***
        id={`${type}-email-input`}
        name="email"
        required
        autoComplete={type === "signup" ? "email" : "username"} // Use "username" for login if it's not strictly email
      />
      {type !== "forgot" && (
        <PasswordInput
          // *** PASS UNIQUE ID ***
          id={`${type}-password-input`}
          name="password"
          placeholder="Enter password"
          required
          autoComplete={type === "login" ? "current-password" : "new-password"}
        />
      )}
      <ButtonColourfull
        text={
          loading
            ? "Processing..."
            : type === "signup"
            ? "Create Account"
            : type === "login"
            ? "Sign In"
            : "Send Reset Link"
        }
        type="submit"
        disabled={loading}
      />
    </form>
  );

  // Helper function to switch view
  const switchView = (newIsSignUp, newAuthMode = "default") => {
    dispatch(clearError());
    if (toastIdRef.current) toast.dismiss(toastIdRef.current);
    setIsSignUp(newIsSignUp);
    setAuthMode(newAuthMode);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        {authMode === "default" ? (
          <motion.div
            key="default-auth"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="relative w-full max-w-[900px] md:h-[600px] h-auto rounded-2xl overflow-hidden md:flex shadow-2xl mt-16 mb-16 md:mt-0 md:mb-0"
            style={{
              background: "rgba(0, 0, 0, 0.7)",
              backdropFilter: "blur(10px)",
            }}
          >
            {/* === Desktop Overlay Panel === */}
            <motion.div
              animate={{ x: isSignUp ? "100%" : "0%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute top-0 left-0 w-1/2 h-full bg-cover bg-center z-10 hidden md:block"
              style={{
                boxShadow: "0 0 50px rgba(139, 92, 246, 0.5)",
                backgroundColor: "rgba(139, 92, 246, 0.7)",
              }}
            >
              <div className="w-full h-full bg-purple-900/50 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center">
                <h2 className="text-4xl font-bold text-white mb-4">
                  {isSignUp ? "Welcome Back!" : "New Here?"}
                </h2>
                <p className="text-white/80 mb-8">
                  {isSignUp
                    ? "Already have an account? Sign in."
                    : "Sign up and join the community!"}
                </p>
                <button
                  onClick={() => switchView(!isSignUp)}
                  className="px-8 py-3 border-2 border-white text-white rounded-full hover:bg-white hover:text-purple-900 transition-all"
                  disabled={loading}
                >
                  {isSignUp ? "Sign In" : "Sign Up"}
                </button>
              </div>
            </motion.div>

            {/* === Mobile View (Renders AuthForm with type='signup' or type='login') === */}
            <div className="md:hidden w-full perspective-1000 p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={isSignUp ? "signUpMobile" : "signInMobile"}
                  initial={{ rotateY: isSignUp ? -90 : 90, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  exit={{ rotateY: isSignUp ? 90 : -90, opacity: 0 }}
                  transition={{
                    duration: 0.6,
                    type: "spring",
                    stiffness: 200,
                    damping: 25,
                  }}
                  style={{
                    backfaceVisibility: "hidden",
                    transformStyle: "preserve-3d",
                  }}
                  className="w-full"
                >
                  {isSignUp ? (
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-6 text-center">
                        Create Account
                      </h2>
                      {/* AuthForm receives type='signup' */}
                      <AuthForm type="signup" />
                      <div className="mt-6 text-center">
                        <button
                          onClick={() => switchView(false)}
                          className="text-purple-400 hover:text-purple-300"
                          disabled={loading}
                        >
                          Already have an account? Sign In
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-6 text-center">
                        Welcome Back!
                      </h2>
                      {/* AuthForm receives type='login' */}
                      <AuthForm type="login" />
                      <div className="mt-4 flex flex-col items-center space-y-3">
                        <button
                          onClick={() => switchView(false, "forgot")}
                          className="text-purple-400 hover:text-purple-300"
                          disabled={loading}
                        >
                          Forgot Password?
                        </button>
                        <button
                          onClick={() => switchView(true)}
                          className="text-purple-400 hover:text-purple-300"
                          disabled={loading}
                        >
                          New here? Create Account
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* === Desktop Forms Container === */}
            <div className="hidden md:flex w-full">
              {/* === Desktop Sign Up Form (Renders AuthForm with type='signup') === */}
              <div className="w-1/2 flex items-center justify-center p-10">
                <div
                  className={`w-full transition-opacity duration-300 ${
                    isSignUp
                      ? "opacity-100 z-20"
                      : "opacity-0 z-0 pointer-events-none"
                  }`}
                >
                  <h2 className="text-3xl font-bold text-white mb-8 text-center">
                    Create Account
                  </h2>
                  {/* AuthForm receives type='signup' */}
                  <AuthForm type="signup" />
                </div>
              </div>
              {/* === Desktop Sign In Form (Renders AuthForm with type='login') === */}
              <div className="w-1/2 flex items-center justify-center p-10">
                <div
                  className={`w-full transition-opacity duration-300 ${
                    !isSignUp
                      ? "opacity-100 z-20"
                      : "opacity-0 z-0 pointer-events-none"
                  }`}
                >
                  <h2 className="text-3xl font-bold text-white mb-8 text-center">
                    Welcome Back!
                  </h2>
                  {/* AuthForm receives type='login' */}
                  <AuthForm type="login" />
                  <button
                    className="mt-4 text-purple-400 hover:text-purple-300 w-full text-center"
                    onClick={() => switchView(false, "forgot")}
                    disabled={loading}
                  >
                    Forgot Password?
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          // === Forgot Password View (Renders AuthForm with type='forgot') ===
          <motion.div
            key="forgot-password"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="p-8 bg-black/70 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-md border border-purple-500/30"
          >
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Reset Password
            </h2>
            {/* AuthForm receives type='forgot' */}
            <AuthForm type="forgot" />
            <button
              className="mt-6 text-purple-400 hover:text-purple-300 w-full text-center"
              onClick={() => switchView(false, "default")}
              disabled={loading}
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
