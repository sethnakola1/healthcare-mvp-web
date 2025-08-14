import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import authService from '../services/auth.service';
import { BusinessRole, User } from '../types/auth.types';

interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: User | null;
  error: string | null;
}

const initialState: AuthState = {
  isLoading: false,
  isAuthenticated: false,
  user: null,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    console.log("🔐 Login action dispatched for:", email);
    try {
      const { user } = await authService.login(email, password);
      console.log("✅ Login thunk successful:", user);
      return user;
    } catch (error: any) {
      console.log("❌ Login thunk failed:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const checkAuthStatus = createAsyncThunk(
  'auth/checkAuthStatus',
  async (_, { rejectWithValue }) => {
    console.log("🔐 9. Checking authentication status...");
    try {
      const isValid = await authService.validateToken();
      console.log("✅ 10. Token validation result:", isValid);

      if (isValid) {
        console.log("👤 11. Attempting to get user data...");
        const user = authService.getUser();
        console.log("👤 11.1. Retrieved user:", user);

        if (user) {
          console.log("✅ 11.2. User data found, authentication successful");
          return user;
        } else {
          console.log("❌ 11.3. No user data found");
        }
      }

      console.log("❌ 12. Auth check failed - invalid session or no user");
      throw new Error('Invalid session');
    } catch (error: any) {
      console.log("❌ 12. Auth check failed:", error.message);
      // Clear any corrupted data
      authService.clearTokens();
      authService.clearUser();
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      console.log("🚪 Logout action dispatched");
      authService.logout();
      return {
        ...initialState,
        isLoading: false
      };
    },
    clearError: (state) => {
      console.log("🧹 Clearing auth error");
      state.error = null;
    },
    setUser: (state, action: PayloadAction<User>) => {
      console.log("👤 Setting user in state:", action.payload);
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(login.pending, (state) => {
        console.log("⏳ Login pending...");
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
        console.log("✅ Login fulfilled:", action.payload);
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        console.log("❌ Login rejected:", action.payload);
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload as string;
      })
      // Check auth status cases
      .addCase(checkAuthStatus.pending, (state) => {
        console.log("⏳ Auth check pending...");
        state.isLoading = true;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action: PayloadAction<User>) => {
        console.log("✅ Auth check fulfilled:", action.payload);
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(checkAuthStatus.rejected, (state, action) => {
        console.log("❌ Auth check rejected:", action.payload);
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = null; // Don't set error for failed auth check
      });
  },
});

export const { logout, clearError, setUser } = authSlice.actions;
export default authSlice.reducer;