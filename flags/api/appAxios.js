// api/appAxios.js
// ─────────────────────────────────────────────
// Axios instance for all /api/* (general + admin user) requests.
//
// Token strategy:
//   - Access token: stored in memory (tokenStore below), never in localStorage.
//     Injected into every request via request interceptor.
//   - Refresh token: HttpOnly cookie set by Django — JS never reads it directly.
//     On 401, this interceptor calls /api/auth/refresh/ automatically,
//     updates the in-memory token, and retries the original request.
//
// Silent refresh on page load:
//   The /app/* route loader calls attemptSilentRefresh() before rendering.
//   This restores the access token from the cookie on page refresh.
//   Public routes never call this — zero overhead on the landing page.

import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ─────────────────────────────────────────────
// In-memory token store
// Lives outside React — survives context re-renders, lost on tab close.
// ─────────────────────────────────────────────

let _accessToken = null;

export const tokenStore = {
    get: () => _accessToken,
    set: (token) => { _accessToken = token; },
    clear: () => { _accessToken = null; },
};

// ─────────────────────────────────────────────
// Silent refresh — called by route loaders on /app/* entry
// ─────────────────────────────────────────────

let _refreshPromise = null; // deduplicate concurrent refresh calls

export async function attemptSilentRefresh() {
    // If a refresh is already in flight, wait for it
    if (_refreshPromise) return _refreshPromise;

    _refreshPromise = axios
        .post(
            `${BASE_URL}/api/auth/refresh/`,
            {},
            { withCredentials: true } // sends the HttpOnly refresh cookie
        )
        .then((res) => {
            tokenStore.set(res.data.data.access_token);
            return { success: true, user: res.data.data.user };
        })
        .catch(() => {
            tokenStore.clear();
            return { success: false };
        })
        .finally(() => {
            _refreshPromise = null;
        });

    return _refreshPromise;
}

// ─────────────────────────────────────────────
// Axios instance
// ─────────────────────────────────────────────

const appAxios = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    withCredentials: true, // always send cookies (needed for refresh token)
    headers: { "Content-Type": "application/json" },
});

// ── Request interceptor — inject access token ─────────────────────────────
appAxios.interceptors.request.use(
    (config) => {
        const token = tokenStore.get();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ── Response interceptor — silent refresh on 401 ──────────────────────────
let _isRefreshing = false;
let _failedQueue = []; // requests that arrived during a refresh

function processQueue(error, token = null) {
    _failedQueue.forEach((prom) => {
        if (error) prom.reject(error);
        else prom.resolve(token);
    });
    _failedQueue = [];
}

appAxios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Only intercept 401s that haven't already been retried
        if (error.response?.status !== 401 || originalRequest._retry) {
            return Promise.reject(error);
        }

        if (_isRefreshing) {
            // Queue this request until refresh completes
            return new Promise((resolve, reject) => {
                _failedQueue.push({ resolve, reject });
            })
                .then((token) => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return appAxios(originalRequest);
                })
                .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        _isRefreshing = true;

        try {
            const result = await attemptSilentRefresh();

            if (!result.success) {
                processQueue(new Error("Refresh failed"), null);
                tokenStore.clear();
                // Redirect to login — let the router handle it
                window.location.href = "/login";
                return Promise.reject(error);
            }

            const newToken = tokenStore.get();
            processQueue(null, newToken);
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return appAxios(originalRequest);
        } catch (refreshError) {
            processQueue(refreshError, null);
            return Promise.reject(refreshError);
        } finally {
            _isRefreshing = false;
        }
    }
);

export default appAxios;