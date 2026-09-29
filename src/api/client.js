import axios from "axios";
import i18n from "../i18n";

const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor
api.interceptors.request.use(
  function (config) {
    config.headers["Accept-Language"] = i18n.language || "uz";
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = "Bearer " + token;
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
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
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
    .then(function (r) {
      return r.data;
    });
};

export const register = function (data) {
  return api.post("/auth/register/", data).then(function (r) {
    return r.data;
  });
};

export const getMe = function () {
  return api.get("/auth/me/").then(function (r) {
    return r.data;
  });
};

export const updateProfile = function (data) {
  return api.patch("/auth/profile/", data).then(function (r) {
    return r.data;
  });
};

// ─── To‘lov ───
export const processPayment = function (data) {
  return api.post("/auth/payment/", data).then(function (r) {
    return r.data;
  });
};

export const myPayments = function () {
  return api.get("/auth/payments/").then(function (r) {
    return r.data;
  });
};

export const planPrices = function () {
  return api.get("/auth/plans/").then(function (r) {
    return r.data;
  });
};

// ─── Test ───
export const startTest = function (language) {
  return api
    .post("/test/start/", { language: language || "uz" })
    .then(function (r) {
      return r.data;
    });
};

export const submitTest = function (session_uuid, answers) {
  return api
    .post("/test/submit/", { session_uuid: session_uuid, answers: answers })
    .then(function (r) {
      return r.data;
    });
};

export const getResults = function (uuid) {
  return api.get("/test/results/" + uuid + "/").then(function (r) {
    return r.data;
  });
};

export const issueCertificate = function (uuid) {
  return api.post("/test/certificate/" + uuid + "/").then(function (r) {
    return r.data;
  });
};

export const verifyCertificate = function (certUuid) {
  return api.get("/test/verify/" + certUuid + "/").then(function (r) {
    return r.data;
  });
};

export default api;