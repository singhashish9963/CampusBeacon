import React, { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import store, { persistor } from "./store.js";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { checkAuthStatus } from "./slices/authSlice";

// Create a wrapper component to handle auth check
const AppWrapper = () => {

  useEffect(() => {
   
    const persistedAuth = localStorage.getItem("persist:root");
    let needsServerCheck = true;
    if (persistedAuth) {
      try {
        const { auth } = JSON.parse(persistedAuth);
        const { user } = JSON.parse(auth);

        if (!isTokenValid(user)) {
 
          localStorage.removeItem("persist:root");
          store.dispatch(logout());
          needsServerCheck = false;
        }
      } catch (e) {
        localStorage.removeItem("persist:root");
        needsServerCheck = false;
      }
    }
    if (needsServerCheck) {
      store.dispatch(checkAuthStatus());
    }
  }, []);

  return <App />;
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppWrapper />
      </PersistGate>
    </Provider>
  </StrictMode>
);
