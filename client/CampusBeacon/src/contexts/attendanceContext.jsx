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

export const AttendanceProvider = ({ children }) => {
  // Core states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [userSubjects, setUserSubjects] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [currentDateTime, setCurrentDateTime] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  // Base API URLs
  const API_URL = import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/v1`
    : "http://localhost:5000/api/v1";
  const AUTH_API_URL = import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL
    : "http://localhost:5000/api";

  // Consolidated error handler
  const handleError = (error) => {
    const errorMessage =
      error.response?.data?.message || error.message || "Something went wrong";
    setError(errorMessage);
    setTimeout(() => setError(null), 3000);
    console.error("API Error:", errorMessage);
  };

  // Refresh the subjects associated with the user by making a GET request
  const refreshUserSubjects = useCallback(
    async (userId) => {
      try {
        setLoading(true);
        // Make sure the endpoint matches your backend (check plural/singular naming)
        const response = await axios.get(`${API_URL}/user-subjects`, {
          params: { userId },
          withCredentials: true,
        });
        setUserSubjects(response.data.data);
        return response.data.data;
      } catch (error) {
        handleError(error);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [API_URL]
  );

  // Fetch current user from cookies by calling the /users/current endpoint
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get(`${AUTH_API_URL}/users/current`, {
          withCredentials: true,
        });
        if (response.data?.data?.user) {
          setCurrentUser(response.data.data.user);
          // Refresh user subjects if user is authenticated
          if (response.data.data.user.id) {
            refreshUserSubjects(response.data.data.user.id);
          }
        }
      } catch (error) {
        console.error("Failed to fetch current user:", error);
      }
    };
    fetchCurrentUser();
  }, [AUTH_API_URL, refreshUserSubjects]);

  // Update current time every minute (UTC formatted as "YYYY-MM-DD HH:MM:SS")
  useEffect(() => {
    const updateCurrentTime = () => {
      const now = new Date();
      const utcString = now.toISOString().replace("T", " ").split(".")[0];
      setCurrentDateTime(utcString);
    };

    updateCurrentTime();
    const timeInterval = setInterval(updateCurrentTime, 60000);
    return () => clearInterval(timeInterval);
  }, []);

  // Get all available subjects
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
      return [];
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  // Add a subject to the current user
  const addUserSubject = useCallback(
    async (subjectId) => {
      try {
        if (!currentUser?.id) throw new Error("User is not authenticated");
        setLoading(true);
        // Ensure endpoint name is correct (user-subjects vs. user-subject)
        await axios.post(
          `${API_URL}/user-subjects`,
          { userId: currentUser.id, subjectId },
          { withCredentials: true }
        );
        await refreshUserSubjects(currentUser.id);
        return true;
      } catch (error) {
        handleError(error);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [API_URL, currentUser, refreshUserSubjects]
  );

  // Remove a subject from the current user
  const removeUserSubject = useCallback(
    async (subjectId) => {
      try {
        if (!currentUser?.id) throw new Error("User is not authenticated");
        setLoading(true);
        // Ensure endpoint name is correct (user-subjects vs. user-subject)
        await axios.delete(`${API_URL}/user-subjects`, {
          data: { userId: currentUser.id, subjectId },
          withCredentials: true,
        });
        await refreshUserSubjects(currentUser.id);
        return true;
      } catch (error) {
        handleError(error);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [API_URL, currentUser, refreshUserSubjects]
  );

  // Mark attendance for the current user on a given subject and date
  const markAttendance = useCallback(
    async (subjectId, date, status) => {
      // Adjust status conversion to ensure proper formatting
      const standardizedStatus =
        status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
      try {
        if (!["Present", "Absent", "Cancelled"].includes(standardizedStatus)) {
          throw new Error("Invalid attendance status");
        }
        if (!currentUser?.id) {
          throw new Error("User is not authenticated");
        }
        setLoading(true);
        const attendanceDate = date || new Date().toISOString().split("T")[0];
        const response = await axios.post(
          `${API_URL}/attendance/attendance`,
          {
            userId: currentUser.id,
            subjectId,
            date: attendanceDate,
            status: standardizedStatus,
          },
          { withCredentials: true }
        );
        return response.data.success;
      } catch (error) {
        handleError(error);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [API_URL, currentUser]
  );

  // Update an attendance record by its ID
  const updateAttendance = useCallback(
    async (attendanceId, status) => {
      try {
        setLoading(true);
        const response = await axios.put(
          `${API_URL}/attendance/attendance/${attendanceId}`,
          { status },
          { withCredentials: true }
        );
        return response.data.success;
      } catch (error) {
        handleError(error);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [API_URL]
  );

  // Delete an attendance record by its ID
  const deleteAttendance = useCallback(
    async (attendanceId) => {
      try {
        setLoading(true);
        await axios.delete(`${API_URL}/attendance/attendance/${attendanceId}`, {
          withCredentials: true,
        });
        return true;
      } catch (error) {
        handleError(error);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [API_URL]
  );

  // Retrieve attendance records for a specific subject.
  // Optional year and month parameters can be used to filter the records.
  const getAttendanceRecords = useCallback(
    async (subjectId, month, year) => {
      try {
        setLoading(true);
        const params = { subjectId };
        if (year) params.year = year;
        if (month) params.month = month;
        const response = await axios.get(`${API_URL}/attendance/attendance`, {
          params,
          withCredentials: true,
        });
        setAttendanceRecords(response.data.data);
        return response.data.data;
      } catch (error) {
        handleError(error);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [API_URL]
  );

  // Get attendance statistics for a subject
  const getAttendanceStats = useCallback(
    async (subjectId) => {
      try {
        setLoading(true);
        // Confirm your backend defines this endpoint correctly.
        const response = await axios.get(
          `${API_URL}/attendance/stats/${subjectId}`,
          { withCredentials: true }
        );
        const stats = response.data.data;
        return {
          ...stats,
          formattedPercentage: `${stats.percentage.toFixed(2)}%`,
          isAtRisk: stats.percentage < 75,
          needsImprovement: stats.percentage < 85,
        };
      } catch (error) {
        handleError(error);
        return {
          percentage: 0,
          totalClasses: 0,
          totalPresent: 0,
          formattedPercentage: "0.00%",
          isAtRisk: true,
          needsImprovement: true,
        };
      } finally {
        setLoading(false);
      }
    },
    [API_URL]
  );

  const contextValue = {
    loading,
    error,
    subjects,
    userSubjects,
    attendanceRecords,
    currentDateTime,
    currentUser,
    fetchSubjects,
    refreshUserSubjects,
    addUserSubject,
    removeUserSubject,
    markAttendance,
    updateAttendance,
    deleteAttendance,
    getAttendanceRecords,
    getAttendanceStats,
    handleError,
  };

  return (
    <AttendanceContext.Provider value={contextValue}>
      {children}
    </AttendanceContext.Provider>
  );
};

export default AttendanceContext;
