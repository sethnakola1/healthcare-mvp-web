// src/types/business.types.ts
export enum BusinessRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  TECH_ADVISOR = 'TECH_ADVISOR'
}

export interface BusinessUserDto {
  businessUserId: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  businessRole: BusinessRole;
  partnerCode: string;
  commissionPercentage: number;
  territory: string;
  targetHospitalsMonthly: number;
  totalHospitalsBrought: number;
  totalCommissionEarned: number;
  isActive: boolean;
  emailVerified: boolean;
  lastLogin?: string;
  createdAt: string;
  fullName: string;
  roleDisplayName: string;
}

export interface CreateBusinessUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  phoneNumber?: string;
  territory: string;
  role: BusinessRole;
}
