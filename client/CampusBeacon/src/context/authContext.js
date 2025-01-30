import React, {createContext,useState,useContext} from "react";
import Axios from "Axios"
const AuthContext= createContext();

export const AuthProvider=({children})=>{
    const [isSignUp,setIsSignUP]= useState(false);
    const [isForgetPassword, setiIForgetPassword] = useState(false);


    const handleSignUp= async (email, password) => {
        try {
            const signup=Axios.fetch()

            console.log("Sign up successful with email:", email);
        } catch (error) {
            console.error("Error during sign up:", error);
        }
    }
    const handleSignIn= async(email,password)=>{

    }
    const handleForgetPassword = async (email,password)=>{

    }
    const handleResetPassword= async (email,password)=>{
        
    }
    const handleSubmit = (e, actionType) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;

        if (actionType === 'signUp') {
            handleSignUp(email, password);
        } else if (actionType === 'signIn') {
            handleSignIn(email, password);
        } else if (actionType === 'forgetPassword') {
            handleForgetPassword(email);
        } else if (actionType === 'resetPassword') {
            handleResetPassword(email, password);
        }
    }
    return (
    <AuthContext.Provider value={{
      isSignUp,
      setIsSignUP,
      isForgetPassword,
      setiIForgetPassword,
      handleSignUp,
      handleSignIn,
      handleForgetPassword
    }}>
      {children}
    </AuthContext.Provider>
    );
};

export const useAuth= ()=> useContext(AuthContext);