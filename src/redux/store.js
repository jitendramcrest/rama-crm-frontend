import { configureStore } from "@reduxjs/toolkit";
import authDataSlice from "@redux/reducers/authDataSlice";
import { persistStore } from "redux-persist";

const store = configureStore({
  reducer: {
    authData: authDataSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

const persistor = persistStore(store);

export { store, persistor };
