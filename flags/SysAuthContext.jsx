// context/SysAuthContext.jsx
// ─────────────────────────────────────────────
// Auth context for system admin users.
// Session-based (Django session cookie + CSRF).
//
// Provides:
//   sysAdmin      — { id, email, fullName, orgSlug, orgName }
//   isLoading     — true while session is being validated
//   isAuthenticated — derived: !!sysAdmin
//   login()       — called after OTP verify step 2 succeeds
//   logout()      — calls API + clears local state
//
// NO permissions or feature flags here — sys admin has full access to the
// sys dashboard by definition. Permission granularity is not needed.
//
// This context is ONLY mounted inside /sys/* routes (except /sys/login).
// Never mounted on public routes or /app/* routes.

import {
    createContext,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import sysAxios from "../api/sysAxios";

export const SysAuthContext = createContext(null);

export function SysAuthProvider({ children, initialAdmin }) {
    // initialAdmin is resolved by the /sys root loader before this mounts.
    // Shape: { id, email, fullName, orgSlug, orgName } | null

    const [sysAdmin, setSysAdmin] = useState(initialAdmin ?? null);
    const [isLoading, setIsLoading] = useState(!initialAdmin);

    // ── On mount — fallback validation if no initialAdmin ───────────────────
    // Normally the loader handles this. This is a safety net.
    useEffect(() => {
        if (initialAdmin) {
            setIsLoading(false);
            return;
        }

        sysAxios
            .get("/sys/auth/me/")
            .then((res) => setSysAdmin(res.data.data.user))
            .catch(() => setSysAdmin(null))
            .finally(() => setIsLoading(false));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // ── Login — called after successful OTP verification ─────────────────────
    const login = useCallback((adminData) => {
        setSysAdmin(adminData);
    }, []);

    // ── Logout ────────────────────────────────────────────────────────────────
    const logout = useCallback(async () => {
        try {
            await sysAxios.post("/sys/auth/logout/");
        } catch {
            // swallow — clear state regardless
        } finally {
            setSysAdmin(null);
            window.location.href = "/sys/login";
        }
    }, []);

    // ── Context value ─────────────────────────────────────────────────────────
    const value = useMemo(
        () => ({
            sysAdmin,
            isLoading,
            isAuthenticated: !!sysAdmin,
            login,
            logout,
        }),
        [sysAdmin, isLoading, login, logout]
    );

    return (
        <SysAuthContext.Provider value={value}>{children}</SysAuthContext.Provider>
    );
}