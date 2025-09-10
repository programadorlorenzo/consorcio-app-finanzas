export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  username: string;
  activo: boolean;
  rendidor: number;
}

export enum FormaPago {
  YAPE = 'yape',
  PLIN = 'plin',
  TRANSFERENCIA = 'transferencia',
}

export interface Rendicion {
  id: number;
  responsableId: number;
  responsable?: Usuario;
  fecha_envio?: string;
  fecha_aprobada?: string;
  fecha_denegada?: string;
  banco?: string;
  cuentabancaria?: string;
  cci?: string;
  titular?: string;
  total_iniciado: number | string; // Puede venir como string desde el backend
  total_rendido: number | string;  // Puede venir como string desde el backend
  total_saldo: number | string;    // Puede venir como string desde el backend
  formaPago: FormaPago;
  createdAt: string;
  updatedAt: string;
  detalles?: DetalleRendicion[];
  archivos?: RendicionFile[];
}

export interface DetalleRendicion {
  id: number;
  rendicionId: number;
  responsableId?: number;
  responsable?: Usuario;
  fecha: string;
  descripcion: string;
  importeUnitario: number | string;
  cantidad: number | string;
  importeTotal: number | string;
  cuentabancaria?: string;
  cci?: string;
  banco?: string;
  titular?: string;
  observaciones?: string;
  archivos?: DetalleRendicionFile[];
  createdAt: string;
  updatedAt: string;
}

export interface DetalleRendicionFile {
  id: number;
  detalleRendicionId: number;
  filename: string;
  createdAt: string;
  updatedAt: string;
}

export interface RendicionFile {
  id: number;
  rendicionId: number;
  filename: string;
  originalName: string;
  path: string;
  size: number;
  mimetype: string;
  createdAt: string;
}

export interface RendicionCreate {
  total_iniciado: number;
  banco?: string;
  cuentabancaria?: string;
  cci?: string;
  titular?: string;
  formaPago: FormaPago;
}

export interface DetalleRendicionCreate {
  rendicionId: number;
  responsableId?: number;
  fecha: string;
  descripcion: string;
  importeUnitario: number;
  cantidad?: number;
  importeTotal: number;
  cuentabancaria?: string;
  cci?: string;
  banco?: string;
  titular?: string;
  observaciones?: string;
  rutasArchivos?: string[];
}

export interface RendicionUpdate {
  banco?: string;
  cuentabancaria?: string;
  cci?: string;
  titular?: string;
  total_iniciado?: number;
  formaPago?: FormaPago;
}

export type RendicionStatusType = 'default' | 'pending' | 'approved' | 'rejected' | 'accent' | 'admin';

// Estado de la rendición basado en las fechas
export type RendicionEstado = 'EN PROCESO' | 'ENVIADA' | 'APROBADA' | 'DENEGADA';

export function getRendicionEstado(rendicion: Rendicion): RendicionEstado {
  if (rendicion.fecha_denegada) return 'DENEGADA';
  if (rendicion.fecha_aprobada) return 'APROBADA';
  if (rendicion.fecha_envio) return 'ENVIADA';
  return 'EN PROCESO';
}
