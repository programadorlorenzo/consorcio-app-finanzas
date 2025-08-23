import { API_URL_AUTH } from "@/app/backend";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import React, { createContext, useContext, useEffect, useState } from "react";
import { AppState } from "react-native";

export type Permiso = {
  id: number;
  nombre: string;
  codigo: string;
  descripcion: string;
  activo: boolean;
  moduloId: number;
  // ...otros campos si necesitas
};

export type Rol = {
  id: number;
  nombre: string;
  descripcion: string;
  activo: boolean;
  esSistema: boolean;
  rutaInicial: string | null;
  permisos: Permiso[];
  // ...otros campos si necesitas
};

export type User = {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  nombre: string;
  email: string;
  username: string;
  activo: boolean;
  esSistema: boolean;
  rol: Rol;
  rolId: number;
  lastPasswordChange: string;
  passwordExpiryDays: number;
  passwordVencido: boolean;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  signIn: (username: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Añade esta función después de las importaciones
  function isTokenExpired(token: string): boolean {
    try {
      // Un token JWT tiene 3 partes separadas por puntos
      const payload = token.split(".")[1];
      // Decodificar el payload (parte central del token)
      const decoded = JSON.parse(atob(payload));
      // Verificar si el token ha expirado
      // Nota: `exp` es un timestamp en segundos, así que lo multiplicamos por 1000 para convertirlo a milisegundos
      console.log("Token expiration date:", new Date(decoded.exp * 1000));
      return decoded.exp < Date.now() / 1000;
    } catch (error) {
      console.error("Error checking token expiration:", error);
      return true; // Si hay error, consideramos que el token es inválido
    }
  }

  // Verificar el estado del token al cambiar el estado de la app
  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      async (nextAppState) => {
        if (nextAppState === "active") {
          try {
            const storedToken = await SecureStore.getItemAsync("access_token");
            const storedUser = await SecureStore.getItemAsync("user");
            if (storedToken && storedUser) {
              if (isTokenExpired(storedToken)) {
                console.log("Stored token is expired, logging out");
                await signOut();
              } else {
                console.log("Stored token is valid, restoring session");
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
              }
            }
          } catch (error) {
            console.error("Error checking token on app state change:", error);
            await signOut();
          }
        }
      }
    );

    return () => {
      subscription.remove();
    };
  }, []);

  // Cargar sesión al iniciar la app
  useEffect(() => {
    console.log("Checking stored token and user on app start");
    (async () => {
      try {
        const storedToken = await SecureStore.getItemAsync("access_token");
        const storedUser = await SecureStore.getItemAsync("user");
        if (storedToken && storedUser) {
          if (isTokenExpired(storedToken)) {
            console.log("Stored token is expired, logging out");
            await signOut();
          } else {
            console.log("Stored token is valid, restoring session");
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
          }
        }
      } catch (error) {
        console.error("Error during token check:", error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // Login real
  const signIn = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await axios.post(
        API_URL_AUTH,
        {
          username,
          password,
        }
      );
      const { access_token, user } = res.data;
      setToken(access_token);
      setUser(user);
      await SecureStore.setItemAsync("access_token", access_token);
      await SecureStore.setItemAsync("user", JSON.stringify(user));
      console.log("Sign-in successful:", user);
      return true;
    } catch (e) {
      console.error("Error during sign-in:", e);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const signOut = async () => {
    try {
      setToken(null);
      setUser(null);
      await SecureStore.deleteItemAsync("access_token");
      await SecureStore.deleteItemAsync("user");
    } catch (error) {
      console.error("Error during sign out:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
