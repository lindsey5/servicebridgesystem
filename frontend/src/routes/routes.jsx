import { useState, useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";

// Function to fetch the user type
const fetchUserType = async (setUser) => {
  try {
    const response = await fetch('/api/user');
    if (response.ok) {
      const result = await response.json();
      setUser(result.user);
    } else {
      setUser(null);
    }
  } catch (error) {
    setUser(null);
  }
};

export const ClientRoutes = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      await fetchUserType(setUser);
      setLoading(false);
    };
    fetchData();
  }, []);
  if (loading) {
    return null;
  }

  return user === 'Client' ? <Outlet /> : <Navigate to="/" />;
};

export const ProviderRoutes = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      await fetchUserType(setUser);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return null;
  }

  return user === 'Provider' ? <Outlet /> : <Navigate to="/" />;
};

export const PublicRoutes = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      await fetchUserType(setUser);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return null;
  }

  if (user) {
    const navigateTo = user === 'Client' ? "/Client/Home" : "/Provider/Dashboard";
    return <Navigate to={navigateTo} />;
  }

  return <Outlet />;
};
