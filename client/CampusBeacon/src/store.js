import { configureStore } from "@reduxjs/toolkit";
// Import your slices here
import ridesReducer from "./slices/ridesSlice";
import authReducer from "./slices/authSlice";
import profileReducer from "./slices/profileSlice";
import eateriesReducer from "./slices/eateriesSlice";
const store = configureStore({
  reducer: {
    rides: ridesReducer,
    auth: authReducer,
    profile: profileReducer,
    eateries: eateriesReducer,
    // Add other slices here
  },
});

export default store;
