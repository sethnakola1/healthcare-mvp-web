// src/types/auth.types.ts
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: BusinessRole;
  loginTime: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UserInfo {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  username: string;
  role: BusinessRole;
  roleDisplayName: string;
  isActive: boolean;
  emailVerified: boolean;
  phoneNumber?: string;
  territory?: string;
  partnerCode?: string;
  lastLogin?: string;
  createdAt: string;
  // Business-specific fields for TECH_ADVISOR
  commissionPercentage?: number;
  targetHospitalsMonthly?: number;
  totalHospitalsBrought?: number;
  totalCommissionEarned?: number;
}