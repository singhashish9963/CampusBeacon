import React, { createContext, useState, useContext, useEffect } from "react";
import { handleApiCall } from "../services/userService"; 


const ProfileContext = createContext();


export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await handleApiCall("/current-user", {}, "GET");
      if (!response) {
        throw new Error("Failed to fetch profile data");
      }
      setProfile(response);
      setError(null);
    } catch (err) {
      setError(err.message || "An error occurred while fetching profile");
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates) => {
    setLoading(true);
    try {
      const data = await handleApiCall("/update-user", updates);
      setProfile(data);
      setError(null);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <ProfileContext.Provider
      value={{ profile, loading, error, fetchProfile, updateProfile }}
    >
      {children}
    </ProfileContext.Provider>
  );
};


export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};

export default ProfileContext;
