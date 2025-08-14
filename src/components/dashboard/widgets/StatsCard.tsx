import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  color?: string;
  icon?: React.ElementType;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, change, color = 'blue', icon: Icon }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    purple: 'bg-purple-100 text-purple-800',
    red: 'bg-red-100 text-red-800'
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {change && (
            <p className={`text-sm mt-2 ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
              {change} from last period
            </p>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
            <Icon className="h-6 w-6" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;