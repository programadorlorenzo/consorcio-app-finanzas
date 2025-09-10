import { Usuario } from "@/types/rendiciones/rendiciones.types";
import { isAxiosError } from "axios";
import { apiClient } from "../base-api";

export const obtenerUsuariosRendidores = async (): Promise<Usuario[]> => {
  try {
    console.log("🚀 Obteniendo usuarios rendidores");
    const response = await apiClient.get<Usuario[]>("/usuarios/rendidores");
    console.log("✅ Usuarios rendidores obtenidos exitosamente:", response.data.length, "usuarios");
    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener usuarios rendidores:", error);

    if (isAxiosError(error)) {
      if (error.response) {
        console.error(`Status: ${error.response.status}`, error.response.data);
        if (error.response.status === 401) {
          console.error(
            "❌ Error de autenticación. Token inválido o expirado."
          );
        }
      } else if (error.request) {
        console.error("❌ No se recibió respuesta del servidor");
      }
    }

    throw error;
  }
};

export const obtenerUsuario = async (id: number): Promise<Usuario> => {
  try {
    console.log(`🚀 Obteniendo usuario con ID: ${id}`);
    const response = await apiClient.get<Usuario>(`/usuarios/${id}`);
    console.log("✅ Usuario obtenido exitosamente:", response.data);
    return response.data;
  } catch (error) {
    console.error(`❌ Error al obtener usuario ${id}:`, error);

    if (isAxiosError(error)) {
      if (error.response) {
        console.error(`Status: ${error.response.status}`, error.response.data);
        if (error.response.status === 404) {
          console.error(`❌ Usuario ${id} no encontrado`);
        } else if (error.response.status === 401) {
          console.error(
            "❌ Error de autenticación. Token inválido o expirado."
          );
        }
      } else if (error.request) {
        console.error("❌ No se recibió respuesta del servidor");
      }
    }

    throw error;
  }
};
