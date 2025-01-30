import React, {createContext,useState,useContext} from "react";
import axios from "axios"
const AuthContext= createContext();

export const AuthProvider = ({ children }) => {
  const [isSignUp, setIsSignUP] = useState(false);
  const [isForgetPassword, setiIForgetPassword] = useState(false);

  const handleSignUp = async (email, password) => {
    try {
      const response = await axios.post("/signup", { email, password });

      console.log("Sign up successful with email:", email);
    } catch (error) {
      console.error("Error during sign up:", error);
    }
  };
  const handleSignIn = async (email, password) => {
    try {
      const response = await axios.post("/forget-password", { email });
      console.log("Forget password request sent for email:", email);
    } catch (error) {
      console.error("Error during forget password:", error);
    }
  };
  const handleForgetPassword = async (email, password) => {
    try {
      const response = await axios.post("/forget-password", { email });
      console.log("Forget password request sent for email:", email);
    } catch (error) {
      console.error("Error during forget password:", error);
    }
  };
  const handleResetPassword = async (email, password) => {
    try {
      const response = await axios.post("/reset-password", {
        email,
        password,
      });
      console.log("Reset password successful for email:", email);
    } catch (error) {
      console.error("Error during reset password:", error);
    }
  };
  const handleSubmit = (e, actionType) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    if (actionType === "signUp") {
      handleSignUp(email, password);
    } else if (actionType === "signIn") {
      handleSignIn(email, password);
    } else if (actionType === "forgetPassword") {
      handleForgetPassword(email);
    } else if (actionType === "resetPassword") {
      handleResetPassword(email, password);
    }
  };
  return (
    <AuthContext.Provider
      value={{
        isSignUp,
        setIsSignUP,
        isForgetPassword,
        setIsForgetPassword,
        handleSignUp,
        handleSignIn,
        handleForgetPassword,
        handleResetPassword,
        handleSubmit,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);