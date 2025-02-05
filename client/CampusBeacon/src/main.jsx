import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import AboutUs from "./pages/AboutUs.jsx";

  createRoot(document.getElementById("root")).render(
    <StrictMode>
    {/* <App/> */}
    <AboutUs />
    </StrictMode>
  );
