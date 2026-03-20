import { createContext, useContext, useState, useCallback } from "react";
import adminApi from "@/services/axios/adminApi";

const AdminAuthContext = createContext(null);

/**
 * AdminAuthProvider — system admin authentication context.
 *
 * LAZY INITIALIZATION: No API calls on mount. The provider starts in an
 * un-initialized state. Session restoration happens only when:
 *   1. A route guard calls `tryRestoreSession()`, or
 *   2. The admin logs in via `submitCredentials()` + `submitOtp()`.
 */
export function AdminAuthProvider({ children }) {
    const [admin, setAdmin] = useState(null);
    const [authStep, setAuthStep] = useState("idle");
    const [loading, setLoading] = useState(false);
    const [initialized, setInitialized] = useState(false);
    const [error, setError] = useState(null);
    const [adminEmail, setAdminEmail] = useState("");

    /**
     * Attempt to restore an existing admin session.
     * Call from route guards when loading admin routes.
     */
    const tryRestoreSession = useCallback(async () => {
        if (initialized) return;
        setLoading(true);
        try {
            const res = await adminApi.get("/sys/auth/me/", { _silent: true });
            setAdmin(res.data);
            setAuthStep("authed");
            setInitialized(true);
        } catch {
            setAdmin(null);
            setAuthStep("idle");
            setInitialized(true);
        } finally {
            setLoading(false);
        }
    }, [initialized]);

    async function submitCredentials(email, password) {
        setError(null);
        setLoading(true);
        setAdminEmail(email); // Capture email for the next step
        try {
            await adminApi.post("/sys/auth/login/", { email, password });
            setAuthStep("otp_pending");
        } catch (err) {
            let msg = "An error occurred during login";
            if (!err.response) {
                msg = "Network error: Unable to connect to the server. Please check your internet connection.";
            } else if (err.response.status === 401 || err.response.status === 400) {
                msg = err.response.data?.message || err.response.data?.detail || "Invalid admin credentials";
            } else {
                msg = err.response.data?.message || err.response.data?.detail || "Server error. Please try again later.";
            }
            setError(msg);
            throw err;
        } finally {
            setLoading(false);
        }
    }

    async function submitOtp(otp) {
        setError(null);
        setLoading(true);
        try {
            // Backend requires both email and otp
            const res = await adminApi.post("/sys/auth/verify-otp/", {
                email: adminEmail,
                otp
            });
            setAdmin(res.data.user);
            setAuthStep("authed");
            setInitialized(true);
        } catch (err) {
            let msg = "OTP verification failed";
            if (!err.response) {
                msg = "Network error: Unable to reach the server.";
            } else if (err.response.status === 401 || err.response.status === 400) {
                msg = err.response.data?.message || err.response.data?.detail || "Invalid or expired OTP";
            } else {
                msg = err.response.data?.message || err.response.data?.detail || "Server error during verification.";
            }
            setError(msg);
            throw err;
        } finally {
            setLoading(false);
        }
    }

    async function adminLogout() {
        try {
            await adminApi.post("/sys/auth/logout/");
        } finally {
            setAdmin(null);
            setAuthStep("idle");
            setError(null);
        }
    }

    function resetFlow() {
        setAuthStep("idle");
        setError(null);
    }

    return (
        <AdminAuthContext.Provider value={{
            admin,
            authStep,
            loading,
            initialized,
            error,
            submitCredentials,
            submitOtp,
            adminLogout,
            resetFlow,
            tryRestoreSession,
        }}>
            {children}
        </AdminAuthContext.Provider>
    );
}

export function useAdminAuth() {
    const ctx = useContext(AdminAuthContext);
    if (!ctx) throw new Error("useAdminAuth must be used inside AdminAuthProvider");
    return ctx;
}