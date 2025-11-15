import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentStep: 1,
  completedSteps: 2,
};

const stepSlice = createSlice({
  name: "stepData",
  initialState,
  reducers: {
    setCurrentStep: (state, action) => {
      state.currentStep = action.payload;
    },
    setCompletedSteps: (state, action) => {
      state.completedSteps = action.payload;
    },
  },
});

export const { setCurrentStep, setCompletedSteps } = stepSlice.actions;
export default stepSlice.reducer;
