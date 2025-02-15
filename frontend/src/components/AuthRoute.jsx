import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

const AuthRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex justify-center items-center bg-opacity-50">
        <div>Loading...</div>
      </div>
    );
  }

  return isAuthenticated ? children : null;
};

export default AuthRoute;
