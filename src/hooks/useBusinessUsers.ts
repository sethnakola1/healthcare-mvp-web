// hooks/useBusinessUsers.ts
import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  fetchBusinessUsers,
  createBusinessUser,
  updateBusinessUser,
  deleteBusinessUser,
  fetchUserDetails,
  fetchUserStats,
  searchBusinessUsers,
  setFilters,
  setSearchTerm,
  setSorting,
  setCurrentPage,
  clearError,
  clearSuccessMessage,
} from '../store/slices/businessSlice';
import { BusinessRole, BusinessUserFilters, CreateBusinessUserRequest, UpdateBusinessUserRequest } from '../types/business.types';

export const useBusinessUsers = () => {
  const dispatch = useAppDispatch();
  
  const {
    users,
    totalUsers,
    currentPage,
    totalPages,
    pageSize,
    filters,
    searchTerm,
    sortBy,
    sortOrder,
    selectedUser,
    selectedUserStats,
    loading,
    listLoading,
    createLoading,
    updateLoading,
    deleteLoading,
    error,
    successMessage,
    fieldErrors,
    selectedUserIds,
    bulkActionLoading,
  } = useAppSelector((state) => state.business);

  // Fetch users with current filters
  const fetchUsers = useCallback((params?: {
    page?: number;
    pageSize?: number;
    role?: BusinessRole;
    search?: string;
    isActive?: boolean;
  }) => {
    dispatch(fetchBusinessUsers(params));
  }, [dispatch]);

  // Create new user
  const createUser = useCallback((userData: CreateBusinessUserRequest) => {
    return dispatch(createBusinessUser(userData));
  }, [dispatch]);

  // Update existing user
  const updateUser = useCallback((userId: string, userData: UpdateBusinessUserRequest) => {
    return dispatch(updateBusinessUser({ userId, userData }));
  }, [dispatch]);

  // Delete user
  const deleteUser = useCallback((userId: string) => {
    return dispatch(deleteBusinessUser(userId));
  }, [dispatch]);

  // Fetch user details
  const getUserDetails = useCallback((userId: string) => {
    return dispatch(fetchUserDetails(userId));
  }, [dispatch]);

  // Fetch user stats
  const getUserStats = useCallback((userId: string) => {
    return dispatch(fetchUserStats(userId));
  }, [dispatch]);

  // Search users
  const searchUsers = useCallback((searchTerm: string, role?: BusinessRole, limit?: number) => {
    return dispatch(searchBusinessUsers({ searchTerm, role, limit }));
  }, [dispatch]);

  // Apply filters
  const applyFilters = useCallback((newFilters: BusinessUserFilters) => {
    dispatch(setFilters(newFilters));
    dispatch(fetchBusinessUsers({ page: 1, ...newFilters }));
  }, [dispatch]);

  // Set search term
  const setSearch = useCallback((term: string) => {
    dispatch(setSearchTerm(term));
    if (term) {
      dispatch(searchBusinessUsers({ searchTerm: term }));
    } else {
      dispatch(fetchBusinessUsers({ page: 1 }));
    }
  }, [dispatch]);

  // Set sorting
  const setSortOrder = useCallback((sortBy: string, sortOrder: 'asc' | 'desc') => {
    dispatch(setSorting({ sortBy: sortBy as any, sortOrder }));
    dispatch(fetchBusinessUsers({ page: currentPage, pageSize }));
  }, [dispatch, currentPage, pageSize]);

  // Change page
  const changePage = useCallback((page: number) => {
    dispatch(setCurrentPage(page));
    dispatch(fetchBusinessUsers({ page, pageSize }));
  }, [dispatch, pageSize]);

  // Clear error
  const clearErrors = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Clear success message
  const clearSuccess = useCallback(() => {
    dispatch(clearSuccessMessage());
  }, [dispatch]);

  // Load users on mount
  useEffect(() => {
    if (users.length === 0 && !listLoading) {
      fetchUsers();
    }
  }, [fetchUsers, users.length, listLoading]);

  return {
    // Data
    users,
    totalUsers,
    currentPage,
    totalPages,
    pageSize,
    filters,
    searchTerm,
    sortBy,
    sortOrder,
    selectedUser,
    selectedUserStats,
    selectedUserIds,

    // Loading states
    loading,
    listLoading,
    createLoading,
    updateLoading,
    deleteLoading,
    bulkActionLoading,

    // Error and success states
    error,
    successMessage,
    fieldErrors,

    // Actions
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    getUserDetails,
    getUserStats,
    searchUsers,
    applyFilters,
    setSearch,
    setSortOrder,
    changePage,
    clearErrors,
    clearSuccess,
  };
};

// hooks/useBusinessUserForm.ts
import { useState, useCallback } from 'react';
import { BusinessRole, ROLE_DEFAULTS } from '../types/business.types';
import { BusinessUserValidator } from '../utils/validators';

interface BusinessUserFormData {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  territory: string;
  businessRole: BusinessRole;
  commissionPercentage: number;
  targetHospitalsMonthly: number;
}

export const useBusinessUserForm = (initialData?: Partial<BusinessUserFormData>, editMode = false) => {
  const [formData, setFormData] = useState<BusinessUserFormData>({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    territory: '',
    businessRole: BusinessRole.TECH_ADVISOR,
    commissionPercentage: ROLE_DEFAULTS[BusinessRole.TECH_ADVISOR].commissionPercentage || 20,
    targetHospitalsMonthly: ROLE_DEFAULTS[BusinessRole.TECH_ADVISOR].targetHospitalsMonthly || 5,
    ...initialData,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Handle input changes
  const handleChange = useCallback((name: string, value: any) => {
    setFormData(prev => {
      const newData = { ...prev, [name]: value };

      // Auto-update role-specific defaults
      if (name === 'businessRole') {
        const defaults = ROLE_DEFAULTS[value as BusinessRole];
        newData.commissionPercentage = defaults.commissionPercentage || 0;
        newData.targetHospitalsMonthly = defaults.targetHospitalsMonthly || 0;
      }

      return newData;
    });

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [errors]);

  // Handle field blur (for validation)
  const handleBlur = useCallback((name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));

    // Validate field on blur
    let error = '';
    switch (name) {
      case 'firstName':
        const firstNameValidation = BusinessUserValidator.validateFirstName(formData.firstName);
        error = firstNameValidation.error || '';
        break;
      case 'lastName':
        const lastNameValidation = BusinessUserValidator.validateLastName(formData.lastName);
        error = lastNameValidation.error || '';
        break;
      case 'email':
        const emailValidation = BusinessUserValidator.validateEmail(formData.email);
        error = emailValidation.error || '';
        break;
      case 'username':
        const usernameValidation = BusinessUserValidator.validateUsername(formData.username);
        error = usernameValidation.error || '';
        break;
      case 'password':
        if (!editMode) { // Only validate password in create mode
          const passwordValidation = BusinessUserValidator.validatePassword(formData.password);
          error = passwordValidation.errors[0] || '';
        }
        break;
      case 'confirmPassword':
        if (!editMode) { // Only validate password confirmation in create mode
          const confirmValidation = BusinessUserValidator.validatePasswordConfirmation(formData.password, formData.confirmPassword);
          error = confirmValidation.error || '';
        }
        break;
      case 'phoneNumber':
        const phoneValidation = BusinessUserValidator.validatePhoneNumber(formData.phoneNumber);
        error = phoneValidation.error || '';
        break;
      case 'territory':
        const territoryValidation = BusinessUserValidator.validateTerritory(formData.territory);
        error = territoryValidation.error || '';
        break;
      case 'commissionPercentage':
        const commissionValidation = BusinessUserValidator.validateCommissionPercentage(formData.commissionPercentage, formData.businessRole);
        error = commissionValidation.error || '';
        break;
      case 'targetHospitalsMonthly':
        const targetValidation = BusinessUserValidator.validateTargetHospitalsMonthly(formData.targetHospitalsMonthly, formData.businessRole);
        error = targetValidation.error || '';
        break;
    }

    if (error) {
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  }, [formData, editMode]);

  // Validate entire form
  const validateForm = useCallback(() => {
    const validation = BusinessUserValidator.validateBusinessUserForm(formData);
    setErrors(validation.errors);
    return validation.isValid;
  }, [formData]);

  // Get password validation details
  const getPasswordValidation = useCallback(() => {
    return BusinessUserValidator.validatePassword(formData.password);
  }, [formData.password]);

  // Reset form
  const resetForm = useCallback(() => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
      phoneNumber: '',
      territory: '',
      businessRole: BusinessRole.TECH_ADVISOR,
      commissionPercentage: ROLE_DEFAULTS[BusinessRole.TECH_ADVISOR].commissionPercentage || 20,
      targetHospitalsMonthly: ROLE_DEFAULTS[BusinessRole.TECH_ADVISOR].targetHospitalsMonthly || 5,
    });
    setErrors({});
    setTouched({});
  }, []);

  // Check if form is valid
  const isFormValid = Object.keys(errors).length === 0 && 
                      formData.firstName &&
                      formData.lastName &&
                      formData.email &&
                      formData.username &&
                      formData.territory &&
                      (editMode || formData.password);

  return {
    formData,
    errors,
    touched,
    showPassword,
    showConfirmPassword,
    setShowPassword,
    setShowConfirmPassword,
    handleChange,
    handleBlur,
    validateForm,
    getPasswordValidation,
    resetForm,
    isFormValid,
  };
};

// hooks/usePermissions.ts
import { useMemo } from 'react';
import { useAppSelector } from '../store/hooks';
import { BusinessRole, ROLE_PERMISSIONS } from '../types/business.types';

export const usePermissions = () => {
  const { user } = useAppSelector((state) => state.auth);

  const permissions = useMemo(() => {
    if (!user || !user.role) {
      return {
        canCreateSuperAdmin: false,
        canCreateTechAdvisor: false,
        canUpdateBusinessUser: false,
        canDeactivateBusinessUser: false,
        canViewAllBusinessUsers: false,
        canViewSystemMetrics: false,
        canResetPasswords: false,
        canManageHospitals: false,
        canViewReports: false,
        canExportData: false,
        canManageSystemSettings: false,
      };
    }

    return ROLE_PERMISSIONS[user.role as BusinessRole] || ROLE_PERMISSIONS[BusinessRole.TECH_ADVISOR];
  }, [user]);

  const hasPermission = useCallback((permission: keyof typeof permissions) => {
    return permissions[permission];
  }, [permissions]);

  const hasRole = useCallback((role: BusinessRole) => {
    return user?.role === role;
  }, [user]);

  const hasAnyRole = useCallback((roles: BusinessRole[]) => {
    return roles.includes(user?.role as BusinessRole);
  }, [user]);

  return {
    permissions,
    hasPermission,
    hasRole,
    hasAnyRole,
    isAdmin: user?.role === BusinessRole.SUPER_ADMIN,
    isTechAdvisor: user?.role === BusinessRole.TECH_ADVISOR,
  };
};

// hooks/useDebounce.ts
import { useState, useEffect } from 'react';

export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// hooks/usePagination.ts
import { useMemo } from 'react';

interface UsePaginationProps {
  totalItems: number;
  currentPage: number;
  pageSize: number;
  maxVisiblePages?: number;
}

export const usePagination = ({
  totalItems,
  currentPage,
  pageSize,
  maxVisiblePages = 5,
}: UsePaginationProps) => {
  const pagination = useMemo(() => {
    const totalPages = Math.ceil(totalItems / pageSize);
    const hasNextPage = currentPage < totalPages;
    const hasPreviousPage = currentPage > 1;

    // Calculate visible page numbers
    const half = Math.floor(maxVisiblePages / 2);
    let startPage = Math.max(currentPage - half, 1);
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }

    const visiblePages = Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );

    return {
      totalPages,
      hasNextPage,
      hasPreviousPage,
      visiblePages,
      isFirstPage: currentPage === 1,
      isLastPage: currentPage === totalPages,
      startItem: (currentPage - 1) * pageSize + 1,
      endItem: Math.min(currentPage * pageSize, totalItems),
    };
  }, [totalItems, currentPage, pageSize, maxVisiblePages]);

  return pagination;
};

// hooks/useLocalStorage.ts
import { useState, useEffect } from 'react';

export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  const removeValue = () => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue, removeValue] as const;
};

// hooks/useAsync.ts
import { useState, useCallback } from 'react';

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export const useAsync = <T>() => {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (asyncFunction: () => Promise<T>) => {
    setState({ data: null, loading: true, error: null });

    try {
      const data = await asyncFunction();
      setState({ data, loading: false, error: null });
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setState({ data: null, loading: false, error: errorMessage });
      throw error;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
};

export default {
  useBusinessUsers,
  useBusinessUserForm,
  usePermissions,
  useDebounce,
  usePagination,
  useLocalStorage,
  useAsync,
};