import { Link } from "react-router-dom";

const ProjectCard = ({ project, isAdmin, onDelete, onEdit }) => {
  return (
    <div className="panel p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-2xl text-ink">{project.title}</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">{project.description}</p>
        </div>
        {isAdmin && (
          <div className="flex gap-2">
            <button type="button" onClick={() => onEdit(project)} className="button-secondary px-4 py-2">
              Edit
            </button>
            <button type="button" onClick={() => onDelete(project._id)} className="rounded-2xl bg-red-500 px-4 py-2 text-sm font-semibold text-white">
              Delete
            </button>
          </div>
        )}
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-slate-500">
        <span>{project.members?.length || 0} members</span>
        <span>Created by {project.createdBy?.name}</span>
      </div>
      <Link to={`/projects/${project._id}`} className="mt-6 inline-flex rounded-full bg-clay px-4 py-2 text-sm font-semibold text-white">
        Open project
      </Link>
    </div>
  );
};

export default ProjectCard;
