import { Etiqueta } from "../etiquetas/etiquetas.types";

export enum CategoriaGasto {
  RENDICION = "RENDICION",
  JOLG = "JOLG",
  CORP_LORENZO = "CORP_LORENZO",
  OSCAR_LORENZO = "OSCAR_LORENZO",
  CONSTRUCCIONES = "CONSTRUCCIONES",
  CASA = "CASA",
  OFICINA = "OFICINA",
}

export enum SubCategoriaGasto {
  // JOLG
  JOLG_LOCALES = "JOLG_LOCALES",
  JOLG_PRODUCCION = "JOLG_PRODUCCION",
  JOLG_PLANILLA = "JOLG_PLANILLA",
  // CORPORACIÓN LORENZO
  CORP_LORENZO_LOCAL = "CORP_LORENZO_LOCAL",
  CORP_LORENZO_PRODUCCION = "CORP_LORENZO_PRODUCCION",
  CORP_LORENZO_PLANILLA = "CORP_LORENZO_PLANILLA",
  // OSCAR LORENZO
  OSCAR_LORENZO_PERSONAL = "OSCAR_LORENZO_PERSONAL",
  OSCAR_LORENZO_CASA = "OSCAR_LORENZO_CASA",
  // CONSTRUCCIONES
  CONSTRUCCIONES_OBRAS = "CONSTRUCCIONES_OBRAS",
  CONSTRUCCIONES_HERRAMIENTAS = "CONSTRUCCIONES_HERRAMIENTAS",
  // CASA
  CASA_SERVICIOS = "CASA_SERVICIOS",
  CASA_MANTENIMIENTO = "CASA_MANTENIMIENTO",
  // OFICINA
  OFICINA_SERVICIOS = "OFICINA_SERVICIOS",
  OFICINA_SUMINISTROS = "OFICINA_SUMINISTROS",
}

export enum EstadoGasto {
  PENDIENTE = "PENDIENTE",
  FINALIZADO = "FINALIZADO",
  RECHAZADO = "RECHAZADO",
}

export enum Moneda {
  SOLES = "SOLES",
  DOLARES = "DOLARES",
  PESOS_COLOMBIANOS = "PESOS_COLOMBIANOS",
}

export interface GastoFile {
  id: number;
  rutaArchivo: string;
  nombreArchivo: string;
  tipoArchivo: string;
  gastoId: number;
}

export interface EtiquetaGasto {
  id: number;
  etiquetaId: number;
  gastoId: number;
  etiqueta?: Etiqueta;
  gasto?: Gasto;
}

export interface Pago {
  id: number;
  gastoId: number;
}

// Interface principal de Gasto basada en la entidad del backend
export interface Gasto {
  // Campos heredados de BaseCustomEntity
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  // Cabeceras
  estado: EstadoGasto | null;
  descripcion: string | null;
  observaciones: string | null;
  categoria: CategoriaGasto | null;
  subcategoria: SubCategoriaGasto | null;
  // Usuarios y fechas
  usuarioRegistroGastoNombre: string | null;
  fechaRegistro: Date | null;
  usuarioRechazoGastoNombre: string | null;
  fechaRechazo: Date | null;
  // Montos
  importe: number | null;
  moneda: Moneda | null;
  // Relaciones
  archivos: GastoFile[];
  etiquetas: EtiquetaGasto[];
  pagos: Pago[];
}

export interface GastoCreateDto {
  // Cabeceras
  descripcion?: string;
  observaciones?: string;
  categoria?: CategoriaGasto;
  subcategoria?: SubCategoriaGasto;
  estado?: EstadoGasto;
  // Montos
  importe: number; // Campo requerido
  moneda?: Moneda;
  // Archivos y etiquetas
  rutasArchivos?: string[];
  etiquetasIds?: number[];
}
