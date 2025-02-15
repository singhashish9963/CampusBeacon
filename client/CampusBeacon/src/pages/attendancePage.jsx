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
import { useAuth } from "../contexts/AuthContext";

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
    getAttendanceStats,
  } = useAttendance();

  const { user } = useAuth(); // Get current user from auth context

  // Local States
  const [activeTab, setActiveTab] = useState("dashboard");
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [editSubjectData, setEditSubjectData] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [attendanceStats, setAttendanceStats] = useState({});
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [trendData, setTrendData] = useState([]);

  // Animation values
  const y = useMotionValue(0);
  const rotate = useTransform(y, [-100, 100], [-10, 10]);

  // Initialize and fetch data
  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  // Fetch attendance stats when subject is selected
  useEffect(() => {
    if (selectedSubjectId) {
      const fetchStats = async () => {
        try {
          const stats = await getAttendanceStats(selectedSubjectId);
          setAttendanceStats((prev) => ({
            ...prev,
            [selectedSubjectId]: stats,
          }));
        } catch (error) {
          setNotification({
            type: "error",
            message: "Failed to fetch attendance statistics",
          });
        }
      };
      fetchStats();
    }
  }, [selectedSubjectId, getAttendanceStats]);

  // Update trend data when selected subject changes
  useEffect(() => {
    if (selectedSubjectId) {
      updateTrendData();
    }
  }, [selectedSubjectId]);

  const updateTrendData = async () => {
    try {
      const months = Array.from({ length: 6 }, (_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        return {
          month: d.getMonth() + 1,
          year: d.getFullYear(),
        };
      }).reverse();

      const data = await Promise.all(
        months.map(async ({ month, year }) => {
          const records = await getAttendanceRecords(
            selectedSubjectId,
            year,
            month
          );
          const monthName = new Date(year, month - 1).toLocaleString(
            "default",
            { month: "short" }
          );
          const presentCount = records.filter(
            (r) => r.status === "Present"
          ).length;
          const totalCount = records.length;
          const attendance =
            totalCount > 0 ? (presentCount / totalCount) * 100 : 0;

          return {
            month: monthName,
            attendance: parseFloat(attendance.toFixed(2)),
          };
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

  const calculateStats = (subject) => {
    const stats = attendanceStats[subject.id] || {
      percentage: 0,
      totalClasses: 0,
      totalPresent: 0,
    };

    const requiredPercentage = 75; // Minimum required attendance
    const currentPercentage = stats.percentage;
    const classesNeeded = Math.ceil(
      (requiredPercentage * stats.totalClasses - 100 * stats.totalPresent) /
        (100 - requiredPercentage)
    );

    return {
      attendancePercent: currentPercentage,
      status:
        currentPercentage >= 75
          ? "good"
          : currentPercentage >= 60
          ? "warning"
          : "danger",
      needed: classesNeeded > 0 ? classesNeeded : 0,
    };
  };

  const handleSubmitSubjectForm = async (formData) => {
    if (!user?.id) {
      setNotification({
        type: "error",
        message: "User not authenticated",
      });
      return;
    }

    try {
      setLoading(true);
      await addUserSubject(user.id, formData.id);
      setShowSubjectModal(false);
      await fetchSubjects();
      setNotification({
        type: "success",
        message: "Subject added successfully!",
      });
    } catch (error) {
      setNotification({
        type: "error",
        message: error.message || "Failed to add subject",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveSubject = async (subjectId) => {
    if (!user?.id) {
      setNotification({
        type: "error",
        message: "User not authenticated",
      });
      return;
    }

    try {
      setLoading(true);
      await removeUserSubject(user.id, subjectId);
      await fetchSubjects();
      setNotification({
        type: "success",
        message: "Subject removed successfully!",
      });
    } catch (error) {
      setNotification({
        type: "error",
        message: error.message || "Failed to remove subject",
      });
    } finally {
      setLoading(false);
    }
  };

  const markAttendanceHandler = async (subjectId, date, status) => {
    try {
      setLoading(true);
      await markAttendanceAPI(subjectId, date, status);
      await getAttendanceStats(subjectId); // Refresh stats
      await updateTrendData(); // Refresh trend data
      setNotification({
        type: "success",
        message: `Attendance marked as ${status} successfully!`,
      });
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
        <Header currentUser={user?.name || "Guest"} />
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
              onClose={() => setNotification(null)}
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
                onRemoveSubject={handleRemoveSubject}
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
                attendanceRecords={attendanceRecords}
              />
            )}
            {activeTab === "settings" && (
              <SettingsView
                subjects={subjects}
                attendanceStats={attendanceStats}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AttendanceManager;
