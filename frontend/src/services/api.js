import axios from "axios";

const configuredBaseUrl = import.meta.env.VITE_API_URL?.trim();
const defaultBaseUrl = import.meta.env.DEV ? "http://localhost:5000/api" : "";

const api = axios.create({
  baseURL: configuredBaseUrl || defaultBaseUrl,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("pm_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else if (config.headers?.Authorization) {
    delete config.headers.Authorization;
  }

  return config;
});

export default api;
