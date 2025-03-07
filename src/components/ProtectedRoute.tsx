import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { JSX } from "react";

interface ProtectedRouteProps {
  children: JSX.Element;
  requiredRoles?: string[]; // Change requiredRole to requiredRoles (array)
}

const ProtectedRoute = ({ children, requiredRoles }: ProtectedRouteProps) => {
  const { user, hasRole } = useAuthStore();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If requiredRoles is provided, check if the user has permission
  if (requiredRoles && !hasRole(requiredRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
