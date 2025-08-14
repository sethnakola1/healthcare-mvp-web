// src/components/dashboard/SuperAdminDashboard.tsx
import React, { useState, useEffect } from 'react';
import { Users, Building2, TrendingUp, Settings, Plus, Eye } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface DashboardStats {
  totalBusinessUsers: number;
  totalTechAdvisors: number;
  totalHospitals: number;
  monthlyRevenue: number;
}

export const SuperAdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalBusinessUsers: 0,
    totalTechAdvisors: 0,
    totalHospitals: 0,
    monthlyRevenue: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch dashboard statistics from API
    const fetchStats = async () => {
      try {
        // Simulate API call
        setTimeout(() => {
          setStats({
            totalBusinessUsers: 12,
            totalTechAdvisors: 8,
            totalHospitals: 45,
            monthlyRevenue: 125000,
          });
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Business Users',
      value: stats.totalBusinessUsers,
      icon: Users,
      color: 'bg-blue-500',
      change: '+2 this month',
    },
    {
      title: 'Tech Advisors',
      value: stats.totalTechAdvisors,
      icon: Users,
      color: 'bg-green-500',
      change: '+1 this month',
    },
    {
      title: 'Hospitals',
      value: stats.totalHospitals,
      icon: Building2,
      color: 'bg-purple-500',
      change: '+5 this month',
    },
    {
      title: 'Monthly Revenue',
      value: `$${stats.monthlyRevenue.toLocaleString()}`,
      icon: TrendingUp,
      color: 'bg-yellow-500',
      change: '+12% vs last month',
    },
  ];

  const quickActions = [
    {
      title: 'Create Tech Advisor',
      description: 'Add a new tech advisor to the system',
      icon: Plus,
      color: 'bg-blue-600',
      action: () => {
        // TODO: Navigate to create tech advisor form
        console.log('Navigate to create tech advisor');
      },
    },
    {
      title: 'View All Users',
      description: 'Manage all business users',
      icon: Eye,
      color: 'bg-green-600',
      action: () => {
        // TODO: Navigate to users list
        console.log('Navigate to users list');
      },
    },
    {
      title: 'System Settings',
      description: 'Configure system settings',
      icon: Settings,
      color: 'bg-gray-600',
      action: () => {
        // TODO: Navigate to settings
        console.log('Navigate to settings');
      },
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">
                Welcome back, {user?.firstName} {user?.lastName}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Super Admin
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {statCards.map((stat, index) => (
              <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className={`${stat.color} p-3 rounded-md`}>
                        <stat.icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          {stat.title}
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {isLoading ? '...' : stat.value}
                        </dd>
                      </dl>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="text-sm text-gray-600">{stat.change}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.action}
                    className="relative bg-white p-6 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center">
                      <div className={`${action.color} p-3 rounded-md`}>
                        <action.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4 text-left">
                        <h4 className="text-sm font-medium text-gray-900">
                          {action.title}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-8 bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">
                Recent Activity
              </h3>
              <div className="space-y-4">
                {[
                  { action: 'New Tech Advisor created', user: 'John Smith', time: '2 hours ago' },
                  { action: 'Hospital registered', user: 'City General Hospital', time: '4 hours ago' },
                  { action: 'System backup completed', user: 'System', time: '6 hours ago' },
                  { action: 'User permissions updated', user: 'Jane Doe', time: '1 day ago' },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-500">{activity.user}</p>
                    </div>
                    <span className="text-sm text-gray-400">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};