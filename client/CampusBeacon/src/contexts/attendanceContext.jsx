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

  const API_URL =
 "http://localhost:5000/api/v1";

  const handleError = (error) => {
    setError(error.response?.data?.message || "Something went wrong");
    setTimeout(() => setError(null), 3000);
  };

  // Get all subjects (public route)
  const fetchSubjects = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/subjects`);
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
      const response = await axios.get(`${API_URL}/subjects/user/${userId}`, {
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
        `${API_URL}/subjects/user/${userId}/add`,
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
      await axios.delete(`${API_URL}/subjects/user/${userId}/remove`, {
        data: { subjectId },
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

  // Mark attendance
  const markAttendance = useCallback(async (subjectId, date, status) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${API_URL}/attendance`,
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
        `${API_URL}/attendance/${attendanceId}`,
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
      await axios.delete(`${API_URL}/attendance/${attendanceId}`, {
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

  // Get attendance records for a subject (with optional year and month)
  const getAttendanceRecords = useCallback(async (subjectId, year, month) => {
    try {
      setLoading(true);
      const url =
        year && month
          ? `${API_URL}/attendance/${subjectId}/${year}/${month}`
          : `${API_URL}/attendance/${subjectId}`;
      const response = await axios.get(url, { withCredentials: true });
      setAttendanceRecords(response.data.data);
      return response.data.data;
    } catch (error) {
      handleError(error);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Get attendance stats
  const getAttendanceStats = useCallback(async (subjectId) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_URL}/attendance/stats/${subjectId}`,
        { withCredentials: true }
      );
      return response.data.data;
    } catch (error) {
      handleError(error);
      return {
        percentage: 0,
        totalClasses: 0,
        totalPresent: 0,
      };
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
    getAttendanceStats,
  };

  return (
    <AttendanceContext.Provider value={value}>
      {children}
    </AttendanceContext.Provider>
  );
};
