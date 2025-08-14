// services/patient.service.ts
import { Patient, CreatePatientRequest, PaginatedResponse } from '../types';
import { apiService } from './api.service';

class PatientService {
  async createPatient(request: CreatePatientRequest): Promise<Patient> {
    const response = await apiService.post<Patient>('/api/patients', request);
    return response.data;
  }

  async getPatientsByHospital(hospitalId: string, params?: {
    page?: number;
    size?: number;
    search?: string;
  }): Promise<PaginatedResponse<Patient>> {
    const queryParams = new URLSearchParams();

    if (params?.page !== undefined) queryParams.append('page', params.page.toString());
    if (params?.size !== undefined) queryParams.append('size', params.size.toString());
    if (params?.search) queryParams.append('search', params.search);

    const response = await apiService.get<PaginatedResponse<Patient>>(
      `/api/patients/hospital/${hospitalId}?${queryParams.toString()}`
    );
    return response.data;
  }

  async getPatientById(id: string): Promise<Patient> {
    const response = await apiService.get<Patient>(`/api/patients/${id}`);
    return response.data;
  }

  async updatePatient(id: string, request: Partial<CreatePatientRequest>): Promise<Patient> {
    const response = await apiService.put<Patient>(`/api/patients/${id}`, request);
    return response.data;
  }

  async searchPatientsGlobally(searchTerm: string): Promise<Patient[]> {
    const response = await apiService.get<Patient[]>(`/api/patients/search?searchTerm=${encodeURIComponent(searchTerm)}`);
    return response.data;
  }
}

export const patientService = new PatientService();