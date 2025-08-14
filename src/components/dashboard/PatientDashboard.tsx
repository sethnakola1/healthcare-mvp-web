// src/components/dashboard/PatientDashboard.tsx
import React from 'react';
import { Calendar, FileText, Pill, Heart } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const PatientDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Patient Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back, {user?.firstName} {user?.lastName}
          </p>
        </div>
      </div>
    </div>
  );
};