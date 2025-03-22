import React, { useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { handleEmailVerification, clearError } from "../slices/authSlice";

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    error: authError,
    isAuthenticated,
    user,
  } = useSelector((state) => state.auth);
  const [verificationState, setVerificationState] = useState({
    status: "pending",
    error: null,
    isLoading: true,
  });

  const hasAttemptedVerification = useRef(false);
  const tokenRef = useRef(searchParams.get("token"));

  const validateToken = useCallback((token) => {
    if (!token || typeof token !== "string" || token.trim() === "") {
      return {
        isValid: false,
        error: "Invalid or missing verification token.",
      };
    }
    return {
      isValid: true,
      error: null,
    };
  }, []);

  const handleNavigateHome = useCallback(() => {
    navigate("/");
  }, [navigate]);

  useEffect(() => {
    if (hasAttemptedVerification.current) return;

    const token = tokenRef.current;
    const tokenValidation = validateToken(token);

    if (!tokenValidation.isValid) {
      setVerificationState({
        status: "failed",
        error: tokenValidation.error,
        isLoading: false,
      });
      hasAttemptedVerification.current = true;
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await dispatch(
          handleEmailVerification(token)
        ).unwrap();
        if (response) {
          setVerificationState({
            status: "success",
            error: null,
            isLoading: false,
          });
        } else {
          throw new Error("Verification failed.");
        }
      } catch (error) {
        setVerificationState({
          status: "failed",
          error: error.message,
          isLoading: false,
        });
      }
    };

    hasAttemptedVerification.current = true;
    verifyEmail();
  }, [dispatch, validateToken]);

  useEffect(() => {
    return () => {
      hasAttemptedVerification.current = false;
    };
  }, []);

  useEffect(() => {
    if (authError) {
      setVerificationState((prev) => ({
        ...prev,
        status: "failed",
        error: authError,
      }));
    }
  }, [authError]);

  useEffect(() => {
    let timer;
    if (
      verificationState.status === "success" &&
      isAuthenticated &&
      user?.isVerified
    ) {
      timer = setTimeout(handleNavigateHome, 3000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [verificationState.status, isAuthenticated, user, handleNavigateHome]);

  const renderContent = () => {
    if (verificationState.isLoading) {
      return (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        </div>
      );
    }

    if (verificationState.status === "success") {
      return (
        <>
          <div className="text-center mt-4">
            <p className="text-gray-300 mb-2">Redirecting to homepage...</p>
            <button
              onClick={handleNavigateHome}
              className="px-4 py-2 text-purple-400 hover:text-purple-300 transition-colors duration-200"
            >
              Continue now
            </button>
          </div>
        </>
      );
    }

    if (verificationState.error) {
      return (
        <div
          className="text-red-500 mb-4 p-4 bg-red-500/10 rounded-lg text-center"
          data-testid="error-message"
        >
          {verificationState.error}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-black via-purple-900 to-black">
      <div className="max-w-md w-full bg-gray-800/50 backdrop-blur-md text-white p-8 rounded-lg shadow-xl border border-purple-500/20">
        <h1 className="text-2xl mb-6 font-bold text-center">
          {verificationState.status === "success"
            ? "Email Verified!"
            : verificationState.status === "failed"
            ? "Verification Failed"
            : "Verifying Email..."}
        </h1>
        {renderContent()}
      </div>
    </div>
  );
};

export default EmailVerification;
