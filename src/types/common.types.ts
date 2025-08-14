// src/types/common.types.ts
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  error?: string;
  timestamp?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  pageable: {
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    pageNumber: number;
    pageSize: number;
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  numberOfElements: number;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  empty: boolean;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface FormErrors {
  [key: string]: string;
}


// Export all types
export * from './auth.types';
export * from './business.types';
export * from './hospital.types';