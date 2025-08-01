import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchCampaignById, fetchCampaignDonors, donateToCampaign } from '../api/crowdfunding';

const CampaignDetail = () => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [donors, setDonors] = useState([]);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [donating, setDonating] = useState(false);

  useEffect(() => {
    fetchCampaignById(id).then(res => setCampaign(res.data));
    fetchCampaignDonors(id).then(res => setDonors(res.data));
    setLoading(false);
  }, [id]);

  const handleDonate = (e) => {
    e.preventDefault();
    if (!amount) return;
    setDonating(true);
    donateToCampaign(id, amount)
      .then(() => {
        fetchCampaignDonors(id).then(res => setDonors(res.data));
        setAmount('');
        alert('Donation successful!');
      })
      .finally(() => setDonating(false));
  };

  if (loading || !campaign) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-2">{campaign.title}</h2>
      {campaign.imageUrl && <img src={campaign.imageUrl} alt={campaign.title} className="w-full h-64 object-cover rounded mb-4" />}
      <p className="mb-2">{campaign.description}</p>
      <div className="mb-2">Goal: ₹{campaign.goalAmount} | Raised: ₹{campaign.collectedAmount}</div>
      <form onSubmit={handleDonate} className="mb-4 flex items-center gap-2">
        <input type="number" min="1" required value={amount} onChange={e => setAmount(e.target.value)}
          placeholder="Enter amount" className="border px-2 py-1 rounded" />
        <button type="submit" className="bg-purple-600 text-white px-4 py-1 rounded" disabled={donating}>
          {donating ? 'Donating...' : 'Donate'}
        </button>
      </form>
      <div>
        <h4 className="font-semibold">Donors:</h4>
        <ul className="ml-4 list-disc">
          {donors.length === 0 && <li>No donors yet.</li>}
          {donors.map((d, i) => (
            <li key={i}>{d.name} donated ₹{d.amount} on {new Date(d.date).toLocaleDateString()}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CampaignDetail;
