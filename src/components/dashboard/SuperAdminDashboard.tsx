// src/components/dashboard/SuperAdminDashboard.tsx
import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import {
  Users,
  Building,
  Activity,
  TrendingUp,
  Plus,
  BarChart3,
  Shield,
  Database
} from 'lucide-react';
import Layout from '../common/Layout';

const SuperAdminDashboard: React.FC = () => {
  const { user } = useAuth();

  const stats = [
    {
      name: 'Total Business Users',
      value: '12',
      change: '+2.5%',
      changeType: 'positive',
      icon: Users,
    },
    {
      name: 'Active Hospitals',
      value: '48',
      change: '+12.5%',
      changeType: 'positive',
      icon: Building,
    },
    {
      name: 'System Uptime',
      value: '99.9%',
      change: '+0.1%',
      changeType: 'positive',
      icon: Activity,
    },
    {
      name: 'Monthly Active Users',
      value: '2,543',
      change: '+8.2%',
      changeType: 'positive',
      icon: TrendingUp,
    },
  ];

  const quickActions = [
    {
      name: 'Create Tech Advisor',
      description: 'Add a new tech advisor to manage hospitals',
      icon: Users,
      href: '/admin/users/create',
      color: 'bg-blue-500',
    },
    {
      name: 'System Monitor',
      description: 'View system health and performance metrics',
      icon: BarChart3,
      href: '/system/monitor',
      color: 'bg-green-500',
    },
    {
      name: 'Security Audit',
      description: 'Review security logs and access controls',
      icon: Shield,
      href: '/admin/security',
      color: 'bg-purple-500',
    },
    {
      name: 'Database Status',
      description: 'Monitor database performance and backups',
      icon: Database,
      href: '/admin/database',
      color: 'bg-orange-500',
    },
  ];

  const recentActivities = [
    {
      id: 1,
      user: 'Tech Advisor John',
      action: 'Created new hospital "City Medical Center"',
      time: '2 hours ago',
    },
    {
      id: 2,
      user: 'Hospital Admin Sarah',
      action: 'Added 5 new doctors to staff',
      time: '4 hours ago',
    },
    {
      id: 3,
      user: 'System',
      action: 'Database backup completed successfully',
      time: '6 hours ago',
    },
    {
      id: 4,
      user: 'Tech Advisor Mike',
      action: 'Updated hospital configuration',
      time: '8 hours ago',
    },
  ];

  return (
    <Layout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {user?.firstName}!
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Super Admin Dashboard - Healthcare System Overview
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {stats.map((item) => (
              <div
                key={item.name}
                className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden"
              >
                <dt>
                  <div className="absolute bg-blue-500 rounded-md p-3">
                    <item.icon className="h-6 w-6 text-white" />
                  </div>
                  <p className="ml-16 text-sm font-medium text-gray-500 truncate">
                    {item.name}
                  </p>
                </dt>
                <dd className="ml-16 pb-6 flex items-baseline sm:pb-7">
                  <p className="text-2xl font-semibold text-gray-900">{item.value}</p>
                  <p className={`ml-2 flex items-baseline text-sm font-semibold ${
                    item.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {item.change}
                  </p>
                </dd>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Actions */}
            <div className="lg:col-span-1">
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Quick Actions
                  </h3>
                  <div className="space-y-4">
                    {quickActions.map((action) => (
                      <div
                        key={action.name}
                        className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                      >
                        <div className={`flex-shrink-0 ${action.color} rounded-md p-2`}>
                          <action.icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            {action.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {action.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="lg:col-span-2">
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Recent Activities
                  </h3>
                  <div className="flow-root">
                    <ul className="-mb-8">
                      {recentActivities.map((activity, activityIdx) => (
                        <li key={activity.id}>
                          <div className="relative pb-8">
                            {activityIdx !== recentActivities.length - 1 ? (
                              <span
                                className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200"
                                aria-hidden="true"
                              />
                            ) : null}
                            <div className="relative flex items-start space-x-3">
                              <div className="relative">
                                <div className="h-10 w-10 bg-gray-400 rounded-full flex items-center justify-center">
                                  <Activity className="h-5 w-5 text-white" />
                                </div>
                              </div>
                              <div className="min-w-0 flex-1">
                                <div>
                                  <div className="text-sm">
                                    <span className="font-medium text-gray-900">
                                      {activity.user}
                                    </span>
                                  </div>
                                  <p className="mt-0.5 text-sm text-gray-500">
                                    {activity.action}
                                  </p>
                                </div>
                                <div className="mt-2 text-sm text-gray-700">
                                  <time>{activity.time}</time>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SuperAdminDashboard;