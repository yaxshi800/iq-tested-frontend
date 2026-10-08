import axios from "axios";
import i18n from "../i18n";

const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

const PUBLIC_ENDPOINTS = [
  "/auth/register/",
  "/auth/token/",
  "/auth/token/refresh/",
  "/test/start/",
  "/test/submit/",
  "/test/categories/",
  "/test/images/start/",
  "/test/images/submit/",
];

function isPublicEndpoint(url) {
  if (!url) return false;
  for (var i = 0; i < PUBLIC_ENDPOINTS.length; i++) {
    if (url.indexOf(PUBLIC_ENDPOINTS[i]) !== -1) return true;
  }
  return false;
}

api.interceptors.request.use(
  function (config) {
    config.headers["Accept-Language"] = i18n.language || "uz";
    if (!isPublicEndpoint(config.url)) {
      var token = localStorage.getItem("access_token");
      if (token) config.headers.Authorization = "Bearer " + token;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error && error.response && error.response.status === 401) {
      var url = (error.config && error.config.url) || "";
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
    .then(function (r) { return r.data; });
};

export const register = function (data) {
  return api.post("/auth/register/", data).then(function (r) { return r.data; });
};

export const getMe = function () {
  return api.get("/auth/me/").then(function (r) { return r.data; });
};

export const updateProfile = function (data) {
  return api.patch("/auth/profile/", data).then(function (r) { return r.data; });
};

// ─── Payment ───
export const processPayment = function (data) {
  return api.post("/auth/payment/", data).then(function (r) { return r.data; });
};

export const myPayments = function () {
  return api.get("/auth/payments/").then(function (r) { return r.data; });
};

export const planPrices = function () {
  return api.get("/auth/plans/").then(function (r) { return r.data; });
};

// ─── Test ───
export const getCategories = function () {
  return api.get("/test/categories/").then(function (r) { return r.data; });
};

export const startTest = function (category, language) {
  return api
    .post("/test/start/", {
      category: category || "iq",
      language: language || "uz",
    })
    .then(function (r) { return r.data; });
};

export const submitTest = function (session_uuid, answers) {
  return api
    .post("/test/submit/", { session_uuid: session_uuid, answers: answers })
    .then(function (r) { return r.data; });
};

export const getResults = function (uuid) {
  return api.get("/test/results/" + uuid + "/").then(function (r) { return r.data; });
};

// ─── Image Test (bolalar uchun) ───
export const startImageTest = function () {
  return api.post("/test/images/start/").then(function (r) { return r.data; });
};

export const submitImageTest = function (answers) {
  return api
    .post("/test/images/submit/", { answers: answers })
    .then(function (r) { return r.data; });
};

export default api;