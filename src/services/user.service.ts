// services/user.service.ts (Hospital Users)
import { HospitalUser, CreateHospitalUserRequest, HospitalUserRole, PaginatedResponse } from '../types';
import { apiService } from './api.service';

class HospitalUserService {
  async createHospitalUser(request: CreateHospitalUserRequest): Promise<HospitalUser> {
    const response = await apiService.post<HospitalUser>('/api/hospital-users', request);
    return response.data;
  }

  async getHospitalUsers(hospitalId: string, params?: {
    page?: number;
    size?: number;
    role?: HospitalUserRole;
    search?: string;
    isActive?: boolean;
  }): Promise<PaginatedResponse<HospitalUser>> {
    const queryParams = new URLSearchParams();

    if (params?.page !== undefined) queryParams.append('page', params.page.toString());
    if (params?.size !== undefined) queryParams.append('size', params.size.toString());
    if (params?.role) queryParams.append('role', params.role);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());

    const response = await apiService.get<PaginatedResponse<HospitalUser>>(
      `/api/hospital-users/hospital/${hospitalId}?${queryParams.toString()}`
    );
    return response.data;
  }

  async getHospitalUserById(id: string): Promise<HospitalUser> {
    const response = await apiService.get<HospitalUser>(`/api/hospital-users/${id}`);
    return response.data;
  }

  async updateHospitalUser(id: string, request: Partial<CreateHospitalUserRequest>): Promise<HospitalUser> {
    const response = await apiService.put<HospitalUser>(`/api/hospital-users/${id}`, request);
    return response.data;
  }

  async deactivateHospitalUser(id: string): Promise<void> {
    await apiService.delete(`/api/hospital-users/${id}`);
  }
}

export const hospitalUserService = new HospitalUserService();