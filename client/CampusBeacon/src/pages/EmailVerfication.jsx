import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const {
    handleEmailVerification,
    error: authError,
    welcomeMessage,
    isAuthenticated,
    user,
  } = useAuth();

  const [verificationError, setVerificationError] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState("pending");

  const hasAttemptedVerification = useRef(false);

  useEffect(() => {
    const verifyEmail = async () => {
      if (hasAttemptedVerification.current) return;

      const token = searchParams.get("token");
      if (!token) {
        setVerificationError("No verification token found in URL.");
        setVerificationStatus("failed");
        return;
      }

      hasAttemptedVerification.current = true; // Set ref to true to prevent multiple calls

      try {
        console.log("Starting verification with token:", token);
        const response = await handleEmailVerification(token);
        console.log("Verification response:", response);

        if (response?.success) {
          setVerificationStatus("success");
          
        } else {
          setVerificationError(response?.message || "Verification failed.");
          setVerificationStatus("failed");
        }
      } catch (error) {
        console.error("Verification error:", error);
        setVerificationError(
          error?.message || "An error occurred during verification."
        );
        setVerificationStatus("failed");
      }
    };

    verifyEmail();
  }, [searchParams, handleEmailVerification]);

  useEffect(() => {
    if (
      verificationStatus === "success" &&
      isAuthenticated &&
      user?.isVerified
    ) {
      const timer = setTimeout(() => {
        navigate("/");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [verificationStatus, isAuthenticated, navigate, user]);

  useEffect(() => {
    if (authError) {
      setVerificationError(authError);
      setVerificationStatus("failed");
    }
  }, [authError]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-black via-purple-900 to-black">
      <div className="max-w-md w-full bg-gray-800/50 backdrop-blur-md text-white p-8 rounded-lg shadow-xl border border-purple-500/20">
        <h1 className="text-2xl mb-6 font-bold text-center">
          {verificationStatus === "success"
            ? "Email Verified!"
            : verificationStatus === "failed"
            ? "Verification Failed"
            : "Verifying Email..."}
        </h1>

        {welcomeMessage && verificationStatus === "success" && (
          <div
            className="text-green-400 mb-4 p-4 bg-green-500/10 rounded-lg text-center"
            data-testid="welcome-message"
          >
            {welcomeMessage}
          </div>
        )}

        {(verificationError || authError) && (
          <div
            className="text-red-500 mb-4 p-4 bg-red-500/10 rounded-lg text-center"
            data-testid="error-message"
          >
            {verificationError || authError}
          </div>
        )}

        {verificationStatus === "pending" && (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          </div>
        )}

        {verificationStatus === "success" && (
          <p className="text-gray-300 text-center mt-4">
            Redirecting to homepage...
          </p>
        )}
      </div>
    </div>
  );
};

export default EmailVerification;
