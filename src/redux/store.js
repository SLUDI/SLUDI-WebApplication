import { configureStore } from "@reduxjs/toolkit";
import stepReducer from "./stepSlice";

export const store = configureStore({
  reducer: {
    step: stepReducer,
  },
});

export default store;
