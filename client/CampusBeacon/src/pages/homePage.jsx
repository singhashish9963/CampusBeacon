import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ButtonColourfull from "../components/ButtonColourfull";
import StarsBg from "../components/StarsBg";

const HomePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <div className="bg-black text-white min-h-[300vh] relative">
        <div className="fixed inset-0 pointer-events-none">
          {/* Stars */}
          {[...Array(100)].map((_, i) => (
            <StarsBg key={i} delay={i * 0.1} />
          ))}
          <div className="fixed top-6 right-6 z-50 flex items-center gap-4">
            {isLoggedIn ? (
              <ButtonColourfull text="Logout" />
            ) : (
              <ButtonColourfull text="Login/Signup" buttonsize="w-full p-3" />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
