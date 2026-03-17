import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, onSnapshot } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import {ADMIN_EMAILS,ADMIN_UIDS} from "../admin";

export interface IAuthRouteProps {
  children: React.ReactNode;
}

const AuthRoute: React.FunctionComponent<IAuthRouteProps> = ({ children }) => {
  const auth = getAuth();
  const db = getFirestore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    let unsubDoc: (() => void) | undefined;

    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setAuthenticated(false);
        setLoading(false);
        navigate("/login", { replace: true });
        return;
      }

      setAuthenticated(true);
      setLoading(false);

      const isAdmin = ADMIN_UIDS.includes(user.uid) || ADMIN_EMAILS.includes(user.email ?? "");
      if (isAdmin) return; // ← admin never gets block listener

      // ── Watch for blocked status (students only) ──
      unsubDoc = onSnapshot(doc(db, "users", user.uid), (snap) => {
        if (snap.exists() && snap.data().status === "blocked") {
          auth.signOut();
          navigate("/login", { replace: true });
        }
      });
    });

    return () => {
      unsubAuth();
      unsubDoc?.();
    };
  }, [auth, db, navigate]);

  if (loading) return null;
  if (!authenticated) return null;

  return <>{children}</>;
};

export default AuthRoute;
