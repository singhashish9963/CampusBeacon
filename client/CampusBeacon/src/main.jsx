import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import LoginSignup from "./pages/LoginPage.jsx";
import Footer from "./components/Footer.jsx";
import App from "./App.jsx"
import {BrowserRouter} from "react-router-dom"

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
    <LoginSignup />
    <Footer />
    </BrowserRouter>
  </StrictMode>
);
