import React, { useEffect, useState } from 'react';
import api from '../api';
import Modal from '../components/Modal';
import ProjectCard from '../components/ProjectCard';

const MyProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', goalAmount: '', imageUrl: '', deadline: '' });
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await api.get('/projects/my-projects');
      setProjects(res.data);
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (project) => {
    setSelected(project);
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
    if (!selected) return;
    try {
      await api.put(`/projects/${selected.id}`, {
        ...form,
        goalAmount: parseFloat(form.goalAmount)
      });
      await load();
    } catch (e) {}
    setShowEdit(false);
    setSelected(null);
  };

  const handleDelete = async (project) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await api.delete(`/projects/${project.id}`);
      setProjects(projects.filter(p => p.id !== project.id));
    } catch (e) {}
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="container mx-auto py-10 min-h-screen text-black bg-white">
      <h2 className="text-2xl font-bold mb-6 text-blue-700">My Projects</h2>
      {projects.length === 0 ? (
        <div>You haven\'t posted any projects yet.</div>
      ) : (
        <div className="flex flex-wrap gap-8 justify-center">
          {projects.map((p) => (
            <div key={p.id} className="relative">
              <ProjectCard project={p} onDonate={() => {}} />
              <div className="absolute top-2 right-2 flex space-x-2">
                <button onClick={() => openEdit(p)} className="bg-blue-500 hover:bg-blue-600 text-white rounded px-2 py-1 text-xs">Edit</button>
                <button onClick={() => handleDelete(p)} className="bg-red-500 hover:bg-red-600 text-white rounded px-2 py-1 text-xs">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

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
    </div>
  );
};

export default MyProjects;
