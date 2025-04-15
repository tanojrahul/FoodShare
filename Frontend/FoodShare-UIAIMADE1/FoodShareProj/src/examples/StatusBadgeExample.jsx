import React from 'react';
import StatusBadge from '../components/StatusBadge';

const StatusBadgeExample = () => {
  const allStatuses = [
    'Pending',
    'Accepted',
    'In Transit',
    'Delivered',
    'Completed',
    'Cancelled'
  ];

  return (
    <div className="p-6 bg-white">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Status Badges</h1>
      
      <div className="mb-8">
        <h2 className="text-lg font-medium mb-3">Size Variants</h2>
        <div className="flex flex-wrap gap-4">
          <StatusBadge status="In Transit" size="small" />
          <StatusBadge status="In Transit" size="medium" />
          <StatusBadge status="In Transit" size="large" />
        </div>
      </div>
      
      <div>
        <h2 className="text-lg font-medium mb-3">All Status Types</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {allStatuses.map(status => (
            <div key={status} className="flex flex-col items-center text-center">
              <StatusBadge status={status} />
              <span className="text-xs text-gray-500 mt-2">{status}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-medium mb-3">Usage in Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['Pending', 'In Transit', 'Delivered'].map(status => (
            <div key={status} className="bg-[#F1EFEC] p-4 rounded-lg border border-[#D4C9BE]">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-medium">Food Donation #{Math.floor(Math.random() * 1000)}</h3>
                <StatusBadge status={status} size="small" />
              </div>
              <p className="text-sm text-gray-600">Sample donation details would appear here.</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatusBadgeExample;
