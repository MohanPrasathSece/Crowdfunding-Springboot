import React from 'react';
import MyCampaigns from './MyCampaigns';
import MyDonations from './MyDonations';

const Dashboard = () => {
  return (
        <div className="max-w-5xl mx-auto p-4 bg-black text-white">
      <h1 className="text-3xl font-bold mb-6">My Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <MyCampaigns />
        </div>
        <div>
          <MyDonations />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
