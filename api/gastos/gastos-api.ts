import { Gasto, GastoCreateDto } from "@/types/gastos/gastos.types";
import { isAxiosError } from "axios";
import { apiClient } from "../base-api";

export const createGasto = async (payload: GastoCreateDto): Promise<Gasto> => {
  try {
    console.log("🚀 Creando gasto:", payload);
    const response = await apiClient.post<Gasto>("/gastos", payload);
    console.log("✅ Gasto creado exitosamente:", response.data.id);
    return response.data;
  } catch (error) {
    console.error("❌ Error creating gasto:", error);

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

export const listarGastos = async (): Promise<Gasto[]> => {
  try {
    console.log("🚀 Obteniendo lista de gastos");
    const response = await apiClient.get<Gasto[]>("/gastos");
    console.log("✅ Lista de gastos obtenida exitosamente:", response.data.length, "gastos");
    console.log("Gastos:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching gastos:", error);

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

export const obtenerGasto = async (gastoId: number): Promise<Gasto> => {
  try {
    console.log(`🚀 Obteniendo gasto ${gastoId}`);
    const response = await apiClient.get<Gasto>(`/gastos/${gastoId}`);
    console.log("✅ Gasto obtenido exitosamente:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching gasto:", error);

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
