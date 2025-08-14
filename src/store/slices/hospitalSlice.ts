// store/slices/hospitalSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Hospital, CreateHospitalRequest, PaginatedResponse } from '../../types';
import { hospitalService } from '../../services';

interface HospitalState {
  hospitals: Hospital[];
  currentHospital: Hospital | null;
  totalElements: number;
  totalPages: number;
  currentPage: number;
  loading: boolean;
  creating: boolean;
  error: string | null;
}

const initialState: HospitalState = {
  hospitals: [],
  currentHospital: null,
  totalElements: 0,
  totalPages: 0,
  currentPage: 0,
  loading: false,
  creating: false,
  error: null,
};

export const createHospital = createAsyncThunk(
  'hospital/create',
  async ({ request, createdBy }: { request: CreateHospitalRequest; createdBy: string }, { rejectWithValue }) => {
    try {
      const hospital = await hospitalService.createHospital(request, createdBy);
      return hospital;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchHospitals = createAsyncThunk(
  'hospital/fetchAll',
  async (params: { page?: number; size?: number; search?: string; isActive?: boolean }, { rejectWithValue }) => {
    try {
      const response = await hospitalService.getAllHospitals(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const hospitalSlice = createSlice({
  name: 'hospital',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createHospital.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(createHospital.fulfilled, (state) => {
        state.creating = false;
      })
      .addCase(createHospital.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload as string;
      })
      .addCase(fetchHospitals.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchHospitals.fulfilled, (state, action) => {
        state.loading = false;
        state.hospitals = action.payload.content;
        state.totalElements = action.payload.totalElements;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.number;
      })
      .addCase(fetchHospitals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = hospitalSlice.actions;
export default hospitalSlice.reducer;