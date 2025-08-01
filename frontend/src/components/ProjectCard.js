import React from 'react';

const ProjectCard = ({ project, onDonate, onEdit, onDelete }) => {
  const completed = project.collectedAmount >= project.goalAmount;
  const percent = Math.min(
    100,
    ((project.collectedAmount / project.goalAmount) * 100).toFixed(0)
  );

  return (
        <div className="bg-white rounded p-4 w-80 h-96 text-black flex flex-col border border-gray-300 relative">
      <img
        src={project.imageUrl}
        alt={project.title}
        className="h-40 w-full object-cover rounded"
      />
      <h3 className="text-lg font-semibold mt-2 truncate">{project.title}</h3>
            <p className="text-sm text-gray-400 line-clamp-2 flex-grow">{project.description}</p>

            <div className="w-full bg-gray-300 rounded-full h-2.5 mt-2">
                <div
          className="bg-orange-500 h-2.5 rounded-full"
          style={{ width: `${percent}%` }}
        ></div>
      </div>
      <div className="text-sm mt-1">
        {project.collectedAmount} / {project.goalAmount}
      </div>
      <div className="absolute top-2 right-2 flex space-x-2">
          <button onClick={(e)=>{e.stopPropagation(); onEdit&&onEdit(project);}} className="px-2 py-1 text-xs bg-orange-500 hover:bg-orange-500 text-white rounded">Edit</button>
          <button onClick={(e)=>{e.stopPropagation(); onDelete&&onDelete(project);}} className="px-2 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded">Delete</button>
        </div>

      
        {!completed ? (
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDonate(project); }}
          className="mt-3 inline-block bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded w-full text-center"
        >
          Donate
        </button>
      ) : (
        <div className="mt-3 inline-block bg-green-600 text-white px-4 py-2 rounded w-full text-center">
          Completed
        </div>
      )}
    </div>
  );
};

export default ProjectCard;
