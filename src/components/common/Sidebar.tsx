import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Building2,
  UserPlus,
  Calendar,
  FileText,
  Settings,
  Stethoscope,
  Pill
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface SidebarProps {
  isOpen: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const location = useLocation();
  const { user, hasRole, hasAnyRole } = useAuth();

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      roles: ['SUPER_ADMIN', 'TECH_ADVISOR', 'HOSPITAL_ADMIN', 'DOCTOR', 'NURSE', 'PATIENT'],
    },
    {
      name: 'Admin Management',
      href: '/admin',
      icon: Users,
      roles: ['SUPER_ADMIN'],
    },
    {
      name: 'Hospital Management',
      href: '/hospitals',
      icon: Building2,
      roles: ['SUPER_ADMIN', 'TECH_ADVISOR'],
    },
    {
      name: 'User Management',
      href: '/users',
      icon: UserPlus,
      roles: ['HOSPITAL_ADMIN'],
    },
    {
      name: 'Patient Management',
      href: '/patients',
      icon: Users,
      roles: ['HOSPITAL_ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST'],
    },
    {
      name: 'Appointments',
      href: '/appointments',
      icon: Calendar,
      roles: ['HOSPITAL_ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST', 'PATIENT'],
    },
    {
      name: 'Medical Records',
      href: '/medical-records',
      icon: FileText,
      roles: ['DOCTOR', 'NURSE'],
    },
    {
      name: 'Prescriptions',
      href: '/prescriptions',
      icon: Pill,
      roles: ['DOCTOR', 'PATIENT'],
    },
  ];

  const bottomNavigationItems = [
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
      roles: ['SUPER_ADMIN', 'TECH_ADVISOR', 'HOSPITAL_ADMIN', 'DOCTOR', 'NURSE', 'PATIENT'],
    },
  ];

  const canAccessItem = (roles: string[]) => {
    return user?.role ? roles.includes(user.role) : false;
  };

  const isActiveLink = (href: string) => {
    return location.pathname.startsWith(href);
  };

  const NavItem: React.FC<{ item: any; isBottom?: boolean }> = ({ item, isBottom = false }) => {
    if (!canAccessItem(item.roles)) return null;

    return (
      <Link
        to={item.href}
        className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors duration-200 ${
          isActiveLink(item.href)
            ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        }`}
        title={!isOpen ? item.name : ''}
      >
        <item.icon className={`h-5 w-5 ${isOpen ? 'mr-3' : 'mx-auto'}`} />
        {isOpen && <span>{item.name}</span>}
      </Link>
    );
  };

  return (
    <div className={`fixed left-0 top-16 bottom-0 bg-white shadow-sm border-r border-gray-200 transition-all duration-300 z-40 ${
      isOpen ? 'w-64' : 'w-16'
    }`}>
      <div className="flex flex-col h-full">
        {/* Navigation items */}
        <nav className="flex-1 px-2 py-4 space-y-2">
          {navigationItems.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}
        </nav>

        {/* Bottom navigation */}
        <div className="px-2 py-4 border-t border-gray-200">
          {bottomNavigationItems.map((item) => (
            <NavItem key={item.name} item={item} isBottom />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;