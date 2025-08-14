// src/components/dashboard/TechAdvisorDashboard.tsx
import React from 'react';
import { Building2, Target, DollarSign, Users } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const TechAdvisorDashboard: React.FC = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: 'Hospitals Brought',
      value: user?.totalHospitalsBrought || 0,
      icon: Building2,
      color: 'bg-blue-500',
    },
    {
      title: 'Monthly Target',
      value: user?.targetHospitalsMonthly || 0,
      icon: Target,
      color: 'bg-green-500',
    },
    {
      title: 'Commission Earned',
      value: `$${(user?.totalCommissionEarned || 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-yellow-500',
    },
    {
      title: 'Commission Rate',
      value: `${user?.commissionPercentage || 0}%`,
      icon: Users,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Tech Advisor Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">
                Welcome back, {user?.firstName} {user?.lastName}
              </p>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Tech Advisor
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {stats.map((stat, index) => (
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
                          {stat.value}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <h4 className="font-medium text-gray-900">Register New Hospital</h4>
                <p className="text-sm text-gray-500">Add a new hospital to the system</p>
              </button>
              <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <h4 className="font-medium text-gray-900">View My Hospitals</h4>
                <p className="text-sm text-gray-500">Manage hospitals you've brought in</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechAdvisorDashboard;