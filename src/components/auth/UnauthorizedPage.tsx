// src/components/auth/UnauthorizedPage.tsx
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const UnauthorizedPage: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-red-100 mb-4">
          <AlertCircle className="h-6 w-6 text-red-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-gray-600 mb-6">
          You don't have permission to access this page.
        </p>
        <div className="text-sm text-gray-500 mb-6">
          Current role: <span className="font-medium">{user?.role || 'Unknown'}</span>
        </div>
        <div className="space-y-3">
          <button
            onClick={() => window.history.back()}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
          >
            Go Back
          </button>
          <button
            onClick={logout}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};