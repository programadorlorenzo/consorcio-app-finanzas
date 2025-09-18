import { Rendicion, RendicionCreate, RendicionUpdate } from "@/types/rendiciones/rendiciones.types";
import { isAxiosError } from "axios";
import { apiClient } from "../base-api";

export const crearRendicion = async (payload: RendicionCreate, responsableId: number): Promise<Rendicion> => {
  try {
    // Crear el payload que coincida con el DTO del backend
    // Solo datos esenciales - la rendición empieza EN PROCESO (sin fecha_envio)
    const backendPayload = {
      responsableId,
      total_iniciado: payload.total_iniciado,
      // Datos bancarios opcionales
      ...(payload.banco && { banco: payload.banco }),
      ...(payload.cuentabancaria && { cuentabancaria: payload.cuentabancaria }),
      ...(payload.cci && { cci: payload.cci }),
      ...(payload.titular && { titular: payload.titular }),
      // Rutas de archivos si existen
      ...(payload.rutasArchivos && payload.rutasArchivos.length > 0 && { rutasArchivos: payload.rutasArchivos }),
    };

    console.log("🚀 Creando rendición:", backendPayload);
    const response = await apiClient.post<Rendicion>("/rendiciones", backendPayload);
    console.log("✅ Rendición creada exitosamente:", response.data.id);
    return response.data;
  } catch (error) {
    console.error("❌ Error al crear rendición:", error);

    if (isAxiosError(error)) {
      if (error.response) {
        console.error(`Status: ${error.response.status}`, error.response.data);
        if (error.response.status === 401) {
          console.error(
            "❌ Error de autenticación. Token inválido o expirado."
          );
        } else if (error.response.status === 400) {
          console.error(
            "❌ Error de validación o ya existe una rendición activa."
          );
        }
      } else if (error.request) {
        console.error("❌ No se recibió respuesta del servidor");
      }
    }

    throw error;
  }
};

export const obtenerRendicionActiva = async (): Promise<Rendicion | null> => {
  try {
    console.log("🚀 Obteniendo rendición activa del usuario");
    const response = await apiClient.get<Rendicion>("/rendiciones/activa");
    console.log("✅ Rendición activa obtenida:", response.data);
    return response.data;
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      console.log("ℹ️ No hay rendición activa");
      return null;
    }
    
    console.error("❌ Error al obtener rendición activa:", error);
    throw error;
  }
};

export const listarRendiciones = async (): Promise<Rendicion[]> => {
  try {
    console.log("🚀 Obteniendo lista de rendiciones");
    const response = await apiClient.get<Rendicion[]>("/rendiciones");
    console.log("✅ Lista de rendiciones obtenida exitosamente:", response.data.length, "rendiciones");
    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener rendiciones:", error);

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

export const obtenerRendicion = async (id: number): Promise<Rendicion> => {
  try {
    console.log(`🚀 Obteniendo rendición con ID: ${id}`);
    const response = await apiClient.get<Rendicion>(`/rendiciones/${id}`);
    console.log("✅ Rendición obtenida exitosamente:", response.data);
    return response.data;
  } catch (error) {
    console.error(`❌ Error al obtener rendición ${id}:`, error);

    if (isAxiosError(error)) {
      if (error.response) {
        console.error(`Status: ${error.response.status}`, error.response.data);
        if (error.response.status === 404) {
          console.error(`❌ Rendición ${id} no encontrada`);
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

export const actualizarRendicion = async (id: number, payload: RendicionUpdate): Promise<Rendicion> => {
  try {
    console.log(`🚀 Actualizando rendición ${id}:`, payload);
    const response = await apiClient.patch<Rendicion>(`/rendiciones/${id}`, payload);
    console.log("✅ Rendición actualizada exitosamente:", response.data);
    return response.data;
  } catch (error) {
    console.error(`❌ Error al actualizar rendición ${id}:`, error);

    if (isAxiosError(error)) {
      if (error.response) {
        console.error(`Status: ${error.response.status}`, error.response.data);
        if (error.response.status === 404) {
          console.error(`❌ Rendición ${id} no encontrada`);
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

export const eliminarRendicion = async (id: number): Promise<void> => {
  try {
    console.log(`🚀 Eliminando rendición ${id}`);
    await apiClient.delete(`/rendiciones/${id}`);
    console.log("✅ Rendición eliminada exitosamente");
  } catch (error) {
    console.error(`❌ Error al eliminar rendición ${id}:`, error);

    if (isAxiosError(error)) {
      if (error.response) {
        console.error(`Status: ${error.response.status}`, error.response.data);
        if (error.response.status === 404) {
          console.error(`❌ Rendición ${id} no encontrada`);
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

export const enviarRendicionARevision = async (rendicionId: number): Promise<Rendicion> => {
  try {
    console.log(`🚀 Enviando rendición ${rendicionId} a revisión`);
    const response = await apiClient.patch<Rendicion>(`/rendiciones/${rendicionId}/enviar-revision`);
    console.log("✅ Rendición enviada a revisión exitosamente");
    return response.data;
  } catch (error) {
    console.error("❌ Error al enviar rendición a revisión:", error);

    if (isAxiosError(error)) {
      if (error.response) {
        console.error(`Status: ${error.response.status}`, error.response.data);
        if (error.response.status === 401) {
          console.error("❌ Error de autenticación. Token inválido o expirado.");
        } else if (error.response.status === 400) {
          console.error("❌ Error de validación. La rendición no se puede enviar a revisión.");
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

export const obtenerRendicionesPorRevisar = async (): Promise<Rendicion[]> => {
  try {
    console.log("🚀 Obteniendo rendiciones por revisar");
    const response = await apiClient.get<Rendicion[]>("/rendiciones/por-revisar");
    console.log(`✅ Se obtuvieron ${response.data.length} rendiciones por revisar`);
    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener rendiciones por revisar:", error);

    if (isAxiosError(error)) {
      if (error.response) {
        console.error(`Status: ${error.response.status}`, error.response.data);
        if (error.response.status === 401) {
          console.error("❌ Error de autenticación. Token inválido o expirado.");
        }
      } else if (error.request) {
        console.error("❌ No se recibió respuesta del servidor");
      }
    }

    throw error;
  }
};

export const obtenerRendicionesAprobadas = async (): Promise<Rendicion[]> => {
  try {
    console.log("🚀 Obteniendo rendiciones aprobadas");
    const response = await apiClient.get<Rendicion[]>("/rendiciones/aprobadas");
    console.log(`✅ Se obtuvieron ${response.data.length} rendiciones aprobadas`);
    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener rendiciones aprobadas:", error);

    if (isAxiosError(error)) {
      if (error.response) {
        console.error(`Status: ${error.response.status}`, error.response.data);
        if (error.response.status === 401) {
          console.error("❌ Error de autenticación. Token inválido o expirado.");
        }
      } else if (error.request) {
        console.error("❌ No se recibió respuesta del servidor");
      }
    }

    throw error;
  }
};

export const aprobarRendicion = async (rendicionId: number): Promise<Rendicion> => {
  try {
    console.log(`🚀 Aprobando rendición ${rendicionId}`);
    const response = await apiClient.patch<Rendicion>(`/rendiciones/${rendicionId}/estado`, {
      estado: 'aprobada'
    });
    console.log("✅ Rendición aprobada exitosamente");
    return response.data;
  } catch (error) {
    console.error("❌ Error al aprobar rendición:", error);

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

export const rechazarRendicion = async (rendicionId: number): Promise<Rendicion> => {
  try {
    console.log(`🚀 Rechazando y reactivando rendición ${rendicionId}`);
    const response = await apiClient.patch<Rendicion>(`/rendiciones/${rendicionId}/rechazar`);
    console.log("✅ Rendición rechazada y reactivada exitosamente");
    return response.data;
  } catch (error) {
    console.error("❌ Error al rechazar rendición:", error);

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
