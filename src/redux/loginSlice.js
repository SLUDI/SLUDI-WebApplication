import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  role: "SuperAdmin",
};

const loginSlice = createSlice({
  name: "loginData",
  initialState,
  reducers: {
    setRole: (state, action) => {
      state.role = action.payload;
    },
  },
});

export const { setRole } = loginSlice.actions;
export default loginSlice.reducer;
