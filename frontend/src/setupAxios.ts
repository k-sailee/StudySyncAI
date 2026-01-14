import axios from "axios";

// Use provided API base in production; fallback to same-origin `/api` for previews/dev proxy
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL ?? "/api";

axios.defaults.withCredentials = true;