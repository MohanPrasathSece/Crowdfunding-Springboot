import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';


const CreateProject = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    imageUrl: '',
    goalAmount: '',
    deadline: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects', {
        ...form,
        goalAmount: parseFloat(form.goalAmount),
      });
      navigate('/explore');
    } catch (err) {
      // handled by interceptor
    }
  };

  return (
        <div className="container mx-auto py-10 max-w-xl bg-black text-white">
      <h2 className="text-2xl font-bold mb-4 text-white">Create Project</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Title"
          className="border p-2 w-full bg-transparent text-white border-white focus:border-orange-500 outline-none"
          value={form.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          className="border p-2 w-full bg-transparent text-white border-white focus:border-orange-500 outline-none"
          rows={4}
          value={form.description}
          onChange={handleChange}
          required
        />
        <input
          type="url"
          name="imageUrl"
          placeholder="Image URL"
          className="border p-2 w-full bg-transparent text-white border-white focus:border-orange-500 outline-none"
          value={form.imageUrl}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="goalAmount"
          placeholder="Goal Amount"
          className="border p-2 w-full bg-transparent text-white border-white focus:border-orange-500 outline-none"
          value={form.goalAmount}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="deadline"
          className="border p-2 w-full bg-transparent text-white border-white focus:border-orange-500 outline-none"
          value={form.deadline}
          onChange={handleChange}
          required
        />
        <button
          type="submit"
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
        >
          Create
        </button>
      </form>
    </div>
  );
};

export default CreateProject;
