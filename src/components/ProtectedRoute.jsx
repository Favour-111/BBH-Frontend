import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useAdminAuth } from "../context/AdminAuthContext.jsx";
import PageLoader from "./ui/PageLoader.jsx";

export function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return <Outlet />;
}

export function AdminProtectedRoute({ section }) {
  const { admin, loading, can } = useAdminAuth();
  if (loading) return <PageLoader />;
  if (!admin) return <Navigate to="/admin/login" replace />;
  if (section && !can(section)) return <Navigate to="/admin" replace />;
  return <Outlet />;
}
