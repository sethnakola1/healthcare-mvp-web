import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import store from '../../store/store';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { checkAuthStatus } from '../../store/authSlice';


// Components
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorBoundary from '../common/ErrorBoundary';
import PrivateRoute from '../common/PrivateRoute';
import Layout from '../common/Layout';
import SessionTimeout from '../auth/SessionTimeout';

// Auth Components
import Login from '../auth/Login';
import ForgotPassword from '../auth/ForgotPassword';
import ResetPassword from '../auth/ResetPassword';

// Dashboard Components
import SuperAdminDashboard from './SuperAdminDashboard';
import TechAdvisorDashboard from './TechAdvisorDashboard';
import HospitalAdminDashboard from './HospitalAdminDashboard';
import DoctorDashboard from './DoctorDashboard';
import { BusinessRole } from '../../types/user.types';

// Create a dashboard wrapper component that renders the correct dashboard based on user role
const DashboardWrapper: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  console.log("🎯 Rendering dashboard for role:", user.role);

  switch (user.role) {
    case BusinessRole.SUPER_ADMIN:
      return <SuperAdminDashboard />;
    case BusinessRole.TECH_ADVISOR:
      return <TechAdvisorDashboard />;
    case BusinessRole.HOSPITAL_ADMIN:
      return <HospitalAdminDashboard />;
    case BusinessRole.DOCTOR:
      return <DoctorDashboard />;
    case BusinessRole.NURSE:
      return <SuperAdminDashboard />; // Placeholder - create NurseDashboard component
    case BusinessRole.RECEPTIONIST:
      return <SuperAdminDashboard />; // Placeholder - create ReceptionistDashboard component
    case BusinessRole.PATIENT:
      return <SuperAdminDashboard />; // Placeholder - create PatientDashboard component
    default:
      console.warn("Unknown role:", user.role);
      return <SuperAdminDashboard />;
  }
};

const AppContent: React.FC = () => {
  console.log("📱 App component rendering...");

  const dispatch = useAppDispatch();
  const { isLoading, isAuthenticated, user } = useAppSelector((state) => state.auth);

  console.log("🔍 Auth state:", { isLoading, isAuthenticated, user });

  useEffect(() => {
    console.log("🚀 App mounted, checking auth status...");
    dispatch(checkAuthStatus());
  }, [dispatch]);

  if (isLoading) {
    console.log("⏳ Still loading auth state...");
    return <LoadingSpinner fullScreen message="Loading application..." />;
  }

  console.log("🎨 Rendering Router...");
  console.log("✅ Auth state loaded successfully!");

  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
          } />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Protected Routes */}
          <Route path="/" element={<PrivateRoute />}>
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardWrapper />} />

              {/* Role-specific routes can be added here */}
              {/* Super Admin Routes */}
              <Route path="admin/*" element={
                user?.role === BusinessRole.SUPER_ADMIN ?
                  <SuperAdminDashboard /> :
                  <Navigate to="/dashboard" replace />
              } />

              {/* Tech Advisor Routes */}
              <Route path="advisor/*" element={
                user?.role === BusinessRole.TECH_ADVISOR ?
                  <TechAdvisorDashboard /> :
                  <Navigate to="/dashboard" replace />
              } />

              {/* Hospital Admin Routes */}
              <Route path="hospital/*" element={
                user?.role === BusinessRole.HOSPITAL_ADMIN ?
                  <HospitalAdminDashboard /> :
                  <Navigate to="/dashboard" replace />
              } />

              {/* Doctor Routes */}
              <Route path="doctor/*" element={
                user?.role === BusinessRole.DOCTOR ?
                  <DoctorDashboard /> :
                  <Navigate to="/dashboard" replace />
              } />

              {/* Common routes accessible by multiple roles */}
              <Route path="patients" element={<div>Patients Page</div>} />
              <Route path="appointments" element={<div>Appointments Page</div>} />
              <Route path="settings" element={<div>Settings Page</div>} />
              <Route path="profile" element={<div>Profile Page</div>} />

              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Route>

          {/* Catch all for non-authenticated users */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>

        {/* Session timeout component */}
        {isAuthenticated && <SessionTimeout />}

        {/* Toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              style: {
                background: '#10b981',
              },
            },
            error: {
              style: {
                background: '#ef4444',
              },
            },
          }}
        />
      </Router>
    </ErrorBoundary>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;