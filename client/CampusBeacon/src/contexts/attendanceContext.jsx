import React, { createContext, useContext, useState, useCallback } from "react";
import axios from "axios";

const AttendanceContext = createContext();

export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (!context) {
    throw new Error("useAttendance must be used within an AttendanceProvider");
  }
  return context;
};

export const AttendanceProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);

  // API base URL
  const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

  // Utility function to handle API errors
  const handleError = (error) => {
    setError(error.response?.data?.message || "Something went wrong");
    setTimeout(() => setError(null), 3000);
  };

  // Get all subjects
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
  }, []);

  // Get user's subjects
  const fetchUserSubjects = useCallback(async (userId) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/subjects/${userId}`, {
        withCredentials: true,
      });
      return response.data.data;
    } catch (error) {
      handleError(error);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Add subject to user's list
  const addUserSubject = useCallback(async (userId, subjectId) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${API_URL}/subjects/${userId}/add`,
        { subjectId },
        { withCredentials: true }
      );
      return response.data.data;
    } catch (error) {
      handleError(error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Remove subject from user's list
  const removeUserSubject = useCallback(async (userId, subjectId) => {
    try {
      setLoading(true);
      await axios.post(
        `${API_URL}/subjects/${userId}/remove`,
        { subjectId },
        { withCredentials: true }
      );
      return true;
    } catch (error) {
      handleError(error);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Mark attendance
  const markAttendance = useCallback(async (subjectId, date, status) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${API_URL}/attendance/mark`,
        { subjectId, date, status },
        { withCredentials: true }
      );
      return response.data.success;
    } catch (error) {
      handleError(error);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update attendance
  const updateAttendance = useCallback(async (attendanceId, status) => {
    try {
      setLoading(true);
      const response = await axios.put(
        `${API_URL}/attendance/update/${attendanceId}`,
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
  }, []);

  // Delete attendance
  const deleteAttendance = useCallback(async (attendanceId) => {
    try {
      setLoading(true);
      await axios.delete(`${API_URL}/attendance/delete/${attendanceId}`, {
        withCredentials: true,
      });
      return true;
    } catch (error) {
      handleError(error);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get attendance records for a subject
  const getAttendanceRecords = useCallback(async (subjectId) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_URL}/attendance/records/${subjectId}`,
        { withCredentials: true }
      );
      return response.data.data || [];
    } catch (error) {
      handleError(error);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Get attendance percentage
  const getAttendancePercentage = useCallback(async (subjectId) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_URL}/attendance/percentage/${subjectId}`,
        { withCredentials: true }
      );
      return response.data.data.percentage;
    } catch (error) {
      handleError(error);
      return 0;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get monthly report
  const getMonthlyReport = useCallback(async (subjectId, month, year) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_URL}/attendance/report/${subjectId}/${month}/${year}`,
        { withCredentials: true }
      );
      return response.data.data;
    } catch (error) {
      handleError(error);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    loading,
    error,
    subjects,
    attendanceRecords,
    fetchSubjects,
    fetchUserSubjects,
    addUserSubject,
    removeUserSubject,
    markAttendance,
    updateAttendance,
    deleteAttendance,
    getAttendanceRecords,
    getAttendancePercentage,
    getMonthlyReport,
  };

  return (
    <AttendanceContext.Provider value={value}>
      {children}
    </AttendanceContext.Provider>
  );
};
