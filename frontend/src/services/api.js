import axios from "axios";

const defaultBaseUrl = import.meta.env.DEV
  ? "http://localhost:5000/api"
  : "https://etharaai-production-abd9.up.railway.app/api";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || defaultBaseUrl,
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
