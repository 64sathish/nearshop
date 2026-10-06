import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("nearshop-token");
  const savedUser = localStorage.getItem("nearshop-user");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const user = savedUser ? JSON.parse(savedUser) : null;

  if (
    allowedRoles &&
    user &&
    !allowedRoles.includes(user.role)
  ) {
    return <Navigate to="/" replace />;
  }

  return children;
}



export default ProtectedRoute;