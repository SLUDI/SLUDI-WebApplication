import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  date: null,
  distric: "",
};

const availableDateSlice = createSlice({
  name: "availableDate",
  initialState,
  reducers: {
    setDate: (state, action) => {
      state.date = action.payload;
    },
    setDistrict: (state, action) => {
      state.distric = action.payload;
    },
  },
});

export const { setDate, setDistrict } = availableDateSlice.actions;
export default availableDateSlice.reducer;
