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