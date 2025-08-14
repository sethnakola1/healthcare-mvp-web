import React from 'react';

interface ChartWidgetProps {
  title: string;
  type: 'line' | 'bar' | 'pie' | 'doughnut';
  data?: any;
}

const ChartWidget: React.FC<ChartWidgetProps> = ({ title, type, data }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
      <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
        <p className="text-gray-500">Chart placeholder ({type})</p>
      </div>
    </div>
  );
};

export default ChartWidget;