import { useEffect, useMemo, useState } from "react";
import AppShell from "../components/AppShell";
import ProjectCard from "../components/ProjectCard";
import { useAuth } from "../context/AuthContext";
import {
  createProject,
  deleteProject,
  getProjects,
  updateProject,
} from "../services/projectService";

const emptyForm = { title: "", description: "" };

const ProjectsPage = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingProjectId, setEditingProjectId] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const isAdmin = user?.role === "Admin";
  const submitLabel = useMemo(
    () => (editingProjectId ? "Update Project" : "Create Project"),
    [editingProjectId]
  );

  const loadProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load projects");
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSaving(true);

    try {
      if (editingProjectId) {
        await updateProject(editingProjectId, formData);
      } else {
        await createProject(formData);
      }

      setFormData(emptyForm);
      setEditingProjectId("");
      await loadProjects();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save project");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (projectId) => {
    try {
      await deleteProject(projectId);
      await loadProjects();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete project");
    }
  };

  const handleEdit = (project) => {
    setEditingProjectId(project._id);
    setFormData({ title: project.title, description: project.description });
  };

  return (
    <AppShell
      title="Projects"
      subtitle="Create project spaces, control access, and keep the team aligned on delivery."
    >
      {error ? <div className="panel p-4 text-sm text-red-600">{error}</div> : null}
      {isAdmin ? (
        <section className="panel p-6">
          <h2 className="font-display text-3xl text-ink">{submitLabel}</h2>
          <form onSubmit={handleSubmit} className="mt-5 grid gap-4 md:grid-cols-2">
            <input
              type="text"
              placeholder="Project title"
              className="input"
              value={formData.title}
              onChange={(event) => setFormData({ ...formData, title: event.target.value })}
            />
            <div className="md:row-span-2">
              <textarea
                placeholder="Project description"
                className="input min-h-32"
                value={formData.description}
                onChange={(event) => setFormData({ ...formData, description: event.target.value })}
              />
            </div>
            <div className="flex gap-3">
              <button type="submit" className="button-primary" disabled={saving}>
                {saving ? "Saving..." : submitLabel}
              </button>
              {editingProjectId ? (
                <button
                  type="button"
                  className="button-secondary"
                  onClick={() => {
                    setEditingProjectId("");
                    setFormData(emptyForm);
                  }}
                >
                  Cancel
                </button>
              ) : null}
            </div>
          </form>
        </section>
      ) : null}
      <section className="grid gap-5 lg:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard
            key={project._id}
            project={project}
            isAdmin={isAdmin}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        ))}
      </section>
    </AppShell>
  );
};

export default ProjectsPage;
