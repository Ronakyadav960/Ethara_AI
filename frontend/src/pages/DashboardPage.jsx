import { useEffect, useState } from "react";
import AppShell from "../components/AppShell";
import StatsCard from "../components/StatsCard";
import { getDashboardStats } from "../services/dashboardService";
import { getTasks } from "../services/taskService";

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    overdueTasks: 0,
  });
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [statsData, taskData] = await Promise.all([getDashboardStats(), getTasks()]);
        setStats(statsData);
        setTasks(taskData.slice(0, 6));
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load dashboard");
      }
    };

    loadDashboard();
  }, []);

  return (
    <AppShell
      title="Delivery at a glance"
      subtitle="Track completion, pending work, and overdue tasks from one dashboard."
    >
      {error ? <div className="panel p-4 text-sm text-red-600">{error}</div> : null}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard label="Total Tasks" value={stats.totalTasks} accent="bg-slate-100 text-slate-700" />
        <StatsCard label="Completed" value={stats.completedTasks} accent="bg-emerald-100 text-emerald-700" />
        <StatsCard label="Pending" value={stats.pendingTasks} accent="bg-amber-100 text-amber-700" />
        <StatsCard label="Overdue" value={stats.overdueTasks} accent="bg-rose-100 text-rose-700" />
      </section>
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="panel p-6">
          <h2 className="font-display text-3xl text-ink">Recent tasks</h2>
          <div className="mt-5 space-y-4">
            {tasks.length ? (
              tasks.map((task) => (
                <div key={task._id} className="rounded-3xl bg-sand p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-semibold text-ink">{task.title}</div>
                    <div className="text-xs text-slate-500">{new Date(task.dueDate).toLocaleDateString()}</div>
                  </div>
                  <div className="mt-2 text-sm text-slate-600">{task.projectId?.title}</div>
                  <div className="mt-1 text-sm text-slate-500">Assigned to {task.assignedTo?.name}</div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No recent tasks available.</p>
            )}
          </div>
        </div>
        <div className="panel p-6">
          <h2 className="font-display text-3xl text-ink">Status guide</h2>
          <div className="mt-5 space-y-4 text-sm text-slate-600">
            <div className="rounded-3xl border border-slate-100 p-4">
              <div className="font-semibold text-ink">Todo</div>
              <p className="mt-2">Work that has been created but not yet started.</p>
            </div>
            <div className="rounded-3xl border border-slate-100 p-4">
              <div className="font-semibold text-ink">In Progress</div>
              <p className="mt-2">Work currently owned and actively moving.</p>
            </div>
            <div className="rounded-3xl border border-slate-100 p-4">
              <div className="font-semibold text-ink">Done</div>
              <p className="mt-2">Work completed and ready for review or closure.</p>
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
};

export default DashboardPage;
