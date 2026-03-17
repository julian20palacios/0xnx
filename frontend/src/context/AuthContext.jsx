import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { obtenerPermisosUsuario } from "../api/Permisos";

const AuthContext = createContext({
  role: null,
  roleLoading: true,
  refreshRole: async () => {},
  clearRole: () => {},
});

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(null);
  const [roleLoading, setRoleLoading] = useState(true);

  const refreshRole = useCallback(async () => {
    const token = localStorage.getItem("access");
    if (!token) {
      setRole(null);
      setRoleLoading(false);
      return;
    }

    setRoleLoading(true);
    try {
      const data = await obtenerPermisosUsuario();
      setRole(data.role || null);
    } catch (error) {
      console.error("Error al cargar rol:", error);
      setRole(null);
    } finally {
      setRoleLoading(false);
    }
  }, []);

  const clearRole = useCallback(() => {
    setRole(null);
    setRoleLoading(false);
  }, []);

  useEffect(() => {
    refreshRole();
  }, [refreshRole]);

  const value = useMemo(
    () => ({ role, roleLoading, refreshRole, clearRole }),
    [role, roleLoading, refreshRole, clearRole]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
