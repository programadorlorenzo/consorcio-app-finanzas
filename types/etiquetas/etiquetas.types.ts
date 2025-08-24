import { EtiquetaGasto } from "../gastos/gastos.types";

export interface Etiqueta {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  nombre: string | null;
  descripcion: string | null;
  gastos: EtiquetaGasto[];
}
// Interface para crear etiquetas basada en el DTO del backend
export interface EtiquetaCreateDto {
  nombre: string; // Campo requerido
  descripcion?: string; // Campo opcional
}

// Interface para actualizar etiquetas basada en el DTO del backend
export interface EtiquetaUpdateDto {
  nombre?: string; // Campo opcional
  descripcion?: string; // Campo opcional
}

// Interface para respuestas de API con paginación
export interface EtiquetasResponse {
  data: Etiqueta[];
  total: number;
  page: number;
  limit: number;
}

// Interface para filtros de búsqueda
export interface EtiquetaFilters {
  nombre?: string;
  descripcion?: string;
  page?: number;
  limit?: number;
}
