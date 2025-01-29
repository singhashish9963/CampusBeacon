import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import LoginSignup from "./pages/loginPage.jsx";
import NavBar from "./components/Navbar.jsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <LoginSignup />
      <NavBar />
    </BrowserRouter>
  </StrictMode>
);
