// src/components/dashboard/DashboardRouter.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { SuperAdminDashboard } from './SuperAdminDashboard';
import { TechAdvisorDashboard } from './TechAdvisorDashboard';
import { HospitalAdminDashboard } from './HospitalAdminDashboard';
import { DoctorDashboard } from './DoctorDashboard';
import { NurseDashboard } from './NurseDashboard';
import { PatientDashboard } from './PatientDashboard';
import { LoadingSpinner } from '../common';

export const DashboardRouter: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Route to appropriate dashboard based on user role
  switch (user.role) {
    case 'SUPER_ADMIN':
      return <SuperAdminDashboard />;
    case 'TECH_ADVISOR':
      return <TechAdvisorDashboard />;
    case 'HOSPITAL_ADMIN':
      return <HospitalAdminDashboard />;
    case 'DOCTOR':
      return <DoctorDashboard />;
    case 'NURSE':
      return <NurseDashboard />;
    case 'PATIENT':
      return <PatientDashboard />;
    default:
      return <Navigate to="/unauthorized" replace />;
  }
};