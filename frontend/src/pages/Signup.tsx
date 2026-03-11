import { Navigate } from "react-router-dom";

// Google-only auth — Signup redirects to Login
const Signup = () => {
  return <Navigate to="/login" replace />;
};

export default Signup;
