// src/types/user.types.ts
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  TECH_ADVISOR = 'TECH_ADVISOR',
  HOSPITAL_ADMIN = 'HOSPITAL_ADMIN',
  DOCTOR = 'DOCTOR',
  NURSE = 'NURSE',
  RECEPTIONIST = 'RECEPTIONIST',
  LAB_STAFF = 'LAB_STAFF',
  PHARMACY_STAFF = 'PHARMACY_STAFF',
  BILLING_STAFF = 'BILLING_STAFF',
}

export interface HospitalUser {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: UserRole;
  hospitalId: string;
  department?: string;
  specialization?: string;
  licenseNumber?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateHospitalUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: UserRole;
  department?: string;
  specialization?: string;
  licenseNumber?: string;
  password: string;
}
