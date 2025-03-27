// AuthContext.jsx
import { createContext, useState } from "react";
import axios from "axios";

// Exporta AuthContext
export const AuthContext = createContext();

// Exporta AuthProvider de forma nombrada
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [failure, setFailure] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const api_url = import.meta.env.VITE_API_URL;

  const saveToken = (token) => sessionStorage.setItem("bearerToken", token);
  const getToken = () => sessionStorage.getItem("bearerToken") || "";
  const removeToken = () => sessionStorage.removeItem("bearerToken");

  const saveUser = (role, id, mail) => {
    sessionStorage.setItem("userRole", role);
    sessionStorage.setItem("userId", id.toString());
    sessionStorage.setItem("userEmail", mail);
  };

  const getUserRole = () => sessionStorage.getItem("userRole") || "";
  const getUserId = () => Number(sessionStorage.getItem("userId")) || null;
  const getUserEmail = () => sessionStorage.getItem("userEmail") || "";

  const removeUser = () => {
    sessionStorage.removeItem("userRole");
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("userEmail");
  };

  async function validate(username, pass) {
    setIsLoading(true);
    try {
      const res = await axios.post(`${api_url}/auth/login`, { email: username, password: pass });
      saveToken(res.data.token);
      saveUser(res.data.roles, res.data.id, res.data.correo);
      console.log(res.data);

      setUser({ role: res.data.roles.replace("ROLE_", "").toLowerCase() });

      setFailure(false);
    } catch (err) {
      console.log(err, err.message);
      if (err.response) {
        setMensaje(err.response.data.message);
      }
      setFailure(true);
    } finally {
      setIsLoading(false);
    }
  }

  const login = (username, password) => {
    validate(username.toLowerCase().trim(), password);
  };

  const logout = () => {
    removeToken();
    removeUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isLoading,
      setIsLoading,
      failure,
      setFailure,
      getToken,
      getUserRole,
      getUserId,
      getUserEmail,
      mensaje,
      setMensaje
    }}>
      {children}
    </AuthContext.Provider>
  );
};