// src/types/business.types.ts
export interface BusinessUser {
  businessUserId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: 'SUPER_ADMIN' | 'TECH_ADVISOR';
  region?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBusinessUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: 'SUPER_ADMIN' | 'TECH_ADVISOR';
  region?: string;
  password: string;
}
