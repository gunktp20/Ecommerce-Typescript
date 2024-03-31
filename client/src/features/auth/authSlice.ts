import { IAuthState, AddUserFunc } from "./types/index";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const user = localStorage.getItem("user");
const token = localStorage.getItem("token");

const initialState: IAuthState = {
  user: user ? JSON.parse(user) : null,
  token: token || null,
  isLoading: false,
  showAlert: false,
  alertText: "",
  alertType: "",
};

const addUserToLocalStorage: AddUserFunc = (user, token) => {
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("token", token);
};
const removeUserFromLocalStorage = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
};

const AuthSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setCredential: (state, action) => {
      addUserToLocalStorage(action.payload.user, action.payload.token);
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
      };
    },
    
  },
});

export const { setCredential } = AuthSlice.actions;

export default AuthSlice.reducer;
