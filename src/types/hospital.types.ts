// src/types/hospital.types.ts
export interface Hospital {
  hospitalId: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
  email: string;
  website?: string;
  description?: string;
  techAdvisorId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateHospitalRequest {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
  email: string;
  website?: string;
  description?: string;
  adminFirstName: string;
  adminLastName: string;
  adminEmail: string;
  adminPhoneNumber: string;
  adminPassword: string;
}