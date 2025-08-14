import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { LoginForm, ProtectedRoute, UnauthorizedPage } from './components/auth';
import { DashboardRouter } from './components/dashboard';
import { AppLayout } from './components/layout';
import { useAuth } from './hooks/useAuth';
import { LoadingSpinner } from './components/common';

// Main App Content Component
const AppContent: React.FC = () => {
  const { isAuthenticated, checkTokenValidity, isLoading } = useAuth();

  useEffect(() => {
    // Check token validity on app load
    if (isAuthenticated) {
      checkTokenValidity();
    }
  }, [isAuthenticated, checkTokenValidity]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Protected Routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <Navigate to="/dashboard" replace />
          </ProtectedRoute>
        } />

        <Route path="/dashboard" element={
          <ProtectedRoute>
            <AppLayout>
              <DashboardRouter />
            </AppLayout>
          </ProtectedRoute>
        } />

        {/* Business User Management Routes (Super Admin Only) */}
        <Route path="/admin/*" element={
          <ProtectedRoute requiredRole="SUPER_ADMIN">
            <AppLayout>
              <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Admin Management</h1>
                <p>Business user management coming soon...</p>
              </div>
            </AppLayout>
          </ProtectedRoute>
        } />

        {/* Hospital Management Routes (Super Admin & Tech Advisor) */}
        <Route path="/hospitals/*" element={
          <ProtectedRoute requiredRoles={['SUPER_ADMIN', 'TECH_ADVISOR']}>
            <AppLayout>
              <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Hospital Management</h1>
                <p>Hospital management coming soon...</p>
              </div>
            </AppLayout>
          </ProtectedRoute>
        } />

        {/* User Management Routes (Hospital Admin) */}
        <Route path="/users/*" element={
          <ProtectedRoute requiredRole="HOSPITAL_ADMIN">
            <AppLayout>
              <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">User Management</h1>
                <p>Hospital user management coming soon...</p>
              </div>
            </AppLayout>
          </ProtectedRoute>
        } />

        {/* Patient Management Routes */}
        <Route path="/patients/*" element={
          <ProtectedRoute requiredRoles={['HOSPITAL_ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST']}>
            <AppLayout>
              <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Patient Management</h1>
                <p>Patient management coming soon...</p>
              </div>
            </AppLayout>
          </ProtectedRoute>
        } />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
};

// Main App Component
const App: React.FC = () => {
  return (
    <Provider store={store}>
      <div className="App">
        <AppContent />
      </div>
    </Provider>
  );
};

export default App;