import axios from "axios";

// Normalize VITE_API_BASE_URL so callers always get a sensible `/api` base.
const rawApiBase = String(import.meta.env.VITE_API_BASE_URL ?? "").trim();
const normalizeApiBase = (raw) => {
	if (!raw) return "/api";
	const trimmed = raw.replace(/\/+$/, "");
	if (trimmed.endsWith("/api")) return trimmed;
	// If it's an absolute URL or a leading-path, append /api
	if (trimmed.includes("://") || trimmed.startsWith("/")) return `${trimmed}/api`;
	return trimmed;
};

axios.defaults.baseURL = normalizeApiBase(rawApiBase);

axios.defaults.withCredentials = true;