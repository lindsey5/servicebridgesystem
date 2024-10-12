import getUser from "../utils/getUser";
import { Outlet, Navigate } from "react-router-dom";

export const ClientRoutes = () => {
    const { user } = getUser();
    if (user && user === 'Client') {
      return <Outlet />;
    }
  
    return <Navigate to="/" />;
};
  
export const ProviderRoutes = () => {
    const { user } = getUser();
  
    if (user && user === 'Provider') {
      return <Outlet />;
    }
    return <Navigate to="/" />;
  };
  
export const PublicRoutes = () => {
    const { user } = getUser();
    if (user) {
      const navigateTo = user === 'Client' ? "/Client/Home" : "/Provider/Dashboard";
      return <Navigate to={navigateTo} />;
    }
    return <Outlet />;
}
