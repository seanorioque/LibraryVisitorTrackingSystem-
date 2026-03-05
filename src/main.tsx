import React from "react";
import ReactDOM from "react-dom/client";
import App from "./pages/admin/Admin.tsx";
import Login from "./pages/Login/Login.tsx";
import "./index.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { initializeApp } from "firebase/app";
import AuthRoute from "./hooks/AuthRoute.tsx";
import { firebaseConfig } from "./services/firebase.ts";

initializeApp(firebaseConfig);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <AuthRoute>
              <App />
            </AuthRoute>
          }
        />
        {/* Redirect all unknown routes to /login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  </React.StrictMode>,
);