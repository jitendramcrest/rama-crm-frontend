import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const authToken = useSelector((state) => state?.authData?.authToken);
  return authToken ? <Navigate to="/" /> : children;
};

export default PublicRoute;
