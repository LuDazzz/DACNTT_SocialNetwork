import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useSelector(
    (state) => state.auth
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated && user !== "admin@gmail.com") {
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, navigate, user]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return user && user === "admin@gmail.com" ? children : null;
};

export default AdminRoute;
