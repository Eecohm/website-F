// context/AuthContext.jsx
// ─────────────────────────────────────────────
// Auth context for general users (students, teachers, admin users).
// JWT-based. Access token in memory. Refresh token in HttpOnly cookie.
//
// Provides:
//   user          — { id, email, fullName, orgSlug, orgName }
//   role          — { id, name, isAdminRole }
//   permissions   — Set of "module:action" strings e.g. "gradebook:edit"
//   featureFlags  — Set of enabled flag keys e.g. "beta_gradebook"
//   isLoading     — true while auth state is being resolved
//   isAuthenticated — derived: !!user
//   login()       — called after successful OTP verify
//   logout()      — clears token + calls API
//   hasPermission(module, action) — permission check helper
//   hasFeature(flagKey)           — feature flag check helper
//
// This context is ONLY mounted inside /app/* routes.
// Never mounted on public routes or /sys/* routes.

import {
    createContext,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import appAxios, { attemptSilentRefresh, tokenStore } from "../api/appAxios";

export const AuthContext = createContext(null);

export function AuthProvider({ children, initialAuth }) {
    // initialAuth is resolved by the /app root loader before this mounts.
    // Shape: { user, role, permissions, featureFlags } | null

    const [user, setUser] = useState(initialAuth?.user ?? null);
    const [role, setRole] = useState(initialAuth?.role ?? null);
    const [permissions, setPermissions] = useState(() => buildPermissionSet(initialAuth?.permissions));
    const [featureFlags, setFeatureFlags] = useState(() => new Set(initialAuth?.featureFlags ?? []));
    const [isLoading, setIsLoading] = useState(!initialAuth);

    // Refresh interval — silently refresh access token before it expires.
    // Access tokens live 15 min — we refresh every 13 min to stay ahead.
    const refreshInterval = useRef(null);

    const clearAuth = useCallback(() => {
        setUser(null);
        setRole(null);
        setPermissions(new Set());
        setFeatureFlags(new Set());
        tokenStore.clear();
        if (refreshInterval.current) clearInterval(refreshInterval.current);
    }, []);

    const hydrateAuth = useCallback((authData) => {
        setUser(authData.user);
        setRole(authData.role);
        setPermissions(buildPermissionSet(authData.permissions));
        setFeatureFlags(new Set(authData.featureFlags ?? []));
    }, []);

    // ── Silent refresh loop ─────────────────────────────────────────────────
    const startRefreshLoop = useCallback(() => {
        if (refreshInterval.current) clearInterval(refreshInterval.current);
        refreshInterval.current = setInterval(async () => {
            const result = await attemptSilentRefresh();
            if (!result.success) {
                clearAuth();
                window.location.href = "/login";
            }
        }, 13 * 60 * 1000); // every 13 minutes
    }, [clearAuth]);

    // ── On mount — resolve auth if no initialAuth (shouldn't happen normally) ─
    useEffect(() => {
        if (initialAuth) {
            setIsLoading(false);
            startRefreshLoop();
            return;
        }

        attemptSilentRefresh().then((result) => {
            if (result.success) {
                hydrateAuth(result.user);
                startRefreshLoop();
            }
            setIsLoading(false);
        });

        return () => {
            if (refreshInterval.current) clearInterval(refreshInterval.current);
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // ── Login — called by login page after OTP verification succeeds ─────────
    const login = useCallback(
        (authData, accessToken) => {
            tokenStore.set(accessToken);
            hydrateAuth(authData);
            startRefreshLoop();
        },
        [hydrateAuth, startRefreshLoop]
    );

    // ── Logout ───────────────────────────────────────────────────────────────
    const logout = useCallback(async () => {
        try {
            await appAxios.post("/api/auth/logout/");
        } catch {
            // swallow — clear client state regardless
        } finally {
            clearAuth();
            window.location.href = "/login";
        }
    }, [clearAuth]);

    // ── Permission helpers ────────────────────────────────────────────────────
    const hasPermission = useCallback(
        (module, action) => permissions.has(`${module}:${action}`),
        [permissions]
    );

    const hasFeature = useCallback(
        (flagKey) => featureFlags.has(flagKey),
        [featureFlags]
    );

    // ── Context value — memoized to prevent unnecessary re-renders ───────────
    const value = useMemo(
        () => ({
            user,
            role,
            permissions,
            featureFlags,
            isLoading,
            isAuthenticated: !!user,
            login,
            logout,
            hasPermission,
            hasFeature,
        }),
        [user, role, permissions, featureFlags, isLoading, login, logout, hasPermission, hasFeature]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function buildPermissionSet(permissions) {
    // permissions from API: [{ module: "gradebook", action: "edit" }, ...]
    // stored as Set of "module:action" strings for O(1) lookup
    if (!permissions?.length) return new Set();
    return new Set(permissions.map((p) => `${p.module}:${p.action}`));
}