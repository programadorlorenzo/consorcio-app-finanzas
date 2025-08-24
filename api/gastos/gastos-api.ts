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
