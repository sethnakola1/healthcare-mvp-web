// src/types/hospital.types.ts
export enum HospitalRole {
  HOSPITAL_ADMIN = 'HOSPITAL_ADMIN',
  DOCTOR = 'DOCTOR',
  NURSE = 'NURSE',
  RECEPTIONIST = 'RECEPTIONIST',
  LAB_STAFF = 'LAB_STAFF',
  PHARMACY_STAFF = 'PHARMACY_STAFF',
  BILLING_STAFF = 'BILLING_STAFF',
  PATIENT = 'PATIENT'
}

export interface HospitalDto {
  hospitalId: string;
  hospitalName: string;
  hospitalCode: string;
  licenseNumber?: string;
  taxId?: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode?: string;
  phoneNumber?: string;
  email?: string;
  website?: string;
  broughtByBusinessUserName?: string;
  broughtByPartnerCode?: string;
  partnerCodeUsed?: string;
  techSupport1Name?: string;
  techSupport2Name?: string;
  subscriptionPlan: string;
  monthlyRevenue?: number;
  commissionRate?: number;
  isActive: boolean;
  contractStartDate?: string;
  contractEndDate?: string;
  createdAt: string;
}