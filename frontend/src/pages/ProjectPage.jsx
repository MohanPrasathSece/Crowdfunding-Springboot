import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import Modal from '../components/Modal';

const ProjectPage = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await api.get(`/projects/${id}`);
        setProject(response.data);
      } catch (err) {
        // Error handling is managed by the interceptor
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const confirmAndDonate = async () => {
    try {
      await api.post(`/projects/${id}/pledge`, { amount: parseFloat(amount) });
      setProject({ ...project, collectedAmount: project.collectedAmount + parseFloat(amount) });
      setAmount('');
    } catch (err) {
      // handled by interceptor
    } finally {
      setShowConfirm(false);
    }
  };

  const handlePledge = (e) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  if (!project) {
    return <div>Project not found.</div>;
  }

  return (
        <div className="container mx-auto py-10 bg-black text-white">
      <h2 className="text-3xl font-bold mb-4">{project.title}</h2>
      <img src={project.imageUrl} alt={project.title} className="w-full h-96 object-cover rounded-lg mb-4" />
            <p className="text-gray-300 mb-4">{project.description}</p>
      <div className="text-xl font-bold">Goal: ${project.goalAmount}</div>
      <div className="text-xl font-bold">Collected: ${project.collectedAmount}</div>
      <div className="text-lg">Deadline: {new Date(project.deadline).toLocaleDateString()}</div>

      <form onSubmit={handlePledge} className="mt-6">
        <input
          type="number"
          placeholder="Pledge Amount"
                    className="border p-2 w-full mb-4 bg-transparent text-white border-gray-600 focus:border-orange-500 outline-none"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
                <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded">
          Pledge
        </button>
      </form>

      <Modal open={showConfirm} onClose={() => setShowConfirm(false)}>
        <h3 className="text-xl font-semibold mb-4">Confirm Donation</h3>
        <p className="mb-6">Donate ${amount} to {project.title}?</p>
        <div className="flex justify-end space-x-4">
                    <button onClick={() => setShowConfirm(false)} className="px-4 py-2 border border-gray-600 rounded">Cancel</button>
                    <button onClick={confirmAndDonate} className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded">Confirm</button>
        </div>
      </Modal>
    </div>
  );
};

export default ProjectPage;
