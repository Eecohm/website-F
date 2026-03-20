import axios from "axios";
import { defaultConfig } from "./config";
import { getCsrfToken } from "./crsfHelper";
import publicApi from "./publicApi";

const authApi = axios.create(defaultConfig);

authApi.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    const unsafeMethods = ["post", "put", "patch", "delete"];
    if (unsafeMethods.includes(config.method)) {
        config.headers["X-CSRFToken"] = getCsrfToken();
    }
    return config;
});

let isRefreshing = false;

authApi.interceptors.response.use(
    (response) => response,
    async (error) => {
        const status = error.response?.status;
        const originalRequest = error.config;

        // 403 = authenticated but not authorized (pending/suspended/rejected)
        // Do NOT redirect to login. Let the component handle it.
        if (status === 403) {
            return Promise.reject(error);
        }

        // 401 = token expired — try to refresh once
        if (status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            if (isRefreshing) {
                // Another refresh is already in flight — just reject
                return Promise.reject(error);
            }

            isRefreshing = true;
            try {
                const res = await publicApi.post('/auth/refresh/', {}, { withCredentials: true });
                const { access_token } = res.data;
                localStorage.setItem('access_token', access_token);
                
                // Update global and instance defaults
                publicApi.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
                authApi.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
                
                originalRequest.headers['Authorization'] = `Bearer ${access_token}`;
                isRefreshing = false;
                
                return authApi(originalRequest);  // retry the original request
            } catch {
                // Refresh also failed — now we know the session is truly gone
                isRefreshing = false;
                localStorage.removeItem('access_token');
                delete publicApi.defaults.headers.common['Authorization'];
                delete authApi.defaults.headers.common['Authorization'];
                
                // Only redirect if not already on login
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    }
);

export default authApi;