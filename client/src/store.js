import { configureStore, combineReducers } from "@reduxjs/toolkit";
// Import your slices here
import ridesReducer from "./slices/ridesSlice";
import authReducer from "./slices/authSlice";
import profileReducer from "./slices/profileSlice";
import eateriesReducer from "./slices/eateriesSlice";
import contactsReducer from "./slices/contactSlice";
import buyAndSellReducer from "./slices/buyandsellSlice";
import notificationReducer from "./slices/notificationSlice";
import lostAndFoundReducer from "./slices/lostAndFoundSlice";
import chatbotReducer from "./slices/chatbotSlice";
import hostelReducer from "./slices/hostelSlice";
import resourceReducer from "./slices/resourceSlice";

// Newly added slices
import clubReducer from "./slices/clubSlice";
import eventReducer from "./slices/eventSlice";
import coordinatorReducer from "./slices/coordinatorSlice";

// Combine reducers without persistence.
const rootReducer = combineReducers({
  rides: ridesReducer,
  auth: authReducer,
  profile: profileReducer,
  eateries: eateriesReducer,
  contacts: contactsReducer,
  notification: notificationReducer,
  buyAndSell: buyAndSellReducer,
  lostAndFound: lostAndFoundReducer,
  chatbot: chatbotReducer,
  hostel: hostelReducer,
  resource: resourceReducer,
  // New reducers
  clubs: clubReducer,
  events: eventReducer,
  coordinators: coordinatorReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;
