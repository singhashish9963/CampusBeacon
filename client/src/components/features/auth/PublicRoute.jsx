import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();

  // If the user is authenticated, redirect them away from the public route (e.g., login page)
  // Redirect to the home page or the page they came from if available in state
  if (isAuthenticated) {
    // Redirect to home ('/') or potentially a dashboard route if preferred
    return <Navigate to={location.state?.from?.pathname || "/"} replace />;
  }

  // If not authenticated, render the child component (e.g., LoginPage)
  return children;
};

export default PublicRoute;
