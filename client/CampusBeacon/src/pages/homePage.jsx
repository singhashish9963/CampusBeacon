import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ButtonColourfull from "../components/ButtonColourfull";
import StarsBg from "../components/StarsBg";
import FeatureCard from "../components/FeatureCard.jsx";

import QuickLinks from "../components/QuickLinks.jsx"
import EventsSection from "../components/EventsSection.jsx"


const HomePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(()=>{
    const token=localStorage.getItem("token");
    if(token){
      setIsLoggedIn(true);
    }
  },[]);

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate("/login");
  };



  return (
    <div>
      <StarsBg />
      <h1>Welcome to Campus Beacon</h1>
      {isLoggedIn ? (
        <ButtonColourfull onClick={handleLogout}>Logout</ButtonColourfull>
      ) : (
        <ButtonColourfull onClick={() => navigate("/login")}>Login</ButtonColourfull>
      )}
      <FeatureCard />
      <QuickLinks/>
      <EventsSection/> 
    </div>
  );

}


export default HomePage;
