import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../contexts/AuthContext.jsx";
import ButtonColourfull from "../components/ButtonColourfull.jsx";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { handleResetPassword } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Extract the token from query parameters (e.g., ?token=abc123)
  const token = searchParams.get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await handleResetPassword(token, password);
      if (response && response.success) {
        setMessage(
          "Your password has been reset successfully. Redirecting to login..."
        );
        // After a short delay, navigate to the login page
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        throw new Error(response?.message || "Password reset failed");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black flex items-center justify-center p-4">
      <AnimatePresence>
        <motion.div
          key="reset-password"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="p-8 bg-white/10 backdrop-blur-10 rounded-2xl shadow-2xl w-full max-w-[400px]"
        >
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Reset Password
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
          {message && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-green-500 mb-4 bg-green-500/10 p-3 rounded-lg"
            >
              {message}
            </motion.div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-white">
                New Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-4 bg-white/5 rounded-lg text-white border border-white/10 focus:outline-none focus:border-purple-500 transition-all mt-2"
              />
            </div>
            <ButtonColourfull
              text={isLoading ? "Resetting..." : "Reset Password"}
              type="submit"
              disabled={isLoading}
            />
          </form>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ResetPassword;
