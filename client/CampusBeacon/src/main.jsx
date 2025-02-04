import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Marketplace from "./pages/buyAndSellPage.jsx";
import LostAndFound from "./pages/lostAndFound.jsx";

  createRoot(document.getElementById("root")).render(
    <StrictMode>
    <App/>
    </StrictMode>
  );
