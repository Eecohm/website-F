import { PrivateRoute, SetupRoute } from "@/router/guards/PrivateRoutes";
import Dashboard from "@/pages/Webapp/dashboard/dashboard";
import ProfileSetup from "@/pages/Webapp/dashboard/ProfileSetup";
import UserProfile from "@/pages/Webapp/profile/UserProfile";

import StatusPage from "@/features/setup/StatusPage";

export const privateRoutes = [
  // Zone C — Full Dashboard Access
  { path: "/app/dashboard", element: <PrivateRoute><Dashboard /></PrivateRoute> },
  { path: "/app/profile", element: <PrivateRoute><UserProfile /></PrivateRoute> },

  // Zone B — Authenticated but restricted
  { path: "/app/profile/setup", element: <SetupRoute><ProfileSetup /></SetupRoute> },
  { path: "/setup/status", element: <SetupRoute><StatusPage /></SetupRoute> },
];