import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
// Import your slices here
import ridesReducer from "./slices/ridesSlice";
import authReducer from "./slices/authSlice";
import profileReducer from "./slices/profileSlice";
import eateriesReducer from "./slices/eateriesSlice";
import contactsReducer from "./slices/contactSlice";
import buyAndSellReducer from "./slices/buyandsellSlice";
import notificationReducer from "./slices/notificationSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // only auth will be persisted
};

// Create the root reducer properly using combineReducers
const rootReducer = combineReducers({
  rides: ridesReducer,
  auth: authReducer,
  profile: profileReducer,
  eateries: eateriesReducer,
  contacts: contactsReducer,
  notification: notificationReducer,
  buyAndSell: buyAndSellReducer,
});

// Create the persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store with the persisted reducer
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);
export default store;
