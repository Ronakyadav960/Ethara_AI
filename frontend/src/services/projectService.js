import api from "./api";

export const getProjects = async () => {
  const { data } = await api.get("/projects");
  return data.projects;
};

export const getProjectById = async (projectId) => {
  const { data } = await api.get(`/projects/${projectId}`);
  return data.project;
};

export const createProject = async (payload) => {
  const { data } = await api.post("/projects", payload);
  return data.project;
};

export const updateProject = async (projectId, payload) => {
  const { data } = await api.put(`/projects/${projectId}`, payload);
  return data.project;
};

export const deleteProject = async (projectId) => {
  const { data } = await api.delete(`/projects/${projectId}`);
  return data;
};

export const addMembers = async (projectId, memberIds) => {
  const { data } = await api.post(`/projects/${projectId}/members`, { memberIds });
  return data.project;
};

export const removeMember = async (projectId, memberId) => {
  const { data } = await api.delete(`/projects/${projectId}/members/${memberId}`);
  return data.project;
};
