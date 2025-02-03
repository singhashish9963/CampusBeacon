import React, {useCallback,useContext,useState,createContext} from "react";
import { handleApiCall } from "../services/userService";



const profileContext= createContext(null);

export const profileProvider= ({ children })=>{
  const checkUser = () => {
    const userStorage = localStorage.getItem("authUser");
    if (userStorage) {
      try {
        return JSON.parse(userStorage);
      } catch (e) {
        console.error("Error parsing stored user:", e);
      }
    }
    return null;
  };
  const [isediting, setIsEditing] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(checkUser());


  const editProfile = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await handleApiCall('/api/profile', 'PUT', data);
      setUser(response);
      localStorage.setItem('authUser', JSON.stringify(response));
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <profileContext.Provider value={{ user, editProfile, isediting, setIsEditing, error, loading }}>
      {children}
    </profileContext.Provider>
  );


}