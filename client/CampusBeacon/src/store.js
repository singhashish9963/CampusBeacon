import { configureStore } from "@reduxjs/toolkit";
// Import your slices here
import ridesReducer from "./slices/ridesSlice";
import authReducer from "./slices/authSlice";

const store = configureStore({
  reducer: {
    rides: ridesReducer,
    auth: authReducer,
    // Add other slices here
  },
});

export default store;
