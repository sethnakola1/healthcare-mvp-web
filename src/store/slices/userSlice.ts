// store/slices/userSlice.ts (Hospital Users)
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { HospitalUser, CreateHospitalUserRequest, HospitalUserRole, PaginatedResponse } from '../../types';
import { hospitalUserService } from '../../services';

interface UserState {
  users: HospitalUser[];
  currentUser: HospitalUser | null;
  totalElements: number;
  totalPages: number;
  currentPage: number;
  loading: boolean;
  creating: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  currentUser: null,
  totalElements: 0,
  totalPages: 0,
  currentPage: 0,
  loading: false,
  creating: false,
  error: null,
};

export const createHospitalUser = createAsyncThunk(
  'user/create',
  async (request: CreateHospitalUserRequest, { rejectWithValue }) => {
    try {
      const user = await hospitalUserService.createHospitalUser(request);
      return user;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchHospitalUsers = createAsyncThunk(
  'user/fetchByHospital',
  async ({ hospitalId, params }: { 
    hospitalId: string; 
    params?: { page?: number; size?: number; role?: HospitalUserRole; search?: string; isActive?: boolean } 
  }, { rejectWithValue }) => {
    try {
      const response = await hospitalUserService.getHospitalUsers(hospitalId, params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createHospitalUser.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(createHospitalUser.fulfilled, (state) => {
        state.creating = false;
      })
      .addCase(createHospitalUser.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload as string;
      })
      .addCase(fetchHospitalUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchHospitalUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.content;
        state.totalElements = action.payload.totalElements;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.number;
      })
      .addCase(fetchHospitalUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;