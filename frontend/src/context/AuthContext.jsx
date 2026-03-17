import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { obtenerPermisosUsuario } from "../api/Permisos";
import { obtenerUsuarioActual } from "../api/Usuario";

const AuthContext = createContext({
  role: null,
  roleLoading: true,
  user: null,
  userLoading: true,
  refreshRole: async () => {},
  refreshUser: async () => {},
  clearRole: () => {},
});

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(null);
  const [roleLoading, setRoleLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);

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

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem("access");
    if (!token) {
      setUser(null);
      setUserLoading(false);
      return;
    }

    setUserLoading(true);
    try {
      const data = await obtenerUsuarioActual();
      setUser(data || null);
    } catch (error) {
      console.error("Error al cargar usuario:", error);
      setUser(null);
    } finally {
      setUserLoading(false);
    }
  }, []);

  const clearRole = useCallback(() => {
    setRole(null);
    setRoleLoading(false);
    setUser(null);
    setUserLoading(false);
  }, []);

  useEffect(() => {
    refreshRole();
    refreshUser();
  }, [refreshRole, refreshUser]);

  const value = useMemo(
    () => ({ role, roleLoading, user, userLoading, refreshRole, refreshUser, clearRole }),
    [role, roleLoading, user, userLoading, refreshRole, refreshUser, clearRole]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
