import { configureStore } from "@reduxjs/toolkit";
import stepReducer from "./stepSlice";
import avilableReducer from "./availableDateSlice";
import roleReducer from "./loginSlice";
import authReducer from "./authSlice";

export const store = configureStore({
  reducer: {
    step: stepReducer,
    availableDate: avilableReducer,
    role: roleReducer,
    auth: authReducer,
  },
});

export default store;
