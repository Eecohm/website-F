import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";

export default function AdminRoute({ children }) {
  const { authStep, loading, initialized, tryRestoreSession } = useAdminAuth();
  const location = useLocation();

  useEffect(() => {
    tryRestoreSession();
  }, [tryRestoreSession]);

  // Fix: Removed `|| loading` from the guard.
  // `loading` is set to true during form submissions (like login/OTP).
  // Blocking render on `loading` causes the entire page to unmount and flash blank mid-flow.
  if (!initialized) return null;

  if (authStep !== "authed") {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}