// components/common/Table.tsx
import React from 'react';

interface Column<T> {
  key: keyof T | string;
  title: string;
  dataIndex?: keyof T;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  sorter?: boolean;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
}

interface TableProps<T> {
  columns: Column<T>[];
  dataSource: T[];
  loading?: boolean;
  rowKey: keyof T | ((record: T) => string);
  onRow?: (record: T, index: number) => React.HTMLAttributes<HTMLTableRowElement>;
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
  };
  selectedRowKeys?: string[];
  onSelectChange?: (selectedRowKeys: string[]) => void;
  className?: string;
}

export function Table<T>({
  columns,
  dataSource,
  loading = false,
  rowKey,
  onRow,
  pagination,
  selectedRowKeys = [],
  onSelectChange,
  className = '',
}: TableProps<T>) {
  const getRowKey = (record: T, index: number): string => {
    if (typeof rowKey === 'function') {
      return rowKey(record);
    }
    return String(record[rowKey]);
  };

  const handleSelectAll = (checked: boolean) => {
    if (onSelectChange) {
      if (checked) {
        const allKeys = dataSource.map((record, index) => getRowKey(record, index));
        onSelectChange(allKeys);
      } else {
        onSelectChange([]);
      }
    }
  };

  const handleSelectRow = (checked: boolean, record: T, index: number) => {
    if (onSelectChange) {
      const key = getRowKey(record, index);
      if (checked) {
        onSelectChange([...selectedRowKeys, key]);
      } else {
        onSelectChange(selectedRowKeys.filter(k => k !== key));
      }
    }
  };

  const isAllSelected = selectedRowKeys.length === dataSource.length && dataSource.length > 0;
  const isIndeterminate = selectedRowKeys.length > 0 && selectedRowKeys.length < dataSource.length;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#219ebc]"></div>
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            {onSelectChange && (
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-gray-300 text-[#219ebc] focus:ring-[#219ebc]"
                  style={{ transform: isIndeterminate ? 'scale(1.1)' : 'scale(1)' }}
                />
              </th>
            )}
            {columns.map((column, index) => (
              <th
                key={String(column.key) + index}
                className={`px-4 py-3 text-${column.align || 'left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}
                style={{ width: column.width }}
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {dataSource.map((record, index) => {
            const key = getRowKey(record, index);
            const isSelected = selectedRowKeys.includes(key);
            const rowProps = onRow?.(record, index) || {};

            return (
              <tr
                key={key}
                className={`hover:bg-gray-50 ${isSelected ? 'bg-blue-50' : ''}`}
                {...rowProps}
              >
                {onSelectChange && (
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => handleSelectRow(e.target.checked, record, index)}
                      className="rounded border-gray-300 text-[#219ebc] focus:ring-[#219ebc]"
                    />
                  </td>
                )}
                {columns.map((column, colIndex) => {
                  const value = column.dataIndex ? record[column.dataIndex] : record;
                  const cellContent = column.render 
                    ? column.render(value, record, index)
                    : String(value || '');

                  return (
                    <td
                      key={String(column.key) + colIndex}
                      className={`px-4 py-3 text-${column.align || 'left'} text-sm text-gray-900`}
                    >
                      {cellContent}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      {pagination && (
        <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200">
          <div className="flex items-center text-sm text-gray-700">
            Showing {Math.min((pagination.current - 1) * pagination.pageSize + 1, pagination.total)} to{' '}
            {Math.min(pagination.current * pagination.pageSize, pagination.total)} of {pagination.total} results
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => pagination.onChange(pagination.current - 1, pagination.pageSize)}
              disabled={pagination.current === 1}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-gray-700">
              Page {pagination.current} of {Math.ceil(pagination.total / pagination.pageSize)}
            </span>
            <button
              onClick={() => pagination.onChange(pagination.current + 1, pagination.pageSize)}
              disabled={pagination.current >= Math.ceil(pagination.total / pagination.pageSize)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// components/common/SearchBox.tsx
import React, { useState, useEffect } from 'react';
import { useDebounce } from '../../hooks/useDebounce';

interface SearchBoxProps {
  placeholder?: string;
  value?: string;
  onChange: (value: string) => void;
  onSearch?: (value: string) => void;
  debounceMs?: number;
  className?: string;
  showSearchButton?: boolean;
}

export const SearchBox: React.FC<SearchBoxProps> = ({
  placeholder = 'Search...',
  value = '',
  onChange,
  onSearch,
  debounceMs = 300,
  className = '',
  showSearchButton = false,
}) => {
  const [searchTerm, setSearchTerm] = useState(value);
  const debouncedSearchTerm = useDebounce(searchTerm, debounceMs);

  useEffect(() => {
    onChange(debouncedSearchTerm);
  }, [debouncedSearchTerm, onChange]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchTerm);
  };

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="flex">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-[#219ebc] focus:border-[#219ebc]"
            placeholder={placeholder}
          />
        </div>
        {showSearchButton && (
          <button
            type="submit"
            className="ml-2 px-4 py-2 bg-[#219ebc] text-white rounded-md hover:bg-[#1a7a94] focus:outline-none focus:ring-2 focus:ring-[#219ebc]"
          >
            Search
          </button>
        )}
      </form>
    </div>
  );
};

// components/common/Modal.tsx
import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4',
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={handleOverlayClick}
        />

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

        <div className={`inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle ${sizeClasses[size]} sm:w-full`}>
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-start justify-between">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {title}
              </h3>
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="ml-4 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            <div className="mt-4">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// components/common/Badge.tsx
import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-base',
  };

  return (
    <span className={`inline-flex items-center font-medium rounded-full ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}>
      {children}
    </span>
  );
};

// components/common/Alert.tsx
import React from 'react';

interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  onClose?: () => void;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  type,
  title,
  message,
  onClose,
  className = '',
}) => {
  const typeClasses = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  const iconClasses = {
    success: 'text-green-400',
    error: 'text-red-400',
    warning: 'text-yellow-400',
    info: 'text-blue-400',
  };

  const icons = {
    success: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
    error: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    ),
    warning: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    ),
    info: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
    ),
  };

  return (
    <div className={`border rounded-md p-4 ${typeClasses[type]} ${className}`}>
      <div className="flex">
        <div className={`flex-shrink-0 ${iconClasses[type]}`}>
          {icons[type]}
        </div>
        <div className="ml-3 flex-1">
          {title && (
            <h3 className="text-sm font-medium">
              {title}
            </h3>
          )}
          <div className={`text-sm ${title ? 'mt-1' : ''}`}>
            {message}
          </div>
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <button
              onClick={onClose}
              className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${iconClasses[type]} hover:bg-opacity-20`}
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// components/business/widgets/RoleDisplayWidget.tsx
import React from 'react';
import { BusinessRole, ROLE_DISPLAY_NAMES } from '../../../types/business.types';
import { Badge } from '../../common/Badge';

interface RoleDisplayWidgetProps {
  role: BusinessRole;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const RoleDisplayWidget: React.FC<RoleDisplayWidgetProps> = ({
  role,
  showIcon = true,
  size = 'md',
}) => {
  const roleColors = {
    [BusinessRole.SUPER_ADMIN]: 'error',
    [BusinessRole.TECH_ADVISOR]: 'info',
  } as const;

  const roleIcons = {
    [BusinessRole.SUPER_ADMIN]: (
      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
    [BusinessRole.TECH_ADVISOR]: (
      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
        <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
      </svg>
    ),
  };

  return (
    <Badge variant={roleColors[role]} size={size}>
      {showIcon && roleIcons[role]}
      {ROLE_DISPLAY_NAMES[role]}
    </Badge>
  );
};

// utils/formatters.ts
export const formatters = {
  currency: (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  },

  percentage: (value: number): string => {
    return `${value}%`;
  },

  date: (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  },

  datetime: (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  },

  phone: (phone: string): string => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  },

  truncate: (text: string, length: number = 50): string => {
    if (text.length <= length) return text;
    return text.slice(0, length) + '...';
  },

  capitalize: (text: string): string => {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  },

  camelToTitle: (text: string): string => {
    return text
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  },
};

export default {
  Table,
  SearchBox,
  Modal,
  Badge,
  Alert,
  RoleDisplayWidget,
  formatters,
};