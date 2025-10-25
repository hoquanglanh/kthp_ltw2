import axios from "axios";
import { getToken } from "../utils/authUtils";

const baseURL =
  window.location.hostname === "localhost"
    ? "http://localhost:8081/api"
    : "http://cafe_backend:8081/api";

const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
