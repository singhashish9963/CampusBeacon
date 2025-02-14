import React, { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";

// Component imports
import SubjectForm from "../components/AttendancePage/SubjectForm";
import DashboardView from "../components/AttendancePage/DashboardView";
import CalendarView from "../components/AttendancePage/CalendarView";
import AchievementsView from "../components/AttendancePage/AchievementsView";
import SettingsView from "../components/AttendancePage/SettingsView";
import Header from "../components/AttendancePage/Header";
import Navigation from "../components/AttendancePage/Navigation";
import Notification from "../components/AttendancePage/Notification";
import LoadingOverlay from "../components/AttendancePage/LoadingOverlay";
import BackgroundAnimation from "../components/AttendancePage/BackgroundAnimation";
import { useAttendance } from "../contexts/attendanceContext";

const AttendanceManager = () => {
  const {
    subjects,
    loading: contextLoading,
    error: contextError,
    fetchSubjects,
    addUserSubject,
    removeUserSubject,
    markAttendance: markAttendanceAPI,
    getAttendanceRecords,
  } = useAttendance();

  // Local States
  const [activeTab, setActiveTab] = useState("dashboard");
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [editSubjectData, setEditSubjectData] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState("2025-02-12");
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [currentDateTime, setCurrentDateTime] = useState("2025-02-13 14:41:59");
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [trendData, setTrendData] = useState([]);

  // Animation values
  const y = useMotionValue(0);
  const rotate = useTransform(y, [-100, 100], [-10, 10]);

  // Achievements state
  const [achievements, setAchievements] = useState([
    {
      id: 1,
      title: "Perfect Week",
      description: "100% attendance for a week",
      unlocked: false,
    },
    {
      id: 2,
      title: "Study Champion",
      description: "Maintain 90% attendance in all subjects",
      unlocked: false,
    },
    {
      id: 3,
      title: "Consistency King",
      description: "10-day attendance streak",
      unlocked: false,
    },
  ]);

  // Card tilt effect options
  const defaultOptions = {
    reverse: false,
    max: 35,
    perspective: 1000,
    scale: 1.05,
    speed: 1000,
    transition: true,
    axis: null,
    reset: true,
    easing: "cubic-bezier(.03,.98,.52,.99)",
  };

  // Initialize and fetch data
  useEffect(() => {
    fetchSubjects();
    updateDateTime();
    const timer = setInterval(updateDateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Update date time
  const updateDateTime = () => {
    const now = new Date();
    setCurrentDateTime(now.toISOString().replace("T", " ").split(".")[0]);
  };

  // Update trend data when subjects change
  useEffect(() => {
    updateTrendData();
  }, [subjects]);

  // Fetch and update trend data
  const updateTrendData = async () => {
    try {
      const months = Array.from({ length: 6 }, (_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        return {
          month: d.toLocaleString("default", { month: "short" }),
          year: d.getFullYear(),
        };
      }).reverse();

      const data = await Promise.all(
        months.map(async ({ month, year }) => {
          const records = await getAttendanceRecords(month, year);
          const attendance = calculateAverageAttendance(records);
          return { month: `${month}`, attendance };
        })
      );

      setTrendData(data);
    } catch (error) {
      setNotification({
        type: "error",
        message: "Failed to fetch trend data",
      });
    }
  };

  // Utility Functions
  const calculateStats = (subject) => {
    const attendance =
      subject.totalClasses > 0
        ? (subject.attendedClasses / subject.totalClasses) * 100
        : 0;

    const toGoal = subject.goal - attendance;
    const classesNeeded = Math.ceil(
      (subject.goal * subject.totalClasses - 100 * subject.attendedClasses) /
        (100 - subject.goal)
    );

    let statusVal = "danger";
    if (attendance >= 75) statusVal = "good";
    else if (attendance >= 60) statusVal = "warning";

    return {
      attendancePercent: attendance || 0,
      streak: subject.streak,
      status: statusVal,
      needed: classesNeeded > 0 ? classesNeeded : 0,
    };
  };

  // Handle subject form submission
  const handleSubmitSubjectForm = async (formData) => {
    try {
      setLoading(true);
      if (editSubjectData) {
        // Update existing subject
        await fetch(`/api/v1/subjects/${editSubjectData.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(formData),
        });
      } else {
        // Add new subject
        const response = await fetch("/api/v1/subjects/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(formData),
        });
        const data = await response.json();
        await addUserSubject(data.data.id);
      }

      setNotification({
        type: "success",
        message: `Subject ${
          editSubjectData ? "updated" : "added"
        } successfully!`,
      });
      setShowSubjectModal(false);
      fetchSubjects();
    } catch (error) {
      setNotification({
        type: "error",
        message: error.message || "Failed to save subject",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle subject removal
  const handleRemoveSubject = async (id) => {
    try {
      setLoading(true);
      await removeUserSubject(id);
      setNotification({
        type: "success",
        message: "Subject removed successfully!",
      });
      fetchSubjects();
    } catch (error) {
      setNotification({
        type: "error",
        message: error.message || "Failed to remove subject",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle attendance marking
  const markAttendanceHandler = async (subjectId, date, status) => {
    try {
      setLoading(true);
      await markAttendanceAPI(subjectId, date, status);
      setNotification({
        type: "success",
        message: `Attendance marked as ${status} successfully!`,
      });
      fetchSubjects();
    } catch (error) {
      setNotification({
        type: "error",
        message: error.message || "Failed to mark attendance",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-violet-900 to-fuchsia-800 p-6 relative overflow-hidden">
      <BackgroundAnimation />

      <div className="max-w-7xl mx-auto relative z-10">
        <Header currentUser="ayush-jadaun" currentDateTime={currentDateTime} />
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Modals & Overlays */}
        <AnimatePresence>
          {showSubjectModal && (
            <SubjectForm
              initialData={editSubjectData}
              onSubmit={handleSubmitSubjectForm}
              onCancel={() => setShowSubjectModal(false)}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {(loading || contextLoading) && <LoadingOverlay />}
        </AnimatePresence>

        <AnimatePresence>
          {(notification || contextError) && (
            <Notification
              type={notification?.type || "error"}
              message={notification?.message || contextError}
            />
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "dashboard" && (
              <DashboardView
                subjects={subjects}
                calculateStats={calculateStats}
                onAddSubject={() => setShowSubjectModal(true)}
                onEditSubject={(subject) => {
                  setEditSubjectData(subject);
                  setShowSubjectModal(true);
                }}
                onRemoveSubject={handleRemoveSubject}
                defaultOptions={defaultOptions}
                trendData={trendData}
              />
            )}
            {activeTab === "calendar" && (
              <CalendarView
                currentMonth={currentMonth}
                setCurrentMonth={setCurrentMonth}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                subjects={subjects}
                selectedSubjectId={selectedSubjectId}
                setSelectedSubjectId={setSelectedSubjectId}
                markAttendance={markAttendanceHandler}
              />
            )}
            {activeTab === "achievements" && (
              <AchievementsView
                achievements={achievements}
                defaultOptions={defaultOptions}
              />
            )}
            {activeTab === "settings" && <SettingsView subjects={subjects} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AttendanceManager;
