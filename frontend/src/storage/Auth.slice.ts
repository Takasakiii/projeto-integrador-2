import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LoginResponse, SecureUser } from "../api";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: null as string | null,
    user: null as SecureUser | null,
  },
  reducers: {
    login: (state, action: PayloadAction<LoginResponse>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },

    logout: (state) => {
      state.token = null;
      state.user = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
