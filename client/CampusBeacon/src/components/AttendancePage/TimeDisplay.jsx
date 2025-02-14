import React from "react";

const TimeDisplay = ({ currentTime, currentUser }) => {
  return (
    <div className="text-center text-gray-400 text-sm mt-4">
      <p>Current Time (UTC): {currentTime}</p>
      <p>User: {currentUser}</p>
    </div>
  );
};

export default TimeDisplay;
