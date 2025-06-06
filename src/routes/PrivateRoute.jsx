import { Navigate, useNavigate, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import authService from "@services/auth";
import { logout } from "@redux/reducers/authDataSlice";

const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authToken = useSelector((state) => state?.authData?.authToken);

  const checkAuth = async () => {
    if (!authToken) {
      dispatch(logout());
      navigate("/login");
      return;
    }

    try {
      const authRes = await authService.checkAuth();
      if (!authRes?.success) {
        dispatch(logout());
        navigate("/login");
      }
    } catch (error) {
      dispatch(logout());
      navigate("/login");
    }
  };

  useEffect(() => {
    checkAuth();

    const handleStorageChange = (event) => {
      if (event.key === "persist:authData") {
        const newValue = JSON.parse(event.newValue || "{}");
        const token = newValue.authToken ? JSON.parse(newValue.authToken) : null;

        if (!token) {
          dispatch(logout());
          navigate("/login");
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
    // eslint-disable-next-line
  }, []);

  if (!authToken) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
