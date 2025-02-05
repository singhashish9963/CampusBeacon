import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import ContactsDisplay from "./pages/ContactPage.jsx";

  createRoot(document.getElementById("root")).render(
    <StrictMode>
    {/* <App/> */}
    <ContactsDisplay />
    </StrictMode>
  );
