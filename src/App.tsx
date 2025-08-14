// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { useAuth } from './hooks/useAuth';

// Components
import LoginForm from './components/auth/LoginForm';
import SuperAdminDashboard from './components/dashboard/SuperAdminDashboard';
import ProtectedRoute from './components/common/ProtectedRoute';
import { UserRole } from './types';

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Something went wrong
              </h2>
              <p className="text-gray-600 mb-4">
                An unexpected error occurred. Please refresh the page.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Unauthorized Page Component
const UnauthorizedPage: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Access Denied
        </h2>
        <p className="text-gray-600 mb-4">
          You don't have permission to access this page.
        </p>
        <button
          onClick={() => window.history.back()}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    </div>
  </div>
);

// Not Found Page Component
const NotFoundPage: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Page Not Found
        </h2>
        <p className="text-gray-600 mb-4">
          The page you're looking for doesn't exist.
        </p>
        <a
          href="/dashboard"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 inline-block"
        >
          Go to Dashboard
        </a>
      </div>
    </div>
  </div>
);

// App Routes Component
const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginForm />
        }
      />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute requiredRole={[UserRole.SUPER_ADMIN, UserRole.TECH_ADVISOR]}>
            <SuperAdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Utility Routes */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/404" element={<NotFoundPage />} />

      {/* Default redirects */}
      <Route
        path="/"
        element={
          <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
        }
      />

      {/* Catch all route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

// Main App Component
const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <Router>
          <div className="App">
            <AppRoutes />
          </div>
        </Router>
      </Provider>
    </ErrorBoundary>
  );
};

export default App;