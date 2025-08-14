// src/redux/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  token: string | null;
  userId: string | null;
  email: string | null;
  name: string | null;
  role: string | null;
  hospitalId: string | null;
  hospitalName: string | null;
  department: string | null;
  licenseNumber: string | null;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  token: null,
  userId: null,
  email: null,
  name: null,
  role: null,
  hospitalId: null,
  hospitalName: null,
  department: null,
  licenseNumber: null,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<Partial<UserState>>) => {
      state.token = action.payload.token || null;
      state.userId = action.payload.userId || null;
      state.email = action.payload.email || null;
      state.name = action.payload.name || null;
      state.role = action.payload.role || null;
      state.hospitalId = action.payload.hospitalId || null;
      state.hospitalName = action.payload.hospitalName || null;
      state.department = action.payload.department || null;
      state.licenseNumber = action.payload.licenseNumber || null;
      state.isAuthenticated = true;
    },
    clearUser: (state) => {
      state.token = null;
      state.userId = null;
      state.email = null;
      state.name = null;
      state.role = null;
      state.hospitalId = null;
      state.hospitalName = null;
      state.department = null;
      state.licenseNumber = null;
      state.isAuthenticated = false;
    },
    updateUserAttributes: (state, action: PayloadAction<Partial<UserState>>) => {
      Object.assign(state, action.payload);
    }
  },
});

export const { setUser, clearUser, updateUserAttributes } = userSlice.actions;
export default userSlice.reducer;