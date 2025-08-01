import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const Create = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [goalAmount, setGoalAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/projects', {
        title,
        description,
        goalAmount: parseFloat(goalAmount)
      });
      navigate('/explore');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10 bg-white min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white p-8 rounded shadow border border-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-blue-700 text-center">Create a Project</h2>
        {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
        <div className="mb-4">
          <label className="block mb-2 text-gray-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border border-gray-300 p-2 w-full rounded bg-white text-black focus:border-blue-500 outline-none"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border border-gray-300 p-2 w-full rounded bg-white text-black focus:border-blue-500 outline-none"
            rows={4}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block mb-2 text-gray-700">Goal Amount (₹)</label>
          <input
            type="number"
            value={goalAmount}
            onChange={(e) => setGoalAmount(e.target.value)}
            className="border border-gray-300 p-2 w-full rounded bg-white text-black focus:border-blue-500 outline-none"
            min="1"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded transition-colors duration-200 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Project'}
        </button>
      </form>
    </div>
  );
};

export default Create;
