import { useContext } from "react";
import { AuthProvider } from "../contexts/AuthContext";

export const useAuth = () => {
  return useContext(AuthProvider);
};
