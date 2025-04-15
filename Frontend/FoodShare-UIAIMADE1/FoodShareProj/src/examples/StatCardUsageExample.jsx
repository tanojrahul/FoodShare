import React, { useState, useEffect } from 'react';
import StatCard from '../components/StatCard';
import { 
  FiPackage, 
  FiTrendingUp, 
  FiAward, 
  FiLifeBuoy 
} from 'react-icons/fi';

const StatCardUsageExample = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch statistics
    const fetchStats = async () => {
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock data
        const mockStats = {
          foodSaved: 245,
          foodTarget: 500,
          donationsCompleted: 12,
          donationsTarget: 20,
          pointsEarned: 3750,
          pointsTarget: 5000,
          peopleHelped: 178,
          peopleTarget: 200
        };
        
        setStats(mockStats);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="p-6 bg-white">
      <h2 className="text-2xl font-bold text-[#123458] mb-6">Your Impact</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Food Saved Stat */}
        <StatCard
          title="Food Saved"
          value={loading ? "-" : stats?.foodSaved}
          unit="kg"
          icon={<FiPackage className="text-[#123458]" size={24} />}
          progress={stats?.foodSaved}
          target={stats?.foodTarget}
          loading={loading}
          progressType="bar"
        />
        
        {/* Donations Completed Stat */}
        <StatCard
          title="Donations Completed"
          value={loading ? "-" : stats?.donationsCompleted}
          icon={<FiTrendingUp className="text-[#123458]" size={24} />}
          progress={stats?.donationsCompleted}
          target={stats?.donationsTarget}
          loading={loading}
          progressType="circle"
        />
        
        {/* Points Earned Stat */}
        <StatCard
          title="Points Earned"
          value={loading ? "-" : stats?.pointsEarned}
          icon={<FiAward className="text-[#123458]" size={24} />}
          progress={stats?.pointsEarned}
          target={stats?.pointsTarget}
          loading={loading}
          progressType="bar"
        />
        
        {/* People Helped Stat */}
        <StatCard
          title="People Helped"
          value={loading ? "-" : stats?.peopleHelped}
          icon={<FiLifeBuoy className="text-[#123458]" size={24} />}
          progress={stats?.peopleHelped}
          target={stats?.peopleTarget}
          loading={loading}
          progressType="circle"
        />
      </div>
    </div>
  );
};

export default StatCardUsageExample;
