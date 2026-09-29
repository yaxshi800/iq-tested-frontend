import axios from "axios";
import i18n from "../i18n";

const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// Public endpoints — no token required
const PUBLIC_ENDPOINTS = [
  "/auth/register/",
  "/auth/token/",
  "/auth/token/refresh/",
  "/test/start/",
  "/test/submit/",
];

function isPublicEndpoint(url) {
  return PUBLIC_ENDPOINTS.some((e) => url && url.includes(e));
}

// Request interceptor
api.interceptors.request.use(
  function (config) {
    config.headers["Accept-Language"] = i18n.language || "uz";

    if (!isPublicEndpoint(config.url)) {
      const token = localStorage.getItem("access_token");
      if (token) {
        config.headers.Authorization = "Bearer " + token;
      }
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error && error.response && error.response.status === 401) {
      const url = error.config?.url || "";
      if (!isPublicEndpoint(url)) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
      }
    }
    console.error(
      "API error:",
      (error && error.response && error.response.data) || error.message
    );
    return Promise.reject(error);
  }
);

// ─── Auth ───
export const login = function (username, password) {
  return api
    .post("/auth/token/", { username: username, password: password })
    .then((r) => r.data);
};

export const register = function (data) {
  return api.post("/auth/register/", data).then((r) => r.data);
};

export const getMe = function () {
  return api.get("/auth/me/").then((r) => r.data);
};

export const updateProfile = function (data) {
  return api.patch("/auth/profile/", data).then((r) => r.data);
};

// ─── Payment ───
export const processPayment = function (data) {
  return api.post("/auth/payment/", data).then((r) => r.data);
};

export const myPayments = function () {
  return api.get("/auth/payments/").then((r) => r.data);
};

export const planPrices = function () {
  return api.get("/auth/plans/").then((r) => r.data);
};

// ─── Test ───
export const startTest = function (language) {
  return api
    .post("/test/start/", { language: language || "uz" })
    .then((r) => r.data);
};

export const submitTest = function (session_uuid, answers) {
  return api
    .post("/test/submit/", { session_uuid: session_uuid, answers: answers })
    .then((r) => r.data);
};

export const getResults = function (uuid) {
  return api.get("/test/results/" + uuid + "/").then((r) => r.data);
};

export const issueCertificate = function (uuid) {
  return api.post("/test/certificate/" + uuid + "/").then((r) => r.data);
};

export const verifyCertificate = function (certUuid) {
  return api.get("/test/verify/" + certUuid + "/").then((r) => r.data);
};

export default api;