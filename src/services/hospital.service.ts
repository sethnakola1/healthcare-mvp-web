// services/hospital.service.ts
import { Hospital, CreateHospitalRequest, PaginatedResponse } from '../types';
import { apiService } from './api.service';

class HospitalService {
  async createHospital(request: CreateHospitalRequest, createdByBusinessUserId: string): Promise<Hospital> {
    const response = await apiService.post<Hospital>(
      `/api/hospitals?createdByBusinessUserId=${createdByBusinessUserId}`,
      request
    );
    return response.data;
  }

  async getAllHospitals(params?: {
    page?: number;
    size?: number;
    search?: string;
    isActive?: boolean;
  }): Promise<PaginatedResponse<Hospital>> {
    const queryParams = new URLSearchParams();

    if (params?.page !== undefined) queryParams.append('page', params.page.toString());
    if (params?.size !== undefined) queryParams.append('size', params.size.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());

    const response = await apiService.get<PaginatedResponse<Hospital>>(
      `/api/hospitals?${queryParams.toString()}`
    );
    return response.data;
  }

  async getHospitalById(id: string): Promise<Hospital> {
    const response = await apiService.get<Hospital>(`/api/hospitals/${id}`);
    return response.data;
  }

  async getHospitalByCode(code: string): Promise<Hospital> {
    const response = await apiService.get<Hospital>(`/api/hospitals/code/${code}`);
    return response.data;
  }

  async getHospitalsByBusinessUser(partnerCode: string): Promise<Hospital[]> {
    const response = await apiService.get<Hospital[]>(`/api/hospitals/business-user/${partnerCode}`);
    return response.data;
  }

  async updateHospital(id: string, request: Partial<CreateHospitalRequest>): Promise<Hospital> {
    const response = await apiService.put<Hospital>(`/api/hospitals/${id}`, request);
    return response.data;
  }

  async deactivateHospital(id: string): Promise<void> {
    await apiService.delete(`/api/hospitals/${id}`);
  }
}

export const hospitalService = new HospitalService();