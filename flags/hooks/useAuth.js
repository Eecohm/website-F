// hooks/useAuth.js
// ─────────────────────────────────────────────
// Hook for consuming AuthContext (general users).
// Must be used inside /app/* routes only.

import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error(
            "useAuth must be used inside an <AuthProvider>. " +
            "Make sure you are inside an /app/* route."
        );
    }
    return context;
}


// hooks/useSysAuth.js
// ─────────────────────────────────────────────
// Hook for consuming SysAuthContext (system admin).
// Must be used inside /sys/* routes only.

import { useContext } from "react";
import { SysAuthContext } from "../context/SysAuthContext";

export function useSysAuth() {
    const context = useContext(SysAuthContext);
    if (!context) {
        throw new Error(
            "useSysAuth must be used inside a <SysAuthProvider>. " +
            "Make sure you are inside a /sys/* route."
        );
    }
    return context;
}