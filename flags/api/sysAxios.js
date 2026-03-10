// api/sysAxios.js
// ─────────────────────────────────────────────
// Axios instance for all /sys/* (system admin) requests.
//
// Auth strategy:
//   - Session cookie: set by Django on login, HttpOnly, sent automatically
//     via withCredentials: true. JS never reads the session cookie.
//   - CSRF token: Django sets a readable CSRF cookie (not HttpOnly).
//     We read it and inject it as X-CSRFToken header on every mutating request.
//     Django's session auth REQUIRES this header on POST/PUT/PATCH/DELETE.
//
// On page load for /sys/* routes:
//   The loader calls GET /sys/auth/me/ — if the session cookie is valid,
//   Django returns the current system admin. If not, loader redirects to /sys/login.
//   No token refresh needed — sessions just work until they expire or are revoked.

import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ─────────────────────────────────────────────
// CSRF token reader
// Django sets csrftoken as a readable (non-HttpOnly) cookie.
// ─────────────────────────────────────────────

function getCsrfToken() {
    const name = "csrftoken";
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
}

// ─────────────────────────────────────────────
// Session validation — called by /sys/* loaders
// ─────────────────────────────────────────────

export async function validateSysAdminSession() {
    try {
        const res = await sysAxios.get("/sys/auth/me/");
        return { success: true, user: res.data.data.user };
    } catch {
        return { success: false };
    }
}

// ─────────────────────────────────────────────
// Axios instance
// ─────────────────────────────────────────────

const sysAxios = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    withCredentials: true, // sends session cookie on every request
    headers: { "Content-Type": "application/json" },
});

// ── Request interceptor — inject CSRF token ───────────────────────────────
sysAxios.interceptors.request.use(
    (config) => {
        const mutatingMethods = ["post", "put", "patch", "delete"];
        if (mutatingMethods.includes(config.method?.toLowerCase())) {
            const csrf = getCsrfToken();
            if (csrf) config.headers["X-CSRFToken"] = csrf;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ── Response interceptor — handle session expiry ──────────────────────────
sysAxios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            // Session expired or revoked — redirect to sys login
            window.location.href = "/sys/login";
        }
        return Promise.reject(error);
    }
);

export default sysAxios;