import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store';
import { useAppDispatch } from '../../store/hooks';
import { logout } from '../../store/authSlice';

const AdminDashboard: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

const handleLogout = () => {
  try {
    dispatch(logout()); // No await or unwrap needed
    navigate('/login');
  } catch (error) {
    console.error('Logout error:', error);
  }
};

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-white">HealthHorizon - Super Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-blue-100">Welcome, {user?.firstName}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Hospitals</dt>
                  <dd className="text-lg font-medium text-gray-900">12</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;