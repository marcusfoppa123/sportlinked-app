import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Login from "@/components/Login";

const AthleteLogin = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "team") {
        navigate("/team-profile");
      } else {
        navigate("/for-you");
      }
    }
  }, [isAuthenticated, user, navigate]);

  return <Login initialRole="athlete" />;
};

export default AthleteLogin;