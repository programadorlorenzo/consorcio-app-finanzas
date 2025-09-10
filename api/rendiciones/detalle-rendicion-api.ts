import { DetalleRendicion, DetalleRendicionCreate } from "@/types/rendiciones/rendiciones.types";
import { isAxiosError } from "axios";
import { apiClient } from "../base-api";

export const crearDetalleRendicion = async (payload: DetalleRendicionCreate): Promise<DetalleRendicion> => {
  try {
    // Convertir fecha a formato ISO string si es necesario
    const backendPayload = {
      ...payload,
      fecha: new Date(payload.fecha).toISOString(),
    };

    console.log("🚀 Creando detalle de rendición:", backendPayload);
    const response = await apiClient.post<DetalleRendicion>("/detalle-rendiciones", backendPayload);
    console.log("✅ Detalle de rendición creado exitosamente:", response.data.id);
    return response.data;
  } catch (error) {
    console.error("❌ Error al crear detalle de rendición:", error);

    if (isAxiosError(error)) {
      if (error.response) {
        console.error(`Status: ${error.response.status}`, error.response.data);
        if (error.response.status === 401) {
          console.error("❌ Error de autenticación. Token inválido o expirado.");
        } else if (error.response.status === 400) {
          console.error("❌ Error de validación en los datos del detalle.");
        } else if (error.response.status === 404) {
          console.error("❌ Rendición no encontrada.");
        }
      } else if (error.request) {
        console.error("❌ No se recibió respuesta del servidor");
      }
    }

    throw error;
  }
};

export const obtenerDetallesPorRendicion = async (rendicionId: number): Promise<DetalleRendicion[]> => {
  try {
    console.log(`🚀 Obteniendo detalles de rendición ${rendicionId}`);
    const response = await apiClient.get<DetalleRendicion[]>(`/detalle-rendiciones/rendicion/${rendicionId}`);
    console.log(`✅ Detalles obtenidos: ${response.data.length} elementos`);
    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener detalles de rendición:", error);

    if (isAxiosError(error)) {
      if (error.response) {
        console.error(`Status: ${error.response.status}`, error.response.data);
        if (error.response.status === 401) {
          console.error("❌ Error de autenticación. Token inválido o expirado.");
        } else if (error.response.status === 404) {
          console.error("❌ Rendición no encontrada.");
        }
      } else if (error.request) {
        console.error("❌ No se recibió respuesta del servidor");
      }
    }

    throw error;
  }
};

export const obtenerDetalleRendicion = async (id: number): Promise<DetalleRendicion> => {
  try {
    console.log(`🚀 Obteniendo detalle de rendición ${id}`);
    const response = await apiClient.get<DetalleRendicion>(`/detalle-rendiciones/${id}`);
    console.log("✅ Detalle obtenido exitosamente");
    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener detalle de rendición:", error);

    if (isAxiosError(error)) {
      if (error.response) {
        console.error(`Status: ${error.response.status}`, error.response.data);
        if (error.response.status === 401) {
          console.error("❌ Error de autenticación. Token inválido o expirado.");
        } else if (error.response.status === 404) {
          console.error("❌ Detalle de rendición no encontrado.");
        }
      } else if (error.request) {
        console.error("❌ No se recibió respuesta del servidor");
      }
    }

    throw error;
  }
};

export const actualizarDetalleRendicion = async (
  id: number, 
  payload: Partial<DetalleRendicionCreate>
): Promise<DetalleRendicion> => {
  try {
    console.log(`🚀 Actualizando detalle de rendición ${id}:`, payload);
    const response = await apiClient.patch<DetalleRendicion>(`/detalle-rendiciones/${id}`, payload);
    console.log("✅ Detalle actualizado exitosamente");
    return response.data;
  } catch (error) {
    console.error("❌ Error al actualizar detalle de rendición:", error);

    if (isAxiosError(error)) {
      if (error.response) {
        console.error(`Status: ${error.response.status}`, error.response.data);
        if (error.response.status === 401) {
          console.error("❌ Error de autenticación. Token inválido o expirado.");
        } else if (error.response.status === 400) {
          console.error("❌ Error de validación en los datos del detalle.");
        } else if (error.response.status === 404) {
          console.error("❌ Detalle de rendición no encontrado.");
        }
      } else if (error.request) {
        console.error("❌ No se recibió respuesta del servidor");
      }
    }

    throw error;
  }
};

export const eliminarDetalleRendicion = async (id: number): Promise<void> => {
  try {
    console.log(`🚀 Eliminando detalle de rendición ${id}`);
    await apiClient.delete(`/detalle-rendiciones/${id}`);
    console.log("✅ Detalle eliminado exitosamente");
  } catch (error) {
    console.error("❌ Error al eliminar detalle de rendición:", error);

    if (isAxiosError(error)) {
      if (error.response) {
        console.error(`Status: ${error.response.status}`, error.response.data);
        if (error.response.status === 401) {
          console.error("❌ Error de autenticación. Token inválido o expirado.");
        } else if (error.response.status === 404) {
          console.error("❌ Detalle de rendición no encontrado.");
        }
      } else if (error.request) {
        console.error("❌ No se recibió respuesta del servidor");
      }
    }

    throw error;
  }
};
