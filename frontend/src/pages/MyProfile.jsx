import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchMyCampaigns } from '../api/crowdfunding';
import ProjectCard from '../components/ProjectCard';

const MyProfile = () => {
  const { user } = useAuth();
  const email = user?.email || user?.sub || '';
  const name = email.split('@')[0];

  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchMyCampaigns();
        setCampaigns(res.data || []);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-white">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10 min-h-screen bg-black text-white">
      <h2 className="text-3xl font-bold text-orange-500 mb-4">My Profile</h2>

      <div className="mb-8 text-sm text-gray-300 space-y-1">
        <p>
          <span className="font-semibold">Name:</span> {name}
        </p>
        <p>
          <span className="font-semibold">Email:</span> {email}
        </p>
      </div>

      {campaigns.length > 0 && (
        <div className="flex flex-wrap gap-8 justify-center">
          {campaigns.map((c) => (
            <ProjectCard key={c.id} project={c} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProfile;
