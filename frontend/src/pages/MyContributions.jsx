import React, { useEffect, useState } from 'react';
import api from '../api';

const MyContributions = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch only my posted projects
    api.get('/projects/my-projects')
      .then(res => setProjects(res.data))
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center text-black bg-white">Loading...</div>;

  return (
    <div className="container mx-auto py-10 bg-white text-black min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-blue-700">My Projects</h2>
      {projects.length === 0 ? (
        <div className="text-gray-500">You have not posted any projects yet.</div>
      ) : (
        <div className="flex flex-wrap gap-8 justify-center">
          {projects.map((project) => (
            <div key={project.id} className="w-96 h-72 flex flex-col border border-gray-200 rounded p-6 bg-white shadow overflow-hidden">
              <h3 className="text-xl font-semibold mb-2 truncate text-black">{project.title}</h3>
              <p className="mb-2 text-gray-700 flex-1 overflow-y-auto text-sm">{project.description}</p>
              <div className="mb-2 text-black">Goal: <span className="font-bold">₹{project.goalAmount}</span></div>
              <div className="mb-2 text-black">Collected: <span className="font-bold">₹{project.collectedAmount}</span></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyContributions;
