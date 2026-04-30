import api from "./api";

export const getTasks = async (params = {}) => {
  const { data } = await api.get("/tasks", { params });
  return data.tasks;
};

export const createTask = async (payload) => {
  const { data } = await api.post("/tasks", payload);
  return data.task;
};

export const updateTask = async (taskId, payload) => {
  const { data } = await api.put(`/tasks/${taskId}`, payload);
  return data.task;
};

export const deleteTask = async (taskId) => {
  const { data } = await api.delete(`/tasks/${taskId}`);
  return data;
};
