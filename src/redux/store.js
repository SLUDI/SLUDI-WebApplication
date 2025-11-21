import { configureStore } from "@reduxjs/toolkit";
import stepReducer from "./stepSlice";
import avilableReducer from "./availableDateSlice";
import roleReducer from "./loginSlice";
import authReducer from "./authSlice";
import licenseVerificationReducer from "./licenseVerificationSlice";

export const store = configureStore({
  reducer: {
    step: stepReducer,
    availableDate: avilableReducer,
    role: roleReducer,
    auth: authReducer,
    licenseVerification: licenseVerificationReducer,
  },
});

export default store;
