import React from "react";
import { useDispatch, useSelector } from "react-redux";

const TimeDisplay = ({ currentTime, currentUser }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  return (
    <div className="text-center text-gray-400 text-sm mt-4">
      <p>Current Time (UTC): {currentTime}</p>
      <p>User: {currentUser}</p>
    </div>
  );
};

export default TimeDisplay;
