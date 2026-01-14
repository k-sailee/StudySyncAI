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

// Request/response logging for debugging (will only log in dev by default)
axios.interceptors.request.use((config) => {
	try {
		const method = (config.method || "GET").toUpperCase();
		const url = (config.baseURL || "") + (config.url || "");
		console.debug(`[API REQUEST] ${method} ${url}`);
	} catch (e) {}
	return config;
});

axios.interceptors.response.use(
	(res) => {
		try {
			const method = (res.config.method || "GET").toUpperCase();
			const url = (res.config.baseURL || "") + (res.config.url || "");
			console.debug(`[API RESPONSE] ${method} ${url} -> ${res.status}`);
		} catch (e) {}
		return res;
	},
	(err) => {
		try {
			const cfg = err.config || {};
			const method = (cfg.method || "GET").toUpperCase();
			const url = (cfg.baseURL || "") + (cfg.url || "");
			console.error(`[API ERROR] ${method} ${url} -> ${err.message}`);
		} catch (e) {}
		return Promise.reject(err);
	}
);