export interface PaymentFormData {
  descripcion: string;
  categoria: CategoriaPago | null;
  subcategoria: SubCategoriaPago | null;
  tipo: TipoPago | null;
  origen: OrigenPago | null;
  moneda: MonedaPago | null;
  monto: string;
  fechaVencimiento: Date | null;
  observaciones: string;
  ubicacionFisica: string;
  numeroRecibo: string;
  cuentaBancaria: string;
}

export enum CategoriaPago {
  JOLG = "JOLG",
  CORP_LORENZO = "CORP_LORENZO",
  OSCAR_LORENZO = "OSCAR_LORENZO",
  CONSTRUCCIONES = "CONSTRUCCIONES",
  RENDICION = "RENDICION",
  CASA = "CASA",
  OFICINA = "OFICINA",
}

export enum SubCategoriaPago {
  JOLG_LOCALES = "JOLG_LOCALES",
  JOLG_PRODUCCION = "JOLG_PRODUCCION",
  JOLG_PLANILLA = "JOLG_PLANILLA",
  CORP_LORENZO_LOCAL = "CORP_LORENZO_LOCAL",
  CORP_LORENZO_PRODUCCION = "CORP_LORENZO_PRODUCCION",
  CORP_LORENZO_PLANILLA = "CORP_LORENZO_PLANILLA",
  OSCAR_LORENZO_PERSONAL = "OSCAR_LORENZO_PERSONAL",
  OSCAR_LORENZO_CASA = "OSCAR_LORENZO_CASA",
  CONSTRUCCIONES_OBRAS = "CONSTRUCCIONES_OBRAS",
  CONSTRUCCIONES_HERRAMIENTAS = "CONSTRUCCIONES_HERRAMIENTAS",
  CASA_SERVICIOS = "CASA_SERVICIOS",
  CASA_MANTENIMIENTO = "CASA_MANTENIMIENTO",
  OFICINA_SERVICIOS = "OFICINA_SERVICIOS",
  OFICINA_SUMINISTROS = "OFICINA_SUMINISTROS",
}

export enum TipoPago {
  EFECTIVO = "EFECTIVO",
  TRANSFERENCIA = "TRANSFERENCIA",
  YAPE = "YAPE",
  PLIN = "PLIN",
}

export enum OrigenPago {
  CUENTA_EMPRESA = "CUENTA_EMPRESA",
  EXTERNO = "EXTERNO",
}

export enum MonedaPago {
  SOLES = "SOLES",
  DOLARES = "DOLARES",
}
