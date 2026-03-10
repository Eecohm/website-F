// App.jsx
// ─────────────────────────────────────────────
// App shell. RouterProvider only.
// Context providers are injected at the route level — not here.
// This keeps public routes completely free of any auth overhead.

import { RouterProvider } from "react-router-dom";
import { router } from "./router";

export default function App() {
  return <RouterProvider router={router} />;
}