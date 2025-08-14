// src/components/LoadingSpinner.tsx
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <h2 className="text-xl font-semibold text-gray-900 mt-4">HealthHorizon</h2>
        <p className="text-gray-600 mt-2">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;