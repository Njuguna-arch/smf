import { useContext } from "react";
import { UserContext } from "../context/UserContext";

const useAuth = () => {
  const { user, setUser } = useContext(UserContext);

  const login = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return { user, login, logout };
};

export default useAuth;