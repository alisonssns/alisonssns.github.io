import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("userSession");
    if (saved) {
      setUser(JSON.parse(saved));
    }
    setLoading(false);
  }, []);

  async function login(email, password) {
    try {
      const res = await axios.post("http://localhost:3000/login", {
        email,
        senha: password
      });

      if (res.data.user || res.data.id) {
        const userData = res.data.user || res.data;
        setUser(userData);
        localStorage.setItem("userSession", JSON.stringify(userData));
        return { success: true };
      } else {

        const userData = res.data;
        setUser(userData);
        localStorage.setItem("userSession", JSON.stringify(userData));
        return { success: true };
      }
    } catch (error) {
      console.log("Login falhou:", error.response?.data?.error);
      return {
        success: false,
        message: error.response?.data?.error || "Email ou senha incorretos."
      };
    }
  }

  async function register(username, email, password) {
    try {
      await axios.post("http://localhost:3000/usuario", {
        nome: username,
        email: email,
        senha: password,
      });

      return { success: true };
    } catch (error) {
      console.error("Erro no registro:", error);
      return {
        success: false,
        message: error.response?.data?.error || "Erro ao criar conta. Verifique os dados."
      };
    }
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("userSession");
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, isAuthenticated: !!user, login, logout, register }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}