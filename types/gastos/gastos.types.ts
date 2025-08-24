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
  LOCALES = "LOCALES",
  PRODUCCION = "PRODUCCION",
  MATERIA_PRIMA = "MATERIA_PRIMA",
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

export enum TipoPago {
  EFECTIVO = "EFECTIVO",
  TRANSFERENCIA = "TRANSFERENCIA",
  TARJETA = "TARJETA",
}

export enum OrigenPago {
  CUENTA_EMPRESA = "CUENTA_EMPRESA",
  EXTERNO = "EXTERNO",
}

export interface GastoFile {
  id: number;
  rutaArchivo: string;
  filename: string;
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

export interface PagoCreateDto {
  tipo: TipoPago;
  origen: OrigenPago;
  gastoId: number;
  rendicionId: number;
  usuarioRegistroPagoId: number;
  fechaRegistro: string;
  titular_origen: string;
  cuenta_bancaria_origen: string;
  cci_origen: string;
  banco_origen: string;
  moneda_origen: Moneda;
  titular_destino: string;
  cuenta_bancaria_destino: string;
  cci_destino: string;
  banco_destino: string;
  moneda_destino: Moneda;
  tipo_cambio: number;
  importe: number;
  moneda: Moneda;
  numeroOperacion: string;
  rutasArchivos: string[];
}
