import { Etiqueta } from "@/types/etiquetas/etiquetas.types";
import { apiClient } from "../base-api";

export const listarEtiquetas = async (
): Promise<Etiqueta[]> => {
  try {
    const response = await apiClient.get<Etiqueta[]>("/etiquetas");
    return response.data;
  } catch (error) {
    console.error('Error al obtener etiquetas:', error);
      throw error;
    }
  }