import React, { useState, useEffect } from 'react';
import {
  Shield,
  Building,
  Users,
  UserPlus,
  Activity,
  Heart,
  FileText,
  DollarSign,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  Home,
  ChevronDown,
  Stethoscope
} from 'lucide-react';

// Mock types for demo
enum BusinessRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  TECH_ADVISOR = 'TECH_ADVISOR'
}

enum HospitalUserRole {
  HOSPITAL_ADMIN = 'HOSPITAL_ADMIN',
  DOCTOR = 'DOCTOR',
  NURSE = 'NURSE',
  RECEPTIONIST = 'RECEPTIONIST',
  LAB_ADMIN = 'LAB_ADMIN',
  LAB_STAFF = 'LAB_STAFF',
  PHARMACY_ADMIN = 'PHARMACY_ADMIN',
  PHARMACY_STAFF = 'PHARMACY_STAFF',
  BILLING_STAFF = 'BILLING_STAFF',
  TECHNICIAN = 'TECHNICIAN'
}

interface User {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: BusinessRole | HospitalUserRole;
  isAuthenticated: boolean;
  hospitalId?: string;
  hospitalName?: string;
}

interface NavigationItem {
  name: string;
  icon: React.ReactNode;
  path: string;
  badge?: number;
  children?: NavigationItem[];
}

const HealthHorizonApp = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Mock current user - in real app this would come from auth state
  const [currentUser] = useState<User>({
    userId: '1',
    email: 'sethnakola@healthhorizon.com',
    firstName: 'Sethna',
    lastName: 'Kola',
    role: BusinessRole.SUPER_ADMIN,
    isAuthenticated: true
  });

  // Navigation items based on user role
  const getNavigationItems = (): NavigationItem[] => {
    const baseItems: NavigationItem[] = [
      {
        name: 'Dashboard',
        icon: <Home className="w-5 h-5" />,
        path: 'dashboard'
      }
    ];

    if (currentUser.role === BusinessRole.SUPER_ADMIN) {
      return [
        ...baseItems,
        {
          name: 'User Management',
          icon: <Users className="w-5 h-5" />,
          path: 'users',
          children: [
            { name: 'All Users', icon: <Users className="w-4 h-4" />, path: 'users/list' },
            { name: 'Create Super Admin', icon: <Shield className="w-4 h-4" />, path: 'users/create-super-admin' },
            { name: 'Create Tech Advisor', icon: <UserPlus className="w-4 h-4" />, path: 'users/create-tech-advisor' }
          ]
        },
        {
          name: 'Hospital Management',
          icon: <Building className="w-5 h-5" />,
          path: 'hospitals',
          children: [
            { name: 'All Hospitals', icon: <Building className="w-4 h-4" />, path: 'hospitals/list' },
            { name: 'Create Hospital', icon: <Building className="w-4 h-4" />, path: 'hospitals/create' }
          ]
        },
        {
          name: 'Analytics',
          icon: <Activity className="w-5 h-5" />,
          path: 'analytics'
        },
        {
          name: 'System Settings',
          icon: <Settings className="w-5 h-5" />,
          path: 'settings'
        }
      ];
    }

    if (currentUser.role === BusinessRole.TECH_ADVISOR) {
      return [
        ...baseItems,
        {
          name: 'My Hospitals',
          icon: <Building className="w-5 h-5" />,
          path: 'my-hospitals',
          badge: 12
        },
        {
          name: 'Create Hospital',
          icon: <Building className="w-5 h-5" />,
          path: 'hospitals/create'
        },
        {
          name: 'Commission Tracking',
          icon: <DollarSign className="w-5 h-5" />,
          path: 'commissions'
        }
      ];
    }

    if (currentUser.role === HospitalUserRole.HOSPITAL_ADMIN) {
      return [
        ...baseItems,
        {
          name: 'Staff Management',
          icon: <Users className="w-5 h-5" />,
          path: 'staff',
          children: [
            { name: 'All Staff', icon: <Users className="w-4 h-4" />, path: 'staff/list' },
            { name: 'Add Doctor', icon: <Stethoscope className="w-4 h-4" />, path: 'staff/create-doctor' },
            { name: 'Add Nurse', icon: <Activity className="w-4 h-4" />, path: 'staff/create-nurse' },
            { name: 'Add Receptionist', icon: <Users className="w-4 h-4" />, path: 'staff/create-receptionist' }
          ]
        },
        {
          name: 'Patient Management',
          icon: <Heart className="w-5 h-5" />,
          path: 'patients',
          children: [
            { name: 'All Patients', icon: <Heart className="w-4 h-4" />, path: 'patients/list' },
            { name: 'Register Patient', icon: <UserPlus className="w-4 h-4" />, path: 'patients/create' }
          ]
        },
        {
          name: 'Appointments',
          icon: <FileText className="w-5 h-5" />,
          path: 'appointments',
          badge: 23
        },
        {
          name: 'Billing',
          icon: <DollarSign className="w-5 h-5" />,
          path: 'billing'
        }
      ];
    }

    return baseItems;
  };

  const navigationItems = getNavigationItems();

  const handleNavigation = (path: string) => {
    setCurrentView(path);
  };

  const handleLogout = () => {
    // In real app, this would clear auth state and redirect to login
    console.log('Logging out...');
  };

  const renderMainContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView user={currentUser} />;
      case 'users/list':
        return <UsersListView />;
      case 'users/create-super-admin':
        return <CreateUserView role={BusinessRole.SUPER_ADMIN} />;
      case 'users/create-tech-advisor':
        return <CreateUserView role={BusinessRole.TECH_ADVISOR} />;
      case 'hospitals/list':
        return <HospitalsListView />;
      case 'hospitals/create':
        return <CreateHospitalView />;
      case 'patients/list':
        return <PatientsListView />;
      case 'patients/create':
        return <CreatePatientView />;
      case 'staff/list':
        return <StaffListView />;
      case 'staff/create-doctor':
        return <CreateStaffView role={HospitalUserRole.DOCTOR} />;
      case 'analytics':
        return <AnalyticsView />;
      default:
        return <DashboardView user={currentUser} />;
    }
  };

  const NavItem = ({ item, depth = 0 }: { item: NavigationItem; depth?: number }) => {
    const [isOpen, setIsOpen] = useState(false);
    const hasChildren = item.children && item.children.length > 0;
    const isActive = currentView === item.path || (hasChildren && item.children?.some(child => child.path === currentView));

    return (
      <div>
        <button
          onClick={() => {
            if (hasChildren) {
              setIsOpen(!isOpen);
            } else {
              handleNavigation(item.path);
            }
          }}
          className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
            isActive
              ? 'bg-blue-600 text-white'
              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
          } ${depth > 0 ? 'ml-4' : ''}`}
        >
          <div className="flex items-center gap-3">
            {item.icon}
            <span>{item.name}</span>
            {item.badge && (
              <span className="ml-auto bg-blue-100 text-blue-600 text-xs font-medium px-2 py-1 rounded-full">
                {item.badge}
              </span>
            )}
          </div>
          {hasChildren && (
            <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          )}
        </button>

        {hasChildren && isOpen && (
          <div className="mt-1 space-y-1">
            {item.children?.map((child, index) => (
              <NavItem key={index} item={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:static lg:inset-0`}>

        {/* Logo */}
        <div className="flex items-center justify-center h-16 px-4 bg-blue-600">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-xl font-bold text-white">HealthHorizon</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-8 px-4 pb-4 overflow-y-auto">
          <div className="space-y-2">
            {navigationItems.map((item, index) => (
              <NavItem key={index} item={item} />
            ))}
          </div>
        </nav>

        {/* User Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {currentUser.firstName[0]}{currentUser.lastName[0]}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {currentUser.firstName} {currentUser.lastName}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {currentUser.role.replace('_', ' ')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col overflow-hidden ${sidebarOpen ? 'lg:ml-64' : ''}`}>
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
              >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              {/* Search */}
              <div className="hidden md:block">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button className="relative p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-3 p-2 text-sm rounded-lg hover:bg-gray-100"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {currentUser.firstName[0]}{currentUser.lastName[0]}
                    </span>
                  </div>
                  <span className="hidden md:block font-medium text-gray-900">
                    {currentUser.firstName} {currentUser.lastName}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      <a href="#" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <Settings className="w-4 h-4" />
                        Profile Settings
                      </a>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          {renderMainContent()}
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

// Mock view components
const DashboardView = ({ user }: { user: User }) => (
  <div className="p-6">
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-900">
        Welcome back, {user.firstName}!
      </h1>
      <p className="text-gray-600">
        {user.role === BusinessRole.SUPER_ADMIN && "Manage your entire healthcare network from here."}
        {user.role === BusinessRole.TECH_ADVISOR && "Track your hospital partnerships and commission earnings."}
        {user.role === HospitalUserRole.HOSPITAL_ADMIN && `Manage ${user.hospitalName || 'your hospital'} operations.`}
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Users</p>
            <p className="text-2xl font-bold text-gray-900">1,247</p>
          </div>
          <Users className="w-8 h-8 text-blue-600" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Hospitals</p>
            <p className="text-2xl font-bold text-gray-900">89</p>
          </div>
          <Building className="w-8 h-8 text-green-600" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Patients</p>
            <p className="text-2xl font-bold text-gray-900">15,643</p>
          </div>
          <Heart className="w-8 h-8 text-purple-600" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Revenue</p>
            <p className="text-2xl font-bold text-gray-900">$2.4M</p>
          </div>
          <DollarSign className="w-8 h-8 text-yellow-600" />
        </div>
      </div>
    </div>
  </div>
);

const UsersListView = () => (
  <div className="p-6">
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
      <p className="text-gray-600">Manage all business users in the system</p>
    </div>
    <div className="bg-white rounded-lg shadow-sm p-6">
      <p className="text-gray-500">Business Users List Component would render here</p>
    </div>
  </div>
);

const CreateUserView = ({ role }: { role: BusinessRole }) => (
  <div className="p-6">
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-900">
        Create {role.replace('_', ' ')}
      </h1>
      <p className="text-gray-600">Add a new {role.toLowerCase().replace('_', ' ')} to the system</p>
    </div>
    <div className="bg-white rounded-lg shadow-sm p-6">
      <p className="text-gray-500">Business User Registration Form would render here</p>
    </div>
  </div>
);

const HospitalsListView = () => (
  <div className="p-6">
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-900">Hospital Management</h1>
      <p className="text-gray-600">Manage all hospitals in the network</p>
    </div>
    <div className="bg-white rounded-lg shadow-sm p-6">
      <p className="text-gray-500">Hospitals List Component would render here</p>
    </div>
  </div>
);

const CreateHospitalView = () => (
  <div className="p-6">
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-900">Create Hospital</h1>
      <p className="text-gray-600">Register a new hospital in the network</p>
    </div>
    <div className="bg-white rounded-lg shadow-sm p-6">
      <p className="text-gray-500">Hospital Registration Form would render here</p>
    </div>
  </div>
);

const PatientsListView = () => (
  <div className="p-6">
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-900">Patient Management</h1>
      <p className="text-gray-600">Manage all patients in your hospital</p>
    </div>
    <div className="bg-white rounded-lg shadow-sm p-6">
      <p className="text-gray-500">Patients List Component would render here</p>
    </div>
  </div>
);

const CreatePatientView = () => (
  <div className="p-6">
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-900">Register Patient</h1>
      <p className="text-gray-600">Add a new patient to the hospital</p>
    </div>
    <div className="bg-white rounded-lg shadow-sm p-6">
      <p className="text-gray-500">Patient Registration Form would render here</p>
    </div>
  </div>
);

const StaffListView = () => (
  <div className="p-6">
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
      <p className="text-gray-600">Manage all hospital staff members</p>
    </div>
    <div className="bg-white rounded-lg shadow-sm p-6">
      <p className="text-gray-500">Hospital Staff List Component would render here</p>
    </div>
  </div>
);

const CreateStaffView = ({ role }: { role: HospitalUserRole }) => (
  <div className="p-6">
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-900">
        Add {role.replace('_', ' ')}
      </h1>
      <p className="text-gray-600">Create a new {role.toLowerCase().replace('_', ' ')} account</p>
    </div>
    <div className="bg-white rounded-lg shadow-sm p-6">
      <p className="text-gray-500">Hospital User Registration Form would render here</p>
    </div>
  </div>
);

const AnalyticsView = () => (
  <div className="p-6">
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-900">System Analytics</h1>
      <p className="text-gray-600">Comprehensive system performance and usage analytics</p>
    </div>
    <div className="bg-white rounded-lg shadow-sm p-6">
      <p className="text-gray-500">Analytics Dashboard would render here</p>
    </div>
  </div>
);

export default HealthHorizonApp;