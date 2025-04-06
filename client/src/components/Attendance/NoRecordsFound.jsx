import React from "react";
import { FiCalendar, FiPlusCircle } from "react-icons/fi";
import { format } from "date-fns";

const NoRecordsFound = ({
  themeStyles,
  selectedDate,
  onMarkThisDateClick,
  isActionDisabled,
}) => {
  const handleMarkClick = () => {
    // Calls modal with 'create' mode and the currently selected date
    onMarkThisDateClick("create", null, selectedDate);
  };

  return (
    <div className="flex-grow flex flex-col items-center justify-center text-center py-10">
      <FiCalendar size={40} className="text-gray-600 mb-3" />
      <p className="text-gray-500 italic">
        No attendance record found for this subject on{" "}
        {selectedDate
          ? format(selectedDate, "dd MMM yyyy")
          : "the selected date"}
        .
      </p>
      <button
        onClick={handleMarkClick}
        disabled={isActionDisabled}
        className={`mt-4 px-4 py-2 rounded-lg text-sm font-semibold shadow text-white flex items-center justify-center transition-all duration-300 ${
          isActionDisabled
            ? "bg-gray-500 cursor-not-allowed opacity-70"
            : `bg-gradient-to-r ${themeStyles.buttonGradient} hover:brightness-110`
        }`}
      >
        <FiPlusCircle className="mr-1.5" /> Mark for this Date
      </button>
    </div>
  );
};

export default NoRecordsFound;
