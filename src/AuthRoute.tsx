import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export interface IAuthRouteProps {
  children: React.ReactNode;
}

const AuthRoute: React.FunctionComponent<IAuthRouteProps> = ({ children }) => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
        navigate('/login', { replace: true });
      }
      setLoading(false); // ✅ Only stop loading AFTER Firebase responds
    });
    return () => unsubscribe();
  }, [auth, navigate]);

  // ✅ Show nothing while Firebase is still resolving — prevents flash redirect
  if (loading) return null;

  // ✅ Only render children once confirmed authenticated
  if (!authenticated) return null;

  return <>{children}</>;
};

export default AuthRoute;