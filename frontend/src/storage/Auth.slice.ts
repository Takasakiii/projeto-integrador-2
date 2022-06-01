import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LoginResponse, RestrictedApi, SecureUser } from "../api";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    restrictedApi: null as RestrictedApi | null,
    user: null as SecureUser | null,
  },
  reducers: {
    login: (state, action: PayloadAction<LoginResponse>) => {
      state.restrictedApi = action.payload.restrictedApi;
      state.user = action.payload.user;
    },

    logout: (state) => {
      state.restrictedApi = null;
      state.user = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
