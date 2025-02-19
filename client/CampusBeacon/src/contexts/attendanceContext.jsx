import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import axios from "axios";

const AttendanceContext = createContext();

export const useAttendanceContext = () => {
  const context = useContext(AttendanceContext);
  if (!context) {
    throw new Error(
      "useAttendanceContext must be used within an AttendanceProvider"
    );
  }
  return context;
};

const initialCurrentUser = {
  id: null,
  login: "guest",
  /* Add other user properties as needed */
};

// Define API_URL and AUTH_API_URL outside the component
const API_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api/v1`
  : "http://localhost:5000/api/v1";
const AUTH_API_URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL
  : "http://localhost:5000/api";

export const AttendanceProvider = ({ children }) => {
  // Core states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [userSubjects, setUserSubjects] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [currentDateTime, setCurrentDateTime] = useState("2025-02-16 08:24:50");
  const [currentUser, setCurrentUser] = useState(initialCurrentUser);
  const [attendanceStats, setAttendanceStats] = useState(null);
  const [attendanceAlerts, setAttendanceAlerts] = useState([]);

  // Consolidated error handler
  const handleError = useCallback((error) => {
    let errorMessage = "Something went wrong";
    if (axios.isAxiosError(error) && error.response) {
      errorMessage =
        error.response.data?.message ||
        `Request failed with status ${error.response.status}`;
      console.error("API Error:", error.response.status, error.response.data);
    } else if (error instanceof Error) {
      errorMessage = error.message;
    } else {
      errorMessage = String(error); // Convert to string for safety
    }

    setError(errorMessage);
    setTimeout(() => setError(null), 5000); // Extended visibility
    console.error("API Error:", errorMessage, error);
    return errorMessage; // Useful for handling in calling functions
  }, []);

  // Refresh User Subjects
  const refreshUserSubjects = useCallback(
    async (userId) => {
      if (!userId) {
        console.warn("No user ID provided, skipping refreshUserSubjects");
        return;
      }
      try {
        setLoading(true);
        const response = await axios.get(
          `${API_URL}/user-subjects/user/${userId}`,
          {
            withCredentials: true,
          }
        );
        if (response.status === 200) {
          setUserSubjects(response.data.data);
          return response.data.data;
        } else {
          const errorMsg = `Failed to fetch user subjects with status: ${response.status}`;
          handleError(new Error(errorMsg));
          setUserSubjects([]);
          return [];
        }
      } catch (error) {
        handleError(error);
        setUserSubjects([]); // Ensure empty array in case of failure
        return [];
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

  // Define getAttendanceRecordsFn before markAttendance
  const getAttendanceRecordsFn = useCallback(
    async (subjectId, month, year) => {
      try {
        setLoading(true);
        const params = { subjectId, month, year };
        const response = await axios.get(`${API_URL}/attendance/attendance`, {
          params,
          withCredentials: true,
        });
        setAttendanceRecords(response.data.data);
        return response.data.data;
      } catch (error) {
        handleError(error);
        setAttendanceRecords([]); // Ensure empty array in case of failure
        return [];
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

  // Student Attendance Report
  const getStudentAttendanceReport = useCallback(
    async (userId) => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${API_URL}/attendance/report/student/${userId}`,
          { withCredentials: true }
        );
        return response.data.data;
      } catch (error) {
        handleError(error);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

  // Fetch current user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setLoading(true); // Indicate loading state
        const response = await axios.get(`${AUTH_API_URL}/users/current`, {
          withCredentials: true,
        });

        if (response.data?.data?.user) {
          setCurrentUser(response.data.data.user);
          if (response.data.data.user.id) {
            await refreshUserSubjects(response.data.data.user.id);
          }
        } else {
          // Handle case where user is not authenticated
          console.warn("User not authenticated, setting guest user");
          setCurrentUser(initialCurrentUser); // Set to guest user
        }
      } catch (error) {
        handleError(error);
        setCurrentUser(initialCurrentUser); // Ensure guest user on failure
      } finally {
        setLoading(false); // End loading state
      }
    };

    fetchCurrentUser(); // Call on mount
  }, [handleError, refreshUserSubjects]);

  // Update current time every minute - can be adjusted
  useEffect(() => {
    const updateCurrentTime = () => {
      const now = new Date();
      const utcString = now.toISOString().replace("T", " ").split(".")[0];
      setCurrentDateTime(utcString);
    };

    updateCurrentTime(); // Set immediately
    const timeInterval = setInterval(updateCurrentTime, 60000); // Update every minute

    return () => clearInterval(timeInterval); // Cleanup
  }, []);

  // Subject Management
  const fetchSubjects = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/subjects`, {
        withCredentials: true,
      });
      setSubjects(response.data.data);
      return response.data.data;
    } catch (error) {
      handleError(error);
      setSubjects([]); // Ensure empty array in case of failure
      return [];
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  // User Subject Management
  const addUserSubject = useCallback(
    async (subjectId) => {
      if (!currentUser?.id) {
        handleError(new Error("User is not authenticated"));
        return false;
      }

      try {
        setLoading(true);

        // Check if the subject is already added
        const existingSubject = userSubjects.find(
          (sub) => sub.subjectId === subjectId
        );
        if (existingSubject) {
          throw new Error("Subject already added for this user.");
        }

        const response = await axios.post(
          `${API_URL}/user-subjects`,
          { userId: currentUser.id, subjectId },
          { withCredentials: true }
        );

        if (response.data.success) {
          await refreshUserSubjects(currentUser.id);
          return true;
        } else {
          throw new Error(response.data.message || "Failed to add subject"); // More informative
        }
      } catch (error) {
        handleError(error);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [currentUser, handleError, refreshUserSubjects, userSubjects]
  );

  const removeUserSubject = useCallback(
    async (subjectId) => {
      if (!currentUser?.id) {
        handleError(new Error("User is not authenticated"));
        return false;
      }
      try {
        setLoading(true);
        const response = await axios.delete(
          `${API_URL}/user-subjects/${currentUser.id}/${subjectId}`,
          { withCredentials: true }
        );
        if (response.data.success) {
          await refreshUserSubjects(currentUser.id);
          return true;
        } else {
          throw new Error(response.data.message || "Failed to remove subject"); // More informative
        }
      } catch (error) {
        handleError(error);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [currentUser, handleError, refreshUserSubjects]
  );

  // Attendance Management
  const markAttendance = useCallback(
    async (subjectId, date, status) => {
      if (!currentUser?.id) {
        handleError(new Error("User is not authenticated"));
        return false;
      }

      const standardizedStatus =
        status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

      if (!["Present", "Absent", "Cancelled"].includes(standardizedStatus)) {
        handleError(new Error("Invalid attendance status"));
        return false;
      }

      setLoading(true);
      try {
        let existingRecord = attendanceRecords.find(
          (record) => record.subjectId === subjectId && record.date === date
        );

        if (existingRecord) {
          const response = await axios.put(
            `${API_URL}/attendance/attendance/${existingRecord.id}`,
            { status: standardizedStatus },
            { withCredentials: true }
          );

          if (!response.data.success) {
            throw new Error(
              response.data.message || "Failed to update attendance"
            );
          }
        } else {
          const response = await axios.post(
            `${API_URL}/attendance/attendance`,
            {
              userId: currentUser.id,
              subjectId,
              date,
              status: standardizedStatus,
            },
            { withCredentials: true }
          );
          if (!response.data.success) {
            throw new Error(
              response.data.message || "Failed to mark attendance"
            );
          }
        }

        // Refresh attendance records - moving the call inside
        try {
          const records = await getAttendanceRecordsFn(
            subjectId,
            new Date(date).getMonth() + 1,
            new Date(date).getFullYear()
          );
          setAttendanceRecords(records); // Update local state
        } catch (refreshError) {
          handleError(refreshError);
        }

        return true;
      } catch (error) {
        handleError(error);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [
      API_URL,
      currentUser,
      attendanceRecords,
      handleError,
      getAttendanceRecordsFn,
    ]
  );

  const updateAttendance = useCallback(
    async (attendanceId, status) => {
      try {
        setLoading(true);
        const response = await axios.put(
          `${API_URL}/attendance/attendance/${attendanceId}`,
          { status },
          { withCredentials: true }
        );
        if (!response.data.success) {
          throw new Error(
            response.data.message || "Failed to update attendance record"
          );
        }
        return response.data.success;
      } catch (error) {
        handleError(error);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

  const deleteAttendance = useCallback(
    async (attendanceId) => {
      try {
        setLoading(true);
        const response = await axios.delete(
          `${API_URL}/attendance/attendance/${attendanceId}`,
          {
            withCredentials: true,
          }
        );
        if (!response.data.success) {
          throw new Error(
            response.data.message || "Failed to delete attendance record"
          );
        }
        return true;
      } catch (error) {
        handleError(error);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

  const getSubjectAttendanceReport = useCallback(
    async (subjectId) => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${API_URL}/attendance/report/subject/${subjectId}`,
          { withCredentials: true }
        );
        return response.data.data;
      } catch (error) {
        handleError(error);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

  const getAttendanceStats = useCallback(
    async (subjectId) => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${API_URL}/attendance/stats/${subjectId}`,
          { withCredentials: true }
        );
        const stats = response.data.data;
        const processedStats = {
          ...stats,
          formattedPercentage: `${stats.percentage?.toFixed(2) || "0.00"}%`,
          isAtRisk: stats.percentage < 75,
          needsImprovement: stats.percentage < 85,
        };
        setAttendanceStats(processedStats);
        return processedStats;
      } catch (error) {
        handleError(error);
        return {
          percentage: 0,
          totalClasses: 0,
          formattedPercentage: "0.00%",
          isAtRisk: true,
          needsImprovement: true,
        };
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

  const getAttendanceAlerts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/attendance/alerts`, {
        withCredentials: true,
      });
      setAttendanceAlerts(response.data.data);
      return response.data.data;
    } catch (error) {
      handleError(error);
      return [];
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const saveAttendanceStatsFromForm = useCallback(
    async (formData) => {
      if (!currentUser?.id) {
        handleError(new Error("User is not authenticated"));
        return null;
      }
      try {
        setLoading(true);
        const payload = {
          userId: currentUser.id,
          subjectId: formData.subjectId,
          totalClasses: parseInt(formData.totalClasses) || 0,
          totalPresent: parseInt(formData.attendedClasses) || 0,
        };

        const response = await axios.post(
          `${API_URL}/attendance/stats`,
          payload,
          { withCredentials: true }
        );

        if (!response.data.success) {
          throw new Error(
            response.data.message || "Failed to save attendance stats"
          );
        }
        return response.data.data;
      } catch (error) {
        handleError(error);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [currentUser, handleError]
  );

  const contextValue = {
    // States
    loading,
    error,
    subjects,
    userSubjects,
    attendanceRecords,
    currentDateTime,
    currentUser,
    attendanceStats,
    attendanceAlerts,

    // Subject Management
    fetchSubjects,
    refreshUserSubjects,
    addUserSubject,
    removeUserSubject,

    // Attendance Management
    markAttendance,
    updateAttendance,
    deleteAttendance,
    getAttendanceRecords: getAttendanceRecordsFn, // Use the useCallback version

    // Reports and Statistics
    getStudentAttendanceReport,
    getSubjectAttendanceReport,
    getAttendanceStats,
    getAttendanceAlerts,
    saveAttendanceStatsFromForm,

    // Utilities
    handleError,
  };

  return (
    <AttendanceContext.Provider value={contextValue}>
      {children}
    </AttendanceContext.Provider>
  );
};

export default AttendanceContext;
