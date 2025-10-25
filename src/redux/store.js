import { configureStore } from "@reduxjs/toolkit";
import stepReducer from "./stepSlice";
import avilableReducer from "./availableDateSlice";

export const store = configureStore({
  reducer: {
    step: stepReducer,
    availableDate: avilableReducer,
  },
});

export default store;
