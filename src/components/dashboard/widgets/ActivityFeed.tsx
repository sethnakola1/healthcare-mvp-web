import React from 'react';

interface Activity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  icon?: React.ElementType;
}

interface ActivityFeedProps {
  activities?: Activity[];
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities = [] }) => {
  const defaultActivities = [
    { id: '1', type: 'appointment', description: 'New appointment booked', timestamp: '2 hours ago' },
    { id: '2', type: 'patient', description: 'Patient record updated', timestamp: '4 hours ago' },
    { id: '3', type: 'system', description: 'System backup completed', timestamp: '1 day ago' }
  ];

  const items = activities.length > 0 ? activities : defaultActivities;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
      <div className="space-y-3">
        {items.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-[#219ebc] rounded-full mt-2"></div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">{activity.description}</p>
              <p className="text-xs text-gray-500">{activity.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;