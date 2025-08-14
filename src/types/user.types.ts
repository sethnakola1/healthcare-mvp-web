

// types/user.types.ts (Hospital Users)
export enum HospitalUserRole {
  HOSPITAL_ADMIN = 'HOSPITAL_ADMIN',
  DOCTOR = 'DOCTOR',
  NURSE = 'NURSE',
  RECEPTIONIST = 'RECEPTIONIST',
  LAB_ADMIN = 'LAB_ADMIN',
  LAB_STAFF = 'LAB_STAFF',
  PHARMACY_ADMIN = 'PHARMACY_ADMIN',
  PHARMACY_STAFF = 'PHARMACY_STAFF',
  BILLING_STAFF = 'BILLING_STAFF',
  TECHNICIAN = 'TECHNICIAN'
}

// types/common.types.ts
export interface BaseEntity {
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
  version?: number;
  isActive: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: string;
  code?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

// types/auth.types.ts
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
  role: string;
  loginTime: string;
}

export interface User {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  role: string;
  roleDisplayName: string;
  isActive: boolean;
  emailVerified: boolean;
  phoneNumber?: string;
  territory?: string;
  partnerCode?: string;
  lastLogin?: string;
  createdAt: string;
}

// types/business.types.ts
export enum BusinessRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  TECH_ADVISOR = 'TECH_ADVISOR'
}

export interface BusinessUser extends BaseEntity {
  businessUserId: string;
  cognitoUserId: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  profilePictureUrl?: string;
  businessRole: BusinessRole;
  partnerCode: string;
  commissionPercentage: number;
  territory?: string;
  targetHospitalsMonthly: number;
  totalHospitalsBrought: number;
  totalCommissionEarned: number;
  emailVerified: boolean;
  lastLogin?: string;
  loginAttempts: number;
  accountLockedUntil?: string;
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

export interface BusinessUserListItem {
  businessUserId: string;
  fullName: string;
  email: string;
  businessRole: BusinessRole;
  territory?: string;
  partnerCode: string;
  totalHospitalsBrought: number;
  commissionPercentage: number;
  isActive: boolean;
  createdAt: string;
}

// types/hospital.types.ts
export interface Hospital extends BaseEntity {
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
  monthlyRevenue: number;
  commissionRate: number;
  contractStartDate?: string;
  contractEndDate?: string;
}

export interface CreateHospitalRequest {
  hospitalName: string;
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
  partnerCodeUsed?: string;
  techSupport1Id?: string;
  techSupport2Id?: string;
  subscriptionPlan: string;
  contractStartDate?: string;
  contractEndDate?: string;
  // Hospital Admin details
  adminFirstName: string;
  adminLastName: string;
  adminEmail: string;
  adminUsername: string;
  adminPassword: string;
  adminPhoneNumber?: string;
}

// types/user.types.ts (Hospital Users)
// export enum HospitalUserRole {
//   HOSPITAL_ADMIN = 'HOSPITAL_ADMIN',
//   DOCTOR = 'DOCTOR',
//   NURSE = 'NURSE',
//   RECEPTIONIST = 'RECEPTIONIST',
//   LAB_ADMIN = 'LAB_ADMIN',
//   LAB_STAFF = 'LAB_STAFF',
//   PHARMACY_ADMIN = 'PHARMACY_ADMIN',
//   PHARMACY_STAFF = 'PHARMACY_STAFF',
//   BILLING_STAFF = 'BILLING_STAFF',
//   TECHNICIAN = 'TECHNICIAN'
// }

export interface HospitalUser extends BaseEntity {
  userId: string;
  hospitalId: string;
  cognitoUserId: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  profilePictureUrl?: string;
  userRole: HospitalUserRole;
  partnerCode: string;
  globalHealthcareId?: string;
  fhirPractitionerId?: string;
  npiNumber?: string;
  licenseNumber?: string;
  specialization?: string;
  yearsOfExperience?: number;
  educationDetails?: any;
  certifications?: string[];
  consultationFee?: number;
  availableFrom?: string;
  availableTo?: string;
  maxPatientsPerDay?: number;
  workingDays?: number[];
  breakTimeStart?: string;
  breakTimeEnd?: string;
  reportsTo?: string;
  emailVerified: boolean;
  lastLogin?: string;
  loginAttempts: number;
  accountLockedUntil?: string;
}

export interface CreateHospitalUserRequest {
  hospitalId: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  phoneNumber?: string;
  userRole: HospitalUserRole;
  specialization?: string;
  licenseNumber?: string;
  yearsOfExperience?: number;
  consultationFee?: number;
  availableFrom?: string;
  availableTo?: string;
  maxPatientsPerDay?: number;
  workingDays?: number[];
  reportsTo?: string;
}

// types/patient.types.ts
export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER'
}

export interface Patient extends BaseEntity {
  patientId: string;
  hospitalId: string;
  globalPatientId: string;
  mrn: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  gender?: Gender;
  bloodGroup?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;
  initialSymptoms?: string;
  allergies?: string;
  currentMedications?: string;
  chronicConditions?: string;
  fhirPatientId?: string;
  ssnLast4?: string;
  contactInfo?: string;
  encryptionKeyId?: string;
  isEncrypted: boolean;
}

export interface CreatePatientRequest {
  hospitalId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  gender?: Gender;
  bloodGroup?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;
  initialSymptoms?: string;
  allergies?: string;
  currentMedications?: string;
  chronicConditions?: string;
  ssnLast4?: string;
}





export interface HospitalUser extends BaseEntity {
  userId: string;
  hospitalId: string;
  cognitoUserId: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  profilePictureUrl?: string;
  userRole: HospitalUserRole;
  partnerCode: string;
  globalHealthcareId?: string;
  fhirPractitionerId?: string;
  npiNumber?: string;
  licenseNumber?: string;
  specialization?: string;
  yearsOfExperience?: number;
  educationDetails?: any;
  certifications?: string[];
  consultationFee?: number;
  availableFrom?: string;
  availableTo?: string;
  maxPatientsPerDay?: number;
  workingDays?: number[];
  breakTimeStart?: string;
  breakTimeEnd?: string;
  reportsTo?: string;
  emailVerified: boolean;
  lastLogin?: string;
  loginAttempts: number;
  accountLockedUntil?: string;
}

export interface CreateHospitalUserRequest {
  hospitalId: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  phoneNumber?: string;
  userRole: HospitalUserRole;
  specialization?: string;
  licenseNumber?: string;
  yearsOfExperience?: number;
  consultationFee?: number;
  availableFrom?: string;
  availableTo?: string;
  maxPatientsPerDay?: number;
  workingDays?: number[];
  reportsTo?: string;
}