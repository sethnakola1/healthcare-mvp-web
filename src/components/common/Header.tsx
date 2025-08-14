import React from 'react';
import { Menu, Bell, User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useAppDispatch } from '../../store/hooks';
import { toggleSidebar } from '../../store/slices/uiSlice';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const dispatch = useAppDispatch();
  const [showDropdown, setShowDropdown] = React.useState(false);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Menu className="h-6 w-6 text-gray-600" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">HealthHorizon</h1>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <Bell className="h-6 w-6 text-gray-600" />
          </button>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-500">{user?.roleDisplayName}</p>
                </div>
              </div>
            </button>

            {/* Dropdown menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                    <p className="font-medium">{user?.fullName}</p>
                    <p className="text-gray-500">{user?.email}</p>
                  </div>
                  <button
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowDropdown(false)}
                  >
                    <Settings className="h-4 w-4 mr-3" />
                    Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;