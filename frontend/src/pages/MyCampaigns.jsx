import React, { useEffect, useState } from 'react';
import { fetchMyCampaigns, fetchCampaignDonors } from '../api/crowdfunding';
import { Link } from 'react-router-dom';

const MyCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [donors, setDonors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyCampaigns()
      .then(res => {
        setCampaigns(res.data);
        // Fetch donors for each campaign
        res.data.forEach(c => {
          fetchCampaignDonors(c.id).then(donorsRes => {
            setDonors(prev => ({ ...prev, [c.id]: donorsRes.data }));
          });
        });
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">My Campaigns</h2>
      <div className="space-y-6">
        {campaigns.map(c => (
                    <div key={c.id} className="border border-gray-700 rounded p-4 bg-gray-900 shadow">
            <div className="flex items-center">
              {c.imageUrl && <img src={c.imageUrl} alt={c.title} className="w-24 h-24 object-cover rounded mr-4" />}
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{c.title}</h3>
                                <p className="text-gray-400">{c.description}</p>
                <div className="mt-1 text-sm">Goal: ₹{c.goalAmount} | Raised: ₹{c.collectedAmount}</div>
                <Link to={`/campaign/${c.id}`}
                                    className="inline-block mt-2 px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600">
                  View Details
                </Link>
                <div className="mt-2">
                  <span className="font-semibold">Donors:</span>
                  <ul className="ml-4 list-disc">
                    {(donors[c.id] || []).length === 0 && <li>No donors yet.</li>}
                    {(donors[c.id] || []).map((d, i) => (
                      <li key={i}>{d.name} donated ₹{d.amount} on {new Date(d.date).toLocaleDateString()}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyCampaigns;
