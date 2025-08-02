import React, { useEffect, useState } from 'react';
import api from '../api';

import ProjectCard from '../components/ProjectCard';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';

const Explore = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
    const [search, setSearch] = useState('');
  const [showDonate, setShowDonate] = useState(false);
  const [selected, setSelected] = useState(null);
  const [amount, setAmount] = useState('');
  
  const [showEdit, setShowEdit] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', goalAmount: '', imageUrl: '', deadline: '' });
  const [selectedEdit, setSelectedEdit] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await api.get('/projects');
      setProjects(res.data);
    };
    fetchData();
  }, []);

  const openDonate = (project) => {
    setSelected(project);
    setShowDonate(true);
  };

  const openEdit = (project) => {
    setSelectedEdit(project);
    setForm({
      title: project.title,
      description: project.description,
      goalAmount: project.goalAmount,
      imageUrl: project.imageUrl,
      deadline: project.deadline?.split('T')[0] || ''
    });
    setShowEdit(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEdit) return;
    try {
      await api.put(`/projects/${selectedEdit.id}`, {
        ...form,
        goalAmount: parseFloat(form.goalAmount)
      });
      const res = await api.get('/projects');
      setProjects(res.data);
    } catch (err) {}
    setShowEdit(false);
    setSelectedEdit(null);
  };

  const handleDelete = async (project) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await api.delete(`/projects/${project.id}`);
      setProjects(projects.filter(p => p.id !== project.id));
    } catch (err) {}
  };

  const confirmDonate = async () => {
    if (!selected || !amount) return;
    try {
      await api.post(`/projects/${selected.id}/pledge`, { amount: parseFloat(amount) });
      // Refresh project data locally
      setProjects(projects.map(p => 
        p.id === selected.id 
          ? { ...p, collectedAmount: p.collectedAmount + parseFloat(amount) } 
          : p
      ));
    } catch (e) {
      // error handled by interceptor
    } finally {
      setAmount('');
      setShowDonate(false);
      setSelected(null);
    }
  };

  const filtered = projects.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );
  const ordered = [...filtered].sort((a, b) => {
    const aCompleted = a.collectedAmount >= a.goalAmount;
    const bCompleted = b.collectedAmount >= b.goalAmount;
    if (aCompleted === bCompleted) return 0;
    return aCompleted ? 1 : -1; // completed go last
  });

  return (
        <div className="container mx-auto py-10 bg-black text-white">
      <h2 className="text-2xl font-bold mb-4 text-orange-500">Explore Projects</h2>
      <input
        type="text"
        placeholder="Search..."
        className="border p-2 w-full mb-6 bg-transparent text-white border-gray-600 focus:border-orange-500 outline-none"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="flex flex-wrap gap-6 justify-center">
        {ordered.map((project) => (
          <div key={project.id} className="relative">
            <ProjectCard 
              project={project}
              onDonate={openDonate}
              editable={user && project.owner && ((project.owner.email||'').toLowerCase() === ((user.email||user.sub||'').toLowerCase()))}
              onEdit={openEdit}
              onDelete={handleDelete}
              onClick={() => openDonate(project)}
            />
          </div>
        ))}
        {ordered.length === 0 && <p>No projects found.</p>}
      </div>

      {selected && (
        <Modal open={showDonate} onClose={() => setShowDonate(false)}>
          <h3 className="text-xl font-semibold mb-2 text-orange-500">Donate to {selected.title}</h3>
          <p className="text-sm text-gray-700 mb-4">by {selected.owner?.name || selected.owner?.email?.split('@')[0] || 'Unknown'}</p>

          <div className="mb-4 text-sm space-y-1 text-black">
            <div className="flex justify-between">
              <span className="text-gray-500">Collected:</span>
              <span className="font-medium">₹{selected.collectedAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Goal:</span>
              <span className="font-medium">₹{selected.goalAmount.toLocaleString()}</span>
            </div>
          </div>

          <input
            type="number"
            placeholder="Amount to Donate"
            className="border p-2 w-full mb-4 bg-white text-black border-gray-300 focus:border-blue-500 outline-none"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
          <div className="flex justify-end space-x-4">
            <button onClick={() => setShowDonate(false)} className="px-4 py-2 border border-gray-400 rounded text-black bg-white">Cancel</button>
            <button onClick={confirmDonate} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded">Confirm Donation</button>
          </div>
        </Modal>
      )}
      {selectedEdit && (
        <Modal open={showEdit} onClose={() => setShowEdit(false)}>
          <h3 className="text-lg font-semibold mb-2">Edit Project</h3>
          <form onSubmit={handleEditSubmit} className="space-y-3">
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Title" className="border p-2 w-full" required />
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Description" className="border p-2 w-full" rows="3" required />
            <input type="number" value={form.goalAmount} onChange={e => setForm({ ...form, goalAmount: e.target.value })} placeholder="Goal Amount" className="border p-2 w-full" required />
            <input value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} placeholder="Image URL" className="border p-2 w-full" />
            <input type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} className="border p-2 w-full" />
            <div className="flex justify-end space-x-3">
              <button type="button" onClick={() => setShowEdit(false)} className="px-4 py-2 border rounded">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Explore;
