import { PagoCreateDto } from "@/types/gastos/gastos.types";
import { isAxiosError } from "axios";
import { apiClient } from "../base-api";

// Crear un nuevo pago
export const createPago = async (pagoData: PagoCreateDto): Promise<any> => {
  try {
    console.log("🔄 Enviando pago al backend:", pagoData);
    
    const response = await apiClient.post("/pagos", pagoData);
    
    console.log("✅ Pago creado exitosamente:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error creando pago:", error);
    
    if (isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.message;
      throw new Error(`Error al crear el pago: ${errorMessage}`);
    }
    
    throw new Error("Error desconocido al crear el pago");
  }
};

// Obtener pagos por gasto
export const getPagosByGasto = async (gastoId: number): Promise<any[]> => {
  try {
    console.log(`🔄 Obteniendo pagos para gasto ${gastoId}`);
    
    const response = await apiClient.get(`/pagos/gasto/${gastoId}`);
    
    console.log("✅ Pagos obtenidos:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error obteniendo pagos:", error);
    
    if (isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.message;
      throw new Error(`Error al obtener los pagos: ${errorMessage}`);
    }
    
    throw new Error("Error desconocido al obtener los pagos");
  }
};

// Actualizar un pago
export const updatePago = async (pagoId: number, pagoData: Partial<PagoCreateDto>): Promise<any> => {
  try {
    console.log(`🔄 Actualizando pago ${pagoId}:`, pagoData);
    
    const response = await apiClient.put(`/pagos/${pagoId}`, pagoData);
    
    console.log("✅ Pago actualizado exitosamente:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error actualizando pago:", error);
    
    if (isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.message;
      throw new Error(`Error al actualizar el pago: ${errorMessage}`);
    }
    
    throw new Error("Error desconocido al actualizar el pago");
  }
};

// Eliminar un pago
export const deletePago = async (pagoId: number): Promise<void> => {
  try {
    console.log(`🔄 Eliminando pago ${pagoId}`);
    
    await apiClient.delete(`/pagos/${pagoId}`);
    
    console.log("✅ Pago eliminado exitosamente");
  } catch (error) {
    console.error("❌ Error eliminando pago:", error);
    
    if (isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.message;
      throw new Error(`Error al eliminar el pago: ${errorMessage}`);
    }
    
    throw new Error("Error desconocido al eliminar el pago");
  }
};
