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
  

}