"use client";

import { configureStore } from "@reduxjs/toolkit";
import userSlice from "@/redux/userSlice";
import adminSlice from "@/redux/adminSlice";

const store = configureStore({
  reducer: {
    user: userSlice,
    admin: adminSlice,
  },
});
export default store;
