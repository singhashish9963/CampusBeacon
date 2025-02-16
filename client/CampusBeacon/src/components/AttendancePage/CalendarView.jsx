import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Slash,
  AlertTriangle,
  Loader,
} from "lucide-react";
import { useAttendanceContext } from "../../contexts/attendanceContext";

const CalendarView = ({
  currentMonth,
  setCurrentMonth,
  selectedDate,
  setSelectedDate,
  subjects,
  selectedSubjectId,
  setSelectedSubjectId,
}) => {
  const {
    markAttendance: markAttendanceAPI,
    getAttendanceRecords,
    loading,
    currentUser,
  } = useAttendanceContext();

  const [currentDateTime, setCurrentDateTime] = useState("2025-02-13 14:37:42");
  const [markedDates, setMarkedDates] = useState({});
  const [notification, setNotification] = useState(null);
  const [processingDate, setProcessingDate] = useState(null);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentDateTime(now.toISOString().replace("T", " ").split(".")[0]);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch attendance records for the current month
  useEffect(() => {
    const fetchMonthlyAttendance = async () => {
      if (!selectedSubjectId) return;

      try {
        const records = await getAttendanceRecords(
          selectedSubjectId,
          currentMonth.getMonth() + 1,
          currentMonth.getFullYear()
        );

        const marked = records.reduce((acc, record) => {
          acc[record.date] = record.status.toLowerCase();
          return acc;
        }, {});

        setMarkedDates(marked);
      } catch (err) {
        setNotification({
          type: "error",
          message: "Failed to fetch attendance records",
        });
      }
    };

    fetchMonthlyAttendance();
  }, [selectedSubjectId, currentMonth, getAttendanceRecords]);

  // Current date logic (using a fixed current date for demonstration)
  const currentDate = new Date("2025-02-13");

  const isCurrentDate = (dateString) =>
    dateString === currentDate.toISOString().split("T")[0];
  const isPastDate = (dateString) => new Date(dateString) < currentDate;

  // Calendar generation logic
  const startOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  );
  const endOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  );
  const startDay = startOfMonth.getDay();
  const totalDays = endOfMonth.getDate();

  const daysArray = [
    ...Array(startDay).fill(null),
    ...Array(totalDays)
      .fill()
      .map((_, i) => i + 1),
  ];

  // Handle attendance marking (ensure status is standardized before sending)
  const handleMarkAttendance = async (status) => {
    if (!selectedSubjectId || !selectedDate) return;

    setProcessingDate(selectedDate);
    // Standardize status ("present" -> "Present", etc.)
    const standardizedStatus =
      status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    try {
      await markAttendanceAPI(
        selectedSubjectId,
        selectedDate,
        standardizedStatus
      );

      setMarkedDates((prev) => ({
        ...prev,
        [selectedDate]: standardizedStatus,
      }));

      setNotification({
        type: "success",
        message: `Attendance marked as ${standardizedStatus} successfully`,
      });
    } catch (err) {
      setNotification({
        type: "error",
        message: err.message || "Failed to mark attendance",
      });
    } finally {
      setProcessingDate(null);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  return (
    <motion.div
      key="calendar"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-6 rounded-xl bg-gradient-to-br from-purple-900/50 to-fuchsia-900/50 border border-purple-500/30"
    >
      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
              notification.type === "error"
                ? "bg-red-500/20 text-red-400 border border-red-500/30"
                : "bg-green-500/20 text-green-400 border border-green-500/30"
            }`}
          >
            {notification.type === "error" ? (
              <AlertTriangle className="w-4 h-4" />
            ) : (
              <CheckCircle className="w-4 h-4" />
            )}
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Calendar Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() =>
            setCurrentMonth(
              new Date(
                currentMonth.getFullYear(),
                currentMonth.getMonth() - 1,
                1
              )
            )
          }
          className="p-2 hover:bg-purple-500/20 rounded-lg text-white"
          disabled={loading}
        >
          <ChevronLeft />
        </button>
        <h2 className="text-xl text-white font-semibold">
          {currentMonth.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </h2>
        <button
          onClick={() =>
            setCurrentMonth(
              new Date(
                currentMonth.getFullYear(),
                currentMonth.getMonth() + 1,
                1
              )
            )
          }
          className="p-2 hover:bg-purple-500/20 rounded-lg text-white"
          disabled={loading}
        >
          <ChevronRight />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2 text-center mb-2 mt-4 text-gray-400 font-semibold">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {daysArray.map((day, i) => {
          const dateString = day
            ? new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
                .toISOString()
                .split("T")[0]
            : null;

          const isCurrent = dateString && isCurrentDate(dateString);
          const isPast = dateString && isPastDate(dateString);
          const isSelected = dateString === selectedDate;
          const markedStatus = markedDates[dateString];

          return (
            <motion.button
              key={i}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (day && !isPast && !loading) setSelectedDate(dateString);
              }}
              className={`
                ${
                  !day
                    ? "cursor-default"
                    : isPast
                    ? "text-gray-600 cursor-not-allowed"
                    : isSelected
                    ? "bg-purple-500 text-white"
                    : isCurrent
                    ? "bg-purple-300/20 text-purple-300 hover:bg-purple-500/20"
                    : "hover:bg-purple-500/20 text-gray-300"
                }
                p-2 rounded-lg transition-all relative
                ${loading ? "opacity-50 cursor-not-allowed" : ""}
                ${
                  markedStatus === "present" || markedStatus === "Present"
                    ? "border-2 border-green-500/50"
                    : markedStatus === "absent" || markedStatus === "Absent"
                    ? "border-2 border-red-500/50"
                    : markedStatus === "cancelled" ||
                      markedStatus === "Cancelled"
                    ? "border-2 border-yellow-500/50"
                    : ""
                }
              `}
              disabled={!day || isPast || loading}
            >
              {day || ""}
              {isCurrent && (
                <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2">
                  <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                </div>
              )}
              {processingDate === dateString && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
                  <Loader className="w-4 h-4 animate-spin" />
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Subject Selection */}
      <div className="mt-6">
        <h3 className="text-white font-medium mb-2">Select Subject</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {subjects.map((subject) => (
            <motion.button
              key={subject.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedSubjectId(subject.id)}
              className={`p-3 rounded-lg border ${
                selectedSubjectId === subject.id
                  ? "bg-purple-500 text-white border-purple-400"
                  : "bg-purple-500/20 text-gray-200 border-purple-500/30 hover:bg-purple-500/30"
              } flex items-center gap-2`}
              disabled={loading}
            >
              <span className="text-2xl">{subject.icon}</span>
              <span className="truncate">{subject.name}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Attendance Marking */}
      {selectedSubjectId && selectedDate && !isPastDate(selectedDate) && (
        <div className="mt-4">
          <h4 className="text-white font-medium mb-2">
            Mark Attendance for{" "}
            <span className="font-semibold underline">
              {subjects.find((s) => s.id === selectedSubjectId)?.name}
            </span>{" "}
            on <span className="font-semibold underline">{selectedDate}</span>
          </h4>
          <div className="flex gap-4 flex-wrap">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleMarkAttendance("present")}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30"
              disabled={loading}
            >
              <CheckCircle className="w-4 h-4" />
              Present
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleMarkAttendance("absent")}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30"
              disabled={loading}
            >
              <XCircle className="w-4 h-4" />
              Absent
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleMarkAttendance("cancelled")}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 hover:bg-yellow-500/30"
              disabled={loading}
            >
              <Slash className="w-4 h-4" />
              Cancelled
            </motion.button>
          </div>
        </div>
      )}

      {/* Time Display */}
      <div className="mt-6 pt-4 border-t border-purple-500/20">
        <div className="flex justify-between items-center text-gray-400 text-sm">
          <span>Current Time (UTC): {currentDateTime}</span>
          <span>User: {currentUser?.login || "Unknown"}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default CalendarView;
