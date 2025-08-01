import React, { useEffect, useState } from 'react';
import { fetchMyDonations } from '../api/crowdfunding';

const MyDonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyDonations()
      .then(res => setDonations(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">My Donations</h2>
      <div className="space-y-4">
        {donations.length === 0 && <div>You have not made any donations yet.</div>}
        {donations.map((d, i) => (
                    <div key={i} className="border border-gray-700 rounded p-4 bg-gray-900 shadow">
            <div>Amount: <span className="font-semibold">₹{d.amount}</span></div>
            <div>Date: {new Date(d.contributedAt).toLocaleDateString()}</div>
            <div>Campaign ID: {d.project.id}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyDonations;
