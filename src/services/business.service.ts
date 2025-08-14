import {
  BusinessUser,
  CreateBusinessUserRequest,
  BusinessUserListItem,
  BusinessRole,
  PaginatedResponse
} from '../types';
import { apiService } from './api.service';

class BusinessUserService {
  async createBusinessUser(request: CreateBusinessUserRequest): Promise<BusinessUser> {
    const response = await apiService.post<BusinessUser>('/api/admin/users/create', request);
    return response.data;
  }

  async getAllBusinessUsers(params?: {
    page?: number;
    size?: number;
    role?: BusinessRole;
    search?: string;
    isActive?: boolean;
  }): Promise<PaginatedResponse<BusinessUserListItem>> {
    const queryParams = new URLSearchParams();

    if (params?.page !== undefined) queryParams.append('page', params.page.toString());
    if (params?.size !== undefined) queryParams.append('size', params.size.toString());
    if (params?.role) queryParams.append('role', params.role);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());

    const response = await apiService.get<PaginatedResponse<BusinessUserListItem>>(
      `/api/business/users?${queryParams.toString()}`
    );
    return response.data;
  }

  async getBusinessUserById(id: string): Promise<BusinessUser> {
    const response = await apiService.get<BusinessUser>(`/api/business/users/${id}`);
    return response.data;
  }

  async updateBusinessUser(id: string, request: Partial<CreateBusinessUserRequest>): Promise<BusinessUser> {
    const response = await apiService.put<BusinessUser>(`/api/business/users/${id}`, request);
    return response.data;
  }

  async deactivateBusinessUser(id: string): Promise<void> {
    await apiService.delete(`/api/business/users/${id}`);
  }

  async activateBusinessUser(id: string): Promise<void> {
    await apiService.put(`/api/business/users/${id}/activate`);
  }

  async resetPassword(email: string, newPassword: string): Promise<void> {
    await apiService.post('/api/admin/users/reset-password', {
      email,
      newPassword
    });
  }

  async getSystemMetrics(): Promise<any> {
    const response = await apiService.get('/api/dashboard/system-metrics');
    return response.data;
  }

  async checkEmailAvailability(email: string): Promise<boolean> {
    const response = await apiService.get<{ available: boolean }>(
      `/api/auth/registration/check-availability?email=${encodeURIComponent(email)}`
    );
    return response.data.available;
  }

  async checkUsernameAvailability(username: string): Promise<boolean> {
    const response = await apiService.get<{ available: boolean }>(
      `/api/auth/registration/check-availability?username=${encodeURIComponent(username)}`
    );
    return response.data.available;
  }
}

export const businessUserService = new BusinessUserService();