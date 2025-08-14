// store/slices/businessSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  BusinessUser,
  CreateBusinessUserRequest,
  BusinessUserListItem,
  BusinessRole,
  PaginatedResponse
} from '../../types';
import { businessUserService } from '../../services';

interface BusinessState {
  users: BusinessUserListItem[];
  currentUser: BusinessUser | null;
  totalElements: number;
  totalPages: number;
  currentPage: number;
  loading: boolean;
  creating: boolean;
  error: string | null;
  searchTerm: string;
  selectedRole: BusinessRole | null;
  systemMetrics: any;
}

const initialState: BusinessState = {
  users: [],
  currentUser: null,
  totalElements: 0,
  totalPages: 0,
  currentPage: 0,
  loading: false,
  creating: false,
  error: null,
  searchTerm: '',
  selectedRole: null,
  systemMetrics: null,
  
  loading: false,
  listLoading: false,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
  metricsLoading: false,
  
  error: null,
  fieldErrors: {},
  
  successMessage: null,
  
  showCreateModal: false,
  showEditModal: false,
  showDeleteModal: false,
  showDetailsModal: false,
  
  selectedUserIds: [],
  bulkActionLoading: false,
};

// Async thunks
export const createBusinessUser = createAsyncThunk(
  'business/createUser',
  async (request: CreateBusinessUserRequest, { rejectWithValue }) => {
    try {
      const user = await businessUserService.createBusinessUser(request);
      return user;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch all business users
export const fetchBusinessUsers = createAsyncThunk(
  'business/fetchUsers',
  async (params: {
    page?: number;
    size?: number;
    role?: BusinessRole;
    search?: string;
    isActive?: boolean;
  }, { rejectWithValue }) => {
    try {
      const response = await businessUserService.getAllBusinessUsers(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchBusinessUserById = createAsyncThunk(
  'business/fetchUserById',
  async (id: string, { rejectWithValue }) => {
    try {
      const user = await businessUserService.getBusinessUserById(id);
      return user;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateBusinessUser = createAsyncThunk(
  'business/updateUser',
  async ({ id, request }: { id: string; request: Partial<CreateBusinessUserRequest> }, { rejectWithValue }) => {
    try {
      const user = await businessUserService.updateBusinessUser(id, request);
      return user;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deactivateBusinessUser = createAsyncThunk(
  'business/deactivateUser',
  async (id: string, { rejectWithValue }) => {
    try {
      await businessUserService.deactivateBusinessUser(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch user details
export const fetchUserDetails = createAsyncThunk(
  'business/fetchUserDetails',
  async (userId: string) => {
    const response = await businessService.getBusinessUserById(userId);
    return response.data;
  }
);

// Fetch user stats
export const fetchUserStats = createAsyncThunk(
  'business/fetchUserStats',
  async (userId: string) => {
    const response = await businessService.getBusinessUserStats(userId);
    return response.data;
  }
);

// Fetch system metrics
export const fetchSystemMetrics = createAsyncThunk(
  'business/fetchSystemMetrics',
  async (_, { rejectWithValue }) => {
    try {
      const metrics = await businessUserService.getSystemMetrics();
      return metrics;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const businessSlice = createSlice({
  name: 'business',
  initialState,
  reducers: {
    // UI Actions
    setFilters: (state, action: PayloadAction<BusinessUserFilters>) => {
      state.filters = action.payload;
    },
    
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    
    setSorting: (state, action: PayloadAction<{ sortBy: keyof BusinessUser; sortOrder: 'asc' | 'desc' }>) => {
      state.sortBy = action.payload.sortBy;
      state.sortOrder = action.payload.sortOrder;
    },
    
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
    },
    
    // Modal Actions
    openCreateModal: (state) => {
      state.showCreateModal = true;
      state.fieldErrors = {};
      state.error = null;
    },
    
    closeCreateModal: (state) => {
      state.showCreateModal = false;
      state.fieldErrors = {};
      state.error = null;
    },
    
    openEditModal: (state, action: PayloadAction<BusinessUser>) => {
      state.showEditModal = true;
      state.selectedUser = action.payload;
      state.fieldErrors = {};
      state.error = null;
    },
    
    closeEditModal: (state) => {
      state.showEditModal = false;
      state.selectedUser = null;
      state.fieldErrors = {};
      state.error = null;
    },
    
    openDeleteModal: (state, action: PayloadAction<BusinessUser>) => {
      state.showDeleteModal = true;
      state.selectedUser = action.payload;
    },
    
    closeDeleteModal: (state) => {
      state.showDeleteModal = false;
      state.selectedUser = null;
    },
    
    openDetailsModal: (state, action: PayloadAction<BusinessUser>) => {
      state.showDetailsModal = true;
      state.selectedUser = action.payload;
    },
    
    closeDetailsModal: (state) => {
      state.showDetailsModal = false;
      state.selectedUser = null;
      state.selectedUserStats = null;
    },
    
    // Selection Actions
    selectUser: (state, action: PayloadAction<string>) => {
      const userId = action.payload;
      if (state.selectedUserIds.includes(userId)) {
        state.selectedUserIds = state.selectedUserIds.filter(id => id !== userId);
      } else {
        state.selectedUserIds.push(userId);
      }
    },
    
    selectAllUsers: (state) => {
      state.selectedUserIds = state.users.map(user => user.businessUserId);
    },
    
    deselectAllUsers: (state) => {
      state.selectedUserIds = [];
    },
    
    // Clear Actions
    clearError: (state) => {
      state.error = null;
      state.fieldErrors = {};
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setSelectedRole: (state, action: PayloadAction<BusinessRole | null>) => {
      state.selectedRole = action.payload;
    },
    clearCurrentUser: (state) => {
      state.currentUser = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Business Users
    builder
      // Create user
      .addCase(createBusinessUser.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(createBusinessUser.fulfilled, (state, action) => {
        state.creating = false;
      })
      .addCase(createBusinessUser.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload as string;
      })
      // Fetch users
      .addCase(fetchBusinessUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBusinessUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.content;
        state.totalElements = action.payload.totalElements;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.number;
      })
      .addCase(fetchBusinessUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch user by ID
      .addCase(fetchBusinessUserById.fulfilled, (state, action) => {
        state.currentUser = action.payload;
      })
      // Update user
      .addCase(updateBusinessUser.fulfilled, (state, action) => {
        state.currentUser = action.payload;
        const index = state.users.findIndex(u => u.businessUserId === action.payload.businessUserId);
        if (index !== -1) {
          state.users[index] = {
            ...state.users[index],
            fullName: `${action.payload.firstName} ${action.payload.lastName}`,
            email: action.payload.email,
          };
        }
      })
      // Deactivate user
      .addCase(deactivateBusinessUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(u => u.businessUserId === action.payload);
        if (index !== -1) {
          state.users[index].isActive = false;
        }
      })
      // System metrics
      .addCase(fetchSystemMetrics.fulfilled, (state, action) => {
        state.systemMetrics = action.payload;
      });
  },
});

export const { clearError, setSearchTerm, setSelectedRole, clearCurrentUser } = businessSlice.actions;
export default businessSlice.reducer;