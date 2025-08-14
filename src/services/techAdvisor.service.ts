// services/techAdvisor.service.ts
import axiosInstance from './axios.config';

export interface CreateTechAdvisorRequest {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  phoneNumber?: string;
  territory: string;
  role: 'TECH_ADVISOR';
}

export interface TechAdvisorResponse {
  businessUserId: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  businessRole: string;
  partnerCode: string;
  commissionPercentage: number;
  territory: string;
  targetHospitalsMonthly: number;
  totalHospitalsBrought: number;
  totalCommissionEarned: number;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp?: string;
}

class TechAdvisorService {
  /**
   * Create a new Tech Advisor
   */
  async createTechAdvisor(request: CreateTechAdvisorRequest): Promise<ApiResponse<TechAdvisorResponse>> {
    try {
      const response = await axiosInstance.post<ApiResponse<TechAdvisorResponse>>(
        '/admin/users/create',
        request
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create Tech Advisor');
    }
  }

  /**
   * Get all Tech Advisors
   */
  async getAllTechAdvisors(): Promise<ApiResponse<TechAdvisorResponse[]>> {
    try {
      const response = await axiosInstance.get<ApiResponse<TechAdvisorResponse[]>>(
        '/business/super-admin/tech-advisors'
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch Tech Advisors');
    }
  }

  /**
   * Get Tech Advisor by ID
   */
  async getTechAdvisorById(techAdvisorId: string): Promise<ApiResponse<TechAdvisorResponse>> {
    try {
      const response = await axiosInstance.get<ApiResponse<TechAdvisorResponse>>(
        `/business/super-admin/tech-advisors/${techAdvisorId}`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch Tech Advisor');
    }
  }

  /**
   * Update Tech Advisor
   */
  async updateTechAdvisor(
    techAdvisorId: string, 
    request: Partial<CreateTechAdvisorRequest>
  ): Promise<ApiResponse<TechAdvisorResponse>> {
    try {
      const response = await axiosInstance.put<ApiResponse<TechAdvisorResponse>>(
        `/business/super-admin/tech-advisors/${techAdvisorId}`,
        request
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update Tech Advisor');
    }
  }

  /**
   * Deactivate Tech Advisor
   */
  async deactivateTechAdvisor(techAdvisorId: string): Promise<ApiResponse<string>> {
    try {
      const response = await axiosInstance.delete<ApiResponse<string>>(
        `/business/super-admin/tech-advisors/${techAdvisorId}`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to deactivate Tech Advisor');
    }
  }

  /**
   * Check if email is available
   */
  async checkEmailAvailability(email: string): Promise<ApiResponse<{ emailAvailable: boolean }>> {
    try {
      const response = await axiosInstance.get<ApiResponse<{ emailAvailable: boolean }>>(
        `/auth/registration/check-availability?email=${encodeURIComponent(email)}`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to check email availability');
    }
  }

  /**
   * Check if username is available
   */
  async checkUsernameAvailability(username: string): Promise<ApiResponse<{ usernameAvailable: boolean }>> {
    try {
      const response = await axiosInstance.get<ApiResponse<{ usernameAvailable: boolean }>>(
        `/auth/registration/check-availability?username=${encodeURIComponent(username)}`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to check username availability');
    }
  }

  /**
   * Reset Tech Advisor password (Super Admin only)
   */
  async resetTechAdvisorPassword(email: string, newPassword: string): Promise<ApiResponse<string>> {
    try {
      const response = await axiosInstance.post<ApiResponse<string>>(
        '/admin/users/reset-password',
        { email, newPassword }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to reset password');
    }
  }
}

export default new TechAdvisorService();