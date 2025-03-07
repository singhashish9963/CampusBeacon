import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const ComplaintContext = createContext();

export const useComplaints = () => useContext(ComplaintContext);

export const ComplaintProvider = ({ children }) => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const API_URL = "http://localhost:5000";

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/complaints`);
      setComplaints(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch complaints");
    } finally {
      setLoading(false);
    }
  };

  const getComplaint = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/complaints/${id}`);
      setSelectedComplaint(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch complaint");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createComplaint = async (complaintData) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/complaints`, complaintData);
      await fetchComplaints();
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit complaint");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateComplaint = async (id, complaintData) => {
    try {
      setLoading(true);
      const response = await axios.put(`${API_URL}/complaints/${id}`, complaintData);
      await fetchComplaints();
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update complaint");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteComplaint = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`${API_URL}/complaints/${id}`);
      setComplaints((prev) => prev.filter((complaint) => complaint.id !== id));
      if (selectedComplaint?.id === id) setSelectedComplaint(null);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete complaint");
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const value = {
    complaints,
    loading,
    error,
    selectedComplaint,
    fetchComplaints,
    getComplaint,
    createComplaint,
    updateComplaint,
    deleteComplaint,
  };

  return <ComplaintContext.Provider value={value}>{children}</ComplaintContext.Provider>;
};
