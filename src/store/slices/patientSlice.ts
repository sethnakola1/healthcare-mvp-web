// store/slices/patientSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Patient, CreatePatientRequest, PaginatedResponse } from '../../types';
import { patientService } from '../../services';

interface PatientState {
  patients: Patient[];
  currentPatient: Patient | null;
  totalElements: number;
  totalPages: number;
  currentPage: number;
  loading: boolean;
  creating: boolean;
  error: string | null;
}

const initialState: PatientState = {
  patients: [],
  currentPatient: null,
  totalElements: 0,
  totalPages: 0,
  currentPage: 0,
  loading: false,
  creating: false,
  error: null,
};

export const createPatient = createAsyncThunk(
  'patient/create',
  async (request: CreatePatientRequest, { rejectWithValue }) => {
    try {
      const patient = await patientService.createPatient(request);
      return patient;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPatients = createAsyncThunk(
  'patient/fetchByHospital',
  async ({ hospitalId, params }: { 
    hospitalId: string; 
    params?: { page?: number; size?: number; search?: string } 
  }, { rejectWithValue }) => {
    try {
      const response = await patientService.getPatientsByHospital(hospitalId, params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const patientSlice = createSlice({
  name: 'patient',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPatient.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(createPatient.fulfilled, (state) => {
        state.creating = false;
      })
      .addCase(createPatient.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload as string;
      })
      .addCase(fetchPatients.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPatients.fulfilled, (state, action) => {
        state.loading = false;
        state.patients = action.payload.content;
        state.totalElements = action.payload.totalElements;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.number;
      })
      .addCase(fetchPatients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = patientSlice.actions;
export default patientSlice.reducer;