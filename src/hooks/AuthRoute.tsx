import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, onSnapshot } from 'firebase/firestore';
import { useNavigate, useLocation } from 'react-router-dom';
import ADMIN_UIDS from '../constants/admin';

export interface IAuthRouteProps {
  children: React.ReactNode;
}

const AuthRoute: React.FunctionComponent<IAuthRouteProps> = ({ children }) => {
  const auth = getAuth();
  const db = getFirestore();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setAuthenticated(false);
        setLoading(false);
        navigate('/login', { replace: true });
        return;
      }

      setAuthenticated(true);
      setLoading(false);

      const isAdmin = ADMIN_UIDS.includes(user.uid);
      const isAdminRoute = location.pathname === '/';
      const isStudentRoute = location.pathname === '/Students';

      // ── Redirect admin away from student routes ──
      if (isAdmin && isStudentRoute) {
        navigate('/', { replace: true });
        return;
      }

      // ── Redirect student away from admin routes ──
      if (!isAdmin && isAdminRoute) {
        navigate('/Students', { replace: true });
        return;
      }

      // ── Watch for blocked status (students only) ──
      if (!isAdmin) {
        const unsubDoc = onSnapshot(doc(db, 'users', user.uid), (snap) => {
          if (snap.exists() && snap.data().status === 'blocked') {
            auth.signOut();
            navigate('/login', { replace: true });
          }
        });
        return () => unsubDoc();
      }
    });

    return () => unsubscribe();
  }, [auth, db, navigate, location.pathname]);

  if (loading) return null;
  if (!authenticated) return null;

  return <>{children}</>;
};

export default AuthRoute;