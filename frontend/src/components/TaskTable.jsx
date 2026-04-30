const statusStyles = {
  Todo: "bg-slate-100 text-slate-700",
  "In Progress": "bg-amber-100 text-amber-700",
  Done: "bg-emerald-100 text-emerald-700",
};

const priorityStyles = {
  Low: "bg-sky-100 text-sky-700",
  Medium: "bg-orange-100 text-orange-700",
  High: "bg-rose-100 text-rose-700",
};

const TaskTable = ({ tasks, isAdmin, onStatusChange, onDelete }) => {
  if (!tasks.length) {
    return <div className="panel p-6 text-sm text-slate-500">No tasks found.</div>;
  }

  return (
    <div className="panel overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-5 py-4 text-left font-semibold">Task</th>
              <th className="px-5 py-4 text-left font-semibold">Assignee</th>
              <th className="px-5 py-4 text-left font-semibold">Status</th>
              <th className="px-5 py-4 text-left font-semibold">Priority</th>
              <th className="px-5 py-4 text-left font-semibold">Due Date</th>
              <th className="px-5 py-4 text-left font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tasks.map((task) => (
              <tr key={task._id}>
                <td className="px-5 py-4">
                  <div className="font-semibold text-ink">{task.title}</div>
                  <div className="mt-1 text-slate-500">{task.description}</div>
                </td>
                <td className="px-5 py-4">{task.assignedTo?.name}</td>
                <td className="px-5 py-4">
                  <select
                    value={task.status}
                    onChange={(event) => onStatusChange(task, event.target.value)}
                    className={`rounded-full px-3 py-2 ${statusStyles[task.status] || "bg-slate-100 text-slate-700"}`}
                  >
                    <option value="Todo">Todo</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                  </select>
                </td>
                <td className="px-5 py-4">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${priorityStyles[task.priority]}`}>
                    {task.priority}
                  </span>
                </td>
                <td className="px-5 py-4">{new Date(task.dueDate).toLocaleDateString()}</td>
                <td className="px-5 py-4">
                  {isAdmin ? (
                    <button type="button" onClick={() => onDelete(task._id)} className="rounded-full bg-red-500 px-4 py-2 text-xs font-semibold text-white">
                      Delete
                    </button>
                  ) : (
                    <span className="text-slate-400">Status only</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskTable;
