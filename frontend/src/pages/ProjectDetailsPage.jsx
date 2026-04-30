import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AppShell from "../components/AppShell";
import TaskTable from "../components/TaskTable";
import { useAuth } from "../context/AuthContext";
import {
  addMembers,
  getProjectById,
  removeMember,
} from "../services/projectService";
import { createTask, deleteTask, getTasks, updateTask } from "../services/taskService";
import { getUsers } from "../services/userService";

const initialTaskForm = {
  title: "",
  description: "",
  assignedTo: "",
  status: "Todo",
  priority: "Medium",
  dueDate: "",
};

const ProjectDetailsPage = () => {
  const { projectId } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [taskForm, setTaskForm] = useState(initialTaskForm);
  const [error, setError] = useState("");

  const isAdmin = user?.role === "Admin";

  const loadProjectData = async () => {
    try {
      const [projectData, taskData] = await Promise.all([
        getProjectById(projectId),
        getTasks({ projectId }),
      ]);
      setProject(projectData);
      setTasks(taskData);

      if (isAdmin) {
        const allUsers = await getUsers();
        setUsers(allUsers);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load project");
    }
  };

  useEffect(() => {
    loadProjectData();
  }, [projectId]);

  const handleAddMember = async (event) => {
    event.preventDefault();
    if (!selectedMemberId) return;

    try {
      await addMembers(projectId, [selectedMemberId]);
      setSelectedMemberId("");
      await loadProjectData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add member");
    }
  };


  const handleRemoveMember = async (memberId) => {
    try {
      await removeMember(projectId, memberId);
      await loadProjectData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to remove member");
    }
  };

  const handleTaskCreate = async (event) => {
    event.preventDefault();
    try {
      await createTask({ ...taskForm, projectId });
      setTaskForm(initialTaskForm);
      await loadProjectData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create task");
    }
  };

  const handleTaskStatusChange = async (task, status) => {
    try {
      await updateTask(task._id, isAdmin ? { ...task, status, projectId } : { status });
      await loadProjectData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update task");
    }
  };

  const handleTaskDelete = async (taskId) => {
    try {
      await deleteTask(taskId);
      await loadProjectData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete task");
    }
  };

  const availableUsers = users.filter(
    (candidate) => !project?.members?.some((member) => member._id === candidate._id)
  );

  return (
    <AppShell
      title={project?.title || "Project details"}
      subtitle={project?.description || "View members, assignments, and task progress."}
    >
      {error ? <div className="panel p-4 text-sm text-red-600">{error}</div> : null}
      {project ? (
        <>
          <section className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="panel p-6">
              <h2 className="font-display text-3xl text-ink">Team members</h2>
              <div className="mt-5 space-y-3">
                {project.members?.map((member) => (
                  <div key={member._id} className="flex items-center justify-between rounded-2xl bg-sand px-4 py-3">
                    <div>
                      <div className="font-semibold text-ink">{member.name}</div>
                      <div className="text-sm text-slate-500">{member.email}</div>
                    </div>
                    {isAdmin && project.createdBy?._id !== member._id ? (
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(member._id)}
                        className="rounded-full bg-red-500 px-3 py-2 text-xs font-semibold text-white"
                      >
                        Remove
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400">{member.role}</span>
                    )}
                  </div>
                ))}
              </div>
              {isAdmin ? (
                <form onSubmit={handleAddMember} className="mt-5 space-y-3">
                  <select
                    className="input"
                    value={selectedMemberId}
                    onChange={(event) => setSelectedMemberId(event.target.value)}
                  >
                    <option value="">Select a user to add</option>
                    {availableUsers.map((candidate) => (
                      <option key={candidate._id} value={candidate._id}>
                        {candidate.name} ({candidate.role})
                      </option>
                    ))}
                  </select>
                  <button type="submit" className="button-primary w-full">
                    Add member
                  </button>
                </form>
              ) : null}
            </div>
            <div className="panel p-6">
              <h2 className="font-display text-3xl text-ink">Task management</h2>
              {isAdmin ? (
                <form onSubmit={handleTaskCreate} className="mt-5 grid gap-4 md:grid-cols-2">
                  <input
                    type="text"
                    placeholder="Task title"
                    className="input"
                    value={taskForm.title}
                    onChange={(event) => setTaskForm({ ...taskForm, title: event.target.value })}
                  />
                  <input
                    type="date"
                    className="input"
                    value={taskForm.dueDate}
                    onChange={(event) => setTaskForm({ ...taskForm, dueDate: event.target.value })}
                  />
                  <textarea
                    placeholder="Task description"
                    className="input md:col-span-2 min-h-28"
                    value={taskForm.description}
                    onChange={(event) => setTaskForm({ ...taskForm, description: event.target.value })}
                  />
                  <select
                    className="input"
                    value={taskForm.assignedTo}
                    onChange={(event) => setTaskForm({ ...taskForm, assignedTo: event.target.value })}
                  >
                    <option value="">Assign to member</option>
                    {project.members?.map((member) => (
                      <option key={member._id} value={member._id}>
                        {member.name}
                      </option>
                    ))}
                  </select>
                  <select
                    className="input"
                    value={taskForm.priority}
                    onChange={(event) => setTaskForm({ ...taskForm, priority: event.target.value })}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                  <button type="submit" className="button-primary md:col-span-2">
                    Create task
                  </button>
                </form>
              ) : (
                <p className="mt-4 text-sm text-slate-500">Members can update status only on their assigned tasks.</p>
              )}
            </div>
          </section>
          <TaskTable
            tasks={tasks}
            isAdmin={isAdmin}
            onStatusChange={handleTaskStatusChange}
            onDelete={handleTaskDelete}
          />
        </>
      ) : (
        <div className="panel p-6 text-sm text-slate-500">Loading project...</div>
      )}
    </AppShell>
  );
};

export default ProjectDetailsPage;
