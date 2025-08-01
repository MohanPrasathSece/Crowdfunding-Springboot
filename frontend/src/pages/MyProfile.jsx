import React, { useEffect, useState } from 'react';
import {
  fetchMyCampaigns,
  fetchCampaignDonors,
} from '../api/crowdfunding';
import api from '../api';
import Modal from '../components/Modal';
import ProjectCard from '../components/ProjectCard';
import { Link } from 'react-router-dom';

const MyProfile = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [donors, setDonors] = useState({});
  const [loading, setLoading] = useState(true);

  const [showEdit, setShowEdit] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    goalAmount: '',
    imageUrl: '',
    deadline: '',
  });
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const load = async () => {
    try {
      const res = await fetchMyCampaigns();
      setCampaigns(res.data);
      // Load donors information
      res.data.forEach((c) => {
        fetchCampaignDonors(c.id).then((donRes) => {
          setDonors((prev) => ({ ...prev, [c.id]: donRes.data }));
        });
      });
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (campaign) => {
    setSelected(campaign);
    setForm({
      title: campaign.title,
      description: campaign.description,
      goalAmount: campaign.goalAmount,
      imageUrl: campaign.imageUrl,
      deadline: campaign.deadline?.split('T')[0] || '',
    });
    setShowEdit(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selected) return;
    try {
      await api.put(`/projects/${selected.id}`, {
        ...form,
        goalAmount: parseFloat(form.goalAmount),
      });
      await load();
    } catch (err) {
      // Optionally handle error with toast
    }
    setShowEdit(false);
    setSelected(null);
  };

  const handleDelete = async (campaign) => {
    if (!window.confirm('Delete this campaign?')) return;
    try {
      await api.delete(`/projects/${campaign.id}`);
      setCampaigns(campaigns.filter((c) => c.id !== campaign.id));
    } catch (err) {
      // handle error
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="container mx-auto py-10 min-h-screen text-black bg-white">
      <h2 className="text-2xl font-bold mb-6 text-blue-700">My Profile</h2>

      {campaigns.length === 0 ? (
        <div>You haven't created any campaigns yet.</div>
      ) : (
        <div className="flex flex-wrap gap-8 justify-center">
          {campaigns.map((c) => (
            <div key={c.id} className="relative">
              <ProjectCard project={c} onDonate={() => {}} />
              <div className="absolute top-2 right-2 flex space-x-2">
                <button
                  onClick={() => openEdit(c)}
                  className="bg-blue-500 hover:bg-blue-600 text-white rounded px-2 py-1 text-xs"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(c)}
                  className="bg-red-500 hover:bg-red-600 text-white rounded px-2 py-1 text-xs"
                >
                  Delete
                </button>
              </div>
              {/* Donors list */}
              <div className="mt-2 text-sm text-gray-700">
                <span className="font-semibold">Donors:</span>
                <ul className="list-disc ml-4">
                  {(donors[c.id] || []).length === 0 && <li>No donors yet.</li>}
                  {(donors[c.id] || []).map((d, i) => (
                    <li key={i}>
                      {d.name} donated ₹{d.amount} on{' '}
                      {new Date(d.date).toLocaleDateString()}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      <Modal open={showEdit} onClose={() => setShowEdit(false)}>
        <h3 className="text-lg font-semibold mb-2">Edit Campaign</h3>
        <form onSubmit={handleEditSubmit} className="space-y-3">
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Title"
            className="border p-2 w-full"
            required
          />
          <textarea
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            placeholder="Description"
            className="border p-2 w-full"
            rows="3"
            required
          />
          <input
            type="number"
            value={form.goalAmount}
            onChange={(e) =>
              setForm({ ...form, goalAmount: e.target.value })
            }
            placeholder="Goal Amount"
            className="border p-2 w-full"
            required
          />
          <input
            value={form.imageUrl}
            onChange={(e) =>
              setForm({ ...form, imageUrl: e.target.value })
            }
            placeholder="Image URL"
            className="border p-2 w-full"
          />
          <input
            type="date"
            value={form.deadline}
            onChange={(e) =>
              setForm({ ...form, deadline: e.target.value })
            }
            className="border p-2 w-full"
          />
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowEdit(false)}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Save
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MyProfile;
