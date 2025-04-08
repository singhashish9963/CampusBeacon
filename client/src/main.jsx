import React, { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import store from "./store.js";
import { Provider } from "react-redux";
import { checkAuthStatus } from "./slices/authSlice";
import { Analytics } from "@vercel/analytics/react";
const AppWrapper = () => {
  useEffect(() => {
    // Dispatch the auth status check which now relies solely on the cookie.
    store.dispatch(checkAuthStatus());

    // Set up periodic validation (every 15 minutes)
    const interval = setInterval(() => {
      store.dispatch(checkAuthStatus());
    }, 15 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return <App />;
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <AppWrapper />
      <Analytics/>
    </Provider>
  </StrictMode>
);
