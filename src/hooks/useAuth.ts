// src/hooks/useAuth.ts
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loginUser, getCurrentUser, logoutUser, changePassword, validateToken, clearError } from '../store/slices/authSlice';
import { LoginRequest, ChangePasswordRequest } from '../types';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading, error, loginLoading } = useAppSelector((state) => state.auth);

  const login = useCallback(
    async (credentials: LoginRequest) => {
      const result = await dispatch(loginUser(credentials));
      return result;
    },
    [dispatch]
  );

  const logout = useCallback(async () => {
    await dispatch(logoutUser());
  }, [dispatch]);

  const getUserInfo = useCallback(async () => {
    await dispatch(getCurrentUser());
  }, [dispatch]);

  const updatePassword = useCallback(
    async (passwordData: ChangePasswordRequest) => {
      const result = await dispatch(changePassword(passwordData));
      return result;
    },
    [dispatch]
  );

  const checkTokenValidity = useCallback(async () => {
    await dispatch(validateToken());
  }, [dispatch]);

  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Permission helpers
  const hasRole = useCallback(
    (role: string) => {
      return user?.role === role;
    },
    [user]
  );

  const hasAnyRole = useCallback(
    (roles: string[]) => {
      return user?.role ? roles.includes(user.role) : false;
    },
    [user]
  );

  const canCreateBusinessUser = useCallback(() => {
    return hasRole('SUPER_ADMIN');
  }, [hasRole]);

  const canCreateHospital = useCallback(() => {
    return hasAnyRole(['SUPER_ADMIN', 'TECH_ADVISOR']);
  }, [hasAnyRole]);

  const canManageHospitalUsers = useCallback(() => {
    return hasRole('HOSPITAL_ADMIN');
  }, [hasRole]);

  const canManagePatients = useCallback(() => {
    return hasAnyRole(['HOSPITAL_ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST']);
  }, [hasAnyRole]);

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,
    loginLoading,

    // Actions
    login,
    logout,
    getUserInfo,
    updatePassword,
    checkTokenValidity,
    clearAuthError,

    // Permissions
    hasRole,
    hasAnyRole,
    canCreateBusinessUser,
    canCreateHospital,
    canManageHospitalUsers,
    canManagePatients,
  };
};

export default useAuth;