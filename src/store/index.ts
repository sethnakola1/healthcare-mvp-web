import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice'; // Adjust the import path

const store = configureStore({
  reducer: {
    auth: authReducer, // Ensure the auth slice is included
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;