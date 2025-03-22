import { configureStore } from "@reduxjs/toolkit";
// Import your slices here
import ridesReducer from "./slices/ridesSlice";
import authReducer from "./slices/authSlice";
import profileReducer from "./slices/profileSlice";
import eateriesReducer from "./slices/eateriesSlice";
import contactsReducer from "./slices/contactSlice"
const store = configureStore({
  reducer: {
    rides: ridesReducer,
    auth: authReducer,
    profile: profileReducer,
    eateries: eateriesReducer,
    contacts: contactsReducer,
    // Add other slices here
  },
});

export default store;
