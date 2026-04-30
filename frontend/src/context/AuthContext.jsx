import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("pm_user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("pm_token") || "");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
      localStorage.setItem("pm_token", token);
    } else {
      delete api.defaults.headers.common.Authorization;
      localStorage.removeItem("pm_token");
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("pm_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("pm_user");
    }
  }, [user]);

  const authenticate = async (endpoint, payload) => {
    setLoading(true);
    try {
      const { data } = await api.post(endpoint, payload);
      setUser(data.user);
      setToken(data.token);
      navigate("/dashboard");
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Something went wrong",
      };
    } finally {
      setLoading(false);
    }
  };

  const login = (payload) => authenticate("/auth/login", payload);
  const signup = (payload) => authenticate("/auth/signup", payload);

  const logout = () => {
    setUser(null);
    setToken("");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
