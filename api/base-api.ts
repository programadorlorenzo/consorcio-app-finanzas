import { API_URL_BASE, TOKEN_KEY } from "@/app/backend";
import axios from "axios";
import * as SecureStore from "expo-secure-store"; // Cambiamos AsyncStorage por SecureStore

export const apiClient = axios.create({
  baseURL: API_URL_BASE,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    try {
      // Obtener el token desde SecureStore en lugar de AsyncStorage
      const token = await SecureStore.getItemAsync(TOKEN_KEY);

      // Si existe un token, lo añadimos al header de autorización
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log(
          `🔑 Token añadido a la petición ${config.method?.toUpperCase()} ${
            config.url
          }`
        );
      } else {
        console.warn(
          `⚠️ No hay token disponible para la petición ${config.method?.toUpperCase()} ${
            config.url
          }`
        );
      }

      return config;
    } catch (error) {
      console.error("Error getting auth token:", error);
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);
