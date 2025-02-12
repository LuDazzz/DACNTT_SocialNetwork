// src/components/PublicRoute.js
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return children;
};

export default PublicRoute;
