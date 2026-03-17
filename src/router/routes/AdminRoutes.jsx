import AdminRoute from "@/router/guards/AdminRoutes";
import { AdminLayout } from "@/components/layout/AdminLayout/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import OrgProfile from "@/pages/admin/sections/OrgProfile";
import UserApprovals from "@/pages/admin/sections/UserApprovals";
import SystemLogs from "@/pages/admin/sections/SystemLogs";

import OrgProfileSetup from "@/pages/admin/sections/OrgProfileSetup";

export const adminRoutes = [
  {
    path: "/app/admin",
    element: <AdminRoute><AdminLayout /></AdminRoute>,
    children: [
      { path: "dashboard", element: <AdminDashboard /> },
      { path: "profile", element: <OrgProfile /> },
      { path: "profile/setup", element: <OrgProfileSetup /> },
      { path: "approvals", element: <UserApprovals /> },
      { path: "logs", element: <SystemLogs /> },
    ]
  },
];