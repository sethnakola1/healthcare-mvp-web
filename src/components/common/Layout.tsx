import React, { useState, useCallback } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logout } from '../../store/authSlice';
import { BusinessRole } from '../../types/user.types';

import toast from 'react-hot-toast';
import {
  HomeIcon,
  UserGroupIcon,
  CalendarIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  UserCircleIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';

const Layout: React.FC = () => {
  console.log("🏗️ 27. Layout component rendering...");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  console.log("👤 28. Layout - current user:", user);
  console.log("🧭 29. Layout - generating navigation for role:", user?.role);

  const handleLogout = useCallback(() => {
    try {
      dispatch(logout());
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Logout failed');
    }
  }, [dispatch, navigate]);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  const toggleProfileDropdown = useCallback(() => {
    setProfileDropdownOpen(prev => !prev);
  }, []);

  const closeProfileDropdown = useCallback(() => {
    setProfileDropdownOpen(false);
  }, []);

  // Define navigation items based on user role
  const getNavigationItems = useCallback(() => {

 console.log("📋 30. Generating navigation items for role:", user?.role);
    const baseItems = [
      { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    ];

    if (!user?.role) return baseItems;

    switch (user.role) {
      case BusinessRole.SUPER_ADMIN:
        return [
          ...baseItems,
          { name: 'Users', href: '/admin/users', icon: UserGroupIcon },
          { name: 'Hospitals', href: '/admin/hospitals', icon: BuildingOfficeIcon },
          { name: 'Tech Advisors', href: '/admin/advisors', icon: UserGroupIcon },
          { name: 'Reports', href: '/admin/reports', icon: ChartBarIcon },
          { name: 'Settings', href: '/admin/settings', icon: Cog6ToothIcon },
        ];

      case BusinessRole.TECH_ADVISOR:
        return [
          ...baseItems,
          { name: 'My Hospitals', href: '/advisor/hospitals', icon: BuildingOfficeIcon },
          { name: 'Commissions', href: '/advisor/commissions', icon: CurrencyDollarIcon },
          { name: 'Performance', href: '/advisor/performance', icon: ChartBarIcon },
          { name: 'Profile', href: '/advisor/profile', icon: UserCircleIcon },
        ];

      case BusinessRole.HOSPITAL_ADMIN:
        return [
          ...baseItems,
          { name: 'Patients', href: '/patients', icon: UserGroupIcon },
          { name: 'Appointments', href: '/appointments', icon: CalendarIcon },
          { name: 'Doctors', href: '/doctors', icon: UserGroupIcon },
          { name: 'Billing', href: '/billing', icon: CurrencyDollarIcon },
          { name: 'Reports', href: '/reports', icon: ChartBarIcon },
          { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
        ];

      case BusinessRole.DOCTOR:
        return [
          ...baseItems,
          { name: 'My Appointments', href: '/appointments', icon: CalendarIcon },
          { name: 'Patients', href: '/patients', icon: UserGroupIcon },
          { name: 'Prescriptions', href: '/prescriptions', icon: DocumentTextIcon },
          { name: 'Medical Records', href: '/medical-records', icon: ClipboardDocumentListIcon },
          { name: 'Schedule', href: '/schedule', icon: CalendarIcon },
        ];

      case BusinessRole.NURSE:
        return [
          ...baseItems,
          { name: 'Patients', href: '/patients', icon: UserGroupIcon },
          { name: 'Appointments', href: '/appointments', icon: CalendarIcon },
          { name: 'Medical Records', href: '/medical-records', icon: ClipboardDocumentListIcon },
          { name: 'Tasks', href: '/tasks', icon: ClipboardDocumentListIcon },
        ];

      case BusinessRole.RECEPTIONIST:
        return [
          ...baseItems,
          { name: 'Appointments', href: '/appointments', icon: CalendarIcon },
          { name: 'Patients', href: '/patients', icon: UserGroupIcon },
          { name: 'Check-In', href: '/check-in', icon: ClipboardDocumentListIcon },
          { name: 'Billing', href: '/billing', icon: CurrencyDollarIcon },
        ];

      case BusinessRole.PATIENT:
        return [
          ...baseItems,
          { name: 'My Appointments', href: '/my-appointments', icon: CalendarIcon },
          { name: 'Medical Records', href: '/my-records', icon: DocumentTextIcon },
          { name: 'Prescriptions', href: '/my-prescriptions', icon: DocumentTextIcon },
          { name: 'Bills', href: '/my-bills', icon: CurrencyDollarIcon },
          { name: 'Profile', href: '/profile', icon: UserCircleIcon },
        ];

      default:
        return baseItems;
    }
  }, [user?.role]);

  const navigationItems = getNavigationItems();
    console.log("📋 30.1. Navigation items:", navigationItems);
  const isActiveRoute = useCallback((href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  }, [location.pathname]);

  if (!user) {
    return null; // or redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-[#219ebc] to-[#7ADAA5] rounded-lg"></div>
            <span className="ml-2 text-xl font-bold text-gray-900">HealthHorizon</span>
          </div>
          <button
            onClick={closeSidebar}
            className="text-gray-500 hover:text-gray-700"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <nav className="mt-5 px-2">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              onClick={closeSidebar}
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md mb-1 ${
                isActiveRoute(item.href)
                  ? 'bg-gradient-to-r from-[#219ebc] to-[#7ADAA5] text-white'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className="mr-3 h-6 w-6" />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
            <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-[#219ebc] to-[#7ADAA5] rounded-lg"></div>
                <span className="ml-2 text-xl font-bold text-gray-900">HealthHorizon</span>
              </div>
            </div>
            <nav className="flex-1 mt-5 px-2 pb-4 space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActiveRoute(item.href)
                      ? 'bg-gradient-to-r from-[#219ebc] to-[#7ADAA5] text-white'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="mr-3 h-6 w-6" />
                  {item.name}
                </Link>
              ))}
            </nav>
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <button
                onClick={handleLogout}
                className="flex-shrink-0 w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              >
                <ArrowLeftOnRectangleIcon className="mr-3 h-6 w-6" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 lg:pl-64">
        {/* Top navigation bar */}
        <div className="sticky top-0 z-30 bg-white shadow">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <button
                  onClick={toggleSidebar}
                  className="px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#219ebc] lg:hidden"
                >
                  <Bars3Icon className="h-6 w-6" />
                </button>
                <h1 className="ml-2 text-xl font-semibold text-gray-900">
                  {user?.role?.replace(/_/g, ' ')} Portal
                </h1>
              </div>

              <div className="flex items-center space-x-4">
                {/* Notifications */}
                <button className="relative p-2 text-gray-400 hover:text-gray-500">
                  <BellIcon className="h-6 w-6" />
                  <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-400"></span>
                </button>

                {/* Profile dropdown */}
                <div className="relative">
                  <button
                    onClick={toggleProfileDropdown}
                    className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#219ebc]"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-gray-700">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-xs text-gray-500">{user?.roleDisplayName}</p>
                      </div>
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#219ebc] to-[#7ADAA5] flex items-center justify-center text-white font-semibold">
                        {user?.firstName?.charAt(0)}
                      </div>
                    </div>
                  </button>

                  {profileDropdownOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                      <div className="py-1">
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={closeProfileDropdown}
                        >
                          Your Profile
                        </Link>
                        <Link
                          to="/settings"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={closeProfileDropdown}
                        >
                          Settings
                        </Link>
                        <hr className="my-1" />
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;