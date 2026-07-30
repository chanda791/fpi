import { Navigate, useLocation } from "react-router-dom";
import { ReactNode } from "react";
import { isAuthenticated } from "../../services/auth";

interface Props {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: Props) => {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
