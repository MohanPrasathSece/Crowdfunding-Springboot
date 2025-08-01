import React, { useEffect, useState } from 'react';
import { fetchAllCampaigns } from '../api/crowdfunding';
import { Link } from 'react-router-dom';

const CampaignList = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllCampaigns()
      .then(res => setCampaigns(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">All Campaigns</h2>
      <div className="space-y-4">
        {campaigns.map(c => (
          <div key={c.id} className="border rounded p-4 bg-white shadow">
            <div className="flex items-center">
              {c.imageUrl && <img src={c.imageUrl} alt={c.title} className="w-24 h-24 object-cover rounded mr-4" />}
              <div>
                <h3 className="text-lg font-semibold">{c.title}</h3>
                <p className="text-gray-600">{c.description}</p>
                <div className="mt-1 text-sm">Goal: ₹{c.goalAmount} | Raised: ₹{c.collectedAmount}</div>
                <Link to={`/campaign/${c.id}`}
                  className="inline-block mt-2 px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700">
                  View / Donate
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CampaignList;
