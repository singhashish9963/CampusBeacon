import React from "react";
import useAuth from "../../contexts/AuthContext"

const TimeDisplay = ({ currentTime, currentUser }) => {
  const {user} = useAuth
  return (
    <div className="text-center text-gray-400 text-sm mt-4">
      <p>Current Time (UTC): {currentTime}</p>
      <p>User: {currentUser}</p>
    </div>
  );
};

export default TimeDisplay;
