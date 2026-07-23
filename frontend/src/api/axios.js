import axios from "axios";

// In production (Vercel), no VITE_API_URL means we use the built-in proxy
// (relative /api/... paths, rewritten to the Render backend via vercel.json).
// In local development, fall back to localhost if VITE_API_URL isn't set.
const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? "" : "http://localhost:5000");

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export { API_URL };
export default api;