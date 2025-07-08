import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("userInfo");
    return saved ? JSON.parse(saved) : null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(!!user);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("https://askai-50ai.onrender.com/auth/profile", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          if (res.status === 401) {
            logout(); // use logout on 401
            return;
          }
          throw new Error("Unexpected error");
        }

        const data = await res.json();
        setUser(data);
        setIsAuthenticated(true);
        localStorage.setItem("userInfo", JSON.stringify(data));
      } catch (err) {
        console.error("Auth check failed:", err.message);
        logout();
      }
    };

    if (!user) {
      fetchProfile();
    }
  }, []);

  const logout = async () => {
    try {
      await fetch("https://askai-50ai.onrender.com/auth/logout", {
        method: "GET",
        credentials: "include",
      });
    } catch (err) {
      console.warn("Logout request failed:", err.message);
    }

    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("userInfo");
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, setUser, setIsAuthenticated, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

