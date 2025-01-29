import React, {useState} from "react";

function LoginSignup() {
  const [isSignUp, setIsSignUP] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black flex items-center justify-center">
      <div className="w-full h-full bg-purple-900 backdrop-blur-sm flex flex-col items-center justify-center mb-9">
        <h2 className="text-3xl font-bold text-white">
          {isSignUp ? "Welcome Back" : "New Here?"}
        </h2>
        <p className="text-white text-center mb-9">
          {isSignUp
          ?"Already have an account? Sign in to continue"
          :"Sign up to start a new journey"}
        </p>
        <button
        onClick={() => setIsSignUP(!isSignUp)}
        className="px-8 py-3 border-5 border-white text-white rounded-full hover:bg-white hover:text-purple-900 transition-all"
        >
          {isSignUp?"Sign In":"Sign Up"}
        </button>
    </div>
    </div>
  );
}

export default LoginSignup;
