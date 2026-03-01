import React from "react";
import ReactDOM from "react-dom/client";
import App from "./pages/App.tsx";
import Login from "./pages/Login/Login.tsx";
import Signup from "./Signup.tsx";
import "./index.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { initializeApp } from "firebase/app";
import AuthRoute from "./AuthRoute.tsx";
import { firebaseConfig } from "./hooks/firebase.ts";


initializeApp(firebaseConfig);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <AuthRoute>
              <App />
            </AuthRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  </React.StrictMode>,
);
