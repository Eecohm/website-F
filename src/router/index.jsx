// router/index.jsx
// ─────────────────────────────────────────────
// Root router — single source of truth for all routes.
//
// Route tree:
//   /                     Public home (org landing page)     — no context
//   /login                General user login                 — no context
//   /sys/login            Sys admin login                    — no context
//   /app/*                General dashboard                  — AuthProvider
//   /sys/*                Sys admin dashboard                — SysAuthProvider
//
// Key design decisions:
//   1. Loaders run BEFORE render — auth checks happen at router level.
//   2. Public routes have NO loader — zero API calls on the landing page.
//   3. /app root loader: attempts silent JWT refresh. Redirects to /login on fail.
//   4. /sys root loader: validates session via /sys/auth/me/. Redirects on fail.
//   5. Context providers are injected via the root layout of each section.
//   6. initialAuth passed from loader → provider via useLoaderData() in layout.

import { createBrowserRouter, redirect } from "react-router-dom";
import { attemptSilentRefresh } from "../api/appAxios";
import { validateSysAdminSession } from "../api/sysAxios";

// Layouts
import AppLayout from "./layouts/AppLayout";
import SysLayout from "./layouts/SysLayout";
import PublicLayout from "./layouts/PublicLayout";

// Public pages
import HomePage from "../pages/public/HomePage";
import LoginPage from "../pages/public/LoginPage";
import SysLoginPage from "../pages/public/SysLoginPage";

// App dashboard pages
import AppDashboard from "../pages/app/Dashboard";
import AppProfile from "../pages/app/Profile";
import AppSettings from "../pages/app/Settings";

// Sys admin pages
import SysDashboard from "../pages/sys/Dashboard";

// Shared
import NotFoundPage from "../pages/NotFoundPage";


// ─────────────────────────────────────────────
// Loaders
// ─────────────────────────────────────────────

/**
 * /app root loader
 * Attempts silent JWT refresh via HttpOnly cookie.
 * On success → returns auth data → AppLayout passes it to AuthProvider.
 * On failure → redirects to /login.
 */
async function appRootLoader() {
    const result = await attemptSilentRefresh();
    if (!result.success) throw redirect("/login");
    return result; // { user, role, permissions, featureFlags }
}

/**
 * /sys root loader (all /sys/* except /sys/login)
 * Validates Django session cookie via GET /sys/auth/me/.
 * On success → returns admin data → SysLayout passes to SysAuthProvider.
 * On failure → redirects to /sys/login.
 */
async function sysRootLoader() {
    const result = await validateSysAdminSession();
    if (!result.success) throw redirect("/sys/login");
    return result; // { user: { id, email, fullName, orgSlug, orgName } }
}

/**
 * /login loader
 * Redirects already-authenticated users straight to dashboard.
 */
async function loginPageLoader() {
    const result = await attemptSilentRefresh();
    if (result.success) throw redirect("/app/dashboard");
    return null;
}

/**
 * /sys/login loader
 * Redirects already-authenticated sys admins straight to sys dashboard.
 */
async function sysLoginPageLoader() {
    const result = await validateSysAdminSession();
    if (result.success) throw redirect("/sys/dashboard");
    return null;
}


// ─────────────────────────────────────────────
// Router
// ─────────────────────────────────────────────

export const router = createBrowserRouter([

    // ── Public — no context, no auth loader ─────────────────────────────────
    {
        element: <PublicLayout />,
        children: [
            {
                path: "/",
                element: <HomePage />,
                // No loader — fetches org profile via unauthenticated axiosInstance
            },
            {
                path: "/login",
                element: <LoginPage />,
                loader: loginPageLoader,
            },
            {
                path: "/sys/login",
                element: <SysLoginPage />,
                loader: sysLoginPageLoader,
            },
        ],
    },

    // ── General dashboard — AuthProvider via AppLayout ───────────────────────
    {
        path: "/app",
        element: <AppLayout />,    // mounts AuthProvider with loader data
        loader: appRootLoader,     // runs first — redirect or return auth data
        children: [
            { index: true, loader: () => redirect("/app/dashboard") },
            { path: "dashboard", element: <AppDashboard /> },
            { path: "profile", element: <AppProfile /> },
            { path: "settings", element: <AppSettings /> },
        ],
    },

    // ── Sys admin dashboard — SysAuthProvider via SysLayout ──────────────────
    {
        path: "/sys",
        element: <SysLayout />,    // mounts SysAuthProvider with loader data
        loader: sysRootLoader,     // runs first — redirect or return admin data
        children: [
            { index: true, loader: () => redirect("/sys/dashboard") },
            { path: "dashboard", element: <SysDashboard /> },
        ],
    },

    // ── 404 ──────────────────────────────────────────────────────────────────
    { path: "*", element: <NotFoundPage /> },
]);