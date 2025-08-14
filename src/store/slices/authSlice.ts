// src/store/slices/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import authService from '../../services/auth.service';
import { LoginRequest, LoginResponse, UserInfo, ChangePasswordRequest } from '../../types';

interface AuthState {
  user: UserInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  loginLoading: boolean;
}

const initialState: AuthState = {
  user: authService.getUserFromStorage(),
  isAuthenticated: authService.isAuthenticated(),
  isLoading: false,
  error: null,
  loginLoading: false,
};

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const user = await authService.getCurrentUser();
      return user;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to get user info');
    }
  }
);

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (passwordData: ChangePasswordRequest, { rejectWithValue }) => {
    try {
      await authService.changePassword(passwordData);
      return 'Password changed successfully';
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to change password');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      return;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Logout failed');
    }
  }
);

export const validateToken = createAsyncThunk(
  'auth/validateToken',
  async (_, { rejectWithValue }) => {
    try {
      const isValid = await authService.validateToken();
      if (!isValid) {
        throw new Error('Token is invalid');
      }
      return isValid;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Token validation failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<UserInfo>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loginLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loginLoading = false;
        state.isAuthenticated = true;
        state.user = {
          userId: action.payload.userId,
          email: action.payload.email,
          firstName: action.payload.firstName,
          lastName: action.payload.lastName,
          fullName: `${action.payload.firstName} ${action.payload.lastName}`,
          username: action.payload.email, // Assuming email as username
          role: action.payload.role,
          roleDisplayName: action.payload.role,
          isActive: true,
          emailVerified: true,
          createdAt: new Date().toISOString(),
        };
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload as string;
      })
      // Get current user
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload as string;
      })
      // Change password
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
        state.isLoading = false;
        state.loginLoading = false;
      })
      // Validate token
      .addCase(validateToken.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = 'Session expired';
      });
  },
});

export const { clearError, setUser, clearAuth } = authSlice.actions;
export default authSlice.reducer;