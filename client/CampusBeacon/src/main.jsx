import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import LoginSignup from "./pages/LoginPage.jsx";
import Footer from "./components/Footer.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <LoginSignup />
    <Footer />
  </StrictMode>
);
