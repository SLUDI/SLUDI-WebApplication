import { createSlice } from "@reduxjs/toolkit";
import { getLocalStorageData } from "../utils/localStorageHelper";

const initialState = {
  roleCode: getLocalStorageData("roleCode") || null,
  organizationId: getLocalStorageData("organizationId") || 1,
  token: getLocalStorageData("token"),
  data: getLocalStorageData("data"),
  refreshToken: getLocalStorageData("refreshToken"),
  expiresIn: getLocalStorageData("expiresIn"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setRoleCode(state, action) {
      state.roleCode = action.payload;
    },
    setOrganizationId(state, action) {
      state.organizationId = action.payload;
    },
    setToken(state, action) {
      state.token = action.payload;
    },
    setData(state, action) {
      state.data = action.payload;
    },
    setRefreshToken(state, action) {
      state.refreshToken = action.refreshToken;
    },
    setExpiresIn(state, action) {
      state.expiresIn = action.expiresIn;
    },

    logOut(state) {
      state.roleCode = null;
      state.token = null;
      state.organizationId = null;
      state.data = null;
      state.refreshToken = null;
      state.expiresIn = null;
      localStorage.clear();
      window.location.replace("/sign-in");
    },
  },
});

export const {
  setRoleCode,
  setOrganizationId,
  setToken,
  logOut,
  setData,
  setRefreshToken,
  setExpiresIn,
} = authSlice.actions;

export default authSlice.reducer;
