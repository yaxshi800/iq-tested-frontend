import axios from "axios";
import i18n from "../i18n";

// Reads VITE_API_URL from environment.
// Falls back to localhost for local dev.
const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  config.headers["Accept-Language"] = i18n.language || "uz";
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API error:", error?.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const startTest = (language = "uz") =>
  api.post("/test/start/", { language }).then((r) => r.data);

export const submitTest = (session_uuid, answers) =>
  api.post("/test/submit/", { session_uuid, answers }).then((r) => r.data);

export const getResults = (uuid) =>
  api.get(`/test/results/${uuid}/`).then((r) => r.data);

export default api;