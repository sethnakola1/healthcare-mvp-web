// src/hooks/useAuth.ts
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loginUser, logoutUser, getCurrentUser, clearError, clearAuth } from '../store/slices/authSlice';
import { LoginRequest } from '../types';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, token, isAuthenticated, loading, error } = useAppSelector((state) => state.auth);

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

  const refreshUser = useCallback(async () => {
    await dispatch(getCurrentUser());
  }, [dispatch]);

  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const clearAuthentication = useCallback(() => {
    dispatch(clearAuth());
  }, [dispatch]);

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    refreshUser,
    clearError: clearAuthError,
    clearAuth: clearAuthentication,
  };
};