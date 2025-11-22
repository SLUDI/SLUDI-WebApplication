import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sessionId: null,
  sharedAttributes: {
    id: null,
    age: null,
    nic: null,
    fullName: null,
    bloodGroup: null,
    dateOfBirth: null,
    profilePhoto: null,
    address: {
      city: null,
      street: null,
      district: null,
      province: null,
      postalCode: null,
      divisionalSecretariat: null,
      gramaNiladhariDivision: null,
    },
  },
  status: null,
  canProceed: false,
  fulfilledAt: null,
  expiresAt: null,
};

const licenseVerificationSlice = createSlice({
  name: "licenseVerification",
  initialState,
  reducers: {
    setLicenseVerificationData(state, action) {
      const {
        sessionId,
        sharedAttributes,
        status,
        canProceed,
        fulfilledAt,
        expiresAt,
      } = action.payload;

      state.sessionId = sessionId;
      state.sharedAttributes = sharedAttributes;
      state.status = status;
      state.canProceed = canProceed;
      state.fulfilledAt = fulfilledAt;
      state.expiresAt = expiresAt;
    },

    clearLicenseVerificationData() {
      return initialState;
    },
  },
});

export const { setLicenseVerificationData, clearLicenseVerificationData } =
  licenseVerificationSlice.actions;

export default licenseVerificationSlice.reducer;
