import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FiCalendar, FiPlusCircle, FiLoader } from "react-icons/fi";
import { format } from "date-fns";

const DetailedViewControls = ({
  themeStyles,
  selectedSubject,
  selectedDate,
  onDateChange,
  onMarkTodayClick,
  maxDate,
  isActionDisabled,
}) => {
  const todayDate = format(new Date(), "yyyy-MM-dd");

  return (
    <div
      className={`${themeStyles.cardBg} rounded-xl p-4 md:p-6 mb-8 border ${themeStyles.borderColor} grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 items-center`}
    >
      <div className="md:col-span-1">
        <h3 className="text-lg font-semibold text-gray-200 mb-1">
          Viewing Details For:
        </h3>
        <p
          className="text-amber-400 font-medium truncate"
          title={selectedSubject?.name}
        >
          {selectedSubject?.name || "..."}
        </p>
        <p className="text-xs text-gray-400">
          {selectedSubject?.code || "..."}
        </p>
      </div>

      <div className="md:col-span-1">
        <label
          htmlFor="detailSelectedDate"
          className="block text-sm font-medium text-gray-300 mb-2"
        >
          Select Date
        </label>
        <div className="relative">
          <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none z-10" />
          <DatePicker
            selected={selectedDate}
            onChange={onDateChange}
            dateFormat="yyyy-MM-dd"
            placeholderText="YYYY-MM-DD"
            className={`relative w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-700/50 border ${themeStyles.borderColor} focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors text-white placeholder-gray-400 cursor-pointer`}
            maxDate={maxDate}
            id="detailSelectedDate"
            popperPlacement="bottom-start"
          />
        </div>
      </div>

      <div className="md:col-span-1 flex justify-end items-end h-full">
        <button
          onClick={onMarkTodayClick}
          disabled={isActionDisabled}
          title={`Mark attendance for ${selectedSubject?.name} for ${todayDate}`}
          className={`w-full md:w-auto px-5 py-2.5 rounded-lg font-semibold shadow text-white flex items-center justify-center transition-all duration-300 ${
            isActionDisabled
              ? "bg-gray-500 cursor-not-allowed opacity-70"
              : `bg-gradient-to-r ${themeStyles.buttonGradient} hover:brightness-110`
          }`}
        >
          {isActionDisabled && <FiLoader className="animate-spin mr-2" />}
          {!isActionDisabled && <FiPlusCircle className="mr-2" />}
          Mark for Today
        </button>
      </div>
    </div>
  );
};

export default DetailedViewControls;
