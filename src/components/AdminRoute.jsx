import { Navigate, Outlet } from "react-router-dom";

export default function AdminRoute() {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  if (!user || user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
