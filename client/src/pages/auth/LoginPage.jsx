import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  handleSignIn,
  handleSignUp,
  handleForgetPassword,
  handleGoogleAuth,
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
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const authError = useSelector((state) => state.auth.error);
  const loading = useSelector((state) => state.auth.loading);

  const [isSignUp, setIsSignUp] = useState(false);
  const [authMode, setAuthMode] = useState("default");

  const navigate = useNavigate();
  const loginSuccessShown = useRef(false);
  const redirectTimerRef = useRef(null);
  const toastIdRef = useRef(null);

  useEffect(() => {
    dispatch(clearError());
    if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current);
    loginSuccessShown.current = false;
  }, [dispatch, authMode, isSignUp]);

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

  const handleFormSubmit = async (e, type) => {
    e.preventDefault();
    dispatch(clearError());
    if (toastIdRef.current) toast.dismiss(toastIdRef.current);
    loginSuccessShown.current = false;

    const email = e.target.elements.email?.value;
    const password = e.target.elements.password?.value;

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
        toast.success("Welcome back!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
        });
        setTimeout(() => {
          navigate("/");
        }, 1000);
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
    }
  };

const handleGoogleSignIn = async () => {
  try {
    const googleAuth = window.google?.accounts?.oauth2;

    if (!googleAuth) {
      toast.error("Google authentication not available");
      return;
    }

    const client = google.accounts.oauth2.initTokenClient({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      scope: "email profile openid",
      callback: async (response) => {
        const id_token = response.id_token; // THIS is what backend wants
        if (!id_token) {
          toast.error("Google authentication failed");
          return;
        }

        try {
          await dispatch(handleGoogleAuth(id_token)).unwrap();
          toast.success("Signed in with Google!");
          setTimeout(() => navigate("/"), 1000);
        } catch (err) {
          console.error("Google auth error:", err);
          toast.error("Google auth failed")
        }
      },
    });
    client.requestAccessToken({ prompt: "consent" }); // triggers token request
  } catch (err) {
    console.error("Google sign-in error:", err);
    toast.error("Failed to sign in with Google");
  }
};


  const AuthForm = ({ type }) => (
    <div className="space-y-6 w-full">
      <form onSubmit={(e) => handleFormSubmit(e, type)} className="space-y-4">
        <CustomEmailInput
          id={`${type}-email-input`}
          name="email"
          required
          autoComplete={type === "signup" ? "email" : "username"}
        />
        {type !== "forgot" && (
          <PasswordInput
            id={`${type}-password-input`}
            name="password"
            placeholder="Enter password"
            required
            autoComplete={
              type === "login" ? "current-password" : "new-password"
            }
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
          className="w-full py-3"
        />
      </form>

      {type !== "forgot" && (
        <>
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative px-4 bg-transparent">
              <span className="text-sm text-gray-400">or</span>
            </div>
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-800 font-medium py-3 px-4 rounded-md transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            <span>
              {type === "login" ? "Sign in with Google" : "Sign up with Google"}
            </span>
          </button>
        </>
      )}
    </div>
  );

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
            className="relative w-full max-w-[900px] md:h-[620px] h-auto rounded-2xl overflow-hidden md:flex shadow-2xl my-8 md:my-0"
            style={{
              background: "rgba(0, 0, 0, 0.7)",
              backdropFilter: "blur(10px)",
            }}
          >
            {/* Sliding overlay panel for desktop */}
            <motion.div
              animate={{ x: isSignUp ? "100%" : "0%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute top-0 left-0 w-1/2 h-full z-10 hidden md:block"
              style={{
                background: "rgba(139, 92, 246, 0.2)", // More transparent
                backdropFilter: "blur(8px)",
                boxShadow: "0 0 50px rgba(139, 92, 246, 0.3)",
                borderRight: isSignUp
                  ? "none"
                  : "1px solid rgba(139, 92, 246, 0.3)",
                borderLeft: isSignUp
                  ? "1px solid rgba(139, 92, 246, 0.3)"
                  : "none",
              }}
            >
              <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-purple-900/100 ">
                <h2 className="text-4xl font-bold text-white mb-6">
                  {isSignUp ? "Welcome Back!" : "New Here?"}
                </h2>
                <p className="text-white/80 mb-8 max-w-xs">
                  {isSignUp
                    ? "Already have an account? Sign in to continue your journey."
                    : "Sign up and join our community today! It only takes a minute."}
                </p>
                <button
                  onClick={() => switchView(!isSignUp)}
                  className="px-10 py-3 border-2 border-white text-white rounded-full hover:bg-white hover:text-purple-900 transition-all duration-300"
                  disabled={loading}
                >
                  {isSignUp ? "Sign In" : "Sign Up"}
                </button>
              </div>
            </motion.div>

            {/* Mobile view with flipping animation */}
            <div className="md:hidden w-full p-6">
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
                    <div className="w-full">
                      <h2 className="text-3xl font-bold text-white mb-6 text-center">
                        Create Account
                      </h2>
                      <AuthForm type="signup" />
                      <div className="mt-6 text-center">
                        <button
                          onClick={() => switchView(false)}
                          className="text-purple-400 hover:text-purple-300 transition-colors"
                          disabled={loading}
                        >
                          Already have an account? Sign In
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full">
                      <h2 className="text-3xl font-bold text-white mb-6 text-center">
                        Welcome Back!
                      </h2>
                      <AuthForm type="login" />
                      <div className="mt-6 flex flex-col items-center space-y-3">
                        <button
                          onClick={() => switchView(false, "forgot")}
                          className="text-purple-400 hover:text-purple-300 transition-colors"
                          disabled={loading}
                        >
                          Forgot Password?
                        </button>
                        <button
                          onClick={() => switchView(true)}
                          className="text-purple-400 hover:text-purple-300 transition-colors"
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

            {/* Desktop view with forms */}
            <div className="hidden md:flex w-full">
              <div className="w-1/2 flex items-center justify-center p-10">
                <div
                  className={`w-full max-w-md mx-auto transition-all duration-300 ${
                    isSignUp
                      ? "opacity-100 z-20"
                      : "opacity-0 z-0 pointer-events-none"
                  }`}
                >
                  <h2 className="text-3xl font-bold text-white mb-8 text-center">
                    Create Account
                  </h2>
                  <AuthForm type="signup" />
                </div>
              </div>
              <div className="w-1/2 flex items-center justify-center p-10">
                <div
                  className={`w-full max-w-md mx-auto transition-all duration-300 ${
                    !isSignUp
                      ? "opacity-100 z-20"
                      : "opacity-0 z-0 pointer-events-none"
                  }`}
                >
                  <h2 className="text-3xl font-bold text-white mb-2 text-center">
                    Welcome Back!
                  </h2>
                  <AuthForm type="login" />
                  <button
                    className="mt-4 text-purple-400 hover:text-purple-300 w-full text-center transition-colors"
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
          // Forgot password view
          <motion.div
            key="forgot-password"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="p-8 bg-black/70 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-md mx-auto border border-purple-500/30"
          >
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Reset Password
            </h2>
            <AuthForm type="forgot" />
            <button
              className="mt-6 text-purple-400 hover:text-purple-300 w-full text-center transition-colors"
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
