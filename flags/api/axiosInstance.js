// api/axiosInstance.js
// ─────────────────────────────────────────────
// Base axios instance — no auth headers, no interceptors.
// Used for public endpoints only (org profile, public pages).

import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 10000,
    headers: { "Content-Type": "application/json" },
});

export default axiosInstance;