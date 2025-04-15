import React, { useState } from 'react';
import { 
  BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell 
} from 'recharts';
import { FiAward, FiTrendingUp, FiPackage, FiUsers } from 'react-icons/fi';

// StatCard Component
const StatCard = ({ icon, title, value, change, changeType }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold mt-1 text-[#123458]">{value}</p>
        </div>
        <div className={`p-2 rounded-full ${icon ? 'bg-[#F1EFEC]' : ''}`}>
          {icon && icon}
        </div>
      </div>
      
      {change && (
        <div className="mt-2 flex items-center">
          <span className={`text-xs ${
            changeType === 'increase' ? 'text-green-600' : 
            changeType === 'decrease' ? 'text-red-600' : 'text-gray-500'
          }`}>
            {changeType === 'increase' ? '▲' : 
             changeType === 'decrease' ? '▼' : ''}
            {' '}{change}
          </span>
          <span className="text-xs text-gray-500 ml-1">vs last month</span>
        </div>
      )}
    </div>
  );
};

// LeaderboardCard Component
const LeaderboardCard = ({ donors }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-5">
      <h3 className="text-lg font-semibold text-[#123458] mb-4">Top Donors</h3>
      <div className="overflow-hidden">
        {donors.map((donor, index) => (
          <div key={donor.id} className="flex items-center py-3 border-b last:border-b-0 border-gray-100">
            <div className={`w-8 h-8 flex items-center justify-center rounded-full 
              ${index === 0 ? 'bg-yellow-100 text-yellow-700' :
                index === 1 ? 'bg-gray-100 text-gray-700' :
                index === 2 ? 'bg-orange-100 text-orange-700' : 
                'bg-[#F1EFEC] text-[#123458]'}`}
            >
              {index + 1}
            </div>
            <div className="ml-3 flex-1">
              <p className="font-medium">{donor.name}</p>
              <p className="text-sm text-gray-500">{donor.location}</p>
            </div>
            <div className="text-right">
              <p className="font-medium text-[#123458]">{donor.amount} kg</p>
              <p className="text-xs text-gray-500">{donor.donations} donations</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ChartCard Component
const ChartCard = ({ title, children, subtitle }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-5">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-[#123458]">{title}</h3>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
};

const ImpactReportPage = () => {
  // Mock data for charts and statistics
  const [timeFrame, setTimeFrame] = useState('year');
  
  // Stat card data
  const statCardData = {
    totalFood: { 
      value: "42,500 kg", 
      change: "12.5%", 
      changeType: "increase" 
    },
    totalDonations: { 
      value: "3,240", 
      change: "8.3%", 
      changeType: "increase" 
    },
    peopleHelped: { 
      value: "15,800", 
      change: "5.2%", 
      changeType: "increase" 
    },
    topDonor: { 
      value: "Green Grocers", 
      change: "2 months", 
      changeType: "neutral" 
    }
  };

  // Monthly donation data for bar chart
  const monthlyDonations = [
    { name: 'Jan', amount: 2400 },
    { name: 'Feb', amount: 1398 },
    { name: 'Mar', amount: 3200 },
    { name: 'Apr', amount: 2780 },
    { name: 'May', amount: 1890 },
    { name: 'Jun', amount: 2390 },
    { name: 'Jul', amount: 3490 },
    { name: 'Aug', amount: 2000 },
    { name: 'Sep', amount: 2780 },
    { name: 'Oct', amount: 3908 },
    { name: 'Nov', amount: 4800 },
    { name: 'Dec', amount: 3800 }
  ];

  // Category distribution data for pie chart
  const categoryDistribution = [
    { name: 'Vegetables', value: 35, color: '#4CAF50' },
    { name: 'Fruits', value: 25, color: '#FFC107' },
    { name: 'Bakery', value: 20, color: '#FF9800' },
    { name: 'Dairy', value: 10, color: '#2196F3' },
    { name: 'Canned Goods', value: 10, color: '#9C27B0' }
  ];

  // User growth data for line chart
  const userGrowthData = [
    { month: 'Jan', users: 400 },
    { month: 'Feb', users: 600 },
    { month: 'Mar', users: 800 },
    { month: 'Apr', users: 1000 },
    { month: 'May', users: 1200 },
    { month: 'Jun', users: 1500 },
    { month: 'Jul', users: 1800 },
    { month: 'Aug', users: 2100 },
    { month: 'Sep', users: 2400 },
    { month: 'Oct', users: 2700 },
    { month: 'Nov', users: 3000 },
    { month: 'Dec', users: 3500 }
  ];

  // Top donors data for leaderboard
  const topDonors = [
    { id: 1, name: 'Green Grocers', location: 'New York', amount: 1250, donations: 45 },
    { id: 2, name: 'Farm Fresh Foods', location: 'Chicago', amount: 950, donations: 32 },
    { id: 3, name: 'Organic Market', location: 'Seattle', amount: 875, donations: 28 },
    { id: 4, name: 'City Bakery', location: 'Boston', amount: 720, donations: 25 },
    { id: 5, name: 'Fresh Farms', location: 'Denver', amount: 690, donations: 22 }
  ];

  // Handle time frame change
  const handleTimeFrameChange = (frame) => {
    setTimeFrame(frame);
    // In a real application, we would fetch new data based on the selected time frame
  };

  return (
    <div className="min-h-screen bg-[#F1EFEC]">
      <header className="bg-[#123458] text-white py-6 px-6">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold">Impact Report</h1>
          <p className="opacity-80">See the difference we're making together</p>
        </div>
      </header>

      <main className="container mx-auto py-6 px-4 sm:px-6">
        {/* Time Frame Selector */}
        <div className="flex justify-end mb-6">
          <div className="bg-white rounded-lg shadow-sm inline-flex">
            <button 
              onClick={() => handleTimeFrameChange('month')}
              className={`px-4 py-2 text-sm rounded-l-lg ${
                timeFrame === 'month' 
                  ? 'bg-[#123458] text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Month
            </button>
            <button 
              onClick={() => handleTimeFrameChange('quarter')}
              className={`px-4 py-2 text-sm ${
                timeFrame === 'quarter' 
                  ? 'bg-[#123458] text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Quarter
            </button>
            <button 
              onClick={() => handleTimeFrameChange('year')}
              className={`px-4 py-2 text-sm rounded-r-lg ${
                timeFrame === 'year' 
                  ? 'bg-[#123458] text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Year
            </button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            icon={<FiPackage size={20} className="text-[#123458]" />}
            title="Total Food Saved" 
            value={statCardData.totalFood.value}
            change={statCardData.totalFood.change}
            changeType={statCardData.totalFood.changeType}
          />
          <StatCard 
            icon={<FiTrendingUp size={20} className="text-[#123458]" />}
            title="Total Donations" 
            value={statCardData.totalDonations.value}
            change={statCardData.totalDonations.change}
            changeType={statCardData.totalDonations.changeType}
          />
          <StatCard 
            icon={<FiUsers size={20} className="text-[#123458]" />}
            title="People Helped" 
            value={statCardData.peopleHelped.value}
            change={statCardData.peopleHelped.change}
            changeType={statCardData.peopleHelped.changeType}
          />
          <StatCard 
            icon={<FiAward size={20} className="text-[#123458]" />}
            title="Top Donor this Month" 
            value={statCardData.topDonor.value}
            change={statCardData.topDonor.change}
            changeType={statCardData.topDonor.changeType}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Monthly Donations Bar Chart */}
          <div className="lg:col-span-2">
            <ChartCard 
              title="Monthly Food Donations" 
              subtitle="Amount of food donated each month (in kg)"
            >
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyDonations}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`${value} kg`, 'Amount']}
                      contentStyle={{ backgroundColor: '#fff', borderColor: '#ddd' }}
                    />
                    <Bar dataKey="amount" fill="#123458" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>

          {/* Category Distribution Pie Chart */}
          <div>
            <ChartCard 
              title="Donation Categories" 
              subtitle="Distribution by food type"
            >
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`${value}%`, 'Percentage']}
                      contentStyle={{ backgroundColor: '#fff', borderColor: '#ddd' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>
        </div>

        {/* Bottom Section - Growth Chart and Top Donors */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Growth Line Chart */}
          <div className="lg:col-span-2">
            <ChartCard 
              title="Platform Growth" 
              subtitle="Number of users over time"
            >
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={userGrowthData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#fff', borderColor: '#ddd' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="users" 
                      stroke="#D4C9BE" 
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>

          {/* Top Donors Leaderboard */}
          <div>
            <LeaderboardCard donors={topDonors} />
          </div>
        </div>

        {/* Impact Metrics Summary */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-[#123458] mb-2">Environmental Impact</h3>
          <p className="text-gray-600 mb-4">
            The food saved through our platform has prevented approximately:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">127.5 tons</p>
              <p className="text-sm text-gray-600">of CO₂ emissions</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">3.6 million</p>
              <p className="text-sm text-gray-600">gallons of water</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">8.5 acres</p>
              <p className="text-sm text-gray-600">of land usage</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ImpactReportPage;
