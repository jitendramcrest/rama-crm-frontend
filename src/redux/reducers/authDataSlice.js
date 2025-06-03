import { createSlice } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "authData",
  storage,
};

const userSlice = createSlice({
  name: "authData",
  initialState: {
    user: null,
    authToken: null,
    error: null,
    warning: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setToken: (state, action) => {
      state.authToken = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.authToken = null;
    },
    setError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setWarning: (state, action) => {
      state.loading = false;
      state.warning = action.payload;
    },
  },
});

export const { setUser, setToken, logout, setError, setWarning } = userSlice.actions;

export default persistReducer(persistConfig, userSlice.reducer);
