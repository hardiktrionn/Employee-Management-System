import { configureStore } from "@reduxjs/toolkit";
import userSlice from "../redux/userSlice";
import adminSlice from "../redux/adminSlice";

const store = configureStore({
  reducer: {
    user: userSlice,
    admin: adminSlice,
  },
  devTools: process.env.NODE_ENV !== "production",
});

// Types for use in components
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
